import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { GlobalSearch } from "@/components/admin/GlobalSearch";
import { Box, Flex, Grid, Avatar } from "@radix-ui/themes";

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
    <Grid columns={{ initial: "1", md: "240px 1fr" }} style={{ minHeight: "100vh" }}>
      {/* Desktop Sidebar */}
      <Box display={{ initial: "none", md: "block" }}>
        <AdminSidebar />
      </Box>

      {/* Main Content */}
      <Flex direction="column" style={{ overflow: "hidden", position: "relative" }}>
        {/* Topbar (Desktop only) */}
        <Flex 
          display={{ initial: "none", md: "flex" }}
          align="center" 
          justify="between" 
          className="knotice-topbar"
          px="6" 
          py="3"
          style={{ height: "64px", flexShrink: 0, zIndex: 60 }}
        >
          <Box style={{ flex: 1, maxWidth: "400px" }}>
            <GlobalSearch />
          </Box>
          <Flex align="center" gap="3">
            <Avatar fallback="A" size="2" color="crimson" radius="full" />
          </Flex>
        </Flex>

        {/* Page Content */}
        <Box style={{ flex: 1, overflowY: "auto" }}>
          {children}
        </Box>
      </Flex>
    </Grid>
  );
}
