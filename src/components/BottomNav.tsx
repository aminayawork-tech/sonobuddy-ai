"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Camera, ClipboardList, Clock } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

const ALL_TABS = [
  { href: "/",          label: "Home",      Icon: Home,          guestOnly: true  },
  { href: "/scan",      label: "Scan",      Icon: Camera,        guestOnly: false },
  { href: "/protocols", label: "Protocols", Icon: ClipboardList, guestOnly: false },
  { href: "/history",   label: "History",   Icon: Clock,         guestOnly: false, authOnly: true },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const tabs = user
    ? ALL_TABS.filter((t) => !t.guestOnly)
    : ALL_TABS.filter((t) => !t.authOnly);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden"
      style={{
        background: "#ffffff",
        borderTop: "1px solid #e2e8f0",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {tabs.map(({ href, label, Icon }) => {
        const active = pathname === href || (href !== "/" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 py-3 transition-colors"
            style={{ color: active ? "#2563eb" : "#94a3b8" }}
          >
            <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
            <span style={{ fontSize: "10px", fontWeight: active ? 700 : 500 }}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
