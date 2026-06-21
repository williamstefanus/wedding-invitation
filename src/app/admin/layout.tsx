import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

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
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center border-b border-slate-200 bg-white px-6">
          <div className="flex flex-1 items-center justify-between">
            <div>
              {/* Breadcrumb slot — child pages can override via slot pattern later */}
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
