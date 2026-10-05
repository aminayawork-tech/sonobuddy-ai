"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle,
  ChevronRight,
  Download,
  Flag,
  Info,
  Loader2,
  Maximize2,
  MessageCircle,
  RefreshCw,
  Send,
  Share2,
  ShieldAlert,
  X,
  XCircle,
} from "lucide-react";
import type { ChatMessage } from "@/app/api/chat/route";
import NavBar from "@/components/NavBar";
import ConfidenceBadge from "@/components/ConfidenceBadge";
import { getProtocolById } from "@/lib/protocols";
import { getMockAnalysis, type AnalysisResult } from "@/lib/mock-analysis";

const ALERT_CONFIG: Record<string, {
  border: string; bg: string; labelBg: string; labelText: string;
  icon: React.ElementType; iconColor: string; label: string;
}> = {
  critical: { border: "#fca5a5", bg: "#fef2f2", labelBg: "#fee2e2", labelText: "#dc2626", icon: XCircle, iconColor: "#dc2626", label: "CRITICAL FINDING" },
  high:     { border: "#fdba74", bg: "#fff7ed", labelBg: "#fed7aa", labelText: "#ea580c", icon: AlertTriangle, iconColor: "#ea580c", label: "SIGNIFICANT FINDING" },
  moderate: { border: "#fcd34d", bg: "#fefce8", labelBg: "#fef9c3", labelText: "#ca8a04", icon: AlertTriangle, iconColor: "#ca8a04", label: "NOTABLE FINDING" },
  low:      { border: "#c4b5fd", bg: "#f5f3ff", labelBg: "#ede9fe", labelText: "#7c3aed", icon: Info, iconColor: "#7c3aed", label: "NOTE" },
  none:     { border: "#6ee7b7", bg: "#f0fdf4", labelBg: "#d1fae5", labelText: "#059669", icon: CheckCircle, iconColor: "#059669", label: "NORMAL" },
};

const FINDING_STYLES: Record<string, { bg: string; border: string; label: string; value: string }> = {
  critical: { bg: "#fef2f2", border: "#fca5a5", label: "#dc2626", value: "#991b1b" },
  warning:  { bg: "#fefce8", border: "#fcd34d", label: "#ca8a04", value: "#92400e" },
  normal:   { bg: "#f0fdf4", border: "#6ee7b7", label: "#059669", value: "#065f46" },
  info:     { bg: "#f5f3ff", border: "#c4b5fd", label: "#7c3aed", value: "#5b21b6" },
};

const MEASURE_STATUS: Record<string, string> = {
  normal:    "#059669",
  borderline: "#d97706",
  abnormal:  "#dc2626",
};

const QUALITY_COLOR: Record<string, string> = {
  excellent: "#059669",
  good:      "#7c3aed",
  fair:      "#d97706",
  poor:      "#dc2626",
};

function AnnotatedImagePlaceholder({ labels, alertLevel }: { labels: AnalysisResult["labels"]; alertLevel: string }) {
  return (
    <div className="relative w-full overflow-hidden" style={{ background: "#0a1020", aspectRatio: "4/3" }}>
      {/* Simulated US background */}
      <div className="absolute inset-0 opacity-25"
        style={{ background: "radial-gradient(ellipse at 40% 50%, rgba(80,120,200,0.4) 0%, rgba(20,30,60,0.8) 60%, rgba(5,10,20,1) 100%)" }} />
      {Array.from({ length: 18 }).map((_, i) => (
        <div key={i} className="absolute left-0 right-0 h-px opacity-10"
          style={{ top: `${(i + 1) * 5.5}%`, background: "rgba(120,160,255,0.35)" }} />
      ))}
      <div className="absolute opacity-20"
        style={{ top: "22%", left: "22%", width: "52%", height: "42%", background: "radial-gradient(ellipse, rgba(160,190,255,0.2), transparent 70%)", borderRadius: "50%" }} />
      {alertLevel === "critical" && (
        <div className="absolute opacity-30"
          style={{ top: "40%", left: "44%", width: "18%", height: "12%", background: "#ef4444", borderRadius: "40%" }} />
      )}

      {/* Labels */}
      {labels.map((label) => (
        <div key={label.id} className="absolute"
          style={{ left: `${label.x}%`, top: `${label.y}%`, transform: "translate(-50%,-50%)" }}>
          <div className="rounded-md px-2 py-1 text-xs font-bold whitespace-nowrap shadow"
            style={{ background: "rgba(0,0,0,0.72)", border: `1px solid ${label.color}`, color: label.color }}>
            {label.name}
          </div>
        </div>
      ))}

      <div className="absolute bottom-3 right-3">
        <span className="rounded-full text-xs font-semibold text-white px-2.5 py-1"
          style={{ background: "rgba(0,0,0,0.65)", border: "1px solid rgba(255,255,255,0.15)" }}>
          AI Analysis Active
        </span>
      </div>
      <div className="absolute right-2 top-4 bottom-4 flex flex-col justify-between">
        {["2cm","4cm","6cm","8cm","10cm"].map((d) => (
          <span key={d} className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>{d}</span>
        ))}
      </div>
    </div>
  );
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const protocolId = searchParams.get("protocol") ?? "efast";
  const protocol = getProtocolById(protocolId);

  const [analysis, setAnalysis] = useState<AnalysisResult>(() => getMockAnalysis(protocolId));
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [reviewConfirmed, setReviewConfirmed] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportNote, setReportNote] = useState("");
  const [reportSent, setReportSent] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  async function handleShare() {
    const shareData = {
      title: `SonoBuddy AI – ${protocol?.name ?? "Ultrasound"} Report`,
      text: `AI ultrasound analysis: ${analysis.summary}`,
      url: window.location.href,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); return; } catch { /* user cancelled */ }
    }
    // Fallback: copy link to clipboard
    await navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2500);
  }

  function handleSubmitReport() {
    if (!reportReason) return;
    // In production this would POST to an API; for now just acknowledge
    setReportSent(true);
    setTimeout(() => {
      setShowReportModal(false);
      setReportSent(false);
      setReportReason("");
      setReportNote("");
    }, 1800);
  }

  function handleExportPDF() {
    setShowExportModal(false);
    // Give React a tick to close the modal before printing
    setTimeout(() => window.print(), 100);
  }

  // Follow-up chat
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const chatExpandedInputRef = useRef<HTMLInputElement>(null);
  const chatSectionRef = useRef<HTMLDivElement>(null);

  async function sendChatMessage() {
    const question = chatInput.trim();
    if (!question || chatLoading) return;
    setChatInput("");
    const newHistory: ChatMessage[] = [...chatHistory, { role: "user", content: question }];
    setChatHistory(newHistory);
    setChatLoading(true);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    try {
      const isFirst = chatHistory.length === 0;
      let imageBase64: string | null = null;
      let mediaType: string | null = null;
      if (isFirst && capturedImage) {
        const match = capturedImage.match(/^data:([^;]+);base64,(.+)$/);
        if (match) { mediaType = match[1]; imageBase64 = match[2]; }
      }
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          analysisContext: analysis,
          history: chatHistory,
          imageBase64,
          mediaType,
        }),
      });
      const data = await res.json();
      const answer = data.answer ?? data.error ?? "Something went wrong.";
      setChatHistory([...newHistory, { role: "assistant", content: answer }]);
    } catch {
      setChatHistory([...newHistory, { role: "assistant", content: "Sorry, I couldn't connect. Please try again." }]);
    } finally {
      setChatLoading(false);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  }

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("lastAnalysis");
      if (stored) {
        setAnalysis(JSON.parse(stored));
        sessionStorage.removeItem("lastAnalysis");
      }
      const img = sessionStorage.getItem("lastImage");
      if (img) {
        setCapturedImage(img);
        sessionStorage.removeItem("lastImage");
      }
    } catch {
      // sessionStorage unavailable or parse error — keep mock
    }
  }, []);

  const cfg = ALERT_CONFIG[analysis.alertLevel] ?? ALERT_CONFIG.none;
  const AlertIcon = cfg.icon;

  const timestamp = new Date(analysis.timestamp).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  const Card = ({ children, className = "", "data-print": dataPrint }: { children: React.ReactNode; className?: string; "data-print"?: string }) => (
    <div className={`rounded-2xl border p-5 shadow-sm ${className}`}
      data-print={dataPrint}
      style={{ background: "#ffffff", borderColor: "#dde4ee" }}>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen pt-14 pb-52 md:pb-8 md:pt-16" style={{ background: "#f8fafc" }}>
      <NavBar />

      <div className="mx-auto max-w-2xl px-4 py-8 print-container">

        {/* Print-only header — hidden on screen */}
        <div data-print="header" className="mb-6 hidden items-center justify-between border-b pb-4"
          style={{ borderColor: "#e2e8f0" }}>
          <div>
            <span className="text-xl font-extrabold" style={{ color: "#0f172a" }}>Sono</span>
            <span className="text-xl font-extrabold" style={{ color: "#7c3aed" }}>Pilot</span>
            <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>AI Ultrasound Report</p>
          </div>
          <div className="text-right text-xs" style={{ color: "#94a3b8" }}>
            <p>{timestamp}</p>
            <p className="mt-0.5">Educational use only — not medical advice</p>
          </div>
        </div>

        {/* Back + timestamp */}
        <div className="mb-6 flex items-center justify-between no-print" data-print="hide">
          <Link href={`/scan?protocol=${protocolId}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium hover:opacity-70"
            style={{ color: "#5a6a85" }}>
            <ArrowLeft size={14} /> Back to Scan
          </Link>
          <span className="text-xs" style={{ color: "#94a3b8" }}>{timestamp}</span>
        </div>

        <div className="mb-4 flex items-center gap-3">
          <span className="text-2xl">{protocol?.icon}</span>
          <div>
            <h1 className="text-xl font-extrabold" style={{ color: "#1a2235" }}>{analysis.protocolName}</h1>
            <p className="text-sm" style={{ color: "#5a6a85" }}>AI Analysis Results</p>
          </div>
        </div>

        {/* Alert banner */}
        {analysis.alertMessage && (
          <div className="my-4 rounded-xl border p-4" style={{ borderColor: cfg.border, background: cfg.bg }}>
            <div className="flex items-start gap-3">
              <AlertIcon size={17} className="mt-0.5 shrink-0" style={{ color: cfg.iconColor }} />
              <div>
                <p className="text-sm font-bold" style={{ color: cfg.iconColor }}>{cfg.label}</p>
                <p className="mt-0.5 text-sm leading-relaxed" style={{ color: cfg.iconColor, opacity: 0.9 }}>
                  {analysis.alertMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Annotated image */}
        <div className="mb-5 overflow-hidden rounded-2xl border shadow-sm" style={{ borderColor: "#dde4ee" }}>
          {capturedImage ? (
            /* Real uploaded image with AI label overlays */
            <div className="relative w-full" style={{ background: "#000" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={capturedImage}
                alt="Analyzed ultrasound"
                className="w-full"
                style={{ display: "block", maxHeight: "420px", objectFit: "contain" }}
              />
              {/* Label overlays — positioned as % of the img element */}
              <div className="absolute inset-0 pointer-events-none">
                {analysis.labels.map((label) => (
                  <div key={label.id} className="absolute"
                    style={{ left: `${label.x}%`, top: `${label.y}%`, transform: "translate(-50%,-50%)" }}>
                    {/* Dot marker */}
                    <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white"
                      style={{ background: label.color }} />
                    <div className="rounded-md px-2 py-1 text-xs font-bold whitespace-nowrap shadow-lg mt-3"
                      style={{ background: "rgba(0,0,0,0.80)", border: `1.5px solid ${label.color}`, color: label.color }}>
                      {label.name}
                    </div>
                  </div>
                ))}
                <div className="absolute bottom-2 right-2">
                  <span className="rounded-full text-xs font-semibold text-white px-2.5 py-1"
                    style={{ background: "rgba(0,0,0,0.70)", border: "1px solid rgba(255,255,255,0.2)" }}>
                    AI Analysis Active
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <AnnotatedImagePlaceholder labels={analysis.labels} alertLevel={analysis.alertLevel} />
          )}
          <div className="flex items-center justify-between border-t px-4 py-2.5"
            style={{ borderColor: "#dde4ee", background: "#f8fafc" }}>
            <span className="text-xs font-semibold"
              style={{ color: QUALITY_COLOR[analysis.imageQuality] }}>
              Image Quality: {analysis.imageQuality.charAt(0).toUpperCase() + analysis.imageQuality.slice(1)}
            </span>
            <ConfidenceBadge score={analysis.confidence} size="sm" />
          </div>
          {analysis.imageQualityNote && (
            <div className="border-t px-4 py-2" style={{ borderColor: "#dde4ee", background: "#f5f3ff" }}>
              <p className="flex items-start gap-1.5 text-xs" style={{ color: "#7c3aed" }}>
                <Info size={11} className="mt-0.5 shrink-0" />
                {analysis.imageQualityNote}
              </p>
            </div>
          )}
        </div>

        {/* Label legend */}
        <div className="mb-2 flex flex-wrap gap-2">
          {analysis.labels.map((label) => (
            <span key={label.id}
              className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium"
              style={{ borderColor: "#dde4ee", background: "#ffffff", color: "#5a6a85" }}>
              <span className="h-2 w-2 rounded-full" style={{ background: label.color }} />
              {label.name}
            </span>
          ))}
        </div>
        {/* Label position disclaimer */}
        <div className="mb-5 flex items-start gap-1.5 rounded-xl border px-3 py-2"
          style={{ borderColor: "#fcd34d", background: "#fefce8" }}>
          <Info size={12} className="mt-0.5 shrink-0" style={{ color: "#ca8a04" }} />
          <p className="text-xs leading-relaxed" style={{ color: "#92400e" }}>
            Label positions are approximate and for reference only. They do not precisely mark the anatomical location of each structure. Use your own sonographic judgment for accurate identification.
          </p>
        </div>

        {/* Findings */}
        <Card className="mb-5">
          <h2 className="mb-4 font-semibold" style={{ color: "#1a2235" }}>Findings</h2>
          <div className="space-y-2">
            {analysis.findings.map((finding, i) => {
              const s = FINDING_STYLES[finding.severity] ?? FINDING_STYLES.info;
              return (
                <div key={i} className="flex items-start justify-between gap-3 rounded-xl border px-3 py-2.5"
                  style={{ borderColor: s.border, background: s.bg }}>
                  <span className="text-xs font-semibold" style={{ color: s.label }}>{finding.label}</span>
                  <span className="text-right text-xs font-bold" style={{ color: s.value }}>{finding.value}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Measurements */}
        {analysis.measurements.length > 0 && (
          <Card className="mb-5">
            <h2 className="mb-4 font-semibold" style={{ color: "#1a2235" }}>Automated Measurements</h2>
            <div className="divide-y" style={{ borderColor: "#f1f5f9" }}>
              {analysis.measurements.map((m, i) => (
                <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium" style={{ color: "#1a2235" }}>{m.name}</p>
                    {m.reference && <p className="text-xs" style={{ color: "#94a3b8" }}>{m.reference}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: MEASURE_STATUS[m.status] }}>{m.value}</p>
                    <p className="text-xs capitalize" style={{ color: "#94a3b8" }}>{m.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Summary */}
        <Card className="mb-5">
          <h2 className="mb-3 font-semibold" style={{ color: "#1a2235" }}>AI Summary</h2>
          <p className="text-sm leading-relaxed" style={{ color: "#5a6a85" }}>{analysis.summary}</p>
        </Card>

        {/* Recommendations */}
        <Card className="mb-5">
          <h2 className="mb-3 font-semibold" style={{ color: "#1a2235" }}>Recommendations</h2>
          <ul className="space-y-2">
            {analysis.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: "#5a6a85" }}>
                <ChevronRight size={14} className="mt-0.5 shrink-0" style={{ color: "#7c3aed" }} />
                {rec}
              </li>
            ))}
          </ul>
        </Card>

        {/* Next views */}
        {analysis.nextViews.length > 0 && (
          <div className="mb-5 rounded-2xl border p-5" style={{ borderColor: "#ddd6fe", background: "#f5f3ff" }}>
            <h2 className="mb-3 font-semibold" style={{ color: "#1a2235" }}>Suggested Next Views</h2>
            <div className="flex flex-wrap gap-2">
              {analysis.nextViews.map((view) => (
                <Link key={view} href={`/scan?protocol=${protocolId}`}
                  className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all hover:opacity-80"
                  style={{ borderColor: "#c4b5fd", background: "#ede9fe", color: "#6d28d9" }}>
                  {view} <ArrowRight size={10} />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer + confirm */}
        <div className="mb-5 rounded-2xl border p-5" style={{ borderColor: "#fcd34d", background: "#fefce8" }}>
          <div className="flex items-start gap-3">
            <ShieldAlert size={17} className="mt-0.5 shrink-0" style={{ color: "#ca8a04" }} />
            <div>
              <p className="text-sm font-bold" style={{ color: "#92400e" }}>Important Disclaimer</p>
              <p className="mt-1 text-xs leading-relaxed" style={{ color: "#92400e", opacity: 0.85 }}>
                SonoBuddy AI is an educational tool only and does not provide medical advice, diagnosis,
                or treatment. Always consult a licensed physician for any medical decisions.
              </p>
              <label className="mt-3 flex cursor-pointer items-start gap-2">
                <input type="checkbox" checked={reviewConfirmed}
                  onChange={(e) => setReviewConfirmed(e.target.checked)}
                  className="mt-0.5" style={{ accentColor: "#ca8a04" }} />
                <span className="text-xs font-medium" style={{ color: "#92400e" }}>
                  I understand this is an educational study tool and does not provide medical
                  advice, diagnosis, or treatment.
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3" data-print="hide">
          {/* Primary: New Scan */}
          <Link href="/scan"
            className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: "#7c3aed" }}>
            <Camera size={17} /> New Scan
          </Link>
          {/* Secondary actions */}
          <div className="grid grid-cols-3 gap-3">
            <button onClick={() => reviewConfirmed && setShowExportModal(true)} disabled={!reviewConfirmed}
              className="flex flex-col items-center gap-1.5 rounded-xl border py-3 text-xs font-medium transition-all hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ borderColor: "#dde4ee", color: "#5a6a85", background: "#ffffff" }}>
              <Download size={17} /> Export PDF
            </button>
            <button onClick={handleShare}
              className="relative flex flex-col items-center gap-1.5 rounded-xl border py-3 text-xs font-medium transition-all hover:bg-slate-50"
              style={{ borderColor: "#dde4ee", color: shareCopied ? "#059669" : "#5a6a85", background: "#ffffff" }}>
              <Share2 size={17} />
              {shareCopied ? "Copied!" : "Share"}
            </button>
            <button onClick={() => setShowReportModal(true)}
              className="flex flex-col items-center gap-1.5 rounded-xl border py-3 text-xs font-medium transition-all hover:bg-slate-50"
              style={{ borderColor: "#dde4ee", color: "#5a6a85", background: "#ffffff" }}>
              <Flag size={17} /> Report
            </button>
          </div>
        </div>

        {/* Protocol checklist */}
        {protocol && (
          <Card className="mt-5" data-print="hide">
            <h2 className="mb-3 font-semibold" style={{ color: "#1a2235" }}>Protocol Checklist</h2>
            <div className="space-y-2">
              {protocol.views.map((view, i) => (
                <div key={view} className="flex items-center gap-3 text-sm">
                  {i === 0
                    ? <CheckCircle size={15} className="shrink-0" style={{ color: "#7c3aed" }} />
                    : <div className="h-4 w-4 shrink-0 rounded-full border-2" style={{ borderColor: "#dde4ee" }} />}
                  <span style={{ color: i === 0 ? "#1a2235" : "#94a3b8" }}>{view}</span>
                  {i === 0 && (
                    <span className="ml-auto rounded-full px-2 py-0.5 text-xs font-semibold"
                      style={{ background: "#ede9fe", color: "#7c3aed" }}>
                      Complete
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs" style={{ color: "#94a3b8" }}>
              <span>1 of {protocol.views.length} views complete</span>
              <Link href={`/scan?protocol=${protocolId}`} className="font-medium" style={{ color: "#7c3aed" }}>
                Continue exam →
              </Link>
            </div>
          </Card>
        )}

        {/* Follow-up chat — full-screen expanded modal */}
        {chatExpanded && (
          <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "#f8fafc" }}>
            {/* Header */}
            <div className="flex items-center gap-2.5 border-b px-4 py-3 shrink-0" style={{ borderColor: "#dde4ee", background: "#ffffff" }}>
              <MessageCircle size={16} style={{ color: "#7c3aed" }} />
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: "#1a2235" }}>Ask a Follow-up Question</p>
                <p className="text-xs" style={{ color: "#94a3b8" }}>Ask anything about this scan</p>
              </div>
              <button onClick={() => setChatExpanded(false)} className="rounded-full p-1.5 hover:bg-slate-100" style={{ color: "#64748b" }}>
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {chatHistory.length === 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {["What does this finding mean?", "Should I be concerned?", "What view should I get next?", "Explain the measurements"].map((q) => (
                    <button key={q} onClick={() => { setChatInput(q); setTimeout(() => chatExpandedInputRef.current?.focus(), 50); }}
                      className="rounded-full border px-3 py-1.5 text-sm font-medium"
                      style={{ borderColor: "#ddd6fe", color: "#7c3aed", background: "#f5f3ff" }}>
                      {q}
                    </button>
                  ))}
                </div>
              )}
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
                    style={msg.role === "user"
                      ? { background: "#7c3aed", color: "#ffffff", borderBottomRightRadius: "4px" }
                      : { background: "#ffffff", color: "#1a2235", borderBottomLeftRadius: "4px", border: "1px solid #e2e8f0" }}>
                    {msg.role === "assistant"
                      ? stripMarkdown(msg.content).split(/\n\n+/).filter(Boolean).map((para, pi, arr) => (
                          <p key={pi} className={pi < arr.length - 1 ? "mb-2" : ""}>{para.trim()}</p>
                        ))
                      : msg.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm" style={{ background: "#ffffff", color: "#5a6a85", border: "1px solid #e2e8f0", borderBottomLeftRadius: "4px" }}>
                    <Loader2 size={13} className="animate-spin" /> Thinking...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

      {/* Input pinned at bottom — safe above keyboard and BottomNav */}
            <div className="shrink-0 border-t px-4 py-3" style={{ borderColor: "#dde4ee", background: "#ffffff", paddingBottom: "max(env(safe-area-inset-bottom), 80px)" }}>
              <div className="flex gap-2">
                <input
                  ref={chatExpandedInputRef}
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendChatMessage()}
                  placeholder="Ask about findings, measurements…"
                  style={{ fontSize: "16px", borderColor: "#dde4ee", background: "#f8fafc", color: "#1a2235" }}
                  className="flex-1 rounded-xl border px-4 py-3 outline-none transition-all"
                />
                <button onClick={sendChatMessage} disabled={!chatInput.trim() || chatLoading}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white transition-all hover:opacity-90 disabled:opacity-40"
                  style={{ background: "#7c3aed" }}>
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Follow-up chat — inline card */}
        <div ref={chatSectionRef} className="mt-5 rounded-2xl border shadow-sm overflow-hidden" data-print="hide" style={{ borderColor: "#dde4ee", background: "#ffffff" }}>
          <div className="flex items-center gap-2.5 border-b px-5 py-4" style={{ borderColor: "#dde4ee", background: "#f8fafc" }}>
            <MessageCircle size={16} style={{ color: "#7c3aed" }} />
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: "#1a2235" }}>Ask a Follow-up Question</p>
              <p className="text-xs" style={{ color: "#94a3b8" }}>Ask anything about this scan or protocol</p>
            </div>
            <button onClick={() => setChatExpanded(true)}
              className="rounded-lg p-1.5 transition-colors hover:bg-slate-100"
              style={{ color: "#64748b" }} title="Expand chat">
              <Maximize2 size={15} />
            </button>
          </div>

          {/* Message list */}
          {chatHistory.length > 0 && (
            <div className="max-h-80 overflow-y-auto px-4 py-4 space-y-3">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
                    style={msg.role === "user"
                      ? { background: "#7c3aed", color: "#ffffff", borderBottomRightRadius: "4px" }
                      : { background: "#f1f5f9", color: "#1a2235", borderBottomLeftRadius: "4px" }}>
                    {msg.role === "assistant"
                      ? stripMarkdown(msg.content)
                          .split(/\n\n+/)
                          .filter(Boolean)
                          .map((para, pi, arr) => (
                            <p key={pi} className={pi < arr.length - 1 ? "mb-2" : ""}>{para.trim()}</p>
                          ))
                      : msg.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm"
                    style={{ background: "#f1f5f9", color: "#5a6a85", borderBottomLeftRadius: "4px" }}>
                    <Loader2 size={13} className="animate-spin" />
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}

          {/* Input */}
          <div className="border-t px-4 py-3" style={{ borderColor: "#dde4ee" }}>
            {chatHistory.length === 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {[
                  "What does this finding mean?",
                  "Should I be concerned?",
                  "What view should I get next?",
                  "Explain the measurements",
                ].map((q) => (
                  <button key={q} onClick={() => setChatInput(q)}
                    className="rounded-full border px-3 py-1 text-xs font-medium transition-all hover:bg-purple-50"
                    style={{ borderColor: "#ddd6fe", color: "#7c3aed", background: "#f5f3ff" }}>
                    {q}
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                ref={chatInputRef}
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendChatMessage()}
                onFocus={() => {
                  setTimeout(() => chatSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
                }}
                placeholder="Ask about findings, measurements, next steps..."
                className="flex-1 rounded-xl border px-4 py-2.5 outline-none transition-all"
                style={{ borderColor: "#dde4ee", background: "#f8fafc", color: "#1a2235", fontSize: "16px" }}
              />
              <button onClick={sendChatMessage} disabled={!chatInput.trim() || chatLoading}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white transition-all hover:opacity-90 disabled:opacity-40"
                style={{ background: "#7c3aed" }}>
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Error modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.4)" }}>
          <div className="w-full max-w-sm rounded-2xl border p-6 shadow-xl"
            style={{ background: "#ffffff", borderColor: "#dde4ee" }}>
            {reportSent ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <CheckCircle size={36} style={{ color: "#059669" }} />
                <p className="font-bold" style={{ color: "#1a2235" }}>Report submitted</p>
                <p className="text-center text-sm" style={{ color: "#5a6a85" }}>
                  Thank you for helping improve SonoBuddy AI.
                </p>
              </div>
            ) : (
              <>
                <h3 className="mb-1 font-bold" style={{ color: "#1a2235" }}>Report an Error</h3>
                <p className="mb-4 text-sm" style={{ color: "#5a6a85" }}>
                  Help us improve AI accuracy by flagging incorrect findings.
                </p>
                <div className="mb-3">
                  <label className="mb-1.5 block text-xs font-semibold" style={{ color: "#5a6a85" }}>
                    What seems incorrect? <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
                    style={{ borderColor: "#dde4ee", color: "#1a2235" }}>
                    <option value="">Select a reason…</option>
                    <option value="wrong_findings">Wrong or missing findings</option>
                    <option value="wrong_measurements">Incorrect measurements</option>
                    <option value="wrong_protocol">Wrong protocol detected</option>
                    <option value="poor_quality">Poor image quality assessment</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="mb-1.5 block text-xs font-semibold" style={{ color: "#5a6a85" }}>
                    Additional details (optional)
                  </label>
                  <textarea
                    value={reportNote}
                    onChange={(e) => setReportNote(e.target.value)}
                    rows={3}
                    placeholder="Describe what was incorrect…"
                    className="w-full resize-none rounded-xl border px-3 py-2.5 text-sm outline-none"
                    style={{ borderColor: "#dde4ee", color: "#1a2235" }}
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { setShowReportModal(false); setReportReason(""); setReportNote(""); }}
                    className="flex-1 rounded-xl border py-2.5 text-sm font-medium"
                    style={{ borderColor: "#dde4ee", color: "#5a6a85" }}>
                    Cancel
                  </button>
                  <button onClick={handleSubmitReport} disabled={!reportReason}
                    className="flex-1 rounded-xl py-2.5 text-sm font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: "#dc2626" }}>
                    Submit
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Export modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.4)" }}>
          <div className="w-full max-w-sm rounded-2xl border p-6 shadow-xl"
            style={{ background: "#ffffff", borderColor: "#dde4ee" }}>
            <h3 className="mb-2 font-bold" style={{ color: "#1a2235" }}>Export Report</h3>
            <p className="mb-4 text-sm" style={{ color: "#5a6a85" }}>
              Your PDF will include the annotated image, all findings, measurements, and the full clinical disclaimer.
            </p>
            <div className="mb-4 flex items-start gap-2 rounded-xl border p-3 text-xs"
              style={{ borderColor: "#fcd34d", background: "#fefce8", color: "#92400e" }}>
              <ShieldAlert size={13} className="shrink-0 mt-0.5" />
              Disclaimer included on all pages. PHI will not be stored.
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowExportModal(false)}
                className="flex-1 rounded-xl border py-2.5 text-sm font-medium"
                style={{ borderColor: "#dde4ee", color: "#5a6a85" }}>
                Cancel
              </button>
              <button onClick={handleExportPDF}
                className="flex-1 rounded-xl py-2.5 text-sm font-bold text-white"
                style={{ background: "#7c3aed" }}>
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s+/g, "")        // remove headings
    .replace(/\*\*(.+?)\*\*/g, "$1")  // remove bold
    .replace(/\*(.+?)\*/g, "$1")      // remove italic
    .replace(/^[-*+]\s+/gm, "")       // remove list markers
    .replace(/^\d+\.\s+/gm, "")       // remove numbered lists
    .replace(/`(.+?)`/g, "$1")        // remove inline code
    .trim();
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#eef3f8" }}>
        <Loader2 size={28} className="animate-spin" style={{ color: "#7c3aed" }} />
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
