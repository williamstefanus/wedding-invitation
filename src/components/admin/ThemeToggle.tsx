"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { IconButton } from "@radix-ui/themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <IconButton variant="ghost" color="gray" radius="full" disabled>
        <div style={{ width: 20, height: 20 }} />
      </IconButton>
    );
  }

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <IconButton
      variant="ghost"
      color="gray"
      radius="full"
      style={{ cursor: "pointer" }}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      {isDark ? <Sun width={20} height={20} /> : <Moon width={20} height={20} />}
    </IconButton>
  );
}
