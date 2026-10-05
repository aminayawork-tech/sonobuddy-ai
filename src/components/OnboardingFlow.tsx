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
} from "lucide-react";

const ONBOARDED_KEY = "sonobuddyai_onboarded_v1";
const TOTAL = 5;

const BG = "#f3f1ec";
const INK = "#0a0a0a";
const MUTED = "#a1a1aa";
const ACCENT = "#7c3aed";
const DARK = "#0f172a";

// ── Shared chrome: logo, label, headline, CTA pill, skip ───────────────────────

function MiniLogo() {
  return (
    <span className="flex items-baseline text-base font-extrabold tracking-tight">
      <span style={{ color: INK }}>Sono</span>
      <span style={{ color: ACCENT }}>Buddy </span>
      <span style={{ color: ACCENT, fontStyle: "italic" }}>AI</span>
    </span>
  );
}

interface ShellProps {
  step: number;
  label: string;
  headline: string;
  accent: string;
  accentItalicSuffix?: string;
  ctaLabel: string;
  onNext: () => void;
  onSkip: () => void;
  children: React.ReactNode;
}

function OnboardingShell({ step, label, headline, accent, accentItalicSuffix, ctaLabel, onNext, onSkip, children }: ShellProps) {
  return (
    <div className="flex h-full flex-col px-6 pt-6 pb-8" style={{ background: BG }}>
      <div className="flex items-center justify-between">
        <MiniLogo />
        <span className="text-xs font-bold tabular-nums" style={{ color: MUTED }}>
          0{step + 1} / 0{TOTAL}
        </span>
      </div>

      <p className="mt-7 text-xs font-bold uppercase tracking-widest" style={{ color: MUTED }}>
        {label}
      </p>
      <h1 className="mt-1 text-[2.1rem] font-extrabold leading-[1.1]" style={{ color: INK }}>
        {headline}{" "}
        <span style={{ color: ACCENT }}>
          {accent}
          {accentItalicSuffix && <span style={{ fontStyle: "italic" }}>{accentItalicSuffix}</span>}
        </span>
      </h1>

      <div className="flex flex-1 flex-col justify-center overflow-y-auto py-4">{children}</div>

      <button
        onClick={onNext}
        className="flex w-full items-center justify-between rounded-full px-6 py-4 transition-all active:scale-[0.98]"
        style={{ background: DARK }}
      >
        <span className="text-base font-bold text-white">{ctaLabel}</span>
        <span className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: "rgba(255,255,255,0.45)" }}>
          0{step + 1}
          <ChevronRight size={16} color="#ffffff" />
        </span>
      </button>
      <button
        onClick={onSkip}
        className="mt-4 text-center text-sm font-medium transition-colors hover:opacity-70"
        style={{ color: MUTED }}
      >
        Skip intro
      </button>
    </div>
  );
}

// ── Screen illustrations ──────────────────────────────────────────────────────

function PhoneIllustration() {
  return (
    <div className="relative mx-auto flex items-center justify-center" style={{ height: 210 }}>
      <div
        className="absolute rounded-full blur-3xl opacity-20"
        style={{ width: 180, height: 180, background: ACCENT }}
      />
      <div
        className="relative rounded-[26px] shadow-xl"
        style={{ width: 128, height: 196, background: DARK, border: "3px solid rgba(15,23,42,0.15)" }}
      >
        <div
          className="absolute left-1/2 rounded-full"
          style={{ top: 9, width: 36, height: 7, background: "#1e293b", transform: "translateX(-50%)" }}
        />
        <div
          className="absolute overflow-hidden rounded-[18px]"
          style={{ top: 22, left: 6, right: 6, bottom: 10, background: "#030712" }}
        >
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 90% 75% at 50% 42%, #1e293b 0%, #030712 100%)" }}
          />
          <div
            className="absolute rounded-full"
            style={{ left: "22%", top: "26%", width: 40, height: 32, background: "rgba(148,163,184,0.12)", border: "1px solid rgba(148,163,184,0.35)" }}
          />
          <div
            className="absolute"
            style={{ left: "14%", top: "52%", width: 66, height: 26, borderRadius: "45%", background: "rgba(100,116,139,0.10)", border: "1px solid rgba(148,163,184,0.2)" }}
          />
          <div
            className="absolute rounded px-1.5 py-0.5 text-[7px] font-extrabold text-white"
            style={{ left: "20%", top: "20%", background: ACCENT }}
          >
            LV
          </div>
          <div
            className="absolute rounded px-1.5 py-0.5 text-[7px] font-extrabold text-white"
            style={{ left: "12%", top: "47%", background: "#059669" }}
          >
            RV
          </div>
          <div
            className="absolute"
            style={{ left: "22%", top: "43%", width: 40, height: 1, background: "#eab308" }}
          />
          <div className="absolute text-[5.5px] font-bold" style={{ left: "24%", top: "36%", color: "#eab308" }}>
            4.2 cm
          </div>
          <div
            className="absolute bottom-1.5 right-1.5 rounded px-1 py-0.5 text-[5px] font-bold"
            style={{ background: "rgba(124,58,237,0.85)", color: "#fff" }}
          >
            AI ●
          </div>
        </div>
      </div>
      <div
        className="absolute rounded-xl border px-2.5 py-1.5 shadow-md text-xs font-bold"
        style={{ left: 4, top: "28%", background: "#ffffff", borderColor: "#e7e5df", color: ACCENT }}
      >
        ♥ Echo
      </div>
      <div
        className="absolute rounded-xl border px-2.5 py-1.5 shadow-md text-xs font-bold"
        style={{ right: 4, top: "54%", background: "#ffffff", borderColor: "#e7e5df", color: "#059669" }}
      >
        ✓ Normal
      </div>
    </div>
  );
}

function StepFlowIllustration() {
  const steps = [
    { icon: Camera, bg: "#f3eafe", color: ACCENT, label: "Snap" },
    { icon: Zap, bg: "#fefce8", color: "#ca8a04", label: "AI" },
    { icon: CheckCircle, bg: "#f0fdf4", color: "#059669", label: "Results" },
  ];
  return (
    <div className="flex items-center justify-center gap-3">
      {steps.map(({ icon: Icon, bg, color, label }, i) => (
        <div key={label} className="flex items-center gap-3">
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm" style={{ background: bg }}>
              <Icon size={26} style={{ color }} />
            </div>
            <span className="text-xs font-semibold" style={{ color: "#78716c" }}>{label}</span>
          </div>
          {i < steps.length - 1 && <div className="mb-6 h-px w-6" style={{ background: "#d6d3cb" }} />}
        </div>
      ))}
    </div>
  );
}

function AIScanIllustration() {
  return (
    <div className="relative mx-auto flex items-center justify-center" style={{ height: 150 }}>
      <div
        className="absolute rounded-full animate-ping opacity-10"
        style={{ width: 120, height: 120, background: ACCENT, animationDuration: "2.2s" }}
      />
      <div
        className="absolute rounded-full animate-ping opacity-10"
        style={{ width: 88, height: 88, background: ACCENT, animationDuration: "2.2s", animationDelay: "0.6s" }}
      />
      <div className="relative flex items-center justify-center rounded-full shadow-lg" style={{ width: 62, height: 62, background: ACCENT }}>
        <Zap size={26} className="text-white" />
      </div>
      <div
        className="absolute rounded-lg border px-2 py-1 text-[10px] font-bold shadow-sm whitespace-nowrap"
        style={{ top: 6, right: "6%", background: "#fff", borderColor: "#e7e5df", color: ACCENT }}
      >
        Structure labeled
      </div>
      <div
        className="absolute rounded-lg border px-2 py-1 text-[10px] font-bold shadow-sm whitespace-nowrap"
        style={{ top: "45%", left: "0%", background: "#fff", borderColor: "#e7e5df", color: "#059669" }}
      >
        ✓ Measurement
      </div>
      <div
        className="absolute rounded-lg border px-2 py-1 text-[10px] font-bold shadow-sm whitespace-nowrap"
        style={{ bottom: 6, right: "4%", background: "#fff", borderColor: "#e7e5df", color: "#dc2626" }}
      >
        ⚠ Flagged
      </div>
    </div>
  );
}

function ReportIllustration() {
  return (
    <div className="mx-auto w-full max-w-xs rounded-2xl border shadow-md" style={{ background: "#fff", borderColor: "#e7e5df" }}>
      <div className="flex items-center justify-between rounded-t-2xl px-4 py-3" style={{ background: "#f3eafe", borderBottom: "1px solid #e9d8fd" }}>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "#c4b5fd" }}>Cardiac Echo</p>
          <p className="text-sm font-bold" style={{ color: "#0f172a" }}>Walkthrough Complete</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: ACCENT }}>
          <Activity size={16} className="text-white" />
        </div>
      </div>
      <div className="px-4 py-3 space-y-2">
        {[
          { label: "LV Function", value: "Normal EF", color: "#059669" },
          { label: "EF Estimate", value: "~55%", color: ACCENT },
          { label: "Pericardium", value: "No effusion", color: "#059669" },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex items-center justify-between text-xs">
            <span style={{ color: "#78716c" }}>{label}</span>
            <span className="font-bold" style={{ color }}>{value}</span>
          </div>
        ))}
      </div>
      <div className="px-4 pb-4">
        <div className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-white" style={{ background: ACCENT }}>
          <FileText size={13} />
          Export PDF
        </div>
      </div>
    </div>
  );
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <div className="space-y-3">
      {items.map((text, i) => (
        <div key={text} className="flex items-center gap-3">
          <div
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
            style={{ background: DARK }}
          >
            {i + 1}
          </div>
          <p className="text-sm font-medium" style={{ color: "#292524" }}>{text}</p>
        </div>
      ))}
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
    <OnboardingShell
      step={0}
      label="AI-Guided Ultrasound Study"
      headline="Welcome to"
      accent="Sono"
      accentItalicSuffix="Buddy AI"
      ctaLabel="Start Scanning Now"
      onNext={onNext}
      onSkip={onSkip}
    >
      <PhoneIllustration />
      <p className="mt-6 text-center text-sm leading-relaxed" style={{ color: "#57534e" }}>
        Point your phone at any ultrasound screen. Get instant labels, reference measurements, and study highlights.
      </p>
    </OnboardingShell>
  );
}

function Screen2({ onNext, onSkip }: ScreenProps) {
  return (
    <OnboardingShell
      step={1}
      label="Step 1 of 3"
      headline="Snap or"
      accent="Upload"
      ctaLabel="Next"
      onNext={onNext}
      onSkip={onSkip}
    >
      <StepFlowIllustration />
      <p className="mt-6 text-center text-sm leading-relaxed" style={{ color: "#57534e" }}>
        Photograph any ultrasound screen or upload an image. No special probes or equipment needed.
        Patient data is{" "}
        <span className="font-semibold" style={{ color: INK }}>automatically anonymized.</span>
      </p>
      <div className="mx-auto mt-5 w-fit rounded-full px-4 py-2 text-xs font-semibold" style={{ background: "#eae7df", color: "#57534e" }}>
        Works with eFAST • Echo • OB • Vascular • MSK & more
      </div>
    </OnboardingShell>
  );
}

function Screen3({ onNext, onSkip }: ScreenProps) {
  return (
    <OnboardingShell
      step={2}
      label="Step 2 of 3"
      headline="AI Analyzes in"
      accent="Seconds"
      ctaLabel="Next"
      onNext={onNext}
      onSkip={onSkip}
    >
      <AIScanIllustration />
      <div className="mt-6">
        <NumberedList
          items={["Structures labeled", "Reference measurements shown", "Study highlights flagged"]}
        />
      </div>
      <p className="mt-4 text-center text-xs" style={{ color: MUTED }}>
        Powered by advanced AI trained on thousands of scans.
      </p>
    </OnboardingShell>
  );
}

function Screen4({ onNext, onSkip }: ScreenProps) {
  return (
    <OnboardingShell
      step={3}
      label="Step 3 of 3"
      headline="Get Instant"
      accent="Insights"
      ctaLabel="Almost there"
      onNext={onNext}
      onSkip={onSkip}
    >
      <ReportIllustration />
      <p className="mt-5 text-center text-sm leading-relaxed" style={{ color: "#57534e" }}>
        Review the walkthrough, share annotated images, or export a study PDF with one tap.
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {[
          { icon: Shield, label: "HIPAA-ready", color: ACCENT, bg: "#f3eafe" },
          { icon: CheckCircle, label: "Privacy-first", color: "#059669", bg: "#f0fdf4" },
        ].map(({ icon: Icon, label, color, bg }) => (
          <div key={label} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold" style={{ background: bg, color }}>
            <Icon size={12} />
            {label}
          </div>
        ))}
        <div className="rounded-full px-3 py-1.5 text-xs font-semibold" style={{ background: "#fff0e4", color: "#c2410c" }}>
          Educational use only
        </div>
      </div>
    </OnboardingShell>
  );
}

function Screen5({ onComplete, onSkip }: ScreenProps) {
  return (
    <OnboardingShell
      step={4}
      label="Get Started"
      headline="Ready to study"
      accent="smarter?"
      ctaLabel="Start Your First Free Study Session"
      onNext={onComplete}
      onSkip={onSkip}
    >
      <div className="flex flex-col items-center">
        <div
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl"
          style={{ background: "#f3eafe", border: "1px solid #e9d8fd" }}
        >
          <div className="relative">
            <Activity size={36} style={{ color: ACCENT }} />
            <div
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[8px] font-extrabold text-white"
              style={{ background: ACCENT }}
            >
              AI
            </div>
          </div>
        </div>
        <p className="max-w-xs text-center text-sm leading-relaxed" style={{ color: "#57534e" }}>
          Join thousands of learners studying ultrasound anatomy with an AI-guided study companion.
        </p>
        <p className="mt-6 text-center text-[10px]" style={{ color: MUTED }}>
          Educational use only. Not medical advice.
        </p>
      </div>
    </OnboardingShell>
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
