import Link from "next/link";
import { ArrowRight, Camera, CheckCircle, ClipboardList, Shield, Upload, Zap } from "lucide-react";
import NavBar from "@/components/NavBar";
import PricingSection from "@/components/PricingSection";


export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: "#ffffff" }}>
      <NavBar />

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-4 pt-28 pb-16 text-center md:pt-32">

        {/* Soft radial glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-full opacity-30"
            style={{ width: 700, height: 500, background: "radial-gradient(ellipse, #ddd6fe 0%, transparent 70%)" }} />
        </div>

        {/* Badge */}
        <div className="relative mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium"
          style={{ borderColor: "#ddd6fe", background: "#f5f3ff", color: "#7c3aed" }}>
          <span className="h-2 w-2 animate-pulse rounded-full" style={{ background: "#7c3aed" }} />
          AI-Guided Ultrasound Study Companion
        </div>

        {/* Headline */}
        <h1 className="relative mb-5 max-w-3xl text-5xl font-extrabold leading-[1.1] tracking-tight md:text-7xl"
          style={{ color: "#0f172a" }}>
          Snap a photo.{" "}
          <span style={{ color: "#7c3aed" }}>Study<br />in seconds.</span>
        </h1>

        {/* Subheadline */}
        <p className="relative mx-auto mb-10 max-w-xl text-lg leading-relaxed md:text-xl"
          style={{ color: "#64748b" }}>
          Point your phone at any ultrasound screen. AI labels structures,
          walks through reference measurements, and highlights areas worth
          further study — for educational use only.
        </p>

        {/* Primary CTA */}
        <Link
          href="/scan"
          className="relative inline-flex items-center gap-3 rounded-2xl px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:opacity-90 hover:shadow-xl active:scale-95"
          style={{ background: "#7c3aed" }}>
          <Camera size={20} />
          Start Studying Now
          <ArrowRight size={18} />
        </Link>

        {/* Trust bar */}
        <div className="relative mt-8 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm"
          style={{ color: "#94a3b8" }}>
          {[
            "Used by learners",
            "HIPAA-ready",
            "Educational use only",
          ].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <CheckCircle size={13} style={{ color: "#7c3aed" }} />
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────── */}
      <section className="border-y py-20" style={{ borderColor: "#f1f5f9", background: "#f8fafc" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-16 text-center text-3xl font-bold" style={{ color: "#0f172a" }}>
            Three steps. Zero learning curve.
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                icon: Upload,
                iconBg: "#f5f3ff",
                iconColor: "#7c3aed",
                title: "Snap or upload",
                desc: "Photograph your ultrasound screen or upload an image from your device. No special equipment needed.",
              },
              {
                step: "02",
                icon: Zap,
                iconBg: "#fefce8",
                iconColor: "#ca8a04",
                title: "AI walks you through it",
                desc: "Structures labeled, reference measurements shown, areas worth study highlighted — all in seconds.",
              },
              {
                step: "03",
                icon: ClipboardList,
                iconBg: "#f0fdf4",
                iconColor: "#059669",
                title: "Study the results",
                desc: "Annotated image, educational summary, study notes, and a one-tap PDF ready to share.",
              },
            ].map(({ step, icon: Icon, iconBg, iconColor, title, desc }) => (
              <div key={step} className="relative rounded-2xl border p-8 text-center shadow-sm"
                style={{ background: "#ffffff", borderColor: "#e2e8f0" }}>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-xs font-bold text-white"
                  style={{ background: "#7c3aed" }}>
                  {step}
                </div>
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ background: iconBg }}>
                  <Icon size={26} style={{ color: iconColor }} />
                </div>
                <h3 className="mb-2 text-lg font-bold" style={{ color: "#0f172a" }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What it can do ──────────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold" style={{ color: "#0f172a" }}>
              Powerful AI, simple study experience
            </h2>
            <p style={{ color: "#64748b" }}>
              Educational walkthroughs of ultrasound anatomy — without the complexity.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Zap,
                title: "Instant AI Walkthrough",
                desc: "Structure labels, reference measurements, and study highlights in seconds.",
              },
              {
                icon: Shield,
                title: "Privacy-First",
                desc: "Auto-anonymization redacts patient headers. End-to-end encryption. HIPAA-ready.",
              },
              {
                icon: Camera,
                title: "31 Protocols Available",
                desc: "eFAST, cardiac echo, OB, vascular, MSK, and more — all accessible after your first study session.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border p-6 shadow-sm"
                style={{ background: "#ffffff", borderColor: "#e2e8f0" }}>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ background: "#f5f3ff" }}>
                  <Icon size={20} style={{ color: "#7c3aed" }} />
                </div>
                <h3 className="mb-2 font-semibold" style={{ color: "#0f172a" }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── Pricing ─────────────────────────────────────────────── */}
      <PricingSection />

      {/* ── Final CTA ───────────────────────────────────────────── */}
      <section className="border-t py-20" style={{ borderColor: "#f1f5f9", background: "#f8fafc" }}>
        <div className="mx-auto max-w-xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold" style={{ color: "#0f172a" }}>
            Ready to study smarter?
          </h2>
          <p className="mb-8" style={{ color: "#64748b" }}>
            Join learners using SonoBuddy AI to study ultrasound anatomy.
          </p>
          <Link
            href="/scan"
            className="inline-flex items-center gap-2 rounded-2xl px-8 py-4 font-bold text-white shadow-lg transition-all hover:opacity-90"
            style={{ background: "#7c3aed" }}>
            <Camera size={18} />
            Start Your First Study Session Free
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t py-8 pb-24 md:pb-8" style={{ borderColor: "#e2e8f0", background: "#ffffff" }}>
        <div className="mx-auto max-w-4xl px-4 text-center text-xs" style={{ color: "#94a3b8" }}>
          <p className="mb-2">
            SonoBuddy AI is an educational tool only. It does not provide medical advice, diagnosis, or
            treatment. Always consult a licensed physician for medical decisions.
          </p>
          <p className="mb-2">
            <Link href="/privacy" className="hover:underline" style={{ color: "#7c3aed" }}>
              Privacy Policy
            </Link>
            {" • "}
            <Link href="/terms" className="hover:underline" style={{ color: "#7c3aed" }}>
              Terms of Use
            </Link>
          </p>
          <p>© 2026 SonoBuddy AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
