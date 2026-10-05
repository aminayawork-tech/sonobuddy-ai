import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getProtocolById } from "@/lib/protocols";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Auth + scan-limits are only enforced when Supabase is configured
const AUTH_ENABLED = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req: NextRequest) {
  let userId: string | null = null;

  // ── 1. Auth + scan-limit check (only when Supabase is configured) ──
  if (AUTH_ENABLED) {
    const { createClient, createServiceClient } = await import("@/lib/supabase/server");

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated", code: "UNAUTHENTICATED" },
        { status: 401 },
      );
    }

    userId = user.id;
    const service = createServiceClient();
    const { data: statusRaw, error: statusError } = await service.rpc(
      "check_scan_status",
      { p_user_id: user.id },
    );

    if (statusError) {
      console.error("check_scan_status error:", statusError);
    } else if (statusRaw) {
      const status = statusRaw as {
        tier: string; scans_used: number;
        limit_reached: boolean; error?: string;
      };
      if (status.error === "profile_not_found") {
        return NextResponse.json({ error: "User profile not found" }, { status: 404 });
      }
      if (status.limit_reached) {
        return NextResponse.json(
          { error: "Monthly scan limit reached", code: "LIMIT_REACHED" },
          { status: 429 },
        );
      }
    }
  }

  // ── 2. Parse request body ─────────────────────────────────────
  try {
    const { imageBase64, mediaType, protocolId } = await req.json();

    if (!protocolId) {
      return NextResponse.json({ error: "protocolId is required" }, { status: 400 });
    }

    const protocol = getProtocolById(protocolId);
    if (!protocol) {
      return NextResponse.json({ error: "Protocol not found" }, { status: 404 });
    }

    const hasImage = imageBase64 && mediaType;

    const systemPrompt = `You are SonoBuddy AI, an AI study companion for point-of-care ultrasound (POCUS) education. You analyze ultrasound images and provide a structured educational walkthrough for study purposes. You always respond with valid JSON only — no markdown fences, no explanation outside the JSON object.

IMPORTANT: You are not FDA-cleared and do not provide medical advice, diagnosis, or treatment. Your output is for educational study purposes only and must never be used as the basis for any clinical or medical decision.`;

    const analysisPrompt = `Analyze this ${protocol.name} ultrasound image. Protocol context:
- Category: ${protocol.category}
- Indication: ${protocol.indication}
- Expected views: ${protocol.views.join(", ")}
- Key findings to assess: ${protocol.keyFindings.join(", ")}
- AI measurements to attempt: ${protocol.aiMeasurements.join(", ")}
- Anomalies to detect: ${protocol.anomaliesDetected.join(", ")}
- Common pitfalls: ${protocol.commonPitfalls.join(", ")}

${hasImage ? "Analyze the provided ultrasound image carefully." : "No image was provided — generate a realistic normal-variant example analysis for this protocol for demonstration purposes."}

Respond ONLY with a raw JSON object (no markdown, no backticks) in this exact shape:
{
  "protocolId": "${protocolId}",
  "protocolName": "${protocol.name}",
  "timestamp": "<ISO 8601 string>",
  "imageQuality": "<poor|fair|good|excellent>",
  "imageQualityNote": "<1-2 sentence note on image quality, depth, gain, or acoustic windows>",
  "confidence": <integer 50-99>,
  "alertLevel": "<none|low|moderate|high|critical>",
  "alertMessage": "<if alertLevel is not none: concise urgent clinical message, else omit this key>",
  "findings": [
    { "label": "<structure name>", "value": "<finding description>", "severity": "<normal|info|warning|critical>" }
  ],
  "measurements": [
    { "name": "<measurement name>", "value": "<value with unit>", "reference": "<normal range>", "status": "<normal|borderline|abnormal>" }
  ],
  "summary": "<2-4 sentence clinical summary of key findings>",
  "recommendations": ["<actionable recommendation>"],
  "nextViews": ["<next view to obtain>"],
  "labels": [
    { "id": "<short-id>", "name": "<structure label>", "x": <0-100>, "y": <0-100>, "color": "<hex color>" }
  ]
}

Rules:
- findings: 3-6 items covering all major structures visible
- measurements: 1-6 relevant measurements for this protocol
- recommendations: 2-4 practical next steps
- nextViews: 2-3 views to obtain next
- labels: 3-6 anatomical labels (x=0 left, x=100 right, y=0 top, y=100 bottom)
  CRITICAL: label names MUST be specific anatomical terms — e.g. "Gallbladder", "Liver", "Common Bile Duct", "Kidney", "Aorta", "IVC", "Bladder", "Uterus" etc.
  NEVER use generic names like "Structure 1", "Structure 2", "Region A". Always name the actual anatomy you see.
- Label colors: normal structures #6ee7b7, abnormal #ef4444, info #a78bfa, uncertain #fbbf24
- alertLevel: none=no abnormality, low=minor, moderate=clinically relevant, high=urgent, critical=immediate action`;

    const messageContent: Anthropic.MessageParam["content"] = hasImage
      ? [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
              data: imageBase64,
            },
          },
          { type: "text", text: analysisPrompt },
        ]
      : analysisPrompt;

    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 8000,
      system: systemPrompt,
      messages: [{ role: "user", content: messageContent }],
    });

    const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === "text");
    if (!textBlock) {
      return NextResponse.json({ error: "No text response from AI" }, { status: 500 });
    }

    const raw = textBlock.text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    const analysis = JSON.parse(raw);
    analysis.timestamp = analysis.timestamp ?? new Date().toISOString();

    // ── 3. Increment scan count (fire-and-forget) ─────────────────
    if (AUTH_ENABLED && userId) {
      import("@/lib/supabase/server").then(({ createServiceClient }) => {
        createServiceClient()
          .rpc("increment_scan_count", { p_user_id: userId })
          .then(({ error }: { error: unknown }) => {
            if (error) console.error("increment_scan_count error:", error);
          });
      });
    }

    return NextResponse.json(analysis);
  } catch (err) {
    console.error("Analyze error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";

    // Anthropic 529 overloaded — surface a clean retry message
    if (message.includes("overloaded") || message.startsWith("529")) {
      return NextResponse.json(
        { error: "The AI is experiencing high demand right now. Please wait a moment and try again." },
        { status: 503 },
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
