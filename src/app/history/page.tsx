"use client";

import { useEffect, useRef, useState } from "react";
import { Clock, ChevronDown, ChevronUp, Trash2, AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import ProBanner from "@/components/ProBanner";
import { PROTOCOLS, CATEGORY_PILL } from "@/lib/protocols";
import { CATEGORY_ICON } from "@/lib/categoryIcons";
import { deleteScanImage, getScanImages, type StoredScanImage } from "@/lib/scanImages";

interface ScanRecord {
  id: string;
  created_at: string;
  protocol_id: string;
  protocol_name: string;
  protocol_icon: string | null;
  alert_level: string;
  confidence: number | null;
  image_quality: string | null;
  summary: string | null;
  findings: Array<{ label: string; value: string; severity: string }>;
  measurements: Array<{ name: string; value: string; reference: string; status: string }>;
  labels: Array<{ name: string; color: string }>;
  recommendations: string[];
}

const ALERT_STYLES: Record<string, { bg: string; border: string; text: string; icon: React.ReactNode }> = {
  critical: { bg: "#fef2f2", border: "#fca5a5", text: "#dc2626", icon: <AlertTriangle size={14} /> },
  high:     { bg: "#fff7ed", border: "#fdba74", text: "#ea580c", icon: <AlertTriangle size={14} /> },
  moderate: { bg: "#fefce8", border: "#fde047", text: "#ca8a04", icon: <Info size={14} /> },
  low:      { bg: "#f0fdf4", border: "#86efac", text: "#16a34a", icon: <Info size={14} /> },
  none:     { bg: "#f0f9ff", border: "#bae6fd", text: "#0284c7", icon: <CheckCircle size={14} /> },
};

function relativeDate(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

// Image with the AI's structure labels drawn at their approximate positions.
function LabeledImage({ image, className }: { image: StoredScanImage; className?: string }) {
  return (
    <div className={`relative ${className ?? ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image.dataUrl} alt="Saved ultrasound" className="block w-full object-contain" />
      {image.labels.map((l) => (
        <span key={l.name} className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[10px] font-bold text-white"
          style={{ left: `${l.x}%`, top: `${l.y}%`, background: `${l.color}dd`, boxShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>
          {l.name}
        </span>
      ))}
    </div>
  );
}

function ImageViewer({ image, title, onClose }: { image: StoredScanImage; title: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[150] flex flex-col" style={{ background: "#000" }} onClick={onClose}>
      <div className="flex items-center justify-between px-4 pb-3" style={{ paddingTop: "calc(env(safe-area-inset-top) + 12px)" }}>
        <p className="truncate text-sm font-semibold text-white">{title}</p>
        <button onClick={onClose} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: "rgba(255,255,255,0.12)" }}>
          <X size={18} className="text-white" />
        </button>
      </div>
      <div className="flex flex-1 items-center justify-center px-2" onClick={(e) => e.stopPropagation()}>
        <LabeledImage image={image} className="w-full max-w-2xl" />
      </div>
      <p className="px-6 pt-3 text-center text-[11px]" style={{ color: "#a1a1aa", paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)" }}>
        Label positions are approximate. Stored only on this device.
      </p>
    </div>
  );
}

function ScanThumb({ scan, image }: { scan: ScanRecord; image?: StoredScanImage }) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={image.dataUrl} alt="" className="h-12 w-12 flex-shrink-0 rounded-xl object-cover" style={{ background: "#000" }} />
    );
  }
  const proto = PROTOCOLS.find((p) => p.id === scan.protocol_id);
  const pill = proto ? CATEGORY_PILL[proto.category] : { bg: "#f5f3ff", text: "#7c3aed" };
  const Icon = proto ? CATEGORY_ICON[proto.category] : Clock;
  return (
    <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: pill.bg }}>
      <Icon size={20} style={{ color: pill.text }} />
    </span>
  );
}

function ScanCard({ scan, image, onDelete }: { scan: ScanRecord; image?: StoredScanImage; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [viewing, setViewing] = useState(false);
  const touchStartX = useRef(0);
  const alert = ALERT_STYLES[scan.alert_level] ?? ALERT_STYLES.none;
  const DELETE_WIDTH = 80;

  async function handleDelete() {
    setDeleting(true);
    const supabase = createClient();
    await supabase.from("scan_history").delete().eq("id", scan.id);
    await deleteScanImage(scan.id);
    onDelete();
  }

  function onTouchStart(e: React.TouchEvent) {
    if (expanded) return;
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchMove(e: React.TouchEvent) {
    if (expanded) return;
    const delta = e.touches[0].clientX - touchStartX.current;
    if (delta < 0) setSwipeOffset(Math.max(delta, -DELETE_WIDTH));
    else if (swipeOffset < 0) setSwipeOffset(Math.min(0, swipeOffset + delta));
  }

  function onTouchEnd() {
    if (expanded) return;
    setSwipeOffset(swipeOffset < -DELETE_WIDTH / 2 ? -DELETE_WIDTH : 0);
  }

  return (
    <>
    {viewing && image && <ImageViewer image={image} title={scan.protocol_name} onClose={() => setViewing(false)} />}
    <div className="relative rounded-2xl overflow-hidden" style={{ background: "#ffffff", boxShadow: "0 1px 3px rgba(15,23,42,0.06)" }}>
      {/* Swipe-to-delete background button */}
      <div
        className="absolute inset-y-0 right-0 flex items-center justify-center"
        style={{ width: DELETE_WIDTH, background: "#ef4444" }}
      >
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex flex-col items-center gap-1"
          style={{ color: "#ffffff" }}
        >
          <Trash2 size={18} />
          <span className="text-xs font-semibold">{deleting ? "…" : "Delete"}</span>
        </button>
      </div>

      {/* Card content — slides left on swipe */}
      <div
        style={{ transform: `translateX(${swipeOffset}px)`, transition: swipeOffset === 0 || swipeOffset === -DELETE_WIDTH ? "transform 0.2s ease" : "none", background: "#ffffff", position: "relative", zIndex: 1 }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Header row */}
        <div
          className="flex items-center gap-3 px-4 py-3.5 cursor-pointer"
          onClick={() => { setSwipeOffset(0); setExpanded((v) => !v); }}
        >
          <ScanThumb scan={scan} image={image} />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate" style={{ color: "#1e293b" }}>{scan.protocol_name}</p>
            <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>{relativeDate(scan.created_at)}</p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span
              className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold capitalize"
              style={{ background: alert.bg, color: alert.text, border: `1px solid ${alert.border}` }}
            >
              {alert.icon}
              {scan.alert_level === "none" ? "Normal" : scan.alert_level}
            </span>
            {scan.confidence != null && (
              <span className="rounded-full px-2 py-0.5 text-xs font-semibold" style={{ background: "#f1f5f9", color: "#64748b" }}>
                {scan.confidence}%
              </span>
            )}
            {expanded ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
          </div>
        </div>

        {/* Expanded detail */}
        {expanded && (
          <div style={{ borderTop: "1px solid #f1f5f9" }}>
            {image && (
              <button onClick={() => setViewing(true)} className="block w-full text-left" style={{ background: "#000" }}>
                <LabeledImage image={image} />
                <span className="block px-4 py-1.5 text-[11px]" style={{ background: "#0b0b0b", color: "#a1a1aa" }}>
                  Tap to enlarge · labels are approximate
                </span>
              </button>
            )}
            {scan.summary && (
              <div className="px-4 py-3" style={{ background: "#f8fafc" }}>
                <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#94a3b8" }}>AI Summary</p>
                <p className="text-sm leading-relaxed" style={{ color: "#334155" }}>{scan.summary}</p>
              </div>
            )}

            {scan.findings.length > 0 && (
              <div className="px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide mb-2.5" style={{ color: "#94a3b8" }}>Findings</p>
                <div className="space-y-3">
                  {scan.findings.map((f, i) => {
                    const sevColor = f.severity === "critical" ? "#dc2626" : f.severity === "warning" ? "#ea580c" : f.severity === "normal" ? "#059669" : "#0284c7";
                    return (
                      <div key={i}>
                        <p className="text-xs font-semibold mb-0.5" style={{ color: "#475569" }}>{f.label}</p>
                        <p className="text-sm leading-relaxed break-words" style={{ color: sevColor }}>{f.value}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {scan.measurements.length > 0 && (
              <div className="px-4 py-3" style={{ borderTop: "1px solid #f1f5f9" }}>
                <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#94a3b8" }}>Measurements</p>
                <div className="space-y-1.5">
                  {scan.measurements.map((m, i) => (
                    <div key={i} className="flex items-baseline justify-between gap-3 text-sm">
                      <span className="flex-1 min-w-0 break-words" style={{ color: "#475569" }}>{m.name}</span>
                      <span className="font-semibold flex-shrink-0" style={{ color: m.status === "abnormal" ? "#dc2626" : m.status === "borderline" ? "#ea580c" : "#059669" }}>
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {scan.labels.length > 0 && (
              <div className="px-4 py-3" style={{ borderTop: "1px solid #f1f5f9" }}>
                <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#94a3b8" }}>Structures Identified</p>
                <div className="flex flex-wrap gap-1.5">
                  {scan.labels.map((l, i) => (
                    <span key={i} className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium" style={{ background: `${l.color}20`, color: l.color, border: `1px solid ${l.color}40` }}>
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: l.color }} />
                      {l.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {scan.recommendations.length > 0 && (
              <div className="px-4 py-3" style={{ borderTop: "1px solid #f1f5f9" }}>
                <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#94a3b8" }}>Recommendations</p>
                <ul className="space-y-1.5">
                  {scan.recommendations.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm leading-relaxed" style={{ color: "#334155" }}>
                      <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#7c3aed" }} />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
}

export default function HistoryPage() {
  const { user, loading } = useAuth();
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [fetching, setFetching] = useState(true);
  const [images, setImages] = useState<Record<string, StoredScanImage>>({});

  useEffect(() => {
    if (!user) { setFetching(false); return; }
    const supabase = createClient();
    supabase
      .from("scan_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        const rows = (data as ScanRecord[]) ?? [];
        setScans(rows);
        setFetching(false);
        getScanImages(rows.map((r) => r.id)).then(setImages);
      });
  }, [user]);

  if (loading || fetching) {
    return (
      <div className="min-h-screen pb-28" style={{ background: "#eef3f8" }}>
        <div className="flex items-center justify-center pt-32">
          <div className="w-6 h-6 rounded-full border-2 border-purple-200 border-t-purple-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28" style={{ background: "#eef3f8" }}>
      <div className="mx-auto max-w-lg px-4 pt-8 pb-6">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "linear-gradient(135deg, #8b5cf6, #6d28d9)" }}>
            <Clock size={18} className="text-white" />
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "#0f172a" }}>Scan History</h1>
        </div>

        <div className="mb-4">
          <ProBanner compact />
        </div>

        {/* Privacy banner */}
        <div className="rounded-xl px-4 py-3 mb-5 flex items-start gap-2" style={{ background: "#f5f3ff", border: "1px solid #ddd6fe" }}>
          <CheckCircle size={15} color="#7c3aed" className="mt-0.5 flex-shrink-0" />
          <p className="text-xs" style={{ color: "#6d28d9" }}>
            <strong>Privacy-first:</strong> Your AI study notes sync to your account. Scan images stay on this device only — never uploaded or stored on our servers.
          </p>
        </div>

        {scans.length === 0 ? (
          <div className="text-center py-16">
            <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "#f5f3ff" }}>
              <Clock size={24} style={{ color: "#7c3aed" }} />
            </span>
            <p className="text-base font-bold mb-1" style={{ color: "#0f172a" }}>No scans yet</p>
            <p className="text-xs mb-5" style={{ color: "#94a3b8" }}>Complete a scan to see your history here.</p>
            <Link
              href="/scan"
              className="inline-flex items-center gap-1.5 rounded-2xl px-6 py-3 text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)", boxShadow: "0 8px 24px rgba(124,58,237,0.3)" }}
            >
              Start a Scan
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {scans.map((scan) => (
              <ScanCard
                key={scan.id}
                scan={scan}
                image={images[scan.id]}
                onDelete={() => setScans((prev) => prev.filter((s) => s.id !== scan.id))}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
