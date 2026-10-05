"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AuthErrorContent() {
  const params = useSearchParams();
  const type = params.get("type"); // "recovery" if we add it later

  const isReset = type === "recovery";

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ background: "#eef3f8" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8 shadow-xl text-center"
        style={{ background: "#fff" }}
      >
        {/* Logo */}
        <div className="mb-6 select-none">
          <span className="text-xl font-extrabold tracking-tight" style={{ color: "#0f172a" }}>Sono</span><span className="text-xl font-extrabold tracking-tight" style={{ color: "#2563eb" }}>Pilot</span>
        </div>

        <div
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full text-2xl"
          style={{ background: "#fef2f2" }}
        >
          🔗
        </div>

        <h1 className="text-lg font-bold mb-2" style={{ color: "#1a2235" }}>
          {isReset ? "Reset link expired" : "Link expired or invalid"}
        </h1>

        <p className="text-sm mb-2" style={{ color: "#64748b" }}>
          {isReset
            ? "This password reset link has already been used or has expired."
            : "This confirmation link is no longer valid. It may have already been used or expired."}
        </p>

        <p className="text-sm mb-6" style={{ color: "#94a3b8" }}>
          Links expire after 1 hour and can only be clicked once.
        </p>

        <div className="flex flex-col gap-2">
          <a
            href="/?auth=forgot"
            className="w-full rounded-xl py-2.5 text-sm font-bold text-white inline-block"
            style={{ background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)" }}
          >
            Request a new reset link
          </a>
          <a
            href="/"
            className="w-full rounded-xl py-2.5 text-sm font-medium inline-block"
            style={{ color: "#64748b" }}
          >
            Back to home
          </a>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense>
      <AuthErrorContent />
    </Suspense>
  );
}
