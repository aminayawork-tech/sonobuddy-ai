"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Clock,
  Search,
  Star,
} from "lucide-react";
import NavBar from "@/components/NavBar";
import {
  CATEGORIES,
  CATEGORY_PILL,
  PROTOCOLS,
  type Category,
  type Protocol,
} from "@/lib/protocols";

const DIFFICULTY_COLOR: Record<string, string> = {
  Basic:        "#059669",
  Intermediate: "#d97706",
  Advanced:     "#dc2626",
};

function ProtocolCard({ protocol }: { protocol: Protocol }) {
  const pill = CATEGORY_PILL[protocol.category];
  return (
    <Link
      href={`/protocols/${protocol.id}`}
      className="group flex flex-col rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
      style={{ background: "#ffffff", borderColor: "#dde4ee" }}
    >
      <div className="mb-3 flex items-center">
        <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
          style={{ background: pill.bg, color: pill.text }}>
          {protocol.category}
        </span>
      </div>

      <h3 className="mb-1 font-semibold transition-colors group-hover:text-blue-600"
        style={{ color: "#1a2235" }}>
        {protocol.name}
      </h3>
      <p className="mb-3 text-xs leading-relaxed line-clamp-2" style={{ color: "#5a6a85" }}>
        {protocol.indication}
      </p>

      <div className="mt-auto flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1" style={{ color: "#94a3b8" }}>
            <Clock size={11} />{protocol.estimatedTime}
          </span>
          <span className="font-medium" style={{ color: DIFFICULTY_COLOR[protocol.difficulty] }}>
            {protocol.difficulty}
          </span>
        </div>
        <ChevronRight size={14} className="transition-colors group-hover:text-blue-500"
          style={{ color: "#cbd5e1" }} />
      </div>
    </Link>
  );
}

export default function ProtocolsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set(["efast", "cardiac-plax"]);
    try {
      const stored = localStorage.getItem("pinnedProtocols");
      return stored ? new Set<string>(JSON.parse(stored)) : new Set(["efast", "cardiac-plax"]);
    } catch {
      return new Set(["efast", "cardiac-plax"]);
    }
  });

  const filtered = PROTOCOLS.filter((p) => {
    const matchesSearch =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.indication.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));

  const favoriteProtocols = PROTOCOLS.filter((p) => favorites.has(p.id));

  useEffect(() => {
    localStorage.setItem("pinnedProtocols", JSON.stringify([...favorites]));
  }, [favorites]);

  function toggleFavorite(id: string, e: React.MouseEvent) {
    e.preventDefault();
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="min-h-screen pt-14 pb-24 md:pb-8 md:pt-16" style={{ background: "#eef3f8" }}>
      <NavBar />

      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-1.5 text-3xl font-extrabold" style={{ color: "#1a2235" }}>
            Protocol Library
          </h1>
          <p style={{ color: "#5a6a85" }}>
            Select a protocol to begin your AI-guided ultrasound analysis.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: "#94a3b8" }} />
          <input
            type="text"
            placeholder="Search protocols or indications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border py-3 pl-10 pr-4 outline-none transition-all"
            style={{
              background: "#ffffff",
              borderColor: "#dde4ee",
              color: "#1a2235",
              fontSize: "16px",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
            onBlur={(e) => (e.target.style.borderColor = "#dde4ee")}
          />
        </div>

        {/* Category filter */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveCategory("All")}
            className="shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-all"
            style={
              activeCategory === "All"
                ? { background: "#2563eb", color: "#ffffff" }
                : { background: "#ffffff", color: "#5a6a85", border: "1px solid #dde4ee" }
            }
          >
            All ({PROTOCOLS.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = PROTOCOLS.filter((p) => p.category === cat).length;
            const pill = CATEGORY_PILL[cat];
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="shrink-0 flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-all"
                style={
                  active
                    ? { background: "#2563eb", color: "#ffffff" }
                    : { background: "#ffffff", color: "#5a6a85", border: "1px solid #dde4ee" }
                }
              >
                <span className="h-2 w-2 rounded-full"
                  style={{ background: active ? "#ffffff" : pill.dot }} />
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Favorites */}
        {favoriteProtocols.length > 0 && activeCategory === "All" && search === "" && (
          <section className="mb-8">
            <div className="mb-3 flex items-center gap-1.5">
              <Star size={14} style={{ color: "#f59e0b", fill: "#f59e0b" }} />
              <h2 className="text-sm font-semibold" style={{ color: "#5a6a85" }}>Favorites</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {favoriteProtocols.map((p) => (
                <div key={p.id} className="relative">
                  <button
                    onClick={(e) => toggleFavorite(p.id, e)}
                    className="absolute right-1.5 top-1.5 z-10 p-2 rounded-full"
                    style={{ touchAction: "manipulation" }}
                  >
                    <Star size={20} style={{ color: "#f59e0b", fill: "#f59e0b" }} />
                  </button>
                  <ProtocolCard protocol={p} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Protocol grid */}
        <section>
          <div className="mb-3">
            <h2 className="text-sm font-semibold" style={{ color: "#5a6a85" }}>
              {activeCategory === "All" ? "All Protocols" : activeCategory} ({filtered.length})
            </h2>
          </div>

          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p style={{ color: "#94a3b8" }}>No protocols found for &ldquo;{search}&rdquo;</p>
              <button onClick={() => setSearch("")} className="mt-2 text-sm font-medium"
                style={{ color: "#2563eb" }}>
                Clear search
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {filtered.map((p) => (
                <div key={p.id} className="relative">
                  <button
                    onClick={(e) => toggleFavorite(p.id, e)}
                    className="absolute right-1.5 top-1.5 z-10 p-2 rounded-full"
                    style={{ touchAction: "manipulation" }}
                  >
                    <Star
                      size={20}
                      style={
                        favorites.has(p.id)
                          ? { color: "#f59e0b", fill: "#f59e0b" }
                          : { color: "#cbd5e1" }
                      }
                    />
                  </button>
                  <ProtocolCard protocol={p} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quick start */}
        <div className="mt-12 rounded-2xl border p-6 text-center"
          style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}>
          <h3 className="mb-1.5 font-semibold" style={{ color: "#1a2235" }}>
            Not sure where to start?
          </h3>
          <p className="mb-4 text-sm" style={{ color: "#5a6a85" }}>
            Try eFAST for trauma, PLAX for cardiac, or OB First Trimester for pregnancy dating.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {["efast", "cardiac-plax", "ob-first-trimester"].map((id) => {
              const p = PROTOCOLS.find((x) => x.id === id)!;
              return (
                <Link key={id} href={`/protocols/${id}`}
                  className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all hover:opacity-80"
                  style={{ borderColor: "#93c5fd", background: "#dbeafe", color: "#1d4ed8" }}>
                  {p.shortName} <ArrowRight size={10} />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
