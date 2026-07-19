"use client";

import { usePathname, useRouter } from "next/navigation";
import { Grid, Box, Flex, Avatar } from "@radix-ui/themes";
import { AdminSidebar } from "./AdminSidebar";
import { GlobalSearch } from "./GlobalSearch";
import { DropdownMenu, Button } from "@radix-ui/themes";
import { logoutAdmin } from "@/lib/actions/auth";

export function AdminLayoutWrapper({ children, session }: { children: React.ReactNode, session?: any }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await logoutAdmin();
    router.push("/admin/login");
  };

  return (
    <Grid 
      columns={{ initial: "1", md: "240px 1fr" }} 
      rows={{ initial: "auto 1fr", md: "1fr" }} 
      style={{ minHeight: "100vh", height: "100vh" }}
    >
      {/* Sidebar (Handles both Mobile Topbar and Desktop Sidebar) */}
      <Box>
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
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button variant="ghost" style={{ cursor: "pointer", padding: "8px", borderRadius: "20px" }}>
                  <Avatar fallback={session?.username?.charAt(0).toUpperCase() || "A"} size="2" color="crimson" radius="full" />
                  <span style={{ fontWeight: 600, marginLeft: "8px", textTransform: "capitalize", color: "var(--gray-11)" }}>
                    {session?.username || "Admin"}
                  </span>
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content align="end">
                <DropdownMenu.Item onClick={handleLogout} color="ruby">
                  Logout
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
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
