"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-12 py-6 px-4 border-t text-center text-xs" style={{ borderColor: "#e2e8f0", color: "#64748b" }}>
      <div className="flex justify-center gap-4 flex-wrap mb-3">
        <Link href="/privacy" className="hover:underline" style={{ color: "#7c3aed" }}>
          Privacy Policy
        </Link>
        <span>•</span>
        <Link href="/terms" className="hover:underline" style={{ color: "#7c3aed" }}>
          Terms of Use
        </Link>
      </div>
      <p>© {new Date().getFullYear()} SonoBuddy AI. All rights reserved.</p>
    </footer>
  );
}
