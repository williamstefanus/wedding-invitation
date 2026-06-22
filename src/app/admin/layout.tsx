import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { GlobalSearch } from "@/components/admin/GlobalSearch";

export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard",
    template: "%s | Admin — Wedding Platform",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Topbar (Desktop only) */}
        <header className="hidden md:flex h-16 shrink-0 items-center border-b border-slate-200 bg-white px-6 z-[60]">
          <div className="flex flex-1 items-center justify-between">
            <div className="flex-1 max-w-md">
              <GlobalSearch />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 rounded-full bg-amber-500 flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
