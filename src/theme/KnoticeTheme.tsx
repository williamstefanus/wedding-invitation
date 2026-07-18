import "@radix-ui/themes/styles.css";
import "./knotice-theme.css";

import type { PropsWithChildren } from "react";
import { Theme } from "@radix-ui/themes";

export function KnoticeTheme({ children }: PropsWithChildren) {
  return (
    <Theme
      appearance="light"
      accentColor="crimson"
      grayColor="mauve"
      panelBackground="solid"
      radius="large"
      scaling="100%"
    >
      {children}
    </Theme>
  );
}
