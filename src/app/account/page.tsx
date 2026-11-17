"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard, ImageIcon, Mail, Trash2, UserRound } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { clearScanImages, countScanImages, keepImagesEnabled, setKeepImagesEnabled } from "@/lib/scanImages";
import { isAndroidApp } from "@/lib/platform";

export default function AccountPage() {
  const { user, profile, signOut } = useAuth();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [keepImages, setKeepImages] = useState(true);
  const [imageCount, setImageCount] = useState(0);
  const [android, setAndroid] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setKeepImages(keepImagesEnabled());
    setAndroid(isAndroidApp());
    countScanImages().then(setImageCount);
  }, []);

  function toggleKeepImages() {
    const next = !keepImages;
    setKeepImages(next);
    setKeepImagesEnabled(next);
  }

  async function handleClearImages() {
    await clearScanImages();
    setImageCount(0);
  }

  // Required by App Store 5.1.1(v) / Google Play: in-app account deletion.
  async function handleDeleteAccount() {
    setDeleting(true);
    setDeleteError(null);
    const res = await fetch("/api/account/delete", { method: "POST" });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setDeleteError(body.error ?? "Could not delete account. Please try again.");
      setDeleting(false);
      return;
    }
    await clearScanImages();
    await signOut();
    window.location.href = "/";
  }

  const tier = profile?.tier ?? "free";
  const rows = [
    { icon: UserRound, label: "Name", value: profile?.full_name || "—" },
    { icon: Mail, label: "Email", value: user?.email ?? "—" },
    { icon: CreditCard, label: "Plan", value: tier.charAt(0).toUpperCase() + tier.slice(1) },
  ];

  return (
    <div className="min-h-screen pb-28" style={{ background: "#eef3f8" }}>
      <div className="mx-auto max-w-lg px-4 pt-8">
        <Link href="/app" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: "#5a6a85" }}>
          <ArrowLeft size={14} /> Home
        </Link>

        <div className="mb-6 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "linear-gradient(135deg, #8b5cf6, #6d28d9)" }}>
            <UserRound size={18} className="text-white" />
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "#0f172a" }}>Account</h1>
        </div>

        <div className="overflow-hidden rounded-2xl" style={{ background: "#ffffff", boxShadow: "0 1px 3px rgba(15,23,42,0.06)" }}>
          {rows.map(({ icon: Icon, label, value }, i) => (
            <div key={label} className="flex items-center gap-3.5 px-4 py-4" style={i > 0 ? { borderTop: "1px solid #f1f5f9" } : undefined}>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: "#f5f3ff" }}>
                <Icon size={17} style={{ color: "#7c3aed" }} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs" style={{ color: "#94a3b8" }}>{label}</p>
                <p className="truncate text-sm font-semibold" style={{ color: "#0f172a" }}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 px-1 text-xs" style={{ color: "#94a3b8" }}>
          {android
            ? "Subscriptions are managed in Google Play → Payments & subscriptions."
            : "Subscriptions are managed in your Apple ID settings."}
        </p>

        <p className="mt-7 mb-2 px-1 text-xs font-semibold tracking-widest" style={{ color: "#94a3b8" }}>SCAN IMAGES</p>
        <div className="overflow-hidden rounded-2xl" style={{ background: "#ffffff", boxShadow: "0 1px 3px rgba(15,23,42,0.06)" }}>
          <button onClick={toggleKeepImages} className="flex w-full items-center gap-3.5 px-4 py-4 text-left">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: "#f5f3ff" }}>
              <ImageIcon size={17} style={{ color: "#7c3aed" }} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold" style={{ color: "#0f172a" }}>Keep scan images on this device</span>
              <span className="block text-xs" style={{ color: "#94a3b8" }}>Shown in History. Never uploaded to our servers.</span>
            </span>
            <span role="switch" aria-checked={keepImages} className="relative h-7 w-12 shrink-0 rounded-full transition-colors"
              style={{ background: keepImages ? "#7c3aed" : "#cbd5e1" }}>
              <span className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all" style={{ left: keepImages ? 22 : 2 }} />
            </span>
          </button>
          {imageCount > 0 && (
            <button onClick={handleClearImages} className="w-full px-4 py-3.5 text-left text-sm font-semibold"
              style={{ borderTop: "1px solid #f1f5f9", color: "#7c3aed" }}>
              Remove {imageCount} saved image{imageCount === 1 ? "" : "s"} from this device
            </button>
          )}
        </div>

        <button onClick={() => setConfirmDelete(true)}
          className="mx-auto mt-16 block text-xs underline" style={{ color: "#94a3b8" }}>
          Delete account
        </button>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center px-6" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="w-full max-w-sm rounded-2xl p-6" style={{ background: "#ffffff" }}>
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full" style={{ background: "#fef2f2" }}>
              <Trash2 size={20} style={{ color: "#dc2626" }} />
            </div>
            <h2 className="text-center text-lg font-bold" style={{ color: "#0f172a" }}>Delete your account?</h2>
            <p className="mt-2 text-center text-sm" style={{ color: "#5a6a85" }}>
              This permanently deletes your account and all scan history. It can&apos;t be undone.
              An active App Store subscription must be canceled separately in your Apple ID settings.
            </p>
            {deleteError && (
              <p className="mt-3 rounded-lg px-3 py-2 text-xs" style={{ background: "#fef2f2", color: "#dc2626" }}>{deleteError}</p>
            )}
            <button onClick={handleDeleteAccount} disabled={deleting}
              className="mt-5 w-full rounded-xl py-3 text-sm font-bold text-white disabled:opacity-60"
              style={{ background: "#dc2626" }}>
              {deleting ? "Deleting…" : "Delete Account"}
            </button>
            <button onClick={() => setConfirmDelete(false)} disabled={deleting}
              className="mt-2 w-full rounded-xl py-3 text-sm font-semibold" style={{ color: "#5a6a85" }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
