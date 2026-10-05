"use client";

import { useState } from "react";
import { Camera, LogIn, UserPlus, Shield, Zap } from "lucide-react";
import Link from "next/link";
import AuthModal from "@/components/AuthModal";

export default function AppHomePage() {
  const [authOpen, setAuthOpen]   = useState(false);
  const [authMode, setAuthMode]   = useState<"signin" | "signup">("signin");

  function openAuth(mode: "signin" | "signup") {
    setAuthMode(mode);
    setAuthOpen(true);
  }

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "linear-gradient(160deg, #1e3a8a 0%, #2563eb 60%, #3b82f6 100%)" }}>

      {/* Logo + branding */}
      <div className="flex flex-col items-center pt-20 pb-6 px-6 text-center">
        <img
          src="/icon-192.png"
          alt="SonoBuddy AI"
          width={88}
          height={88}
          className="rounded-[22px] mb-5 shadow-xl"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}
        />
        <h1 className="text-4xl font-extrabold text-white tracking-tight">SonoBuddy AI</h1>
        <p className="mt-3 text-lg font-medium" style={{ color: "#bfdbfe" }}>
          AI-Guided Ultrasound Study Companion
        </p>
        <p className="mt-2 text-sm" style={{ color: "#93c5fd" }}>
          Snap a photo. Study in seconds.
        </p>
      </div>

      {/* Feature pills */}
      <div className="flex justify-center gap-3 px-6 pb-10 flex-wrap">
        {[
          { icon: Zap, label: "31 Protocols" },
          { icon: Shield, label: "HIPAA-ready" },
          { icon: Camera, label: "Instant AI" },
        ].map(({ icon: Icon, label }) => (
          <span key={label} className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
            style={{ background: "rgba(255,255,255,0.15)", color: "#e0f2fe" }}>
            <Icon size={12} />
            {label}
          </span>
        ))}
      </div>

      {/* Auth buttons */}
      <div className="px-6 space-y-3 pb-4">
        <button
          onClick={() => openAuth("signup")}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-lg transition-all active:scale-95"
          style={{ background: "#ffffff", color: "#1d4ed8" }}>
          <UserPlus size={20} />
          Create Free Account
        </button>

        <button
          onClick={() => openAuth("signin")}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-lg border-2 transition-all active:scale-95"
          style={{ borderColor: "rgba(255,255,255,0.6)", color: "#ffffff", background: "rgba(255,255,255,0.1)" }}>
          <LogIn size={20} />
          Sign In
        </button>
      </div>

      {/* Try without account */}
      <div className="px-6 pt-2 text-center">
        <Link
          href="/scan"
          className="inline-flex items-center gap-1.5 text-sm font-medium transition-opacity active:opacity-70"
          style={{ color: "#93c5fd" }}>
          <Camera size={15} />
          Try a scan without an account →
        </Link>
      </div>

      {/* Free tier note */}
      <div className="mt-auto px-6 pb-32 pt-10 text-center">
        <p className="text-xs" style={{ color: "#7dd3fc" }}>
          5 free AI analyses/month · No credit card required
        </p>
        <p className="text-xs mt-1" style={{ color: "#60a5fa" }}>
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
