"use client";

import { useState } from "react";
import {
  BookOpen, Check, Crown, FileDown, Infinity as InfinityIcon, Loader2,
  MessageSquare, Ruler, ShieldCheck, X, Zap,
} from "lucide-react";
import { PLANS, FREE_SCAN_LIMIT, type PlanKey } from "@/lib/plans";

interface UpgradeModalProps {
  onClose: () => void;
  limitReached?: boolean;
}

const PURPLE_LIGHT = "#a78bfa";

const FEATURES = [
  { icon: InfinityIcon,   title: "Unlimited AI study sessions", sub: `No ${FREE_SCAN_LIMIT}-per-month cap` },
  { icon: BookOpen,       title: "All 31 protocols",            sub: "Cardiac, OB, abdominal & more" },
  { icon: Ruler,          title: "Full reference measurements", sub: "Normal values for every structure" },
  { icon: MessageSquare,  title: "AI study chat",               sub: "Ask follow-up questions on any image" },
  { icon: FileDown,       title: "PDF study export",            sub: "Save walkthroughs for review" },
  { icon: ShieldCheck,    title: "PHI auto-redaction",          sub: "Patient info stripped before analysis" },
  { icon: Zap,            title: "Priority AI queue",           sub: "Faster walkthroughs, every time" },
];

const MONTHLY = PLANS.pro_monthly;
const YEARLY  = PLANS.pro_yearly;
const dollars = (p: string) => parseFloat(p.replace("$", ""));
const yearlyPerMonth = (dollars(YEARLY.price) / 12).toFixed(2);
const yearlySavings  = Math.floor((1 - dollars(YEARLY.price) / (dollars(MONTHLY.price) * 12)) * 100);

function PlanOption({
  selected, onSelect, title, price, period, note, badge,
}: {
  selected: boolean; onSelect: () => void; title: string; price: string;
  period: string; note: string; badge?: string;
}) {
  return (
    <button
      onClick={onSelect}
      className="relative flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition-all active:scale-[0.99]"
      style={{
        background: selected ? "rgba(124,58,237,0.18)" : "rgba(255,255,255,0.04)",
        border: `1.5px solid ${selected ? PURPLE_LIGHT : "rgba(255,255,255,0.12)"}`,
      }}>
      {badge && (
        <span
          className="absolute -top-2.5 right-4 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold tracking-wide text-white"
          style={{ background: "linear-gradient(90deg, #7c3aed, #c026d3)" }}>
          {badge}
        </span>
      )}
      <span
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
        style={{
          border: `2px solid ${selected ? PURPLE_LIGHT : "rgba(255,255,255,0.3)"}`,
          background: selected ? PURPLE_LIGHT : "transparent",
        }}>
        {selected && <Check size={12} strokeWidth={3} style={{ color: "#0b0718" }} />}
      </span>
      <span className="flex-1">
        <span className="block text-sm font-bold text-white">{title}</span>
        <span className="block text-xs" style={{ color: "#a1a1aa" }}>{note}</span>
      </span>
      <span className="text-right">
        <span className="block text-base font-extrabold text-white">{price}</span>
        <span className="block text-[11px]" style={{ color: "#a1a1aa" }}>per {period}</span>
      </span>
    </button>
  );
}

export default function UpgradeModal({ onClose, limitReached }: UpgradeModalProps) {
  const [loading,  setLoading]  = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [planKey,  setPlanKey]  = useState<PlanKey>("pro_yearly");

  const plan = PLANS[planKey];
  const isYearly = planKey === "pro_yearly";

  // Shared by both a live purchase and a restore — both end with the native
  // side firing iap-purchase-complete/error once StoreKit resolves.
  function awaitNativeResult(onDone: () => void) {
    const onComplete = async (e: Event) => {
      window.removeEventListener("iap-purchase-complete", onComplete);
      window.removeEventListener("iap-purchase-error", onError);
      const payload = (e as CustomEvent).detail as string;
      try {
        await fetch("/api/ios/purchase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payload }),
        });
        onClose();
        window.location.reload();
      } catch {
        setErrorMsg("Purchase succeeded but sync failed. Please restart the app.");
        onDone();
      }
    };
    const onError = (e: Event) => {
      window.removeEventListener("iap-purchase-complete", onComplete);
      window.removeEventListener("iap-purchase-error", onError);
      setErrorMsg((e as CustomEvent).detail ?? "Something went wrong.");
      onDone();
    };
    window.addEventListener("iap-purchase-complete", onComplete);
    window.addEventListener("iap-purchase-error", onError);
  }

  function handleUpgrade() {
    setLoading(true);
    setErrorMsg(null);

    const nativeMH = typeof window !== "undefined" ? (window as any).webkit?.messageHandlers : null;
    if (!nativeMH?.openPurchase) {
      setErrorMsg("Subscriptions are only available in the SonoBuddy AI app. Please download it from the App Store.");
      setLoading(false);
      return;
    }

    awaitNativeResult(() => setLoading(false));
    nativeMH.openPurchase.postMessage(plan.iapProductId);
  }

  function handleRestore() {
    setRestoring(true);
    setErrorMsg(null);

    const nativeMH = typeof window !== "undefined" ? (window as any).webkit?.messageHandlers : null;
    if (!nativeMH?.restorePurchases) {
      setErrorMsg("Restore is only available in the SonoBuddy AI app.");
      setRestoring(false);
      return;
    }

    awaitNativeResult(() => setRestoring(false));
    nativeMH.restorePurchases.postMessage("");
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-stretch justify-center sm:items-center sm:p-4"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>

      <div
        className="relative flex w-full max-w-md flex-col overflow-y-auto sm:rounded-3xl sm:shadow-2xl"
        style={{
          background: "radial-gradient(120% 60% at 50% 0%, #3b1a78 0%, #170b33 45%, #0b0718 100%)",
          maxHeight: "100dvh",
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}>

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/10"
          style={{ top: "calc(env(safe-area-inset-top) + 12px)", background: "rgba(255,255,255,0.08)", color: "#d4d4d8" }}>
          <X size={16} />
        </button>

        {/* Hero */}
        <div className="px-6 pt-12 pb-6 text-center">
          <div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{
              background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 60%, #c026d3 100%)",
              boxShadow: "0 10px 40px rgba(139,92,246,0.55)",
            }}>
            <Crown size={30} className="text-white" />
          </div>

          <h2 className="text-[28px] font-extrabold leading-tight tracking-tight text-white">
            Sono<span style={{ color: PURPLE_LIGHT }}>Buddy </span>
            <span style={{ color: PURPLE_LIGHT, fontStyle: "italic" }}>ai</span>{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, #c4b5fd, #f0abfc)" }}>
              Pro
            </span>
          </h2>

          <p className="mx-auto mt-2 max-w-xs text-sm" style={{ color: "#c4b5fd" }}>
            {limitReached
              ? `You've used your ${FREE_SCAN_LIMIT} free study sessions this month. Go Pro to keep learning.`
              : "Your unlimited ultrasound study companion."}
          </p>
        </div>

        {/* Features */}
        <div className="mx-5 rounded-2xl px-4 py-2"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          {FEATURES.map(({ icon: Icon, title, sub }, i) => (
            <div key={title} className="flex items-center gap-3 py-2.5"
              style={i < FEATURES.length - 1 ? { borderBottom: "1px solid rgba(255,255,255,0.06)" } : undefined}>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{ background: "rgba(167,139,250,0.15)" }}>
                <Icon size={16} style={{ color: PURPLE_LIGHT }} />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-semibold text-white">{title}</span>
                <span className="block text-xs" style={{ color: "#a1a1aa" }}>{sub}</span>
              </span>
              <Check size={16} style={{ color: PURPLE_LIGHT }} />
            </div>
          ))}
        </div>

        {/* Plans */}
        <div className="mx-5 mt-6 space-y-3">
          <PlanOption
            selected={isYearly}
            onSelect={() => setPlanKey("pro_yearly")}
            title="Yearly"
            price={YEARLY.price}
            period="year"
            note={`Just $${yearlyPerMonth}/mo, billed annually`}
            badge={`BEST VALUE · SAVE ${yearlySavings}%`}
          />
          <PlanOption
            selected={!isYearly}
            onSelect={() => setPlanKey("pro_monthly")}
            title="Monthly"
            price={MONTHLY.price}
            period="month"
            note="Billed monthly, cancel anytime"
          />
        </div>

        {errorMsg && (
          <div className="mx-5 mt-4 rounded-xl px-3 py-2.5 text-sm"
            style={{ background: "rgba(220,38,38,0.15)", border: "1px solid rgba(248,113,113,0.4)", color: "#fca5a5" }}>
            {errorMsg}
          </div>
        )}

        {/* CTA */}
        <div className="px-5 pt-5">
          <button
            onClick={handleUpgrade}
            disabled={loading || restoring}
            className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-extrabold text-white transition-all hover:opacity-95 active:scale-[0.98] disabled:opacity-60"
            style={{
              background: "linear-gradient(90deg, #7c3aed 0%, #9333ea 50%, #c026d3 100%)",
              boxShadow: "0 8px 30px rgba(147,51,234,0.45)",
            }}>
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? "Connecting to App Store…" : `Continue — ${plan.price}/${plan.period}`}
          </button>
        </div>

        {/* Subscription details (required for App Review) */}
        <div className="px-6 pt-4 pb-6 text-center text-[11px] leading-relaxed space-y-3" style={{ color: "#71717a" }}>
          <p>
            SonoBuddy AI {isYearly ? "Pro Yearly" : "Pro Monthly"} · {isYearly ? "1 year" : "1 month"} · {plan.price}/{plan.period}.
            Payment is charged to your Apple ID at confirmation. Subscription auto-renews unless canceled
            at least 24 hours before the end of the current period. Manage or cancel in your App Store account settings.
          </p>
          <div className="flex items-center justify-center gap-3 text-xs font-medium" style={{ color: "#a1a1aa" }}>
            <button onClick={handleRestore} disabled={restoring || loading} className="underline disabled:opacity-60">
              {restoring ? "Restoring…" : "Restore Purchases"}
            </button>
            <span>·</span>
            <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline">Terms of Use</a>
            <span>·</span>
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline">Privacy</a>
          </div>
          <p>For educational use only. Not intended for diagnosis or clinical decisions.</p>
        </div>
      </div>
    </div>
  );
}
