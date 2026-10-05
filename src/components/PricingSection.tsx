"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { CheckCircle, Sparkles } from "lucide-react";
import UpgradeModal from "./UpgradeModal";

type BillingCycle = "monthly" | "yearly";

function PaidButton({ label }: { label: string }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {showModal && typeof document !== "undefined" && createPortal(
        <UpgradeModal onClose={() => setShowModal(false)} />,
        document.body
      )}
      <button
        onClick={() => setShowModal(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-white transition-all hover:opacity-90"
        style={{ background: "#2563eb" }}>
        {label}
      </button>
    </>
  );
}

export default function PricingSection() {
  const [billing, setBilling] = useState<BillingCycle>("monthly");

  return (
    <section className="py-20">
      <div className="mx-auto max-w-2xl px-4">
        <h2 className="mb-3 text-center text-3xl font-bold" style={{ color: "#0f172a" }}>
          Simple, transparent pricing
        </h2>
        <p className="mb-8 text-center" style={{ color: "#64748b" }}>
          Start free. Upgrade as you grow.
        </p>

        {/* Billing toggle */}
        <div className="mb-10 flex items-center justify-center gap-1 rounded-xl p-1 w-fit mx-auto"
          style={{ background: "#f1f5f9" }}>
          <button
            onClick={() => setBilling("monthly")}
            className="rounded-lg px-5 py-2 text-sm font-semibold transition-all"
            style={billing === "monthly"
              ? { background: "#ffffff", color: "#0f172a", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }
              : { color: "#64748b" }}>
            Monthly
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className="flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold transition-all"
            style={billing === "yearly"
              ? { background: "#ffffff", color: "#0f172a", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }
              : { color: "#64748b" }}>
            Yearly
            <span className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
              style={{ background: "#059669" }}>
              4 months free
            </span>
          </button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* Free */}
          <div className="flex flex-col rounded-2xl border p-6"
            style={{ borderColor: "#e2e8f0", background: "#ffffff" }}>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "#94a3b8" }}>Free</p>
            <p className="mb-5 text-3xl font-extrabold" style={{ color: "#0f172a" }}>$0</p>
            <ul className="mb-6 flex-1 space-y-2.5 text-xs" style={{ color: "#475569" }}>
              {["5 AI study sessions/month", "All 31 protocols", "Structure labeling", "Study highlights", "PHI auto-redaction"].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle size={13} style={{ color: "#94a3b8", flexShrink: 0 }} />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/scan"
              className="block w-full rounded-xl border py-2.5 text-center text-xs font-semibold transition-all hover:bg-slate-50"
              style={{ borderColor: "#e2e8f0", color: "#475569" }}>
              Get Started Free
            </Link>
          </div>

          {/* Pro */}
          <div className="relative flex flex-col rounded-2xl border p-6 shadow-lg"
            style={{ borderColor: "#93c5fd", background: "#eff6ff" }}>
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold text-white"
              style={{ background: "#2563eb" }}>
              Most Popular
            </div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "#2563eb" }}>Pro</p>
            {billing === "monthly" ? (
              <p className="mb-5 text-3xl font-extrabold" style={{ color: "#0f172a" }}>
                $9.99<span className="text-sm font-normal" style={{ color: "#64748b" }}>/mo</span>
              </p>
            ) : (
              <>
                <div className="mb-1 flex items-center gap-2">
                  <p className="text-3xl font-extrabold" style={{ color: "#0f172a" }}>
                    $69.99<span className="text-sm font-normal" style={{ color: "#64748b" }}>/yr</span>
                  </p>
                  <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                    style={{ background: "#059669" }}>
                    <Sparkles size={9} />
                    4 MONTHS FREE
                  </span>
                </div>
                <p className="mb-5 text-xs" style={{ color: "#64748b" }}>~$5.83/mo</p>
              </>
            )}
            <ul className="mb-6 flex-1 space-y-2.5 text-xs" style={{ color: "#1e40af" }}>
              {["Unlimited AI study sessions", "All 31 protocols", "Full reference measurements", "AI chat", "PDF study export", "PHI auto-redaction", "Priority AI queue"].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle size={13} style={{ color: "#2563eb", flexShrink: 0 }} />
                  {f}
                </li>
              ))}
            </ul>
            <PaidButton label="Get Pro" />
          </div>
        </div>
      </div>
    </section>
  );
}
