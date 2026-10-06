"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { LogIn, Shield, UserPlus, Zap } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabaseConfigured } from "@/lib/supabase/client";
import AuthModal from "@/components/AuthModal";

// Pages that must stay reachable without an account — legal pages Apple
// requires to be viewable pre-login, and the auth flow's own callback routes.
const PUBLIC_PREFIXES = ["/privacy", "/terms", "/auth/"];

const BG = "#f3f1ec";
const INK = "#0a0a0a";
const MUTED = "#78716c";
const ACCENT = "#7c3aed";
const ACCENT_LIGHT = "#f3eafe";

export default function AuthGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup");

  const isPublicPath = PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(p));

  // Not configured yet (local dev without Supabase env vars) — don't gate.
  if (!supabaseConfigured || isPublicPath || loading || user) {
    return <>{children}</>;
  }

  function openAuth(mode: "signin" | "signup") {
    setAuthMode(mode);
    setAuthOpen(true);
  }

  return (
    <div className="flex min-h-screen flex-col" style={{ background: BG }}>
      <div className="flex flex-col items-center pt-20 pb-6 px-6 text-center">
        <Image
          src="/sonobuddy-favicon.png"
          alt=""
          width={88}
          height={88}
          className="rounded-[22px] mb-5 shadow-xl"
          priority
        />
        <h1 className="text-4xl font-extrabold tracking-tight">
          <span style={{ color: INK }}>Sono</span>
          <span style={{ color: ACCENT }}>Buddy </span>
          <span style={{ color: ACCENT, fontStyle: "italic" }}>ai</span>
        </h1>
        <p className="mt-3 text-lg font-medium" style={{ color: "#44403c" }}>
          AI-Guided Ultrasound Study Companion
        </p>
        <p className="mt-2 text-sm" style={{ color: MUTED }}>
          Sign in to continue
        </p>
      </div>

      <div className="flex justify-center gap-3 px-6 pb-10 flex-wrap">
        {[
          { icon: Zap, label: "31 Protocols" },
          { icon: Shield, label: "HIPAA-ready" },
        ].map(({ icon: Icon, label }) => (
          <span key={label} className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
            style={{ background: ACCENT_LIGHT, color: ACCENT }}>
            <Icon size={12} />
            {label}
          </span>
        ))}
      </div>

      <div className="px-6 space-y-3 pb-4">
        <button
          onClick={() => openAuth("signup")}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-lg transition-all active:scale-95"
          style={{ background: ACCENT, color: "#ffffff" }}>
          <UserPlus size={20} />
          Create Free Account
        </button>

        <button
          onClick={() => openAuth("signin")}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-lg border-2 transition-all active:scale-95"
          style={{ borderColor: "#ddd6fe", color: ACCENT, background: "#ffffff" }}>
          <LogIn size={20} />
          Sign In
        </button>
      </div>

      <div className="mt-auto px-6 pb-32 pt-10 text-center">
        <p className="text-xs" style={{ color: MUTED }}>
          5 free AI study sessions/month · No credit card required
        </p>
        <p className="text-xs mt-1" style={{ color: "#a8a29e" }}>
          Not FDA-cleared · For educational use only
        </p>
      </div>

      {authOpen && (
        <AuthModal
          onClose={() => setAuthOpen(false)}
          initialMode={authMode}
        />
      )}
    </div>
  );
}
