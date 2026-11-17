import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, BookOpen, Camera, Check, ChevronDown, ClipboardList, Clock, GraduationCap,
  HeartPulse, Lock, MessageCircle, Sparkles, Stethoscope, Activity, type LucideIcon,
} from "lucide-react";
import { PROTOCOLS } from "@/lib/protocols";

export const metadata: Metadata = {
  title: "SonoBuddy AI — Learn to read ultrasound images",
  description:
    "An AI study companion for ultrasound. Snap or upload any ultrasound image and get a walkthrough with labeled structures, study points and answers to your follow-up questions.",
};

// Set once SonoBuddy AI is live on the App Store.
const APP_STORE_URL = "";
const SONOBUDDY_URL = "https://apps.apple.com/us/app/sonobuddy-ultrasound-reference/id6761020726";
const SONOPASS_URL = "https://sonopass.com";

const PURPLE = "#7c3aed";
const INK = "#0f172a";
const BODY = "#5a6a85";

function Wordmark({ light = false, size = "text-xl" }: { light?: boolean; size?: string }) {
  return (
    <span className={`${size} font-extrabold tracking-tight`}>
      <span style={{ color: light ? "#ffffff" : INK }}>Sono</span>
      <span style={{ color: light ? "#ddd6fe" : PURPLE }}>Buddy </span>
      <span style={{ color: light ? "#f0abfc" : PURPLE, fontStyle: "italic" }}>ai</span>
    </span>
  );
}

function Phone({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`rounded-[2.6rem] p-2.5 ${className}`}
      style={{ background: "#0b0b10", boxShadow: "0 40px 80px -20px rgba(20,0,60,0.55), inset 0 0 0 2px #2a2a36" }}>
      <div className="relative overflow-hidden rounded-[2.1rem]" style={{ background: "#eef3f8" }}>
        <div className="absolute left-1/2 top-2 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
        <Image src={src} alt={alt} width={780} height={1593} className="block h-auto w-full pt-9" />
      </div>
    </div>
  );
}

function StoreBadge() {
  const inner = (
    <span className="flex items-center gap-3 rounded-2xl px-5 py-3 text-white" style={{ background: "#000", border: "1px solid rgba(255,255,255,0.25)" }}>
      <svg width="22" height="26" viewBox="0 0 384 512" fill="#fff" aria-hidden="true">
        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
      </svg>
      <span className="leading-tight">
        <span className="block text-[10px] font-medium opacity-80">{APP_STORE_URL ? "Download on the" : "Coming soon to the"}</span>
        <span className="block text-lg font-semibold">App Store</span>
      </span>
    </span>
  );
  return APP_STORE_URL
    ? <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">{inner}</a>
    : <span aria-label="Coming soon to the App Store">{inner}</span>;
}

const STEPS = [
  { icon: Camera, title: "Snap or upload", text: "Take a photo of any ultrasound screen or upload a saved image." },
  { icon: Sparkles, title: "Get a walkthrough", text: "The main structures are labeled and the key points explained, with study tips." },
  { icon: MessageCircle, title: "Ask anything", text: "Ask follow-up questions about the same image, in plain language." },
];

const FEATURES: { icon: LucideIcon; title: string; text: string; gradient: string }[] = [
  { icon: Sparkles, title: "Structures labeled", text: "Liver, kidney, LV, aorta, gestational sac and more, marked on your own image.", gradient: "linear-gradient(135deg,#a78bfa,#7c3aed)" },
  { icon: BookOpen, title: "Study points", text: "What's worth noticing on the image, and why it matters for learning.", gradient: "linear-gradient(135deg,#f0abfc,#c026d3)" },
  { icon: MessageCircle, title: "Follow-up chat", text: "“Why does fluid collect here first?” Get an answer about your image.", gradient: "linear-gradient(135deg,#60a5fa,#2563eb)" },
  { icon: ClipboardList, title: `${PROTOCOLS.length} protocols`, text: "How to get every view, what to look for, typical values and common mistakes.", gradient: "linear-gradient(135deg,#34d399,#059669)" },
  { icon: Clock, title: "Your study library", text: "Every walkthrough saved to History, with images kept on your device.", gradient: "linear-gradient(135deg,#fbbf24,#d97706)" },
  { icon: Lock, title: "Privacy built in", text: "Patient details at the top of the image are blacked out. Images aren't stored on our servers.", gradient: "linear-gradient(135deg,#94a3b8,#475569)" },
];

const ROLES: { icon: LucideIcon; label: string }[] = [
  { icon: GraduationCap, label: "Sonography (DMS) students" },
  { icon: BookOpen, label: "Medical students" },
  { icon: Stethoscope, label: "Residents & fellows" },
  { icon: HeartPulse, label: "Nurses, PAs & NPs" },
  { icon: Activity, label: "Sonographers cross-training" },
];

const FAQ = [
  { q: "Is SonoBuddy AI a diagnostic tool?", a: "No. SonoBuddy AI is a study tool for learning to read ultrasound images. It is not a medical device, is not FDA-cleared, and doesn't provide medical advice, diagnosis or treatment. Don't use it for patient care." },
  { q: "What images can I use?", a: "Any ultrasound image: a photo of a machine screen, a textbook or lecture image, or a saved file. Avoid uploading anything that identifies a patient; the top of the image, where machines show patient details, is blacked out automatically." },
  { q: "Are my images stored?", a: "No. Images are processed to create your walkthrough and aren't stored on our servers. A copy stays on your own device so you can see it in History, and you can turn that off anytime." },
  { q: "What does it cost?", a: "Every account gets 5 AI study sessions a month for free, with all protocols. SonoBuddy AI Pro on iPhone unlocks unlimited sessions for $9.99/month or $69.99/year." },
  { q: "Which devices does it work on?", a: "iPhone, and any modern web browser at sonobuddyai.com/app. Your study history syncs to your account." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "#eef3f8", color: INK }}>
      {/* ── Header ───────────────────────────────────────────── */}
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/sonobuddy-favicon.png" alt="" width={34} height={34} className="rounded-xl" priority />
            <Wordmark light />
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-semibold md:flex" style={{ color: "#ddd6fe" }}>
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#protocols" className="hover:text-white">Protocols</a>
            <a href="#pricing" className="hover:text-white">Pricing</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/app" className="rounded-full px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">Log in</Link>
            <Link href="/app" className="hidden rounded-full bg-white px-4 py-2 text-sm font-bold sm:block" style={{ color: PURPLE }}>Get started</Link>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28"
        style={{ background: "radial-gradient(900px 600px at 85% 10%, rgba(240,171,252,.30), transparent 60%), radial-gradient(900px 700px at 0% 100%, rgba(96,165,250,.22), transparent 60%), linear-gradient(165deg, #1e0b4b 0%, #4c1d95 50%, #7c3aed 100%)" }}>
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 md:grid-cols-2">
          <div className="text-center md:text-left">
            <p className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: "#c4b5fd" }}>AI study companion for ultrasound</p>
            <h1 className="mt-4 text-[42px] font-extrabold leading-[1.04] tracking-[-0.03em] text-white md:text-6xl">
              Learn to read ultrasound,{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg,#ddd6fe,#f0abfc)" }}>one image at a time.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed md:mx-0" style={{ color: "#ddd6fe" }}>
              Snap or upload any ultrasound image. SonoBuddy AI labels the structures, explains what&apos;s worth noticing and answers your follow-up questions.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:justify-start sm:justify-center">
              <Link href="/app" className="flex items-center gap-2 rounded-2xl bg-white px-6 py-4 text-base font-bold transition-transform active:scale-[0.98]" style={{ color: PURPLE }}>
                Start studying free <ArrowRight size={18} />
              </Link>
              <StoreBadge />
            </div>
            <p className="mt-4 text-sm" style={{ color: "#c4b5fd" }}>5 free AI study sessions every month · No credit card</p>
          </div>
          <div className="relative mx-auto h-[560px] w-full max-w-[420px] md:h-[620px]">
            <Phone src="/landing/results.webp" alt="SonoBuddy AI walkthrough with labeled structures" className="absolute left-0 top-0 w-[68%] rotate-[-4deg]" />
            <Phone src="/landing/chat.webp" alt="Follow-up question chat" className="absolute right-0 top-16 w-[62%] rotate-[5deg]" />
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="text-center text-xs font-bold uppercase tracking-[0.16em]" style={{ color: PURPLE }}>How it works</p>
        <h2 className="mt-3 text-center text-3xl font-extrabold tracking-tight md:text-4xl">Snap it. Understand it.</h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="rounded-3xl bg-white p-7" style={{ boxShadow: "0 1px 3px rgba(15,23,42,0.06)" }}>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl text-white" style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)" }}>
                  <Icon size={20} />
                </span>
                <span className="text-sm font-bold" style={{ color: "#c4b5fd" }}>0{i + 1}</span>
              </div>
              <h3 className="mt-5 text-lg font-bold">{title}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed" style={{ color: BODY }}>{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section id="features" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-center text-xs font-bold uppercase tracking-[0.16em]" style={{ color: PURPLE }}>Features</p>
          <h2 className="mt-3 text-center text-3xl font-extrabold tracking-tight md:text-4xl">Everything you need to study any scan</h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, text, gradient }) => (
              <div key={title} className="rounded-3xl p-6" style={{ background: "#f8fafc", border: "1px solid #eef2f7" }}>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl text-white" style={{ background: gradient }}>
                  <Icon size={20} />
                </span>
                <h3 className="mt-4 text-lg font-bold">{title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed" style={{ color: BODY }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Showcase ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <Phone src="/landing/history.webp" alt="Scan history with saved images" className="mx-auto w-[78%] max-w-[300px]" />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: PURPLE }}>Your study library</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">Every scan you study, saved</h2>
            <p className="mt-4 text-lg leading-relaxed" style={{ color: BODY }}>
              Come back to any walkthrough with its labeled image and notes. Images stay on your device; only your study notes sync to your account.
            </p>
            <ul className="mt-6 space-y-3">
              {["Recommendations from the areas you choose to study", "Swipe to delete anything, anytime", "Works on iPhone and on the web"].map((t) => (
                <li key={t} className="flex items-center gap-3 text-[15px] font-medium">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full" style={{ background: "#f5f3ff" }}>
                    <Check size={14} style={{ color: PURPLE }} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Protocols ────────────────────────────────────────── */}
      <section id="protocols" className="bg-white py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2">
          <div className="md:order-2">
            <Phone src="/landing/protocol-detail.webp" alt="Step-by-step eFAST protocol" className="mx-auto w-[78%] max-w-[300px]" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: PURPLE }}>{PROTOCOLS.length} protocols</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">Every protocol, step by step</h2>
            <p className="mt-4 text-lg leading-relaxed" style={{ color: BODY }}>
              How to get each view, what to look for, a measurement guide with typical values, and the mistakes everyone makes at first.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["eFAST", "Echo", "Lung", "OB/GYN", "RUQ & gallbladder", "Renal", "Aorta", "DVT", "Carotid", "Thyroid", "Shoulder", "Optic nerve"].map((t) => (
                <span key={t} className="rounded-full px-3.5 py-1.5 text-sm font-semibold" style={{ background: "#f5f3ff", color: "#6d28d9" }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Who it's for ─────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-20 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: PURPLE }}>Made for learners</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">Built for everyone learning ultrasound</h2>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {ROLES.map(({ icon: Icon, label }) => (
            <span key={label} className="flex items-center gap-2.5 rounded-2xl bg-white px-5 py-3.5 text-[15px] font-semibold" style={{ boxShadow: "0 1px 3px rgba(15,23,42,0.06)" }}>
              <Icon size={18} style={{ color: PURPLE }} /> {label}
            </span>
          ))}
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────── */}
      <section id="pricing" className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-5">
          <p className="text-center text-xs font-bold uppercase tracking-[0.16em]" style={{ color: PURPLE }}>Pricing</p>
          <h2 className="mt-3 text-center text-3xl font-extrabold tracking-tight md:text-4xl">Start free. Go Pro when you&apos;re ready.</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <div className="rounded-3xl p-8" style={{ background: "#f8fafc", border: "1px solid #eef2f7" }}>
              <h3 className="text-lg font-bold">Free</h3>
              <p className="mt-2"><span className="text-4xl font-extrabold">$0</span></p>
              <ul className="mt-6 space-y-3 text-[15px]">
                {["5 AI study sessions every month", `All ${PROTOCOLS.length} protocols`, "Follow-up questions", "Study history"].map((t) => (
                  <li key={t} className="flex items-center gap-2.5"><Check size={16} style={{ color: "#059669" }} /> {t}</li>
                ))}
              </ul>
              <Link href="/app" className="mt-8 block rounded-2xl py-3.5 text-center font-bold" style={{ background: "#ffffff", border: "1.5px solid #ddd6fe", color: PURPLE }}>
                Create free account
              </Link>
            </div>
            <div className="relative overflow-hidden rounded-3xl p-8 text-white"
              style={{ background: "radial-gradient(140% 120% at 0% 0%, #4c1d95 0%, #1e1038 55%, #0b0718 100%)", boxShadow: "0 20px 50px -20px rgba(76,29,149,0.6)" }}>
              <h3 className="text-lg font-bold">SonoBuddy AI Pro</h3>
              <p className="mt-2"><span className="text-4xl font-extrabold">$9.99</span><span style={{ color: "#c4b5fd" }}> /month</span></p>
              <p className="text-sm" style={{ color: "#c4b5fd" }}>or $69.99/year</p>
              <ul className="mt-6 space-y-3 text-[15px]">
                {["Unlimited AI study sessions", "Everything in Free", "Cancel anytime in your Apple ID settings"].map((t) => (
                  <li key={t} className="flex items-center gap-2.5"><Check size={16} style={{ color: "#c4b5fd" }} /> {t}</li>
                ))}
              </ul>
              <p className="mt-8 text-sm" style={{ color: "#c4b5fd" }}>Available as an in-app subscription in the iPhone app.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section id="faq" className="mx-auto max-w-3xl px-5 py-20">
        <h2 className="text-center text-3xl font-extrabold tracking-tight md:text-4xl">Questions</h2>
        <div className="mt-10 space-y-3">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="group rounded-2xl bg-white px-6 py-5" style={{ boxShadow: "0 1px 3px rgba(15,23,42,0.06)" }}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-bold">
                {q}
                <ChevronDown size={18} className="shrink-0 transition-transform group-open:rotate-180" style={{ color: "#94a3b8" }} />
              </summary>
              <p className="mt-3 text-[15px] leading-relaxed" style={{ color: BODY }}>{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Family of apps ───────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="grid gap-5 md:grid-cols-2">
          <a href={SONOBUDDY_URL} target="_blank" rel="noopener noreferrer" className="rounded-3xl p-7 transition-transform hover:-translate-y-0.5" style={{ background: "#0f172a" }}>
            <p className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: "#7dd3fc" }}>Quick reference</p>
            <h3 className="mt-2 text-xl font-bold text-white">Sono<span style={{ color: "#39a5e9" }}>Buddy</span></h3>
            <p className="mt-1.5 text-[15px]" style={{ color: "#cbd5e1" }}>Normal values, protocols and calculators for the scan room.</p>
          </a>
          <a href={SONOPASS_URL} target="_blank" rel="noopener noreferrer" className="rounded-3xl p-7 transition-transform hover:-translate-y-0.5" style={{ background: "#0f172a" }}>
            <p className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: "#86efac" }}>Registry exam prep</p>
            <h3 className="mt-2 text-xl font-bold text-white">Sono<span style={{ color: "#2ea873" }}>Pass</span></h3>
            <p className="mt-1.5 text-[15px]" style={{ color: "#cbd5e1" }}>Practice questions, mock exams and flashcards for your registry.</p>
          </a>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────── */}
      <section className="px-5 pb-20">
        <div className="mx-auto max-w-4xl rounded-[2rem] px-6 py-14 text-center text-white"
          style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)", boxShadow: "0 20px 50px -20px rgba(124,58,237,0.6)" }}>
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Your next scan is a lesson.</h2>
          <p className="mx-auto mt-3 max-w-xl text-lg" style={{ color: "#ede9fe" }}>Create a free account and study your first image in under a minute.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/app" className="flex items-center gap-2 rounded-2xl bg-white px-6 py-4 font-bold" style={{ color: PURPLE }}>
              Start studying free <ArrowRight size={18} />
            </Link>
            <StoreBadge />
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t bg-white" style={{ borderColor: "#eef2f7" }}>
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <div className="flex items-center gap-2.5">
              <Image src="/sonobuddy-favicon.png" alt="" width={28} height={28} className="rounded-lg" />
              <Wordmark size="text-lg" />
            </div>
            <p className="mt-3 text-xs leading-relaxed" style={{ color: "#94a3b8" }}>
              For educational use only. SonoBuddy AI is not a medical device, is not FDA-cleared, and does not provide medical advice, diagnosis or treatment.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold" style={{ color: BODY }}>
            <Link href="/app">Log in</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/support">Support</Link>
            <a href="mailto:hello@sonobuddy.com">hello@sonobuddy.com</a>
          </div>
        </div>
        <p className="pb-8 text-center text-xs" style={{ color: "#94a3b8" }}>© {new Date().getFullYear()} SonoBuddy LLC</p>
      </footer>
    </div>
  );
}
