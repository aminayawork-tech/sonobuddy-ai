"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Camera,
  ChevronRight,
  Clock,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import NavBar from "@/components/NavBar";
import ProBanner from "@/components/ProBanner";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { FREE_SCAN_LIMIT } from "@/lib/plans";
import { PROTOCOLS, CATEGORY_PILL } from "@/lib/protocols";
import { CATEGORY_ICON } from "@/lib/categoryIcons";

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

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function HomePage() {
  const { user, profile } = useAuth();
  const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
  const [totalScans, setTotalScans] = useState<number | null>(null);

  useEffect(() => {
    if (!user) { setRecentScans([]); setTotalScans(null); return; }
    const supabase = createClient();
    supabase
      .from("scan_history")
      .select("id, created_at, protocol_id, protocol_name, alert_level")
      .order("created_at", { ascending: false })
      .limit(3)
      .then(({ data }) => setRecentScans((data as RecentScan[]) ?? []));
    supabase
      .from("scan_history")
      .select("id", { count: "exact", head: true })
      .then(({ count }) => setTotalScans(count ?? 0));
  }, [user]);

  const isPaid = profile?.tier === "pro" || profile?.tier === "clinic";
  const scansUsed = profile?.scans_used_this_month ?? 0;
  const firstName = profile?.full_name?.trim().split(" ")[0];
  const usedPct = Math.min(100, (scansUsed / FREE_SCAN_LIMIT) * 100);

  return (
    <div className="min-h-screen pt-14 pb-24 md:pt-16 md:pb-8" style={{ background: "#eef3f8" }}>
      <NavBar />

      <main className="mx-auto max-w-4xl px-4 py-6 space-y-6">
        {/* ── Greeting ─────────────────────────────────────────── */}
        <div>
          <p suppressHydrationWarning className="text-xs font-bold uppercase tracking-widest" style={{ color: "#7c3aed" }}>
            {greeting()}
          </p>
          <h1 className="mt-1 text-[26px] font-extrabold leading-tight tracking-tight" style={{ color: "#0f172a" }}>
            Welcome back{firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#5a6a85" }}>
            Ready for your next study session?
          </p>
        </div>

        {/* ── Primary action ───────────────────────────────────── */}
        <Link
          href="/scan"
          className="relative block overflow-hidden rounded-3xl p-6 transition-all hover:opacity-95 active:scale-[0.99]"
          style={{
            background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 45%, #6d28d9 100%)",
            boxShadow: "0 14px 34px rgba(124,58,237,0.35)",
          }}
        >
          {/* Decorative sound-wave rings */}
          <span className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full" style={{ border: "1.5px solid rgba(255,255,255,0.14)" }} />
          <span className="pointer-events-none absolute -right-2 -top-2 h-28 w-28 rounded-full" style={{ border: "1.5px solid rgba(255,255,255,0.18)" }} />
          <span className="pointer-events-none absolute right-6 top-6 h-12 w-12 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }} />

          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: "rgba(255,255,255,0.2)" }}>
            <Camera size={22} className="text-white" />
          </div>
          <p className="relative mt-4 text-xl font-extrabold text-white">Start a Study Session</p>
          <p className="relative mt-1 text-sm" style={{ color: "#ede9fe" }}>
            Snap or upload an ultrasound image for an AI walkthrough
          </p>
          <span className="relative mt-5 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold" style={{ color: "#6d28d9" }}>
            Open camera <ArrowRight size={14} />
          </span>
        </Link>

        {/* ── Premium ─────────────────────────────────────────── */}
        <ProBanner />

        {/* ── Stats ───────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl p-4" style={{ background: "#ffffff", boxShadow: "0 1px 3px rgba(15,23,42,0.06)" }}>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: "#f5f3ff" }}>
                <Activity size={14} style={{ color: "#7c3aed" }} />
              </span>
              <p className="text-xs font-semibold" style={{ color: "#5a6a85" }}>This Month</p>
            </div>
            <p className="mt-3 text-2xl font-extrabold" style={{ color: "#0f172a" }}>
              {isPaid ? "∞" : `${scansUsed}/${FREE_SCAN_LIMIT}`}
            </p>
            {isPaid ? (
              <p className="text-xs" style={{ color: "#5a6a85" }}>Unlimited sessions</p>
            ) : (
              <div className="mt-2 h-1.5 overflow-hidden rounded-full" style={{ background: "#ede9fe" }}>
                <div className="h-full rounded-full" style={{ width: `${usedPct}%`, background: "linear-gradient(90deg, #8b5cf6, #c026d3)" }} />
              </div>
            )}
          </div>
          <Link href="/history" className="rounded-2xl p-4 transition-all active:scale-[0.99]" style={{ background: "#ffffff", boxShadow: "0 1px 3px rgba(15,23,42,0.06)" }}>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: "#ecfdf5" }}>
                <TrendingUp size={14} style={{ color: "#059669" }} />
              </span>
              <p className="text-xs font-semibold" style={{ color: "#5a6a85" }}>All Time</p>
            </div>
            <p className="mt-3 text-2xl font-extrabold" style={{ color: "#0f172a" }}>{totalScans ?? "–"}</p>
            <p className="text-xs" style={{ color: "#5a6a85" }}>sessions studied</p>
          </Link>
        </div>

        {/* ── Quick start protocols ────────────────────────────── */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold" style={{ color: "#0f172a" }}>Quick Start</h2>
            <Link href="/protocols" className="flex items-center gap-0.5 text-xs font-semibold" style={{ color: "#7c3aed" }}>
              See all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
            {QUICK_START_IDS.map((id) => {
              const p = PROTOCOLS.find((x) => x.id === id);
              if (!p) return null;
              const pill = CATEGORY_PILL[p.category];
              const Icon = CATEGORY_ICON[p.category];
              return (
                <Link
                  key={id}
                  href={`/scan?protocol=${id}`}
                  className="flex shrink-0 flex-col gap-3 rounded-2xl p-4 transition-all active:scale-[0.98]"
                  style={{ background: "#ffffff", boxShadow: "0 1px 3px rgba(15,23,42,0.06)", width: 136 }}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: pill.bg }}>
                    <Icon size={19} style={{ color: pill.text }} />
                  </span>
                  <span>
                    <span className="block text-sm font-bold leading-snug" style={{ color: "#0f172a" }}>{p.shortName}</span>
                    <span className="block text-[11px] font-medium" style={{ color: "#94a3b8" }}>{p.category}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── Recent activity ──────────────────────────────────── */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold" style={{ color: "#0f172a" }}>Recent Activity</h2>
            {recentScans.length > 0 && (
              <Link href="/history" className="flex items-center gap-0.5 text-xs font-semibold" style={{ color: "#7c3aed" }}>
                View all <ArrowRight size={12} />
              </Link>
            )}
          </div>

          {recentScans.length === 0 ? (
            <div className="rounded-2xl p-6 text-center" style={{ background: "#ffffff", boxShadow: "0 1px 3px rgba(15,23,42,0.06)" }}>
              <span className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "#f5f3ff" }}>
                <Clock size={18} style={{ color: "#7c3aed" }} />
              </span>
              <p className="text-sm" style={{ color: "#5a6a85" }}>No study sessions yet — start your first one above</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl" style={{ background: "#ffffff", boxShadow: "0 1px 3px rgba(15,23,42,0.06)" }}>
              {recentScans.map((scan, i) => {
                const proto = PROTOCOLS.find((x) => x.id === scan.protocol_id);
                const pill = proto ? CATEGORY_PILL[proto.category] : { bg: "#f5f3ff", text: "#7c3aed" };
                const Icon = proto ? CATEGORY_ICON[proto.category] : Sparkles;
                return (
                  <Link
                    key={scan.id}
                    href="/history"
                    className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-slate-50"
                    style={i > 0 ? { borderTop: "1px solid #f1f5f9" } : undefined}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: pill.bg }}>
                      <Icon size={16} style={{ color: pill.text }} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-semibold" style={{ color: "#0f172a" }}>{scan.protocol_name}</p>
                      <p className="text-xs" style={{ color: "#94a3b8" }}>{relativeDate(scan.created_at)}</p>
                    </div>
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: ALERT_DOT[scan.alert_level] ?? ALERT_DOT.none }} />
                    <ChevronRight size={16} style={{ color: "#cbd5e1" }} />
                  </Link>
                );
              })}
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
            Try Sono<span style={{ color: "#39a5e9" }}>Buddy</span>, our ultrasound reference app
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
