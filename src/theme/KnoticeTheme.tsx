"use client";

import "@radix-ui/themes/styles.css";
import "./knotice-theme.css";

import type { PropsWithChildren } from "react";
import { Theme } from "@radix-ui/themes";
import { ThemeProvider, useTheme } from "next-themes";
import { useEffect, useState } from "react";

function RadixThemeWrapper({ children }: PropsWithChildren) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Theme
      appearance={mounted && resolvedTheme === "dark" ? "dark" : "light"}
      accentColor="crimson"
      grayColor="mauve"
      panelBackground="solid"
      radius="large"
      scaling="100%"
      hasBackground={true}
    >
      {children}
    </Theme>
  );
}

export function KnoticeTheme({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RadixThemeWrapper>{children}</RadixThemeWrapper>
    </ThemeProvider>
  );
}
