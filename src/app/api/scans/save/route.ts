import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnon) {
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Unauthenticated users silently no-op — they can still scan, just no history
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Strip label x/y positions — only store name + color, never canvas coordinates
  const labels = Array.isArray(body.labels)
    ? (body.labels as Array<Record<string, unknown>>).map(({ name, color }) => ({ name, color }))
    : [];

  const { data, error } = await supabase
    .from("scan_history")
    .insert({
      user_id:      user.id,
      protocol_id:  String(body.protocolId   ?? ""),
      protocol_name: String(body.protocolName ?? ""),
      protocol_icon: body.protocolIcon ? String(body.protocolIcon) : null,
      alert_level:  String(body.alertLevel   ?? "none"),
      confidence:   typeof body.confidence === "number" ? body.confidence : null,
      image_quality: body.imageQuality ? String(body.imageQuality) : null,
      summary:      body.summary ? String(body.summary) : null,
      findings:     Array.isArray(body.findings)        ? body.findings        : [],
      measurements: Array.isArray(body.measurements)    ? body.measurements    : [],
      labels,
      recommendations: Array.isArray(body.recommendations) ? body.recommendations : [],
    })
    .select("id")
    .single();

  if (error) {
    console.error("[scans/save]", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}
