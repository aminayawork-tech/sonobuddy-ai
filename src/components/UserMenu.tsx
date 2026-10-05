"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CreditCard, LogOut } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { FREE_SCAN_LIMIT } from "@/lib/plans";
import UpgradeModal from "./UpgradeModal";

export default function UserMenu() {
  const { user, profile, scansLeft, signOut } = useAuth();
  const [open,           setOpen]           = useState(false);
  const [showUpgrade,    setShowUpgrade]    = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function openPortal() {
    // Subscriptions are managed through Apple, not a web billing portal.
    setOpen(false);
    window.location.href = "https://apps.apple.com/account/subscriptions";
  }

  if (!user) return null;

  const initials = (user.email ?? "?").substring(0, 1).toUpperCase();
  const isPaid   = profile?.tier === "pro" || profile?.tier === "clinic";

  return (
    <>
    {showUpgrade && typeof document !== "undefined" && createPortal(
      <UpgradeModal onClose={() => setShowUpgrade(false)} />,
      document.body
    )}
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl border px-3 py-1.5 transition-all hover:bg-slate-50"
        style={{ borderColor: "#e2e8f0" }}>

        {/* Avatar */}
        <div className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
          style={{ background: isPaid ? "#2563eb" : "#94a3b8" }}>
          {initials}
        </div>

        {/* Scan counter badge */}
        {profile?.tier === "free" && (
          <span className="text-xs font-medium"
            style={{ color: scansLeft <= 1 ? "#dc2626" : "#64748b" }}>
            {scansLeft}/{FREE_SCAN_LIMIT}
          </span>
        )}
        {isPaid && (
          <span className="rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white"
            style={{ background: "#2563eb" }}>
            {profile.tier === "clinic" ? "CLINIC" : "PRO"}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-2xl border shadow-xl"
          style={{ background: "#ffffff", borderColor: "#e2e8f0", zIndex: 60 }}>

          {/* User info */}
          <div className="px-4 py-3 border-b" style={{ borderColor: "#f1f5f9" }}>
            <p className="text-xs font-semibold truncate" style={{ color: "#0f172a" }}>
              {user.email}
            </p>
            <p className="text-xs mt-0.5 capitalize" style={{ color: "#94a3b8" }}>
              {profile?.tier ?? "free"} plan
              {profile?.tier === "free" && ` · ${scansLeft} scans left`}
            </p>
          </div>

          {/* Actions */}
          <div className="p-1.5">
            {isPaid ? (
              <button
                onClick={openPortal}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-slate-50"
                style={{ color: "#374151" }}>
                <CreditCard size={14} style={{ color: "#64748b" }} />
                Manage Billing
              </button>
            ) : (
              <button
                onClick={() => { setOpen(false); setShowUpgrade(true); }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-slate-50"
                style={{ color: "#2563eb" }}>
                <CreditCard size={14} />
                Upgrade to Pro
              </button>
            )}

            <button
              onClick={() => { signOut(); setOpen(false); }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-slate-50"
              style={{ color: "#64748b" }}>
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
