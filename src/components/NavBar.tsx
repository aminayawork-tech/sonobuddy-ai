"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Camera, Home, Library, LogIn, Menu } from "lucide-react";
import { useAuth } from "./AuthProvider";
import UserMenu from "./UserMenu";
import AuthModal from "./AuthModal";
import MobileMenu from "./MobileMenu";

const desktopNavItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/protocols", label: "Protocols", icon: Library },
];

function SonoLogo({ size = "md" }: { size?: "sm" | "md" }) {
  const textCls = size === "sm"
    ? "text-2xl font-extrabold tracking-tight"
    : "text-xl font-extrabold tracking-tight";
  return (
    <Link href="/" className="flex items-center gap-2 select-none leading-none">
      <span>
        <span className={textCls} style={{ color: "#0f172a" }}>Sono</span>
        <span className={textCls} style={{ color: "#7c3aed" }}>Buddy </span>
        <span className={textCls} style={{ color: "#7c3aed", fontStyle: "italic" }}>ai</span>
      </span>
    </Link>
  );
}

function NavBarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth]         = useState(false);
  const [authInitMode, setAuthInitMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const authParam = searchParams.get("auth");
    if (authParam === "forgot") {
      setAuthInitMode("forgot");
      setShowAuth(true);
      // Clean the URL without reloading
      const url = new URL(window.location.href);
      url.searchParams.delete("auth");
      router.replace(url.pathname + (url.search || ""), { scroll: false });
    }
  }, [searchParams, router]);

  function closeAuth() {
    setShowAuth(false);
    setAuthInitMode("signin");
  }

  return (
    <>
      {showAuth && <AuthModal onClose={closeAuth} initialMode={authInitMode} />}
      {showMobileMenu && (
        <MobileMenu
          onClose={() => setShowMobileMenu(false)}
          onSignIn={() => { setAuthInitMode("signin"); setShowAuth(true); }}
        />
      )}
      {/* ── Desktop top nav ── */}
      <header
        className="hidden md:block fixed top-0 left-0 right-0 z-50 border-b"
        style={{ background: "rgba(255,255,255,0.95)", borderColor: "#e2e8f0", backdropFilter: "blur(8px)" }}>
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <SonoLogo />

          <nav className="flex items-center gap-1">
            {desktopNavItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link key={href} href={href}
                  className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-all"
                  style={active ? { color: "#7c3aed", background: "#f5f3ff" } : { color: "#64748b" }}>
                  <Icon size={15} />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {!loading && (
              user
                ? <UserMenu />
                : (
                  <button onClick={() => setShowAuth(true)}
                    className="flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-medium transition-all hover:bg-slate-50"
                    style={{ borderColor: "#e2e8f0", color: "#374151" }}>
                    <LogIn size={14} />
                    Sign in
                  </button>
                )
            )}
            <Link href="/scan"
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:opacity-90 active:scale-95"
              style={{ background: "#7c3aed" }}>
              <Camera size={15} />
              Start Scanning
            </Link>
          </div>
        </div>
      </header>

      {/* ── Mobile top bar (logo + hamburger) ── */}
      <header
        className="md:hidden fixed top-0 left-0 right-0 z-50 border-b"
        style={{ background: "rgba(255,255,255,0.97)", borderColor: "#e2e8f0" }}>
        <div className="flex items-center justify-between px-4 py-3">
          <SonoLogo size="sm" />
          <button
            onClick={() => setShowMobileMenu(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors hover:bg-slate-100"
            style={{ color: "#374151" }}
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

    </>
  );
}

export default function NavBar() {
  return (
    <Suspense>
      <NavBarInner />
    </Suspense>
  );
}
