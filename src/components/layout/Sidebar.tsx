"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Kanban, 
  Users, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  User as UserIcon,
  CheckCircle2,
  Search,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { CommandPalette } from "@/components/ui/CommandPalette";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "My Tasks", href: "/my-tasks", icon: CheckCircle2 },
  { name: "Board", href: "/board", icon: Kanban },
  { name: "Team", href: "/team", icon: Users, adminOnly: true },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const { data: session } = useSession();

  // Hide sidebar on auth pages
  if (pathname.startsWith("/auth")) return null;

  const user = session?.user;

  // Global Cmd+K / Ctrl+K hotkey
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
    <aside 
      className={`sticky top-0 h-screen bg-card border-r transition-all duration-300 flex flex-col ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Kanban className="text-primary-foreground w-5 h-5" />
        </div>
        {!isCollapsed && (
          <span className="font-bold text-xl tracking-tight">TeamTask</span>
        )}
      </div>

      {/* Search / Command Palette Trigger */}
      <div className="px-3 pb-3">
        <button
          onClick={() => setIsPaletteOpen(true)}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-muted/60 border border-border/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 group ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <Search className="w-4 h-4 shrink-0" />
          {!isCollapsed && (
            <>
              <span className="text-sm flex-1 text-left">Search...</span>
              <div className="flex items-center gap-0.5 opacity-50">
                <kbd className="text-[9px] font-black bg-background border border-border rounded px-1 py-0.5">⌘</kbd>
                <kbd className="text-[9px] font-black bg-background border border-border rounded px-1 py-0.5">K</kbd>
              </div>
            </>
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          // Skip items that are admin-only if user is not admin
          if (item.adminOnly && user?.role !== "ADMIN") return null;
          
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                isActive 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? "" : "group-hover:scale-110 transition-transform"}`} />
              {!isCollapsed && <span className="font-medium">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t">
        <div className={`flex items-center gap-3 mb-4 ${isCollapsed ? "justify-center" : ""}`}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm shrink-0">
            {user?.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U"}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{user?.name}</p>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                {user?.role === "ADMIN" ? <Shield size={10} className="text-amber-500" /> : <UserIcon size={10} />}
                <span className="truncate">{user?.designation}</span>
              </div>
            </div>
          )}
        </div>
        
        <Button 
          variant="ghost" 
          onClick={() => signOut()}
          className={`w-full flex items-center gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 ${isCollapsed ? "justify-center px-0" : "justify-start px-3"}`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span className="font-medium">Sign Out</span>}
        </Button>
      </div>

      {/* Collapse Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-background border rounded-full flex items-center justify-center shadow-md hover:bg-muted transition-colors z-50"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>

    {/* Command Palette Portal */}
    <CommandPalette
      isOpen={isPaletteOpen}
      onClose={() => setIsPaletteOpen(false)}
      userRole={user?.role}
    />
    </>
  );
}
