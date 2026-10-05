import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SonoBuddy AI — AI Ultrasound Guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://sonobuddyai.app";

export default async function Image() {
  const logoData = await fetch(`${APP_URL}/sonobuddy-logo.png`).then((r) => r.arrayBuffer());
  const logoBase64 = `data:image/png;base64,${Buffer.from(logoData).toString("base64")}`;

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
        {/* Logo: SonoBuddy AI wordmark + icon as one unit */}
        <img src={logoBase64} width={680} height={420} style={{ objectFit: "contain" }} />

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
