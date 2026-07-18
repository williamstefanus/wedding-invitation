"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Home,
  Users,
  CheckSquare,
  Grid3X3,
  Settings,
  Database,
  Menu,
  X
} from "lucide-react";
import { Box, Flex, Text, Button, IconButton, Card, Heading } from "@radix-ui/themes";
import { GlobalSearch } from "./GlobalSearch";

const NAV_ITEMS = [
  { label: "Overview",    href: "/admin",             icon: Home },
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
    <Flex direction="column" className="knotice-sidebar" style={{ height: "100%", width: "100%" }}>
      {/* Logo */}
      <Box px="4" pt="5" pb="3">
        <img 
          src="/images/logo_horizontal.png" 
          alt="Knotice" 
          style={{ 
            height: "56px", 
            width: "160px", 
            objectFit: "cover", 
            objectPosition: "left center",
            marginLeft: "4px"
          }} 
        />
      </Box>

      {/* Mobile Search */}
      <Box display={{ initial: "block", md: "none" }} p="4" style={{ borderBottom: "1px solid var(--gray-6)" }}>
        <GlobalSearch />
      </Box>

      {/* Navigation */}
      <Box style={{ flex: 1, overflowY: "auto" }} px="3" py="4">
        <Flex direction="column" gap="1">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const isActive =
              href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  backgroundColor: isActive ? "var(--crimson-3)" : "transparent",
                  color: isActive ? "var(--crimson-11)" : "var(--gray-11)",
                  fontWeight: isActive ? 600 : 500,
                  textDecoration: "none",
                  transition: "background-color 0.2s"
                }}
              >
                <Icon width={22} height={22} />
                <span style={{ marginLeft: "14px", fontSize: "15px" }}>{label}</span>
              </Link>
            );
          })}
        </Flex>

      </Box>

      {/* Footer */}
      <Box px="4" py="4" style={{ borderTop: "1px solid var(--gray-6)" }}>
        <Text size="1" color="gray">
          © 2025 Knotice Platform
        </Text>
      </Box>
    </Flex>
  );

  return (
    <>
      {/* Mobile Topbar */}
      <Flex display={{ initial: "flex", md: "none" }} align="center" justify="between" px="4" py="3" style={{ borderBottom: "1px solid var(--gray-6)", backgroundColor: "white" }}>
        <Flex align="center" gap="2">
           <Flex align="center" justify="center" style={{ width: 24, height: 24, backgroundColor: "var(--crimson-9)", borderRadius: "var(--radius-2)" }}>
             <Text size="2" weight="bold" style={{ color: "white", lineHeight: 1 }}>K</Text>
           </Flex>
           <Text size="3" weight="bold">Knotice</Text>
        </Flex>
        <IconButton variant="ghost" color="gray" onClick={() => setIsOpen(true)}>
          <Menu width={20} height={20} />
        </IconButton>
      </Flex>

      {/* Mobile Overlay */}
      {isOpen && (
        <Box position="fixed" top="0" left="0" right="0" bottom="0" style={{ zIndex: 100, display: "flex" }}>
          <Box position="absolute" top="0" left="0" right="0" bottom="0" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} onClick={() => setIsOpen(false)} />
          <Box position="relative" style={{ width: 260, height: "100%" }}>
            <Box position="absolute" top="4" right="4" style={{ zIndex: 10 }}>
              <IconButton variant="ghost" color="gray" onClick={() => setIsOpen(false)}>
                <X width={20} height={20} />
              </IconButton>
            </Box>
            <SidebarContent />
          </Box>
        </Box>
      )}

      {/* Desktop Sidebar Content (rendered through layout Grid) */}
      <Box display={{ initial: "none", md: "block" }} style={{ height: "100%" }}>
        <SidebarContent />
      </Box>
    </>
  );
}
