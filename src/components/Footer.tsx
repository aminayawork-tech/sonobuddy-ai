"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Footer() {
  const pathname = usePathname();

  // Home is the app's main screen, not a marketing page — Privacy/Terms
  // are already reachable from the hamburger menu, so skip the footer here.
  if (pathname === "/") return null;

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
