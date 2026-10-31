"use client";

import { useState } from "react";
import { ChevronRight, Crown, Sparkles } from "lucide-react";
import { useAuth } from "./AuthProvider";
import UpgradeModal from "./UpgradeModal";
import { FREE_SCAN_LIMIT } from "@/lib/plans";

// Premium upsell card shown to free users; collapses to a slim "Pro member"
// strip for paid users so every page carries the same premium accent.
export default function ProBanner({ compact = false }: { compact?: boolean }) {
  const { user, profile } = useAuth();
  const [showUpgrade, setShowUpgrade] = useState(false);

  if (!user || !profile) return null;
  const isPaid = profile.tier === "pro" || profile.tier === "clinic";

  if (isPaid) {
    return (
      <div className="flex items-center gap-3 rounded-2xl px-4 py-3"
        style={{ background: "linear-gradient(90deg, #1e1038 0%, #2e1065 100%)" }}>
        <span className="flex h-8 w-8 items-center justify-center rounded-xl"
          style={{ background: "linear-gradient(135deg, #8b5cf6, #c026d3)" }}>
          <Crown size={15} className="text-white" />
        </span>
        <p className="flex-1 text-sm font-bold text-white">
          {profile.tier === "clinic" ? "Clinic" : "Pro"} member
          <span className="ml-1.5 font-medium" style={{ color: "#c4b5fd" }}>· Unlimited sessions</span>
        </p>
        <Sparkles size={15} style={{ color: "#f0abfc" }} />
      </div>
    );
  }

  const left = Math.max(0, FREE_SCAN_LIMIT - profile.scans_used_this_month);

  return (
    <>
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} limitReached={left === 0} />}
      <button
        onClick={() => setShowUpgrade(true)}
        className="relative flex w-full items-center gap-3.5 overflow-hidden rounded-2xl text-left shadow-lg transition-all active:scale-[0.99]"
        style={{
          background: "radial-gradient(140% 120% at 0% 0%, #4c1d95 0%, #1e1038 55%, #0b0718 100%)",
          padding: compact ? "14px 16px" : "18px 18px",
          boxShadow: "0 10px 30px rgba(76,29,149,0.35)",
        }}>
        <span className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(192,38,211,0.45), transparent 70%)" }} />
        <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 60%, #c026d3 100%)", boxShadow: "0 6px 20px rgba(139,92,246,0.5)" }}>
          <Crown size={20} className="text-white" />
        </span>
        <span className="relative flex-1 min-w-0">
          <span className="block text-[15px] font-extrabold text-white">
            Go <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg, #c4b5fd, #f0abfc)" }}>Pro</span>
          </span>
          <span className="block text-xs" style={{ color: "#c4b5fd" }}>
            {left === 0
              ? "You're out of free sessions — unlock unlimited"
              : `${left} of ${FREE_SCAN_LIMIT} free sessions left · Unlock unlimited`}
          </span>
        </span>
        <span className="relative flex items-center gap-0.5 rounded-full px-3 py-1.5 text-xs font-bold text-white"
          style={{ background: "rgba(255,255,255,0.12)" }}>
          Upgrade <ChevronRight size={13} />
        </span>
      </button>
    </>
  );
}
