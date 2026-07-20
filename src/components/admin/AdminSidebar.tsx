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
  UserCog,
  Menu,
  X
} from "lucide-react";
import { Box, Flex, Text, Button, IconButton, Card, Heading } from "@radix-ui/themes";
import { GlobalSearch } from "./GlobalSearch";
import { useTheme } from "next-themes";
import { KnoticeLogo } from "./KnoticeLogo";
import { ThemeToggle } from "./ThemeToggle";

const NAV_ITEMS = [
  { label: "Overview",        href: "/admin",             icon: Home },
  { label: "Guests",          href: "/admin/guests",      icon: Users },
  { label: "RSVP",            href: "/admin/rsvp",        icon: CheckSquare },
  { label: "Seating",         href: "/admin/seating",     icon: Grid3X3 },
  { label: "Data Management", href: "/admin/data",        icon: Database },
  { label: "Settings",        href: "/admin/settings",    icon: Settings },
  { label: "System Users",    href: "/admin/users",       icon: UserCog },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false);
    setMounted(true);
  }, [pathname]);

  const SidebarContent = ({ isMobileOverlay }: { isMobileOverlay?: boolean } = {}) => (
    <Flex direction="column" className="knotice-sidebar" style={{ height: "100%", width: "100%", backgroundColor: "var(--color-panel-solid)" }}>
      {/* Logo */}
      <Flex px="4" pt={isMobileOverlay ? "5" : "5"} pb={isMobileOverlay ? "1" : "3"} align="center" justify="between">
        <KnoticeLogo 
          style={{ 
            height: isMobileOverlay ? "45px" : "70px", 
            width: isMobileOverlay ? "130px" : "200px",
            marginLeft: "4px"
          }} 
        />
        {isMobileOverlay && (
          <IconButton variant="ghost" color="gray" onClick={() => setIsOpen(false)} style={{ cursor: "pointer", marginRight: "4px" }}>
            <X width={24} height={24} />
          </IconButton>
        )}
      </Flex>



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
                  backgroundColor: isActive ? "var(--red-3)" : "transparent",
                  color: isActive ? "var(--red-11)" : "var(--gray-11)",
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

      {/* User / Settings Footer */}
      <Box p="4" style={{ borderTop: "1px solid var(--gray-5)" }}>
        <Flex align="center" gap="3">
          <Box
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              backgroundColor: "var(--red-4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--red-11)",
              fontWeight: "bold",
              fontSize: "14px"
            }}
          >
            A
          </Box>
          <Box style={{ flex: 1 }}>
            <Text size="2" weight="bold" style={{ display: "block", color: "var(--gray-12)" }}>Admin</Text>
            <Text size="1" color="gray">System Manager</Text>
          </Box>
          <ThemeToggle />
        </Flex>
      </Box>
    </Flex>
  );

  return (
    <>
      {/* Mobile Topbar */}
      <Flex display={{ initial: "flex", md: "none" }} align="center" justify="between" px="4" py="3" style={{ borderBottom: "1px solid var(--gray-6)" }}>
        <Box>
          <KnoticeLogo 
            style={{ 
              height: "40px", 
              width: "115px",
            }} 
          />
        </Box>
        <IconButton variant="ghost" color="gray" onClick={() => setIsOpen(true)}>
          <Menu width={20} height={20} />
        </IconButton>
      </Flex>

      {/* Mobile Overlay */}
      {isOpen && (
        <Box position="fixed" top="0" left="0" right="0" bottom="0" style={{ zIndex: 100, display: "flex" }}>
          <Box position="absolute" top="0" left="0" right="0" bottom="0" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} onClick={() => setIsOpen(false)} />
          <Box position="relative" style={{ width: 280, height: "100%" }}>
            <SidebarContent isMobileOverlay />
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
