"use client";

import type { ReactNode, ElementType } from "react";
import Link from "next/link";
import { X, LogIn, CreditCard, Shield, FileText, ChevronRight, Upload, Zap, ClipboardList, Camera } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

interface Props {
  onSignIn: () => void;
  onClose: () => void;
}

const HOW_IT_WORKS = [
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
];

export default function MobileMenu({ onSignIn, onClose }: Props) {
  const { user, profile, signOut } = useAuth();

  function handlePortal() {
    // Subscriptions are managed through Apple, not a web billing portal.
    onClose();
    window.location.href = "https://apps.apple.com/account/subscriptions";
  }

  async function handleSignOut() {
    await signOut();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col" style={{ background: "#f8fafc" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b shrink-0"
        style={{ borderColor: "#e2e8f0", background: "#ffffff" }}>
        <span className="text-base font-bold" style={{ color: "#1a2235" }}>Menu</span>
        <button onClick={onClose} className="rounded-full p-2 transition-colors hover:bg-slate-100">
          <X size={20} style={{ color: "#64748b" }} />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">

        {/* Account */}
        <MenuSection title="ACCOUNT">
          {user ? (
            <MenuItem icon={LogIn} label="Sign Out" sublabel={user.email ?? undefined}
              iconColor="#dc2626" labelColor="#dc2626" onClick={handleSignOut} />
          ) : (
            <MenuItem icon={LogIn} label="Sign In" iconColor="#7c3aed" labelColor="#7c3aed"
              onClick={() => { onClose(); onSignIn(); }} />
          )}
        </MenuSection>

        {/* Subscription */}
        <MenuSection title="SUBSCRIPTION">
          <MenuItem icon={CreditCard} label="Manage Subscription"
            sublabel={profile ? `${profile.tier.charAt(0).toUpperCase() + profile.tier.slice(1)} plan` : undefined}
            onClick={handlePortal} />
        </MenuSection>

        {/* How it works */}
        <div>
          <p className="mb-3 px-1 text-xs font-semibold tracking-widest" style={{ color: "#94a3b8" }}>
            HOW IT WORKS
          </p>
          <div className="space-y-3">
            {HOW_IT_WORKS.map(({ step, icon: Icon, iconBg, iconColor, title, desc }) => (
              <div key={step} className="rounded-2xl border p-4" style={{ background: "#ffffff", borderColor: "#e2e8f0" }}>
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{ background: iconBg }}>
                      <Icon size={18} style={{ color: iconColor }} />
                    </div>
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white"
                      style={{ background: "#7c3aed" }}>
                      {step}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold mb-0.5" style={{ color: "#1a2235" }}>{title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: "#64748b" }}>{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Start Scanning CTA */}
          <Link href="/scan" onClick={onClose}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold text-white shadow-sm transition-all active:scale-95"
            style={{ background: "#7c3aed" }}>
            <Camera size={16} />
            Start Scanning Now
          </Link>
        </div>

        {/* Legal */}
        <MenuSection title="LEGAL">
          <MenuItem icon={Shield}   label="Privacy Policy" href="/privacy" onClose={onClose} />
          <MenuItem icon={FileText} label="Terms of Use"    href="/terms"   onClose={onClose} last />
        </MenuSection>

      </div>

      {/* Version footer */}
      <div className="py-5 text-center shrink-0">
        <p className="text-xs tracking-widest font-medium" style={{ color: "#cbd5e1" }}>SONOBUDDY AI V1.0</p>
      </div>
    </div>
  );
}

function MenuSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 px-1 text-xs font-semibold tracking-widest" style={{ color: "#94a3b8" }}>{title}</p>
      <div className="rounded-2xl overflow-hidden border divide-y" style={{ borderColor: "#e2e8f0", background: "#ffffff" }}>
        {children}
      </div>
    </div>
  );
}

function MenuItem({
  icon: Icon, label, sublabel, iconColor = "#7c3aed", labelColor = "#1a2235",
  onClick, href, onClose, last,
}: {
  icon: ElementType; label: string; sublabel?: string;
  iconColor?: string; labelColor?: string;
  onClick?: () => void; href?: string; onClose?: () => void; last?: boolean;
}) {
  const inner = (
    <div className="flex items-center gap-3.5 px-4 py-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0" style={{ background: "#f5f3ff" }}>
        <Icon size={18} style={{ color: iconColor }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold" style={{ color: labelColor }}>{label}</p>
        {sublabel && <p className="text-xs mt-0.5 truncate" style={{ color: "#94a3b8" }}>{sublabel}</p>}
      </div>
      <ChevronRight size={16} style={{ color: "#cbd5e1" }} />
    </div>
  );

  if (href) return <Link href={href} onClick={onClose}>{inner}</Link>;
  return <button className="w-full text-left" onClick={onClick}>{inner}</button>;
}
