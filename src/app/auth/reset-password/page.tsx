"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/"), 3000);
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ background: "#eef3f8" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8 shadow-xl"
        style={{ background: "#fff" }}
      >
        {/* Logo */}
        <div className="mb-6 select-none">
          <span className="text-xl font-extrabold tracking-tight" style={{ color: "#0f172a" }}>Sono</span><span className="text-xl font-extrabold tracking-tight" style={{ color: "#7c3aed" }}>Pilot</span>
        </div>

        {done ? (
          <div className="text-center py-4">
            <CheckCircle size={44} className="mx-auto mb-3" style={{ color: "#10b981" }} />
            <h2 className="text-lg font-semibold mb-1" style={{ color: "#1a2235" }}>
              Password updated!
            </h2>
            <p className="text-sm" style={{ color: "#64748b" }}>
              Redirecting you to the app…
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-1" style={{ color: "#1a2235" }}>
              Set new password
            </h2>
            <p className="text-sm mb-6" style={{ color: "#64748b" }}>
              Choose a strong password for your SonoBuddy AI account.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New password */}
              <div>
                <label className="mb-1 block text-xs font-medium" style={{ color: "#475569" }}>
                  New password
                </label>
                <div className="relative">
                  <Lock
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "#94a3b8" }}
                  />
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Min. 8 characters"
                    className="w-full rounded-lg border py-2.5 pl-9 pr-10 text-sm outline-none focus:ring-2"
                    style={{
                      borderColor: "#e2e8f0",
                      background: "#f8fafc",
                      color: "#1a2235",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: "#94a3b8" }}
                  >
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label className="mb-1 block text-xs font-medium" style={{ color: "#475569" }}>
                  Confirm password
                </label>
                <div className="relative">
                  <Lock
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "#94a3b8" }}
                  />
                  <input
                    type={showPw ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    placeholder="Re-enter password"
                    className="w-full rounded-lg border py-2.5 pl-9 pr-4 text-sm outline-none focus:ring-2"
                    style={{
                      borderColor: "#e2e8f0",
                      background: "#f8fafc",
                      color: "#1a2235",
                    }}
                  />
                </div>
              </div>

              {error && (
                <p className="rounded-lg px-3 py-2 text-xs" style={{ background: "#fef2f2", color: "#dc2626" }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #8b5cf6 100%)" }}
              >
                {loading ? "Updating…" : "Update password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
