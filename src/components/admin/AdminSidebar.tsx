"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Mail,
  CheckSquare,
  Grid3X3,
  Settings,
  Heart,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Overview",    href: "/admin",             icon: LayoutDashboard },
  { label: "Guests",      href: "/admin/guests",      icon: Users },
  { label: "Invitations", href: "/admin/invitations", icon: Mail },
  { label: "RSVP",        href: "/admin/rsvp",        icon: CheckSquare },
  { label: "Seating",     href: "/admin/seating",     icon: Grid3X3 },
  { label: "Settings",    href: "/admin/settings",    icon: Settings },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-60 flex-col border-r border-slate-800 bg-slate-900">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-slate-800 px-5">
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
      <div className="border-t border-slate-800 px-4 py-3">
        <p className="text-[10px] text-slate-500">
          © 2025 Wedding Platform
        </p>
      </div>
    </aside>
  );
}
