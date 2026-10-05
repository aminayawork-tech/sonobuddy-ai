import type { Metadata, Viewport } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import AuthGate from "@/components/AuthGate";
import BottomNav from "@/components/BottomNav";
import PwaInit from "@/components/PwaInit";
import OnboardingFlow from "@/components/OnboardingFlow";
import Footer from "@/components/Footer";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://sonobuddyai.app";

export const metadata: Metadata = {
  title: "SonoBuddy AI — AI Ultrasound Guide",
  description:
    "AI-guided ultrasound study companion. Protocol-first educational walkthroughs, reference measurements, and study guidance for learners. Educational use only — not medical advice.",
  keywords:
    "POCUS study, ultrasound AI study tool, point of care ultrasound education, ultrasound learning, sonography study",
  metadataBase: new URL(APP_URL),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "SonoBuddy AI",
    statusBarStyle: "default",
    startupImage: "/sonobuddy-favicon.png",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48 32x32 16x16", type: "image/x-icon" },
      { url: "/sonobuddy-favicon.png", sizes: "192x192", type: "image/png" },
      { url: "/sonobuddy-favicon.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/sonobuddy-favicon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "SonoBuddy AI — AI Ultrasound Study Companion",
    description:
      "Snap a photo of any ultrasound screen. AI labels structures, walks through reference measurements, and highlights study areas in seconds. Educational use only.",
    url: APP_URL,
    siteName: "SonoBuddy AI",
    type: "website",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "SonoBuddy AI — AI Ultrasound Guide" }],
  },
  twitter: {
    card: "summary",
    title: "SonoBuddy AI — AI Ultrasound Study Companion",
    description:
      "Protocol-first AI ultrasound study walkthroughs for learners and sonography students. Educational use only.",
    images: ["/opengraph-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased min-h-screen w-full overflow-x-hidden"
        style={{ background: "#eef3f8", color: "#1a2235", fontFamily: "system-ui, -apple-system, sans-serif" }}
      >
        <AuthProvider>
          <PwaInit />
          <OnboardingFlow />
          <AuthGate>
            {children}
            <Footer />
            <BottomNav />
          </AuthGate>
        </AuthProvider>
      </body>
    </html>
  );
}
