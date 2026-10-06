"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  ChevronRight,
  Clock,
  Sparkles,
} from "lucide-react";
import NavBar from "@/components/NavBar";
import UpgradeModal from "@/components/UpgradeModal";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { FREE_SCAN_LIMIT } from "@/lib/plans";
import { PROTOCOLS, CATEGORY_PILL } from "@/lib/protocols";

const QUICK_START_IDS = ["efast", "cardiac-plax", "ob-first-trimester", "renal", "dvt"];

const ALERT_DOT: Record<string, string> = {
  critical: "#dc2626",
  high: "#ea580c",
  moderate: "#ca8a04",
  low: "#16a34a",
  none: "#94a3b8",
};

interface RecentScan {
  id: string;
  created_at: string;
  protocol_id: string;
  protocol_name: string;
  alert_level: string;
}

function relativeDate(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function HomePage() {
  const { user, profile } = useAuth();
  const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    if (!user) { setRecentScans([]); return; }
    const supabase = createClient();
    supabase
      .from("scan_history")
      .select("id, created_at, protocol_id, protocol_name, alert_level")
      .order("created_at", { ascending: false })
      .limit(3)
      .then(({ data }) => setRecentScans((data as RecentScan[]) ?? []));
  }, [user]);

  const isPaid = profile?.tier === "pro" || profile?.tier === "clinic";
  const scansUsed = profile?.scans_used_this_month ?? 0;
  const firstName = profile?.full_name?.trim().split(" ")[0];

  return (
    <div className="min-h-screen pt-14 pb-24 md:pt-16 md:pb-8" style={{ background: "#eef3f8" }}>
      <NavBar />
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}

      <main className="mx-auto max-w-4xl px-4 py-6 space-y-6">
        {/* ── Greeting ─────────────────────────────────────────── */}
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: "#1a2235" }}>
            Welcome back{firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#5a6a85" }}>
            Ready for your next study session?
          </p>
        </div>

        {/* ── Primary action ───────────────────────────────────── */}
        <Link
          href="/scan"
          className="flex items-center justify-between rounded-2xl p-6 shadow-sm transition-all hover:opacity-95 active:scale-[0.99]"
          style={{ background: "#7c3aed" }}
        >
          <div>
            <p className="text-lg font-bold text-white">Start a Study Session</p>
            <p className="mt-0.5 text-sm" style={{ color: "#ede9fe" }}>
              Snap or upload an ultrasound image
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ background: "rgba(255,255,255,0.18)" }}>
            <Camera size={22} className="text-white" />
          </div>
        </Link>

        {/* ── Stats / account status ───────────────────────────── */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border p-4" style={{ background: "#ffffff", borderColor: "#dde4ee" }}>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#94a3b8" }}>
              This Month
            </p>
            <p className="mt-1 text-2xl font-extrabold" style={{ color: "#1a2235" }}>
              {isPaid ? "∞" : `${scansUsed}/${FREE_SCAN_LIMIT}`}
            </p>
            <p className="text-xs" style={{ color: "#5a6a85" }}>study sessions</p>
          </div>
          {isPaid ? (
            <div className="rounded-2xl border p-4" style={{ background: "#ffffff", borderColor: "#dde4ee" }}>
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#94a3b8" }}>
                Plan
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-2xl font-extrabold" style={{ color: "#1a2235" }}>
                Pro
                <Sparkles size={16} style={{ color: "#7c3aed" }} />
              </p>
              <p className="text-xs" style={{ color: "#5a6a85" }}>Unlimited sessions</p>
            </div>
          ) : (
            <button
              onClick={() => setShowUpgrade(true)}
              className="rounded-2xl border p-4 text-left transition-all hover:bg-slate-50"
              style={{ background: "#ffffff", borderColor: "#dde4ee" }}
            >
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#94a3b8" }}>
                Plan
              </p>
              <p className="mt-1 text-2xl font-extrabold" style={{ color: "#1a2235" }}>Free</p>
              <p className="text-xs font-semibold" style={{ color: "#7c3aed" }}>Upgrade for unlimited →</p>
            </button>
          )}
        </div>

        {/* ── Quick start protocols ────────────────────────────── */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold" style={{ color: "#5a6a85" }}>Quick Start</h2>
            <Link href="/protocols" className="flex items-center gap-0.5 text-xs font-semibold" style={{ color: "#7c3aed" }}>
              See all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {QUICK_START_IDS.map((id) => {
              const p = PROTOCOLS.find((x) => x.id === id);
              if (!p) return null;
              const pill = CATEGORY_PILL[p.category];
              return (
                <Link
                  key={id}
                  href={`/scan?protocol=${id}`}
                  className="flex shrink-0 flex-col gap-2 rounded-2xl border p-4 transition-all hover:shadow-sm"
                  style={{ background: "#ffffff", borderColor: "#dde4ee", width: 140 }}
                >
                  <span className="w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: pill.bg, color: pill.text }}>
                    {p.category}
                  </span>
                  <span className="text-sm font-bold leading-snug" style={{ color: "#1a2235" }}>
                    {p.shortName}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── Recent activity ──────────────────────────────────── */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold" style={{ color: "#5a6a85" }}>Recent Activity</h2>
            {recentScans.length > 0 && (
              <Link href="/history" className="flex items-center gap-0.5 text-xs font-semibold" style={{ color: "#7c3aed" }}>
                View all <ArrowRight size={12} />
              </Link>
            )}
          </div>

          {recentScans.length === 0 ? (
            <div className="rounded-2xl border p-6 text-center" style={{ background: "#ffffff", borderColor: "#dde4ee" }}>
              <Clock size={20} className="mx-auto mb-2" style={{ color: "#94a3b8" }} />
              <p className="text-sm" style={{ color: "#5a6a85" }}>No study sessions yet — start your first one above</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentScans.map((scan) => (
                <Link
                  key={scan.id}
                  href="/history"
                  className="flex items-center justify-between rounded-2xl border p-4 transition-all hover:bg-slate-50"
                  style={{ background: "#ffffff", borderColor: "#dde4ee" }}
                >
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: ALERT_DOT[scan.alert_level] ?? ALERT_DOT.none }} />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "#1a2235" }}>{scan.protocol_name}</p>
                      <p className="text-xs" style={{ color: "#94a3b8" }}>{relativeDate(scan.created_at)}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} style={{ color: "#cbd5e1" }} />
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ── Cross-promo: SonoBuddy reference app ─────────────────── */}
        <a
          href="https://apps.apple.com/us/app/sonobuddy-ultrasound-reference/id6761020726"
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-2xl p-5 transition-all hover:opacity-95"
          style={{ background: "#0f172a" }}
        >
          <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "#a78bfa" }}>
            Need a quick reference?
          </p>
          <h3 className="mt-1 text-lg font-bold text-white">
            Try <span style={{ color: "#60a5fa" }}>SonoBuddy</span>, our ultrasound reference app
          </h3>
          <p className="mt-1 text-sm" style={{ color: "#cbd5e1" }}>
            Normal values, protocols, and calculators — a fast offline companion for the exam room.
          </p>
          <p className="mt-3 flex items-center gap-1 text-sm font-semibold" style={{ color: "#c4b5fd" }}>
            Download on the App Store
            <ArrowRight size={14} />
          </p>
        </a>

        {/* ── Disclaimer ────────────────────────────────────────── */}
        <p className="pt-2 text-center text-xs" style={{ color: "#94a3b8" }}>
          Educational use only. SonoBuddy ai does not provide medical advice, diagnosis, or treatment.
        </p>
      </main>
    </div>
  );
}
