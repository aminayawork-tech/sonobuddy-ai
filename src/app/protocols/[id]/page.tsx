"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Clock,
  ListOrdered,
  Lightbulb,
  Ruler,
  Search,
  Zap,
  Camera,
} from "lucide-react";
import NavBar from "@/components/NavBar";
import { CATEGORY_PILL, getProtocolById } from "@/lib/protocols";

const DIFFICULTY_COLOR: Record<string, string> = {
  Basic:        "#059669",
  Intermediate: "#d97706",
  Advanced:     "#dc2626",
};

export default function ProtocolDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const protocol = getProtocolById(id);
  if (!protocol) notFound();

  const pill = CATEGORY_PILL[protocol.category];

  return (
    <div className="min-h-screen pt-14 pb-28 md:pb-10 md:pt-16" style={{ background: "#f8fafc" }}>
      <NavBar />

      <div className="mx-auto max-w-2xl px-4 py-8">

        {/* Back */}
        <Link
          href="/protocols"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium hover:opacity-70"
          style={{ color: "#5a6a85" }}>
          <ArrowLeft size={14} /> Back to Protocols
        </Link>

        {/* Header */}
        <div className="mb-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
              style={{ background: pill.bg, color: pill.text }}>
              {protocol.category}
            </span>
            <span className="text-xs font-semibold" style={{ color: DIFFICULTY_COLOR[protocol.difficulty] }}>
              {protocol.difficulty}
            </span>
            <span className="flex items-center gap-1 text-xs" style={{ color: "#94a3b8" }}>
              <Clock size={11} /> {protocol.estimatedTime}
            </span>
          </div>
          <h1 className="mb-2 text-2xl font-extrabold" style={{ color: "#0f172a" }}>
            {protocol.name}
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "#5a6a85" }}>
            <span className="font-semibold" style={{ color: "#0f172a" }}>Indication: </span>
            {protocol.indication}
          </p>
        </div>

        {/* How to Perform */}
        {protocol.steps && protocol.steps.length > 0 && (
          <div className="mb-5 rounded-2xl border p-5" style={{ background: "#ffffff", borderColor: "#dde4ee" }}>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: "#eff6ff" }}>
                <ListOrdered size={15} style={{ color: "#2563eb" }} />
              </div>
              <h2 className="font-semibold" style={{ color: "#0f172a" }}>How to Perform</h2>
            </div>
            <ol className="space-y-3">
              {protocol.steps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ background: "#2563eb" }}>
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>{step}</p>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Measurement Guide */}
        {protocol.measurements && protocol.measurements.length > 0 && (
          <div className="mb-5 rounded-2xl border p-5" style={{ background: "#ffffff", borderColor: "#dde4ee" }}>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: "#fdf4ff" }}>
                <Ruler size={15} style={{ color: "#9333ea" }} />
              </div>
              <h2 className="font-semibold" style={{ color: "#0f172a" }}>Measurement Guide</h2>
            </div>
            <div className="space-y-4">
              {protocol.measurements.map((m, i) => (
                <div key={i} className={i < protocol.measurements!.length - 1 ? "border-b pb-4" : ""} style={{ borderColor: "#f1f5f9" }}>
                  <p className="mb-1.5 text-sm font-semibold" style={{ color: "#1a2235" }}>{m.structure}</p>
                  <div className="space-y-1.5">
                    <div className="flex gap-2 text-xs">
                      <span className="shrink-0 font-semibold" style={{ color: "#9333ea" }}>Where:</span>
                      <span style={{ color: "#374151" }}>{m.landmark}</span>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <span className="shrink-0 font-semibold" style={{ color: "#059669" }}>Normal:</span>
                      <span style={{ color: "#374151" }}>{m.normal}</span>
                    </div>
                    {m.technique && (
                      <div className="flex gap-2 text-xs">
                        <span className="shrink-0 font-semibold" style={{ color: "#d97706" }}>Tip:</span>
                        <span style={{ color: "#374151" }}>{m.technique}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Views to Obtain */}
        <div className="mb-5 rounded-2xl border p-5" style={{ background: "#ffffff", borderColor: "#dde4ee" }}>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: "#f0fdf4" }}>
              <Camera size={15} style={{ color: "#059669" }} />
            </div>
            <h2 className="font-semibold" style={{ color: "#0f172a" }}>Views to Obtain</h2>
          </div>
          <ul className="space-y-2">
            {protocol.views.map((view, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: "#374151" }}>
                <CheckCircle size={14} className="mt-0.5 shrink-0" style={{ color: "#059669" }} />
                {view}
              </li>
            ))}
          </ul>
        </div>

        {/* What to Look For */}
        <div className="mb-5 rounded-2xl border p-5" style={{ background: "#ffffff", borderColor: "#dde4ee" }}>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: "#eff6ff" }}>
              <Search size={15} style={{ color: "#2563eb" }} />
            </div>
            <h2 className="font-semibold" style={{ color: "#0f172a" }}>What to Look For</h2>
          </div>
          <ul className="space-y-2">
            {protocol.keyFindings.map((finding, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: "#374151" }}>
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "#2563eb" }} />
                {finding}
              </li>
            ))}
          </ul>
        </div>

        {/* Common Mistakes */}
        <div className="mb-5 rounded-2xl border p-5" style={{ background: "#fffbeb", borderColor: "#fcd34d" }}>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: "#fef9c3" }}>
              <AlertTriangle size={15} style={{ color: "#d97706" }} />
            </div>
            <h2 className="font-semibold" style={{ color: "#0f172a" }}>Common Mistakes</h2>
          </div>
          <ul className="space-y-2">
            {protocol.commonPitfalls.map((pitfall, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: "#374151" }}>
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "#d97706" }} />
                {pitfall}
              </li>
            ))}
          </ul>
        </div>

        {/* Pro Tip */}
        <div className="mb-8 rounded-2xl border p-5" style={{ background: "#f0fdf4", borderColor: "#6ee7b7" }}>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: "#d1fae5" }}>
              <Lightbulb size={15} style={{ color: "#059669" }} />
            </div>
            <h2 className="font-semibold" style={{ color: "#0f172a" }}>Pro Tip</h2>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>{protocol.tip}</p>
        </div>

        {/* AI Detects */}
        {protocol.anomaliesDetected.length > 0 && (
          <div className="mb-8 rounded-2xl border p-5" style={{ background: "#ffffff", borderColor: "#dde4ee" }}>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: "#eff6ff" }}>
                <Zap size={15} style={{ color: "#2563eb" }} />
              </div>
              <h2 className="font-semibold" style={{ color: "#0f172a" }}>AI Detects</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {protocol.anomaliesDetected.map((a, i) => (
                <span key={i} className="rounded-full border px-2.5 py-1 text-xs font-medium"
                  style={{ borderColor: "#dde4ee", background: "#f8fafc", color: "#5a6a85" }}>
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <Link
          href={`/scan?protocol=${protocol.id}`}
          className="flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 text-lg font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-95"
          style={{ background: "#2563eb" }}>
          <Camera size={20} />
          Start Scan — {protocol.shortName}
        </Link>
        <p className="mt-2 text-center text-xs" style={{ color: "#94a3b8" }}>
          Protocol pre-selected · AI will use this context for analysis
        </p>

      </div>
    </div>
  );
}
