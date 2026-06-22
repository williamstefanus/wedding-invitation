"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Mail,
  CheckSquare,
  Grid3X3,
  Settings,
  Database,
  Heart,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlobalSearch } from "./GlobalSearch";

const NAV_ITEMS = [
  { label: "Overview",    href: "/admin",             icon: LayoutDashboard },
  { label: "Guests",      href: "/admin/guests",      icon: Users },
  { label: "RSVP",        href: "/admin/rsvp",        icon: CheckSquare },
  { label: "Seating",     href: "/admin/seating",     icon: Grid3X3 },
  { label: "Data Management", href: "/admin/data",    icon: Database },
  { label: "Settings",    href: "/admin/settings",    icon: Settings },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-slate-800 px-5 relative">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500">
          <Heart className="h-3.5 w-3.5 fill-white text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white leading-none">
            Wedding Hub
          </p>
          <p className="mt-0.5 text-[10px] text-slate-400 leading-none">
            Admin Dashboard
          </p>
        </div>
      </div>

      {/* Mobile Search - Visible only inside the sidebar overlay on md:hidden */}
      <div className="md:hidden p-4 border-b border-slate-800 shrink-0">
        <GlobalSearch />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-0.5">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const isActive =
              href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(href);

            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                    "transition-all duration-150",
                    isActive
                      ? "bg-amber-500 text-white shadow-sm"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="flex-1">{label}</span>
                  {isActive && (
                    <ChevronRight className="h-3.5 w-3.5 opacity-70" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800 px-4 py-3 shrink-0">
        <p className="text-[10px] text-slate-500">
          © 2025 Wedding Platform
        </p>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between bg-slate-900 px-4 py-3 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
           <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500">
             <Heart className="h-3 w-3 fill-white text-white" />
           </div>
           <span className="text-white font-bold text-sm">Wedding Hub</span>
        </div>
        <button onClick={() => setIsOpen(true)} className="text-slate-300 p-2 -mr-2">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-[100] flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <aside className="relative flex w-64 flex-col bg-slate-900 border-r border-slate-800 h-full shadow-2xl animate-fade-right">
             <div className="absolute top-4 right-4 z-10">
               <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:text-white transition rounded-full hover:bg-slate-800">
                 <X className="w-5 h-5"/>
               </button>
             </div>
             <SidebarContent />
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex h-full w-60 shrink-0 flex-col border-r border-slate-800 bg-slate-900 z-10">
        <SidebarContent />
      </aside>
    </>
  );
}
