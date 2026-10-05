"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  Camera,
  CheckCircle,
  ChevronDown,
  Edit3,
  ImageIcon,
  Info,
  Loader2,
  Search,
  Upload,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import AuthModal from "@/components/AuthModal";
import UpgradeModal from "@/components/UpgradeModal";
import { useAuth } from "@/components/AuthProvider";
import { PROTOCOLS, getProtocolById } from "@/lib/protocols";
import { FREE_SCAN_LIMIT } from "@/lib/plans";

const DEFAULT_PROTOCOL_ID = "efast";

// Steps advance until HOLD_AT, then wait for real AI response
const ANALYSIS_STEPS = [
  "Assessing image quality...",
  "Identifying anatomical structures...",
  "Running AI analysis...",
  "Calculating measurements...",
  "Generating findings summary...",
];
const HOLD_AT = ANALYSIS_STEPS.length - 2; // stop at index 3, reserve last for completion

// ── Protocol bottom-sheet ─────────────────────────────────────────────
function ProtocolSheet({
  selected,
  onSelect,
  onClose,
}: {
  selected: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const sorted = [...PROTOCOLS].sort((a, b) => a.name.localeCompare(b.name));
  const filtered = query.trim()
    ? sorted.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.indication.toLowerCase().includes(query.toLowerCase()),
      )
    : sorted;

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    /* Backdrop — mobile: align bottom; desktop: center */
    <div
      className="fixed inset-0 z-[60] flex flex-col justify-end md:items-center md:justify-center md:px-4"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>

      {/* Sheet — mobile: full-width bottom sheet; desktop: compact centered dialog */}
      <div
        className="flex w-full flex-col overflow-x-hidden
          rounded-t-3xl
          md:rounded-2xl md:max-w-md"
        style={{
          background: "#ffffff",
          maxHeight: "88vh",
          boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
          animation: "slideUp 0.22s cubic-bezier(0.32,0.72,0,1)",
        }}>

        {/* Handle (mobile only) */}
        <div className="md:hidden flex justify-center pt-3">
          <div className="h-1 w-10 rounded-full" style={{ background: "#e2e8f0" }} />
        </div>

        {/* Header */}
        <div className="flex-shrink-0 px-5 pt-4 pb-3">
          <div className="flex items-center justify-between mb-3">
            <p className="font-bold" style={{ color: "#0f172a" }}>Choose Protocol</p>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 transition-colors hover:bg-slate-100"
              style={{ color: "#94a3b8" }}>
              <X size={16} />
            </button>
          </div>
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#94a3b8" }} />
            <input
              type="text"
              placeholder="Search protocols..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border py-2.5 pl-9 pr-4 outline-none focus:border-blue-300"
              style={{ borderColor: "#e2e8f0", color: "#0f172a", background: "#f8fafc", fontSize: "16px" }}
            />
          </div>
        </div>

        {/* Clear selection */}
        {selected && (
          <div className="flex-shrink-0 px-5 pb-2">
            <button
              onClick={() => { onSelect(""); onClose(); }}
              className="flex w-full items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium"
              style={{ borderColor: "#fca5a5", background: "#fef2f2", color: "#dc2626" }}>
              <X size={13} /> Clear selection (AI auto-detects)
            </button>
          </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-3" style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))", WebkitOverflowScrolling: "touch" }}>
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm" style={{ color: "#94a3b8" }}>No protocols match &ldquo;{query}&rdquo;</p>
          ) : (
            filtered.map((p) => {
              const active = p.id === selected;
              return (
                <button
                  key={p.id}
                  onClick={() => { onSelect(p.id); onClose(); }}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left transition-colors hover:bg-slate-50"
                  style={{ background: active ? "#eff6ff" : undefined }}>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <p className="truncate text-sm font-semibold" style={{ color: active ? "#2563eb" : "#0f172a" }}>
                      {p.name}
                    </p>
                    <p className="truncate text-xs mt-0.5" style={{ color: "#94a3b8" }}>
                      {p.indication}
                    </p>
                  </div>
                  {active && <CheckCircle size={16} style={{ color: "#2563eb", flexShrink: 0 }} />}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main scan page ────────────────────────────────────────────────────
function ScanContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, profile, scansLeft, refreshProfile } = useAuth();

  const urlProtocolId = searchParams.get("protocol") ?? "";
  const [selectedProtocolId, setSelectedProtocolId] = useState(urlProtocolId);
  const [protocolSheetOpen,  setProtocolSheetOpen]  = useState(false);

  const [image,       setImage]       = useState<string | null>(null);
  const [isDragging,  setIsDragging]  = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep,setAnalysisStep]= useState(0);
  const [analysisError,setAnalysisError] = useState<string | null>(null);

  const [showAuthModal,    setShowAuthModal]    = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeReason,    setUpgradeReason]    = useState<"limit" | "generic">("generic");

  const fileInputRef   = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const effectiveProtocolId = selectedProtocolId || DEFAULT_PROTOCOL_ID;
  const selectedProtocol    = getProtocolById(effectiveProtocolId);

  useEffect(() => {
    const param      = searchParams.get("upgrade");
    const newAccount = searchParams.get("new_account");
    if (param === "success") {
      refreshProfile();
      if (newAccount === "1") {
        // New user paid without an account — show email setup prompt
        router.replace("/scan?welcome=1");
      } else {
        router.replace("/scan");
      }
    } else if (param === "cancelled") {
      router.replace("/scan");
    }
  }, [searchParams, refreshProfile, router]);

  // Receive images injected by the native iOS WKWebView image picker
  useEffect(() => {
    function onNativeImage(e: Event) {
      const dataUrl = (e as CustomEvent<string>).detail;
      if (dataUrl) setImage(dataUrl);
    }
    window.addEventListener("native-image-selected", onNativeImage);
    return () => window.removeEventListener("native-image-selected", onNativeImage);
  }, []);

  // Use native iOS message handler if available (bypasses action sheet popup),
  // otherwise fall back to the hidden file input
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nativeMH = typeof window !== "undefined" ? (window as any).webkit?.messageHandlers : null;
  function openNativeCamera() {
    if (nativeMH?.openCamera) { nativeMH.openCamera.postMessage(null); }
    else { cameraInputRef.current?.click(); }
  }
  function openNativeGallery() {
    if (nativeMH?.openGallery) { nativeMH.openGallery.postMessage(null); }
    else { fileInputRef.current?.click(); }
  }

  function handleFile(file: File) {
    // iOS Safari reports empty MIME type for HEIC/iCloud gallery photos — allow those through
    if (file.type && !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) setImage(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function compressImage(src: string, maxPx = 1024, quality = 0.82) {
    return new Promise<{ dataUrl: string; base64: string; mediaType: string }>((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        try {
          const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
          const w = Math.round(img.width * scale);
          const h = Math.round(img.height * scale);
          const canvas = document.createElement("canvas");
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (!ctx) { reject(new Error("canvas")); return; }
          ctx.drawImage(img, 0, 0, w, h);
          // Redact top 13% — covers machine overlay (patient name/DOB area)
          ctx.fillStyle = "#000000";
          ctx.fillRect(0, 0, w, Math.round(h * 0.13));
          const compressed = canvas.toDataURL("image/jpeg", quality);
          resolve({ dataUrl: compressed, base64: compressed.split(",")[1], mediaType: "image/jpeg" });
        } catch (e) { reject(e); }
      };
      img.onerror = () => reject(new Error("load"));
      img.src = src;
    });
  }

  const runAnalysis = useCallback(async () => {
    if (!user) { setShowAuthModal(true); return; }

    setIsAnalyzing(true);
    setAnalysisStep(0);

    let imageBase64: string | null = null;
    let mediaType: string | null = null;
    let compressedDataUrl: string | null = null;

    if (image) {
      try {
        const c = await compressImage(image);
        imageBase64 = c.base64; mediaType = c.mediaType; compressedDataUrl = c.dataUrl;
      } catch {
        const match = image.match(/^data:([^;]+);base64,(.+)$/);
        if (match) { mediaType = match[1]; imageBase64 = match[2]; compressedDataUrl = image; }
      }
    }

    // ── Advance steps every 1.8s but hold at HOLD_AT — last step reserved for real completion ──
    const stepInterval = setInterval(() => {
      setAnalysisStep((prev) => {
        if (prev < HOLD_AT) return prev + 1;
        clearInterval(stepInterval);
        return prev;
      });
    }, 1800);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64, mediaType, protocolId: effectiveProtocolId }),
      });

      clearInterval(stepInterval);

      if (res.status === 401) { setIsAnalyzing(false); setShowAuthModal(true); return; }
      if (res.status === 429) {
        setIsAnalyzing(false); setUpgradeReason("limit"); setShowUpgradeModal(true); return;
      }
      if (!res.ok) {
        const data = await res.json();
        const msg = data.error ?? "Analysis failed";
        const isMissingKey = /anthropic_api_key.*(missing|empty)|x-api-key/i.test(msg);
        throw new Error(
          isMissingKey
            ? "API key error: Make sure ANTHROPIC_API_KEY is set in your environment variables."
            : msg,
        );
      }


      const analysis = await res.json();

      // ── Flash remaining steps quickly then navigate ──
      const stepsLeft = ANALYSIS_STEPS.length - 1 - HOLD_AT;
      for (let i = 1; i <= stepsLeft; i++) {
        await new Promise((r) => setTimeout(r, 180));
        setAnalysisStep(HOLD_AT + i);
      }
      await new Promise((r) => setTimeout(r, 300));

      sessionStorage.setItem("lastAnalysis", JSON.stringify(analysis));
      if (compressedDataUrl) sessionStorage.setItem("lastImage", compressedDataUrl);
      else sessionStorage.removeItem("lastImage");

      // Fire-and-forget: save AI result to history (no image, no PHI)
      fetch("/api/scans/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(analysis),
      });

      refreshProfile();
      router.push(`/results?protocol=${effectiveProtocolId}`);
    } catch (err) {
      clearInterval(stepInterval);
      setIsAnalyzing(false);
      setAnalysisError(err instanceof Error ? err.message : "Analysis failed. Please try again.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveProtocolId, router, image, user]);

  const isFreeAtLimit = profile?.tier === "free" && profile.scans_used_this_month >= FREE_SCAN_LIMIT;

  return (
    <div className="min-h-screen pt-14 pb-28 md:pb-10 md:pt-16" style={{ background: "#f8fafc" }}>
      <NavBar />

      <div className="mx-auto max-w-lg px-4 py-8">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-extrabold" style={{ color: "#0f172a" }}>New Scan</h1>
          <p className="mt-1 text-sm" style={{ color: "#64748b" }}>
            Upload your ultrasound image — AI analyzes it instantly
          </p>
        </div>

        {/* Scan counter badge */}
        {user && profile && (
          <div className="mb-4 flex justify-center">
            {profile.tier === "free" ? (
              <button
                onClick={() => { setUpgradeReason("generic"); setShowUpgradeModal(true); }}
                className="flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all hover:bg-slate-50"
                style={{
                  borderColor: scansLeft <= 1 ? "#fca5a5" : "#dde4ee",
                  background:  scansLeft <= 1 ? "#fef2f2" : "#ffffff",
                  color:       scansLeft <= 1 ? "#dc2626" : "#5a6a85",
                }}>
                <span className="font-bold" style={{ color: scansLeft <= 1 ? "#dc2626" : "#2563eb" }}>
                  {scansLeft}/{FREE_SCAN_LIMIT}
                </span>
                free scans left this month
                {scansLeft <= 1 && " · Upgrade"}
              </button>
            ) : (
              <span className="flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium"
                style={{ borderColor: "#bfdbfe", background: "#eff6ff", color: "#1d4ed8" }}>
                <Zap size={11} />
                {profile.tier === "clinic" ? "Clinic" : "Pro"} — unlimited scans
              </span>
            )}
          </div>
        )}

        {/* New-account welcome banner (paid without being signed in) */}
        {searchParams.get("welcome") === "1" && (
          <div className="mb-5 rounded-2xl border p-4"
            style={{ borderColor: "#86efac", background: "#f0fdf4" }}>
            <p className="text-sm font-bold" style={{ color: "#15803d" }}>Payment successful!</p>
            <p className="mt-1 text-xs" style={{ color: "#166534" }}>
              Check your email — we&apos;ve sent you a link to set up your password and activate your account.
            </p>
          </div>
        )}

        {/* Limit banner */}
        {isFreeAtLimit && (
          <div className="mb-5 rounded-2xl border p-4"
            style={{ borderColor: "#fca5a5", background: "#fef2f2" }}>
            <p className="text-sm font-bold" style={{ color: "#dc2626" }}>Monthly limit reached</p>
            <p className="mt-1 text-xs" style={{ color: "#dc2626", opacity: 0.85 }}>
              You&apos;ve used your {FREE_SCAN_LIMIT} free scans.{" "}
              <button onClick={() => { setUpgradeReason("limit"); setShowUpgradeModal(true); }}
                className="font-bold underline">
                Upgrade to Pro
              </button>{" "}
              for unlimited scans.
            </p>
          </div>
        )}

        {/* ── Upload Zone ── */}
        <div className="mb-5 overflow-hidden rounded-2xl border shadow-sm"
          style={{ background: "#ffffff", borderColor: "#e2e8f0" }}>
          {image ? (
            <div>
              <div className="relative" style={{ background: "#000" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt="Uploaded ultrasound" className="w-full object-contain"
                  style={{ maxHeight: 320 }} />
                <button onClick={() => setImage(null)}
                  className="absolute right-3 top-3 rounded-full p-1.5 text-white"
                  style={{ background: "rgba(0,0,0,0.6)" }}>
                  <X size={14} />
                </button>
                <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-white"
                  style={{ background: "rgba(5,150,105,0.9)" }}>
                  <CheckCircle size={11} /> PHI redacted
                </div>
                {selectedProtocol && (
                  <div className="absolute bottom-0 left-0 right-0 px-4 py-3"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent)" }}>
                    <p className="flex items-center gap-1.5 text-xs text-white">
                      <Info size={11} /> {selectedProtocol.tip}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex gap-2 p-3">
                <button onClick={() => setImage(null)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium hover:bg-slate-50"
                  style={{ borderColor: "#e2e8f0", color: "#64748b" }}>
                  <Edit3 size={13} /> Retake
                </button>
                <button onClick={() => openNativeGallery()}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium hover:bg-slate-50"
                  style={{ borderColor: "#e2e8f0", color: "#64748b" }}>
                  <Upload size={13} /> Different image
                </button>
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => openNativeGallery()}
              className="cursor-pointer p-10 text-center transition-all select-none"
              style={{
                background: isDragging ? "#eff6ff" : "#ffffff",
                border: isDragging ? "2px dashed #2563eb" : "2px dashed #cbd5e1",
                borderRadius: "1rem",
              }}>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{ background: isDragging ? "#dbeafe" : "#f1f5f9" }}>
                <ImageIcon size={28} style={{ color: isDragging ? "#2563eb" : "#94a3b8" }} />
              </div>
              <p className="mb-1 text-base font-semibold" style={{ color: "#0f172a" }}>
                Tap to photograph your ultrasound
              </p>
              <p className="mb-5 text-sm" style={{ color: "#94a3b8" }}>or drag & drop an image here</p>
              <div className="flex justify-center gap-3">
                <button onClick={(e) => { e.stopPropagation(); openNativeCamera(); }}
                  className="flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-medium hover:bg-slate-100"
                  style={{ borderColor: "#e2e8f0", color: "#64748b", background: "#f8fafc" }}>
                  <Camera size={13} /> Camera
                </button>
                <button onClick={(e) => { e.stopPropagation(); openNativeGallery(); }}
                  className="flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-medium hover:bg-slate-100"
                  style={{ borderColor: "#e2e8f0", color: "#64748b", background: "#f8fafc" }}>
                  <Upload size={13} /> Gallery
                </button>
              </div>
            </div>
          )}
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) { handleFile(f); e.target.value = ""; } }} />
        <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) { handleFile(f); e.target.value = ""; } }} />

        {/* ── Protocol selector — opens bottom sheet ── */}
        <button
          onClick={() => setProtocolSheetOpen(true)}
          className="mb-5 flex w-full items-center justify-between overflow-hidden rounded-2xl border px-5 py-4 text-left shadow-sm transition-colors hover:bg-slate-50"
          style={{ background: "#ffffff", borderColor: "#e2e8f0" }}>
          <div className="min-w-0">
            <p className="text-sm font-semibold" style={{ color: "#0f172a" }}>
              {selectedProtocolId ? getProtocolById(selectedProtocolId)?.name : "Protocol (optional)"}
            </p>
            <p className="mt-0.5 text-xs truncate" style={{ color: "#94a3b8" }}>
              {selectedProtocolId
                ? getProtocolById(selectedProtocolId)?.indication
                : "AI auto-detects — or choose for precision"}
            </p>
          </div>
          <ChevronDown size={16} className="ml-3 flex-shrink-0" style={{ color: "#94a3b8" }} />
        </button>

        <DisclaimerBanner compact />

        {/* ── Analyze / Loading ── */}
        <div className="mt-5">
          {isAnalyzing ? (
            <div className="overflow-hidden rounded-2xl border"
              style={{ borderColor: "#bfdbfe", background: "#eff6ff" }}>
              {image && (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt="Analyzing..." className="w-full object-contain"
                    style={{ maxHeight: 280, background: "#000" }} />
                  <div className="absolute inset-0 flex items-center justify-center"
                    style={{ background: "rgba(10,16,32,0.55)" }}>
                    <div className="rounded-2xl px-6 py-4 text-center"
                      style={{ background: "rgba(0,0,0,0.7)", border: "1px solid rgba(37,99,235,0.4)" }}>
                      <Loader2 size={24} className="mx-auto mb-2 animate-spin" style={{ color: "#60a5fa" }} />
                      <p className="text-sm font-semibold text-white">
                        {analysisStep < ANALYSIS_STEPS.length
                          ? ANALYSIS_STEPS[analysisStep]
                          : "Almost done…"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className="px-6 py-5">
                {!image && (
                  <>
                    <Loader2 size={28} className="mx-auto mb-2 animate-spin" style={{ color: "#2563eb" }} />
                    <p className="text-center font-semibold" style={{ color: "#0f172a" }}>
                      {analysisStep < ANALYSIS_STEPS.length ? ANALYSIS_STEPS[analysisStep] : "Almost done…"}
                    </p>
                  </>
                )}
                {/* Progress dots — last dot pulses until AI responds */}
                <div className="mt-3 flex justify-center gap-1.5">
                  {ANALYSIS_STEPS.map((_, i) => {
                    const done    = i < analysisStep;
                    const active  = i === analysisStep;
                    const pending = i > analysisStep;
                    return (
                      <div key={i}
                        className={`h-1.5 rounded-full transition-all duration-500 ${active ? "animate-pulse" : ""}`}
                        style={{
                          width:      done || active ? "2rem" : "0.5rem",
                          background: done ? "#2563eb" : active ? "#60a5fa" : pending ? "#dde4ee" : "#dde4ee",
                          opacity:    pending ? 0.5 : 1,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <>
              {analysisError && (
                <div className="mb-4 rounded-2xl border p-4 text-sm"
                  style={{ borderColor: "#fca5a5", background: "#fef2f2", color: "#dc2626" }}>
                  <div className="flex items-start gap-2">
                    <AlertCircle size={15} className="mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="font-bold">
                        {analysisError.includes("high demand") ? "AI is busy" : "Analysis failed"}
                      </p>
                      <p className="mt-0.5 leading-relaxed opacity-90">{analysisError}</p>
                      {analysisError.includes("high demand") && (
                        <button
                          onClick={() => { setAnalysisError(null); runAnalysis(); }}
                          className="mt-2 rounded-lg px-3 py-1.5 text-xs font-bold text-white"
                          style={{ background: "#dc2626" }}>
                          Try again
                        </button>
                      )}
                      {analysisError.includes("API key") && (
                        <p className="mt-2 text-xs font-medium" style={{ color: "#991b1b" }}>
                          → Add <code className="rounded px-1" style={{ background: "#fee2e2" }}>
                            ANTHROPIC_API_KEY
                          </code> to your environment variables.
                        </p>
                      )}
                    </div>
                    <button onClick={() => setAnalysisError(null)} style={{ color: "#dc2626", flexShrink: 0 }}>
                      <X size={14} />
                    </button>
                  </div>
                </div>
              )}

              {!user ? (
                <div className="space-y-3">
                  <button onClick={() => setShowAuthModal(true)}
                    className="flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 text-lg font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-95"
                    style={{ background: "#2563eb" }}>
                    <Zap size={19} /> Sign in to Start Scanning
                  </button>
                  <p className="text-center text-xs" style={{ color: "#94a3b8" }}>
                    Free account · 5 scans/month · No credit card
                  </p>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => { setAnalysisError(null); runAnalysis(); }}
                    disabled={!image || isFreeAtLimit}
                    className="flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 text-lg font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                    style={{ background: "#2563eb" }}>
                    <Zap size={19} />
                    {isFreeAtLimit ? "Upgrade to Continue" : image ? "Analyze Now" : "Upload an image to start"}
                  </button>

                  {isFreeAtLimit && (
                    <button onClick={() => { setUpgradeReason("limit"); setShowUpgradeModal(true); }}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border py-3 text-sm font-bold"
                      style={{ borderColor: "#2563eb", color: "#2563eb" }}>
                      View upgrade plans →
                    </button>
                  )}

                  {!image && !isFreeAtLimit && (
                    <button onClick={() => { setAnalysisError(null); runAnalysis(); }}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border py-3 text-sm font-medium hover:bg-white"
                      style={{ borderColor: "#e2e8f0", color: "#64748b" }}>
                      <CheckCircle size={14} style={{ color: "#2563eb" }} />
                      Try a demo analysis without uploading
                    </button>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Protocol bottom sheet */}
      {protocolSheetOpen && (
        <ProtocolSheet
          selected={selectedProtocolId}
          onSelect={setSelectedProtocolId}
          onClose={() => setProtocolSheetOpen(false)}
        />
      )}

      {/* Auth modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          reason={!user ? "Sign in to start scanning — free account, 5 scans per month." : undefined}
        />
      )}

      {/* Upgrade modal */}
      {showUpgradeModal && (
        <UpgradeModal
          onClose={() => setShowUpgradeModal(false)}
          limitReached={upgradeReason === "limit"}
        />
      )}
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#f8fafc" }}>
        <Loader2 size={28} className="animate-spin" style={{ color: "#2563eb" }} />
      </div>
    }>
      <ScanContent />
    </Suspense>
  );
}
