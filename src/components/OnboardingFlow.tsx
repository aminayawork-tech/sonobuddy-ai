"use client";

import { useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import Image from "next/image";
import localFont from "next/font/local";
import {
  Activity, ArrowLeft, BookOpen, Camera, Check, ChevronRight, FileText, GraduationCap,
  HeartPulse, MessageCircle, Sparkles, Stethoscope, type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import UpgradeModal from "@/components/UpgradeModal";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES, CATEGORY_PILL, type Category } from "@/lib/protocols";
import { CATEGORY_ICON } from "@/lib/categoryIcons";
import { FREE_SCAN_LIMIT, YEARLY_SALE, yearlySaleActive } from "@/lib/plans";
import { isAndroidApp } from "@/lib/platform";
import {
  EMPTY_ANSWERS, OPEN_AUTH_EVENT, OPEN_ONBOARDING_EVENT, getOnboarding, saveOnboarding,
  type OnboardingAnswers, type StudyRole,
} from "@/lib/onboarding";

const handwriting = localFont({ src: "../app/fonts/Kalam-latin.woff2", weight: "400", display: "swap" });

// Legacy flag from the first intro — people who saw it skip the intro screens.
const LEGACY_ONBOARDED_KEY = "sonobuddyai_onboarded_v1";
// Set once a signed-in user has been offered the personalization questions.
const ASKED_KEY = "sonobuddyai_personalize_asked_v1";

const INK = "#0f172a";
const BODY = "#5a6a85";
const MUTED = "#94a3b8";
const ACCENT = "#7c3aed";
const ACCENT_SOFT = "#f5f3ff";

// ✏️ Founder's note — replace with your own words.
const FOUNDER_NOTE = [
  "When I was learning to scan, the hardest part wasn\u2019t holding the probe. It was looking at the screen and not knowing what I was looking at, and not having anyone to ask in that moment.",
  "Textbooks show perfect images. Real scans are messy, and the questions come up while you\u2019re studying at night, not when an instructor is standing next to you.",
  "So I built SonoBuddy ai: a study buddy you can show any ultrasound image to, that walks you through what\u2019s on the screen and answers your follow-up questions.",
  "I hope it helps it all click a little sooner.",
];
const FOUNDER_SIGNATURE = "\u2014 Founder of SonoBuddy ai";

const ROLES: { id: StudyRole; label: string; sub: string; icon: LucideIcon; gradient: string }[] = [
  { id: "sonography_student", label: "Sonography student", sub: "DMS / ultrasound program", icon: GraduationCap, gradient: "linear-gradient(135deg,#a78bfa,#7c3aed)" },
  { id: "medical_student",    label: "Medical student",    sub: "Learning POCUS & anatomy", icon: BookOpen,      gradient: "linear-gradient(135deg,#60a5fa,#2563eb)" },
  { id: "resident",           label: "Resident or fellow", sub: "EM, IM, critical care & more", icon: Stethoscope, gradient: "linear-gradient(135deg,#34d399,#059669)" },
  { id: "nurse_pa_np",        label: "Nurse, PA or NP",    sub: "Adding ultrasound skills",    icon: HeartPulse,   gradient: "linear-gradient(135deg,#f472b6,#db2777)" },
  { id: "sonographer",        label: "Practicing sonographer", sub: "Refreshing or cross-training", icon: Activity, gradient: "linear-gradient(135deg,#fbbf24,#d97706)" },
  { id: "curious",            label: "Just curious",       sub: "Exploring ultrasound",        icon: Sparkles,     gradient: "linear-gradient(135deg,#94a3b8,#475569)" },
];

type Step = "hook" | "how" | "role" | "focus" | "founder" | "offer" | "account";

function Accent({ children, italic }: { children: React.ReactNode; italic?: boolean }) {
  return <span style={{ color: ACCENT, fontStyle: italic ? "italic" : undefined }}>{children}</span>;
}

function GradientTile({ icon: Icon, gradient, size = 40 }: { icon: LucideIcon; gradient: string; size?: number }) {
  return (
    <span className="flex shrink-0 items-center justify-center rounded-xl text-white"
      style={{ width: size, height: size, background: gradient, boxShadow: "0 6px 14px -6px rgba(76,29,149,0.45)" }}>
      <Icon size={Math.round(size * 0.45)} />
    </span>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: MUTED }}>{children}</p>;
}

function Headline({ children }: { children: React.ReactNode }) {
  return <h1 className="mt-3 text-[32px] font-extrabold leading-[1.08] tracking-[-0.03em]" style={{ color: INK }}>{children}</h1>;
}

function PhoneIllustration() {
  return (
    <div className="relative mx-auto flex items-center justify-center" style={{ height: 210 }}>
      <div
        className="absolute rounded-full blur-3xl opacity-20"
        style={{ width: 180, height: 180, background: ACCENT }}
      />
      <div
        className="relative rounded-[26px] shadow-xl"
        style={{ width: 128, height: 196, background: INK, border: "3px solid rgba(15,23,42,0.15)" }}
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

// ── Main component ────────────────────────────────────────────────────────────

export default function OnboardingFlow() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const [mode, setMode] = useState<"full" | "personalize" | null>(null);
  const [step, setStep] = useState<Step>("hook");
  const [answers, setAnswers] = useState<OnboardingAnswers>(EMPTY_ANSWERS);
  const [android, setAndroid] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const isPaid = profile?.tier === "pro" || profile?.tier === "clinic";

  // Decide whether to show anything, and sync saved answers to the profile.
  useEffect(() => {
    if (typeof window === "undefined" || loading) return;
    const params = new URLSearchParams(window.location.search);
    const local = getOnboarding();
    setAndroid(isAndroidApp());

    if (!user) {
      const seen = local.completedAt || localStorage.getItem(LEGACY_ONBOARDED_KEY);
      if (!seen && !params.has("welcome") && !params.has("confirmed")) {
        setAnswers(local);
        setStep("hook");
        setMode("full");
      }
      return;
    }

    if (!profile) return;
    const columnsReady = "onboarded_at" in profile; // migration 005 has been run
    if (!columnsReady || profile.onboarded_at) return;

    if (local.completedAt) {
      // Answered before signing up — copy onto the profile, no need to ask again.
      void persist(local).then(refreshProfile);
      return;
    }
    // Signed in without answers (e.g. new device). Arriving from a confirmation
    // email goes straight into the app; Home offers personalization instead.
    if (!params.has("welcome") && !params.has("confirmed") && !localStorage.getItem(ASKED_KEY)) {
      localStorage.setItem(ASKED_KEY, "1");
      setAnswers(local);
      setStep("role");
      setMode("personalize");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, profile, loading]);

  // Home's "Personalize" card reopens just the questions.
  useEffect(() => {
    function open() {
      const local = getOnboarding();
      setAnswers({ ...local, role: (profile?.role as StudyRole) ?? local.role, focusAreas: (profile?.focus_areas as Category[]) ?? local.focusAreas });
      setStep("role");
      setMode("personalize");
    }
    window.addEventListener(OPEN_ONBOARDING_EVENT, open);
    return () => window.removeEventListener(OPEN_ONBOARDING_EVENT, open);
  }, [profile]);

  const steps: Step[] = useMemo(() => {
    if (mode === "personalize") {
      const list: Step[] = ["role", "focus"];
      if (user && !isPaid && !android) list.push("offer");
      return list;
    }
    return ["hook", "how", "role", "focus", "founder", "account"];
  }, [mode, user, isPaid, android]);

  if (!mode) return null;

  const index = Math.max(0, steps.indexOf(step));

  async function persist(a: OnboardingAnswers) {
    const done = { ...a, completedAt: a.completedAt ?? new Date().toISOString() };
    saveOnboarding(done);
    localStorage.setItem(LEGACY_ONBOARDED_KEY, "1");
    if (!user) return;
    await createClient().from("profiles").update({
      role: done.role,
      focus_areas: done.focusAreas,
      onboarded_at: done.completedAt,
    }).eq("id", user.id);
  }

  async function finish() {
    await persist(answers);
    if (user) await refreshProfile();
    setMode(null);
  }

  function next() {
    const target = steps[index + 1];
    // Save as soon as the questions are answered, so leaving early keeps them.
    if (step === "focus") void persist(answers);
    if (target) setStep(target);
    else void finish();
  }

  function back() {
    if (index > 0) setStep(steps[index - 1]);
  }

  function openAuth(authMode: "signup" | "signin") {
    void persist(answers);
    flushSync(() => setMode(null));
    window.dispatchEvent(new CustomEvent(OPEN_AUTH_EVENT, { detail: authMode }));
  }

  const toggleFocus = (c: Category) =>
    setAnswers((a) => ({
      ...a,
      focusAreas: a.focusAreas.includes(c) ? a.focusAreas.filter((x) => x !== c) : [...a.focusAreas, c],
    }));

  const ctaLabel: Record<Step, string> = {
    hook: "See how it works",
    how: "Get started",
    role: "Continue",
    focus: answers.focusAreas.length ? "Continue" : "Pick at least one",
    founder: "Let\u2019s go",
    offer: "Continue with free",
    account: "",
  };
  const ctaDisabled = (step === "role" && !answers.role) || (step === "focus" && answers.focusAreas.length === 0);

  return (
    <div className="fixed inset-0 z-[110] flex flex-col"
      style={{ background: "linear-gradient(180deg, #ede9fe 0%, #f3f0fd 260px, #eef3f8 560px)" }}>
      {showUpgrade && <UpgradeModal onClose={() => { setShowUpgrade(false); void refreshProfile(); }} />}

      {/* Header: back · wordmark · progress · counter */}
      <div className="mx-auto w-full max-w-lg px-5" style={{ paddingTop: "calc(env(safe-area-inset-top) + 18px)" }}>
        <div className="flex items-center gap-3">
          {index > 0 ? (
            <button onClick={back} aria-label="Back"
              className="-ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
              style={{ background: "rgba(255,255,255,0.85)", boxShadow: "0 1px 3px rgba(15,23,42,0.08)" }}>
              <ArrowLeft size={17} style={{ color: INK }} />
            </button>
          ) : (
            <Image src="/sonobuddy-favicon.png" alt="" width={28} height={28} className="shrink-0 rounded-lg" />
          )}
          <p className="shrink-0 text-[19px] font-extrabold leading-none tracking-[-0.03em]">
            <span style={{ color: INK }}>Sono</span><span style={{ color: ACCENT }}>Buddy </span><span style={{ color: ACCENT, fontStyle: "italic" }}>ai</span>
          </p>
          <div className="flex min-w-0 flex-1 gap-1.5">
            {steps.map((s, i) => (
              <div key={s} className="h-1.5 flex-1 rounded-full transition-colors duration-300"
                style={{ background: i <= index ? ACCENT : "rgba(15,23,42,0.10)" }} />
            ))}
          </div>
          <span className="shrink-0 text-[12px] font-bold tabular-nums" style={{ color: MUTED }}>
            {String(index + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Step content */}
      <div key={step} className="onb-enter mx-auto w-full max-w-lg flex-1 overflow-y-auto px-5 pt-8 pb-6">
        {step === "hook" && (
          <>
            <Eyebrow>Why SonoBuddy ai</Eyebrow>
            <Headline>Reading a scan is a skill you build <Accent>one image at a time.</Accent></Headline>
            <div className="mt-6"><PhoneIllustration /></div>
            <p className="mt-6 text-[16px] leading-relaxed" style={{ color: BODY }}>
              The fastest way to learn is to look at real images and have someone explain them. SonoBuddy ai is that someone, any time you&apos;re studying.
            </p>
          </>
        )}

        {step === "how" && (
          <>
            <Eyebrow>How it works</Eyebrow>
            <Headline>Snap it. <Accent>Understand it.</Accent></Headline>
            <div className="mt-6 flex flex-col gap-3">
              {[
                { icon: Camera, gradient: "linear-gradient(135deg,#a78bfa,#7c3aed)", title: "Snap or upload any scan", sub: "Photo of the screen or a saved image \u2014 patient info is redacted" },
                { icon: Sparkles, gradient: "linear-gradient(135deg,#f0abfc,#c026d3)", title: "AI walks you through it", sub: "Structures labeled, measurements explained, key findings highlighted" },
                { icon: MessageCircle, gradient: "linear-gradient(135deg,#60a5fa,#2563eb)", title: "Ask follow-up questions", sub: "\u201cWhat view should I get next?\u201d \u2014 get an answer about your image" },
                { icon: FileText, gradient: "linear-gradient(135deg,#34d399,#059669)", title: "34 protocols to study", sub: "Step-by-step views, normal values and common pitfalls" },
              ].map((f) => (
                <div key={f.title} className="flex items-center gap-3.5 rounded-[20px] bg-white p-3.5" style={{ boxShadow: "0 1px 3px rgba(15,23,42,0.06)" }}>
                  <GradientTile icon={f.icon} gradient={f.gradient} />
                  <div className="min-w-0">
                    <p className="text-[15px] font-bold" style={{ color: INK }}>{f.title}</p>
                    <p className="text-[12.5px] font-medium leading-snug" style={{ color: MUTED }}>{f.sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-5 text-center text-[11.5px]" style={{ color: MUTED }}>For educational use only. Not for diagnosis or patient care.</p>
          </>
        )}

        {step === "role" && (
          <>
            <Eyebrow>Let&apos;s personalize your app</Eyebrow>
            <Headline>Who&apos;s <Accent>studying?</Accent></Headline>
            <div className="mt-5 flex flex-col gap-2.5">
              {ROLES.map((r) => {
                const active = answers.role === r.id;
                return (
                  <button key={r.id} onClick={() => setAnswers((a) => ({ ...a, role: r.id }))}
                    className="flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition-transform active:scale-[0.99]"
                    style={{ background: active ? ACCENT_SOFT : "#ffffff", borderColor: active ? ACCENT : "transparent", boxShadow: active ? undefined : "0 1px 3px rgba(15,23,42,0.06)" }}>
                    <GradientTile icon={r.icon} gradient={r.gradient} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14.5px] font-bold leading-tight" style={{ color: INK }}>{r.label}</span>
                      <span className="mt-0.5 block text-[12px] font-medium" style={{ color: MUTED }}>{r.sub}</span>
                    </span>
                    {active && (
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full" style={{ background: ACCENT }}>
                        <Check size={14} strokeWidth={3} className="text-white" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {step === "focus" && (
          <>
            <Eyebrow>Pick as many as you like</Eyebrow>
            <Headline>What do you want to <Accent>master first?</Accent></Headline>
            <p className="mt-1.5 text-[15px]" style={{ color: BODY }}>We&apos;ll put these protocols first on your Home screen.</p>
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              {CATEGORIES.map((c) => {
                const active = answers.focusAreas.includes(c);
                const pill = CATEGORY_PILL[c];
                const Icon = CATEGORY_ICON[c];
                return (
                  <button key={c} onClick={() => toggleFocus(c)}
                    className="relative flex items-center gap-2.5 rounded-2xl border-2 p-3 text-left transition-transform active:scale-[0.98]"
                    style={{ background: active ? ACCENT_SOFT : "#ffffff", borderColor: active ? ACCENT : "transparent", boxShadow: active ? undefined : "0 1px 3px rgba(15,23,42,0.06)" }}>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: pill.bg }}>
                      <Icon size={17} style={{ color: pill.text }} />
                    </span>
                    <span className="text-[14px] font-bold" style={{ color: INK }}>{c}</span>
                    {active && (
                      <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full" style={{ background: ACCENT }}>
                        <Check size={12} strokeWidth={3} className="text-white" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {step === "founder" && (
          <>
            <Eyebrow>From the founder</Eyebrow>
            <Headline>The study buddy <Accent>I wish I&apos;d had.</Accent></Headline>
            <div className="mt-6 rounded-[24px] bg-white p-5" style={{ boxShadow: "0 1px 3px rgba(15,23,42,0.06)" }}>
              <div className={`${handwriting.className} space-y-4 text-[19px] leading-[1.55]`} style={{ color: "#334155" }}>
                {FOUNDER_NOTE.map((p) => <p key={p}>{p}</p>)}
                <p style={{ color: INK }}>{FOUNDER_SIGNATURE}</p>
              </div>
            </div>
          </>
        )}

        {step === "offer" && (
          <>
            <Eyebrow>{yearlySaleActive() ? `${YEARLY_SALE.label} \u00b7 ${YEARLY_SALE.endsLabel}` : "SonoBuddy ai Pro"}</Eyebrow>
            <Headline>Study without <Accent>limits.</Accent></Headline>
            <div className="mt-6 overflow-hidden rounded-[24px] p-5 text-white"
              style={{ background: "radial-gradient(140% 120% at 0% 0%, #4c1d95 0%, #1e1038 55%, #0b0718 100%)", boxShadow: "0 14px 34px -12px rgba(76,29,149,0.5)" }}>
              {["Unlimited AI study sessions", "Unlimited follow-up questions", "PDF study export", "Priority AI queue"].map((f) => (
                <p key={f} className="flex items-center gap-2.5 py-1.5 text-[15px] font-semibold">
                  <Check size={16} style={{ color: "#c4b5fd" }} /> {f}
                </p>
              ))}
              <p className="mt-3 text-[13px]" style={{ color: "#c4b5fd" }}>
                {yearlySaleActive() ? `Yearly ${YEARLY_SALE.price} \u00b7 or $9.99/month` : "From $9.99/month"}
              </p>
            </div>
            <button onClick={() => setShowUpgrade(true)}
              className="mt-4 w-full rounded-2xl py-4 text-[16px] font-extrabold text-white transition-transform active:scale-[0.98]"
              style={{ background: "linear-gradient(90deg, #7c3aed 0%, #9333ea 50%, #c026d3 100%)", boxShadow: "0 8px 30px rgba(147,51,234,0.35)" }}>
              See Pro plans
            </button>
          </>
        )}

        {step === "account" && (
          <>
            <Image src="/sonobuddy-favicon.png" alt="" width={56} height={56} priority className="rounded-2xl" style={{ boxShadow: "0 10px 24px -10px rgba(124,58,237,0.6)" }} />
            <Headline>Save your <Accent>progress.</Accent></Headline>
            <p className="mt-2 text-[15px] leading-relaxed" style={{ color: BODY }}>
              Create a free account to keep your study history and get {FREE_SCAN_LIMIT} AI study sessions every month.
            </p>
            <button onClick={() => openAuth("signup")}
              className="mt-7 w-full rounded-2xl py-4 text-[16px] font-bold text-white transition-transform active:scale-[0.98]"
              style={{ background: ACCENT, boxShadow: "0 10px 24px -10px rgba(124,58,237,0.7)" }}>
              Create free account
            </button>
            <button onClick={() => openAuth("signin")}
              className="mt-3 w-full rounded-2xl border-2 bg-white py-4 text-[16px] font-bold transition-transform active:scale-[0.98]"
              style={{ borderColor: "#ddd6fe", color: ACCENT }}>
              I already have an account
            </button>
          </>
        )}
      </div>

      {/* Bottom action (the account step has its own buttons) */}
      {step !== "account" && (
        <div className="border-t bg-white px-5 pt-3" style={{ borderColor: "rgba(15,23,42,0.05)", paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}>
          <div className="mx-auto max-w-lg">
            <button onClick={next} disabled={ctaDisabled}
              className="flex w-full items-center justify-between rounded-full px-6 py-4 transition-transform active:scale-[0.98] disabled:opacity-40"
              style={{ background: step === "offer" ? "#ffffff" : INK, border: step === "offer" ? "1.5px solid #e2e8f0" : undefined }}>
              <span className="text-[16px] font-bold" style={{ color: step === "offer" ? BODY : "#ffffff" }}>{ctaLabel[step]}</span>
              <span className="flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: step === "offer" ? MUTED : "rgba(255,255,255,0.45)" }}>
                {String(index + 1).padStart(2, "0")}
                <ChevronRight size={16} color={step === "offer" ? MUTED : "#ffffff"} />
              </span>
            </button>
            {(step === "hook" || step === "how") && mode === "full" && (
              <button onClick={() => openAuth("signin")} className="mt-3 block w-full text-center text-[14px] font-semibold" style={{ color: BODY }}>
                I already have an account
              </button>
            )}
            {(step === "role" || step === "focus") && (
              <button onClick={() => (mode === "full" ? setStep("account") : finish())}
                className="mt-3 block w-full text-center text-[14px] font-semibold" style={{ color: MUTED }}>
                Skip
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
