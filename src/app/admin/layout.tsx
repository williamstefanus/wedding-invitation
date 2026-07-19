import type { Metadata } from "next";
import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";

export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard",
    template: "%s | Admin — Wedding Platform",
  },
  icons: {
    icon: "/assets/logo_icononly.png",
  },
  robots: { index: false, follow: false },
};

import { getAdminSession } from "@/lib/actions/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  return <AdminLayoutWrapper session={session}>{children}</AdminLayoutWrapper>;
}
