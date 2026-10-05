"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Zap,
  FileText,
  CheckCircle,
  Activity,
  Shield,
  ChevronRight,
  ChevronLeft,
  X,
} from "lucide-react";

const ONBOARDED_KEY = "sonobuddyai_onboarded_v1";
const TOTAL = 5;

// ── Progress indicator ────────────────────────────────────────────────────────

function Dots({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: TOTAL }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-300"
          style={{
            width: i === current ? 18 : 6,
            height: 6,
            background:
              i === current
                ? "rgba(255,255,255,0.95)"
                : i < current
                ? "rgba(255,255,255,0.5)"
                : "rgba(255,255,255,0.25)",
          }}
        />
      ))}
    </div>
  );
}

function DarkDots({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: TOTAL }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-300"
          style={{
            width: i === current ? 18 : 6,
            height: 6,
            background:
              i === current ? "#2563eb" : i < current ? "#93c5fd" : "#e2e8f0",
          }}
        />
      ))}
    </div>
  );
}

// ── Screen illustrations ──────────────────────────────────────────────────────

function PhoneIllustration() {
  return (
    <div className="relative flex items-center justify-center" style={{ height: 230 }}>
      {/* Ambient glow */}
      <div
        className="absolute rounded-full blur-3xl opacity-30"
        style={{ width: 200, height: 200, background: "#ffffff" }}
      />
      {/* Phone shell */}
      <div
        className="relative rounded-[26px] shadow-2xl"
        style={{
          width: 136,
          height: 210,
          background: "#0f172a",
          border: "3px solid rgba(148,163,184,0.4)",
        }}
      >
        {/* Notch */}
        <div
          className="absolute left-1/2 rounded-full"
          style={{
            top: 9,
            width: 38,
            height: 8,
            background: "#1e293b",
            transform: "translateX(-50%)",
          }}
        />
        {/* Screen */}
        <div
          className="absolute overflow-hidden rounded-[20px]"
          style={{ top: 24, left: 6, right: 6, bottom: 12, background: "#030712" }}
        >
          {/* Ultrasound sector */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 90% 75% at 50% 42%, #1e293b 0%, #030712 100%)",
            }}
          />
          {/* Cardiac chamber shapes */}
          <div
            className="absolute rounded-full"
            style={{
              left: "22%",
              top: "26%",
              width: 44,
              height: 34,
              background: "rgba(148,163,184,0.12)",
              border: "1px solid rgba(148,163,184,0.35)",
            }}
          />
          <div
            className="absolute"
            style={{
              left: "14%",
              top: "52%",
              width: 72,
              height: 28,
              borderRadius: "45%",
              background: "rgba(100,116,139,0.10)",
              border: "1px solid rgba(148,163,184,0.2)",
            }}
          />
          {/* AI label — LV */}
          <div
            className="absolute rounded px-1.5 py-0.5 text-[7px] font-extrabold text-white"
            style={{ left: "20%", top: "20%", background: "#2563eb" }}
          >
            LV
          </div>
          {/* AI label — RV */}
          <div
            className="absolute rounded px-1.5 py-0.5 text-[7px] font-extrabold text-white"
            style={{ left: "12%", top: "47%", background: "#059669" }}
          >
            RV
          </div>
          {/* Measurement line */}
          <div
            className="absolute"
            style={{ left: "22%", top: "43%", width: 44, height: 1, background: "#eab308" }}
          />
          <div
            className="absolute text-[5.5px] font-bold"
            style={{ left: "24%", top: "36%", color: "#eab308" }}
          >
            4.2 cm
          </div>
          {/* Corner badge */}
          <div
            className="absolute bottom-1.5 right-1.5 rounded px-1 py-0.5 text-[5px] font-bold"
            style={{ background: "rgba(37,99,235,0.85)", color: "#fff" }}
          >
            AI ●
          </div>
        </div>
      </div>
      {/* Floating result cards */}
      <div
        className="absolute rounded-xl border px-2.5 py-1.5 shadow-xl text-xs font-bold"
        style={{
          left: 0,
          top: "30%",
          background: "#ffffff",
          borderColor: "#e2e8f0",
          color: "#2563eb",
        }}
      >
        ♥ Echo
      </div>
      <div
        className="absolute rounded-xl border px-2.5 py-1.5 shadow-xl text-xs font-bold"
        style={{
          right: 0,
          top: "52%",
          background: "#ffffff",
          borderColor: "#e2e8f0",
          color: "#059669",
        }}
      >
        ✓ Normal
      </div>
    </div>
  );
}

function StepFlowIllustration() {
  const steps = [
    { icon: Camera, bg: "#eff6ff", color: "#2563eb", label: "Snap" },
    { icon: Zap, bg: "#fefce8", color: "#ca8a04", label: "AI" },
    { icon: CheckCircle, bg: "#f0fdf4", color: "#059669", label: "Results" },
  ];
  return (
    <div className="flex items-center justify-center gap-3 py-2">
      {steps.map(({ icon: Icon, bg, color, label }, i) => (
        <div key={label} className="flex items-center gap-3">
          <div className="flex flex-col items-center gap-2">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm"
              style={{ background: bg }}
            >
              <Icon size={26} style={{ color }} />
            </div>
            <span className="text-xs font-semibold" style={{ color: "#64748b" }}>
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className="mb-6 h-px w-6" style={{ background: "#cbd5e1" }} />
          )}
        </div>
      ))}
    </div>
  );
}

function AIScanIllustration() {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ height: 160 }}
    >
      <div
        className="absolute rounded-full animate-ping opacity-10"
        style={{ width: 130, height: 130, background: "#2563eb", animationDuration: "2.2s" }}
      />
      <div
        className="absolute rounded-full animate-ping opacity-10"
        style={{ width: 95, height: 95, background: "#2563eb", animationDuration: "2.2s", animationDelay: "0.6s" }}
      />
      <div
        className="relative flex h-18 w-18 items-center justify-center rounded-full shadow-lg"
        style={{ width: 64, height: 64, background: "#2563eb" }}
      >
        <Zap size={28} className="text-white" />
      </div>
      {/* Floating tags */}
      <div
        className="absolute rounded-lg border px-2 py-1 text-[10px] font-bold shadow-sm"
        style={{ top: 8, right: "8%", background: "#fff", borderColor: "#e2e8f0", color: "#2563eb", whiteSpace: "nowrap" }}
      >
        Structure labeled
      </div>
      <div
        className="absolute rounded-lg border px-2 py-1 text-[10px] font-bold shadow-sm"
        style={{ top: "45%", left: "2%", background: "#fff", borderColor: "#e2e8f0", color: "#059669", whiteSpace: "nowrap" }}
      >
        ✓ Measurement
      </div>
      <div
        className="absolute rounded-lg border px-2 py-1 text-[10px] font-bold shadow-sm"
        style={{ bottom: 8, right: "6%", background: "#fff", borderColor: "#e2e8f0", color: "#dc2626", whiteSpace: "nowrap" }}
      >
        ⚠ Flagged
      </div>
    </div>
  );
}

function ReportIllustration() {
  return (
    <div
      className="mx-auto w-full max-w-xs rounded-2xl border shadow-lg"
      style={{ background: "#fff", borderColor: "#e2e8f0" }}
    >
      <div
        className="flex items-center justify-between rounded-t-2xl px-4 py-3"
        style={{ background: "#eff6ff", borderBottom: "1px solid #dbeafe" }}
      >
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "#93c5fd" }}>
            Cardiac Echo
          </p>
          <p className="text-sm font-bold" style={{ color: "#0f172a" }}>
            Analysis Complete
          </p>
        </div>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ background: "#2563eb" }}
        >
          <Activity size={16} className="text-white" />
        </div>
      </div>
      <div className="px-4 py-3 space-y-2">
        {[
          { label: "LV Function", value: "Normal EF", color: "#059669" },
          { label: "EF Estimate", value: "~55%", color: "#2563eb" },
          { label: "Pericardium", value: "No effusion", color: "#059669" },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex items-center justify-between text-xs">
            <span style={{ color: "#64748b" }}>{label}</span>
            <span className="font-bold" style={{ color }}>
              {value}
            </span>
          </div>
        ))}
      </div>
      <div className="px-4 pb-4">
        <div
          className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-white"
          style={{ background: "#2563eb" }}
        >
          <FileText size={13} />
          Export PDF Report
        </div>
      </div>
    </div>
  );
}

// ── Screen content definitions ────────────────────────────────────────────────

interface ScreenProps {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  onComplete: () => void;
  current: number;
}

function Screen1({ onNext, onSkip }: ScreenProps) {
  return (
    <div
      className="flex h-full flex-col px-6 pt-6 pb-10"
      style={{
        background: "linear-gradient(160deg, #1e3a8a 0%, #2563eb 55%, #3b82f6 100%)",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-0.5">
          <span className="text-base font-extrabold text-white">Sono</span>
          <span className="text-base font-extrabold text-blue-200">Pilot</span>
        </div>
        <button
          onClick={onSkip}
          className="rounded-full p-1.5 text-white/60 transition-colors hover:text-white"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <PhoneIllustration />
      </div>

      <div>
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-xs font-medium text-white/80">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
          AI-Guided Ultrasound Study
        </div>
        <h1 className="mb-2 text-3xl font-extrabold leading-tight text-white">
          Welcome to SonoBuddy AI
        </h1>
        <p className="mb-2 text-base font-semibold text-white/90">
          AI-Guided Ultrasound Study Companion
        </p>
        <p className="mb-8 text-sm leading-relaxed text-white/70">
          Point your phone at any ultrasound screen. Get instant labels, reference measurements, and study highlights.
        </p>
        <button
          onClick={onNext}
          className="mb-3 w-full rounded-2xl py-4 text-base font-bold text-blue-700 shadow-lg transition-all active:scale-95"
          style={{ background: "#ffffff" }}
        >
          Start Scanning Now
        </button>
        <button
          onClick={onNext}
          className="w-full rounded-2xl border border-white/25 py-4 text-base font-semibold text-white transition-all hover:bg-white/10"
        >
          Learn How It Works
        </button>
      </div>
    </div>
  );
}

function Screen2({ onNext, onBack, onSkip, current }: ScreenProps) {
  return (
    <div className="flex h-full flex-col bg-white px-6 pt-6 pb-10">
      <div className="flex items-center justify-between">
        <DarkDots current={current} />
        <button
          onClick={onSkip}
          className="rounded-full p-1.5 transition-colors hover:bg-slate-100"
          style={{ color: "#94a3b8" }}
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center">
        <div
          className="mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
          style={{ background: "#eff6ff", color: "#2563eb" }}
        >
          Step 1 of 3
        </div>
        <h2
          className="mb-4 text-center text-2xl font-extrabold"
          style={{ color: "#0f172a" }}
        >
          Snap or Upload
        </h2>
        <StepFlowIllustration />
        <p className="mt-6 text-center text-sm leading-relaxed" style={{ color: "#64748b" }}>
          Photograph any ultrasound screen or upload an image. No special probes or equipment needed.
          Patient data is{" "}
          <span className="font-semibold" style={{ color: "#0f172a" }}>
            automatically anonymized.
          </span>
        </p>
        <div
          className="mt-5 rounded-full px-4 py-2 text-xs font-semibold"
          style={{ background: "#f1f5f9", color: "#475569" }}
        >
          Works with eFAST • Echo • OB • Vascular • MSK & more
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex items-center justify-center rounded-2xl border p-4 transition-all hover:bg-slate-50"
          style={{ borderColor: "#e2e8f0", color: "#94a3b8" }}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={onNext}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold text-white transition-all hover:opacity-90"
          style={{ background: "#2563eb" }}
        >
          Next
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

function Screen3({ onNext, onBack, onSkip, current }: ScreenProps) {
  return (
    <div className="flex h-full flex-col bg-white px-6 pt-6 pb-10">
      <div className="flex items-center justify-between">
        <DarkDots current={current} />
        <button
          onClick={onSkip}
          className="rounded-full p-1.5 transition-colors hover:bg-slate-100"
          style={{ color: "#94a3b8" }}
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center">
        <div
          className="mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
          style={{ background: "#fefce8", color: "#ca8a04" }}
        >
          Step 2 of 3
        </div>
        <h2
          className="mb-4 text-center text-2xl font-extrabold"
          style={{ color: "#0f172a" }}
        >
          AI Analyzes in Seconds
        </h2>
        <AIScanIllustration />
        <div className="mt-6 space-y-3 w-full">
          {[
            { icon: "🏷", text: "Structures labeled", color: "#2563eb" },
            { icon: "📐", text: "Automated measurements", color: "#059669" },
            { icon: "⚠️", text: "Anomalies detected", color: "#dc2626" },
          ].map(({ icon, text, color }) => (
            <div
              key={text}
              className="flex items-center gap-3 rounded-xl px-4 py-3"
              style={{ background: "#f8fafc", border: "1px solid #f1f5f9" }}
            >
              <span className="text-lg">{icon}</span>
              <span className="text-sm font-semibold" style={{ color }}>
                {text}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs" style={{ color: "#94a3b8" }}>
          Powered by advanced AI trained on thousands of scans.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex items-center justify-center rounded-2xl border p-4 transition-all hover:bg-slate-50"
          style={{ borderColor: "#e2e8f0", color: "#94a3b8" }}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={onNext}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold text-white transition-all hover:opacity-90"
          style={{ background: "#2563eb" }}
        >
          Next
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

function Screen4({ onNext, onBack, onSkip, current }: ScreenProps) {
  return (
    <div className="flex h-full flex-col bg-white px-6 pt-6 pb-10">
      <div className="flex items-center justify-between">
        <DarkDots current={current} />
        <button
          onClick={onSkip}
          className="rounded-full p-1.5 transition-colors hover:bg-slate-100"
          style={{ color: "#94a3b8" }}
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center">
        <div
          className="mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
          style={{ background: "#f0fdf4", color: "#059669" }}
        >
          Step 3 of 3
        </div>
        <h2
          className="mb-4 text-center text-2xl font-extrabold"
          style={{ color: "#0f172a" }}
        >
          Get Instant Insights
        </h2>
        <ReportIllustration />
        <p className="mt-5 text-center text-sm leading-relaxed" style={{ color: "#64748b" }}>
          Review findings, share annotated images, or export a professional PDF report with one tap.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {[
            { icon: Shield, label: "HIPAA-ready", color: "#2563eb", bg: "#eff6ff" },
            { icon: CheckCircle, label: "Privacy-first", color: "#059669", bg: "#f0fdf4" },
          ].map(({ icon: Icon, label, color, bg }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
              style={{ background: bg, color }}
            >
              <Icon size={12} />
              {label}
            </div>
          ))}
          <div
            className="rounded-full px-3 py-1.5 text-xs font-semibold"
            style={{ background: "#fff7ed", color: "#c2410c" }}
          >
            Educational use only
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex items-center justify-center rounded-2xl border p-4 transition-all hover:bg-slate-50"
          style={{ borderColor: "#e2e8f0", color: "#94a3b8" }}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={onNext}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold text-white transition-all hover:opacity-90"
          style={{ background: "#2563eb" }}
        >
          Almost there
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

function Screen5({ onComplete, onSkip }: ScreenProps) {
  return (
    <div
      className="flex h-full flex-col items-center justify-between px-6 pt-12 pb-12 text-center"
      style={{
        background: "linear-gradient(160deg, #1e3a8a 0%, #2563eb 55%, #3b82f6 100%)",
      }}
    >
      <div />

      <div className="flex flex-col items-center">
        {/* Stethoscope-ish icon cluster */}
        <div
          className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl shadow-2xl"
          style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}
        >
          <div className="relative">
            <Activity size={44} className="text-white" />
            <div
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[8px] font-extrabold"
              style={{ background: "#ffffff", color: "#2563eb" }}
            >
              AI
            </div>
          </div>
        </div>
        <h2 className="mb-3 text-3xl font-extrabold text-white">
          Ready to study smarter?
        </h2>
        <p className="mb-10 max-w-xs text-base leading-relaxed text-white/75">
          Join thousands of learners studying ultrasound anatomy with an AI-guided study companion.
        </p>
        <button
          onClick={onComplete}
          className="mb-4 w-full max-w-xs rounded-2xl py-4 text-base font-extrabold text-blue-700 shadow-xl transition-all active:scale-95"
          style={{ background: "#ffffff" }}
        >
          Start Your First Free Study Session
        </button>
        <button
          onClick={onSkip}
          className="text-sm font-medium text-white/55 transition-colors hover:text-white/80"
        >
          Skip Tutorial
        </button>
      </div>

      <p className="text-[10px] text-white/40">
        Educational use only. Not medical advice.
      </p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function OnboardingFlow() {
  const [visible, setVisible] = useState(false);
  const [screen, setScreen] = useState(0);
  const router = useRouter();
  const touchStartX = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(ONBOARDED_KEY)) setVisible(true);
  }, []);

  function complete() {
    localStorage.setItem(ONBOARDED_KEY, "1");
    setVisible(false);
    router.push("/scan");
  }

  function skip() {
    localStorage.setItem(ONBOARDED_KEY, "1");
    setVisible(false);
  }

  function next() {
    if (screen < TOTAL - 1) setScreen((s) => s + 1);
    else complete();
  }

  function back() {
    if (screen > 0) setScreen((s) => s - 1);
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.changedTouches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) {
      if (delta > 0) next();
      else back();
    }
  }

  if (!visible) return null;

  const screenProps: ScreenProps = {
    onNext: next,
    onBack: back,
    onSkip: skip,
    onComplete: complete,
    current: screen,
  };

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Sliding carousel — all 5 screens laid out horizontally */}
      <div
        className="flex h-full"
        style={{
          width: `${TOTAL * 100}%`,
          transform: `translateX(-${(screen / TOTAL) * 100}%)`,
          transition: "transform 0.38s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {[Screen1, Screen2, Screen3, Screen4, Screen5].map((Scr, i) => (
          <div key={i} style={{ width: `${100 / TOTAL}%`, height: "100%" }}>
            <Scr {...screenProps} />
          </div>
        ))}
      </div>
    </div>
  );
}
