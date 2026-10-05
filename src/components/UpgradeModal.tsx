"use client";

import { useState } from "react";
import { Check, Loader2, Sparkles, X, Zap } from "lucide-react";
import { PLANS, FREE_SCAN_LIMIT, type PlanKey } from "@/lib/plans";

interface UpgradeModalProps {
  onClose: () => void;
  limitReached?: boolean;
}

type BillingCycle = "monthly" | "yearly";

export default function UpgradeModal({ onClose, limitReached }: UpgradeModalProps) {
  const [loading,  setLoading]  = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [billing,  setBilling]  = useState<BillingCycle>("monthly");

  const planKey: PlanKey = billing === "monthly" ? "pro_monthly" : "pro_yearly";
  const plan = PLANS[planKey];
  const isYearly = billing === "yearly";

  async function handleUpgrade() {
    setLoading(true);
    setErrorMsg(null);

    const iapProductID = plan.iapProductId;
    const nativeMH = typeof window !== "undefined" ? (window as any).webkit?.messageHandlers : null;

    if (!nativeMH?.openPurchase) {
      setErrorMsg("Subscriptions are only available in the SonoBuddy AI app. Please download it from the App Store.");
      setLoading(false);
      return;
    }

    // Native iOS — trigger RevenueCat purchase sheet
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
        setLoading(false);
      }
    };
    const onError = (e: Event) => {
      window.removeEventListener("iap-purchase-complete", onComplete);
      window.removeEventListener("iap-purchase-error", onError);
      setErrorMsg((e as CustomEvent).detail ?? "Purchase failed.");
      setLoading(false);
    };
    window.addEventListener("iap-purchase-complete", onComplete);
    window.addEventListener("iap-purchase-error", onError);
    nativeMH.openPurchase.postMessage(iapProductID);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:px-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>

      <div
        className="relative w-full max-w-md overflow-y-auto rounded-t-3xl border shadow-2xl sm:rounded-2xl"
        style={{ background: "#ffffff", borderColor: "#dde4ee", maxHeight: "92dvh" }}>

        {/* Mobile drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="h-1 w-10 rounded-full" style={{ background: "#e2e8f0" }} />
        </div>

        {/* Header */}
        <div className="px-6 pt-4 pb-4 sm:pt-6"
          style={{ background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)" }}>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1.5 transition-colors hover:bg-slate-100"
            style={{ color: "#94a3b8" }}>
            <X size={16} />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl"
              style={{ background: "#2563eb" }}>
              <Zap size={15} className="text-white" />
            </div>
            <span className="font-bold" style={{ color: "#0f172a" }}>Upgrade SonoBuddy AI</span>
          </div>

          {limitReached ? (
            <>
              <p className="text-lg font-bold leading-snug" style={{ color: "#0f172a" }}>
                You&apos;ve used your {FREE_SCAN_LIMIT} free scans this month.
              </p>
              <p className="mt-1 text-sm" style={{ color: "#64748b" }}>
                Upgrade to keep scanning and unlock advanced features.
              </p>
            </>
          ) : (
            <p className="text-sm" style={{ color: "#64748b" }}>
              Unlock unlimited scans, all protocols, and priority AI analysis.
            </p>
          )}
        </div>

        {/* Billing toggle */}
        <div className="px-6 pt-3 pb-1">
          <div className="flex items-center gap-1 rounded-xl p-1 w-fit"
            style={{ background: "#f1f5f9" }}>
            <button
              onClick={() => setBilling("monthly")}
              className="rounded-lg px-4 py-1.5 text-xs font-semibold transition-all"
              style={billing === "monthly"
                ? { background: "#ffffff", color: "#0f172a", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }
                : { color: "#64748b" }}>
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className="flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold transition-all"
              style={billing === "yearly"
                ? { background: "#ffffff", color: "#0f172a", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }
                : { color: "#64748b" }}>
              Yearly
              <span className="rounded-full px-1.5 py-0.5 text-[9px] font-bold text-white"
                style={{ background: "#059669" }}>
                4 months free
              </span>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mx-6 mb-3 rounded-xl border px-3 py-2.5 text-sm"
            style={{ borderColor: "#fca5a5", background: "#fef2f2", color: "#dc2626" }}>
            {errorMsg}
          </div>
        )}

        {/* Subscription details (for App Review) */}
        <div className="px-6 pt-3 pb-3">
          <div className="rounded-xl border p-3 text-xs space-y-1.5" style={{ borderColor: "#e2e8f0", background: "#f8fafc" }}>
            <div className="font-semibold" style={{ color: "#0f172a" }}>SonoBuddy AI {billing === "yearly" ? "Pro Yearly" : "Pro Monthly"}</div>
            <div style={{ color: "#64748b" }}>
              <div>Billing Period: {billing === "yearly" ? "1 year" : "1 month"}</div>
              <div>Price: {plan.price}/{plan.period}</div>
              <div>Auto-renews unless canceled in App Settings</div>
            </div>
          </div>
        </div>

        {/* Pro plan card */}
        <div className="px-6 pb-6">
          <div className="rounded-xl border p-4"
            style={{ borderColor: "#2563eb", background: "#eff6ff" }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm" style={{ color: "#0f172a" }}>Pro</span>
                  {isYearly && (
                    <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                      style={{ background: "#059669" }}>
                      <Sparkles size={9} />
                      4 MONTHS FREE
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs" style={{ color: "#64748b" }}>
                  <span className="text-base font-extrabold" style={{ color: "#0f172a" }}>
                    {plan.price}
                  </span>
                  {" "}/{plan.period}
                  {isYearly && <span className="ml-1">— ~$5.83/mo</span>}
                </p>
              </div>
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold text-white disabled:opacity-60 transition-all hover:opacity-90"
                style={{ background: "#2563eb", minWidth: 80 }}>
                {loading ? <Loader2 size={12} className="animate-spin" /> : null}
                {loading ? "Loading…" : "Upgrade"}
              </button>
            </div>

            <ul className="space-y-1.5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs" style={{ color: "#374151" }}>
                  <Check size={12} className="mt-0.5 shrink-0" style={{ color: "#2563eb" }} />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pb-4 px-6 text-center text-xs space-y-2" style={{ color: "#94a3b8" }}>
          <p>Billed via Apple In-App Purchase. Cancel anytime in Settings.</p>
          <p>
            By subscribing, you agree to our{" "}
            <a href="/terms" target="_blank" rel="noopener noreferrer"
              style={{ color: "#2563eb", textDecoration: "underline" }}>Terms of Use</a>
            {" "}and{" "}
            <a href="/privacy" target="_blank" rel="noopener noreferrer"
              style={{ color: "#2563eb", textDecoration: "underline" }}>Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
