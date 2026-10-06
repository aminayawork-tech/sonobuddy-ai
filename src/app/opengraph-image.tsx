import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SonoBuddy AI — AI Ultrasound Guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://sonobuddyai.app";

export default async function Image() {
  const iconData = await fetch(`${APP_URL}/sonobuddy-favicon.png`).then((r) => r.arrayBuffer());
  const iconBase64 = `data:image/png;base64,${Buffer.from(iconData).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
        }}
      >
        <img src={iconBase64} alt="" width={120} height={120} style={{ borderRadius: 26, marginBottom: 24 }} />

        {/* Wordmark */}
        <div style={{ display: "flex", fontSize: 96, fontWeight: 800, letterSpacing: "-2px" }}>
          <span style={{ color: "#0a0a0a" }}>Sono</span>
          <span style={{ color: "#7c3aed" }}>Buddy </span>
          <span style={{ color: "#7c3aed", fontStyle: "italic" }}>ai</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            color: "#64748b",
            fontWeight: 400,
            letterSpacing: "-0.3px",
            marginTop: 8,
          }}
        >
          AI-Guided Ultrasound Study Companion
        </div>
      </div>
    ),
    { ...size },
  );
}
