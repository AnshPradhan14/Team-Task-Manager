"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Kanban,
  User,
  Zap,
  LayoutDashboard,
  CheckCircle2,
  Users,
  Settings,
  ArrowRight,
  Command,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ResultCategory = "navigation" | "task" | "action";

interface CommandResult {
  id: string;
  label: string;
  sublabel?: string;
  category: ResultCategory;
  badge?: { text: string; color: string };
  icon: React.ElementType;
  action: () => void;
}

// ─── Static Navigation & Action Items ─────────────────────────────────────────

const buildStaticItems = (
  router: ReturnType<typeof useRouter>,
  role: string | undefined
): CommandResult[] => {
  const navItems: CommandResult[] = [
    {
      id: "nav-dashboard",
      label: "Dashboard",
      sublabel: "Overview & metrics",
      category: "navigation",
      icon: LayoutDashboard,
      action: () => router.push("/"),
    },
    {
      id: "nav-mytasks",
      label: "My Tasks",
      sublabel: "Your assigned work",
      category: "navigation",
      icon: CheckCircle2,
      action: () => router.push("/my-tasks"),
    },
    {
      id: "nav-board",
      label: "Project Board",
      sublabel: "Kanban view",
      category: "navigation",
      icon: Kanban,
      action: () => router.push("/board"),
    },
    {
      id: "nav-settings",
      label: "Settings",
      sublabel: "Account preferences",
      category: "navigation",
      icon: Settings,
      action: () => router.push("/settings"),
    },
  ];

  if (role === "ADMIN") {
    navItems.push({
      id: "nav-team",
      label: "Team Management",
      sublabel: "Monitor team performance",
      category: "navigation",
      icon: Users,
      badge: { text: "ADMIN", color: "amber" },
      action: () => router.push("/team"),
    });
  }

  return navItems;
};

// ─── Badge Colors ──────────────────────────────────────────────────────────────

const BADGE_STYLES: Record<string, string> = {
  HIGH: "bg-red-500/20 text-red-300 border border-red-500/30",
  MEDIUM: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  LOW: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  DONE: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  TODO: "bg-slate-500/20 text-slate-300 border border-slate-500/30",
  IN_PROGRESS: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  ADMIN: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  amber: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
};

const CATEGORY_LABELS: Record<ResultCategory, string> = {
  navigation: "Navigation",
  task: "Tasks",
  action: "Actions",
};

// ─── Main Component ────────────────────────────────────────────────────────────

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: string;
}

export function CommandPalette({ isOpen, onClose, userRole }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [results, setResults] = useState<CommandResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const staticItems = buildStaticItems(router, userRole);

  // ── Filter Results ──────────────────────────────────────────────────────────
  const filterResults = useCallback(
    (q: string) => {
      if (!q.trim()) {
        setResults(staticItems);
        return;
      }
      const lower = q.toLowerCase();
      const filtered = staticItems.filter(
        (item) =>
          item.label.toLowerCase().includes(lower) ||
          item.sublabel?.toLowerCase().includes(lower)
      );
      setResults(filtered);
    },
    [userRole]
  );

  // ── Effects ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveIndex(0);
      setResults(staticItems);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    filterResults(query);
    setActiveIndex(0);
  }, [query]);

  // Scroll active item into view
  useEffect(() => {
    const activeEl = listRef.current?.querySelector(`[data-index="${activeIndex}"]`);
    activeEl?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  // ── Keyboard Handler ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (results[activeIndex]) {
          results[activeIndex].action();
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, results, activeIndex, onClose]);

  if (!isOpen) return null;

  // ── Group results by category ───────────────────────────────────────────────
  const grouped = results.reduce<Record<ResultCategory, CommandResult[]>>(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<ResultCategory, CommandResult[]>
  );

  const orderedCategories: ResultCategory[] = ["navigation", "task", "action"];
  let globalIndex = -1;

  return (
    <>
      {/* ── Backdrop ─────────────────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close command palette"
      />

      {/* ── Command Panel ─────────────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-[201] flex items-start justify-center pt-[15vh] px-4 pointer-events-none"
        aria-label="Command palette"
        role="dialog"
        aria-modal="true"
      >
        <div
          className="pointer-events-auto w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl shadow-black/60"
          style={{
            background: "rgba(15, 23, 42, 0.92)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Subtle glow behind input */}
          <div className="relative">
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-16 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%)",
              }}
            />

            {/* ── Search Row ─────────────────────────────────────────────────── */}
            <div className="flex items-center gap-3 px-5 py-4 relative">
              <Search className="w-5 h-5 text-white/30 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tasks, people, actions..."
                className="flex-1 bg-transparent text-white text-lg font-medium placeholder:text-white/25 focus:outline-none"
                aria-label="Command search"
                autoComplete="off"
              />
              <div className="shrink-0 flex items-center gap-1 bg-white/5 border border-white/10 rounded-md px-2 py-1">
                <span className="text-[10px] text-white/30 font-bold tracking-widest uppercase">ESC</span>
              </div>
            </div>
          </div>

          {/* ── Divider ────────────────────────────────────────────────────────── */}
          <div className="h-px bg-white/[0.07] mx-0" />

          {/* ── Results List ───────────────────────────────────────────────────── */}
          <div
            ref={listRef}
            className="overflow-y-auto"
            style={{ maxHeight: "320px" }}
          >
            {results.length === 0 ? (
              /* ── Empty State ─────────────────────────────────────────────── */
              <div className="flex flex-col items-center justify-center py-14 px-6 gap-3">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                  <Search className="w-6 h-6 text-white/20" />
                </div>
                <p className="text-sm font-bold text-white/30">No results found</p>
                <p className="text-xs text-white/15 tracking-wider uppercase">Try a different search term</p>
              </div>
            ) : (
              orderedCategories.map((category) => {
                const items = grouped[category];
                if (!items?.length) return null;

                return (
                  <div key={category}>
                    {/* Category Header */}
                    <div className="px-5 pt-3 pb-1">
                      <span className="text-[9px] font-black uppercase tracking-[0.15em] text-white/25">
                        {CATEGORY_LABELS[category]}
                      </span>
                    </div>

                    {/* Items */}
                    {items.map((item) => {
                      globalIndex++;
                      const idx = globalIndex;
                      const isActive = activeIndex === idx;
                      const Icon = item.icon;

                      return (
                        <button
                          key={item.id}
                          data-index={idx}
                          onClick={() => {
                            item.action();
                            onClose();
                          }}
                          onMouseEnter={() => setActiveIndex(idx)}
                          className="w-full flex items-center gap-4 px-4 py-3 mx-1 rounded-xl transition-all duration-100 text-left group"
                          style={{
                            background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
                            borderLeft: isActive ? "2px solid #3B82F6" : "2px solid transparent",
                            width: "calc(100% - 8px)",
                          }}
                        >
                          {/* Icon */}
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-100"
                            style={{
                              background: isActive
                                ? "rgba(59,130,246,0.15)"
                                : "rgba(255,255,255,0.05)",
                            }}
                          >
                            <Icon
                              className="w-4 h-4 transition-colors duration-100"
                              style={{ color: isActive ? "#3B82F6" : "rgba(255,255,255,0.4)" }}
                            />
                          </div>

                          {/* Label */}
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-sm font-bold leading-tight truncate transition-colors duration-100"
                              style={{ color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.75)" }}
                            >
                              {item.label}
                            </p>
                            {item.sublabel && (
                              <p className="text-[11px] text-white/25 leading-tight mt-0.5 truncate">
                                {item.sublabel}
                              </p>
                            )}
                          </div>

                          {/* Badge */}
                          {item.badge && (
                            <span
                              className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shrink-0 ${
                                BADGE_STYLES[item.badge.color] || BADGE_STYLES[item.badge.text] || "bg-white/10 text-white/50"
                              }`}
                            >
                              {item.badge.text}
                            </span>
                          )}

                          {/* Arrow on active */}
                          <ArrowRight
                            className="w-3.5 h-3.5 shrink-0 transition-all duration-100"
                            style={{
                              color: isActive ? "#3B82F6" : "transparent",
                              transform: isActive ? "translateX(0)" : "translateX(-4px)",
                            }}
                          />
                        </button>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>

          {/* ── Footer Hint Bar ────────────────────────────────────────────────── */}
          <div className="h-px bg-white/[0.07]" />
          <div className="flex items-center gap-4 px-5 py-3">
            <span className="text-[10px] uppercase tracking-widest text-white/20 font-bold flex items-center gap-1.5">
              <kbd className="bg-white/5 border border-white/10 rounded px-1.5 py-0.5">↵</kbd>
              <span>to open</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-white/20 font-bold flex items-center gap-1.5">
              <kbd className="bg-white/5 border border-white/10 rounded px-1.5 py-0.5">↑↓</kbd>
              <span>navigate</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-white/20 font-bold flex items-center gap-1.5">
              <kbd className="bg-white/5 border border-white/10 rounded px-1.5 py-0.5">ESC</kbd>
              <span>close</span>
            </span>
            <div className="ml-auto flex items-center gap-1.5 text-white/15">
              <Command className="w-3 h-3" />
              <span className="text-[10px] font-black tracking-widest uppercase">K</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
