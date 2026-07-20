import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter, Playfair_Display, Cormorant_Garamond, Alegreya_Sans, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["300", "400"],
  style: ["normal", "italic"],
});

const alegreya = Alegreya_Sans({
  subsets: ["latin"],
  variable: "--font-alegreya",
  display: "swap",
  weight: ["300", "400", "500", "700"],
  style: ["normal", "italic"],
});

const justWrite = localFont({
  src: "../../public/fonts/JustWrite.otf",
  variable: "--font-justwrite",
  display: "swap",
});

const egizio = localFont({
  src: "../../public/fonts/EgizioEF Condensed Regular.otf",
  variable: "--font-egizio",
  display: "swap",
});

import { getSettings } from "@/lib/actions/settings";

export async function generateMetadata(): Promise<Metadata> {
  let faviconUrl = "/favicon-default.ico";
  let coupleName = "John & Jane";

  try {
    const settingsRes = await getSettings();
    const config = settingsRes.success ? (settingsRes.data?.config as any) : null;
    if (config?.faviconUrl) {
      // Append a cache-buster to force Safari to fetch the new favicon
      faviconUrl = `${config.faviconUrl}?v=${new Date().getTime()}`;
    }
    if (config?.groomFirstName && config?.brideFirstName) {
      coupleName = `${config.groomFirstName} & ${config.brideFirstName}`;
    }
  } catch {
    // Fall back to default favicon and names
  }

  return {
    title: {
      default: `Wedding Invitation — ${coupleName}`,
      template: `%s | ${coupleName}`,
    },
    description:
      `A private digital wedding invitation and guest management platform for ${coupleName}'s celebration.`,
    robots: { index: false, follow: false },
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
  };
}

import { KnoticeTheme } from "@/theme/KnoticeTheme";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${cormorant.variable} ${alegreya.variable} ${justWrite.variable} ${egizio.variable} ${montserrat.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full antialiased">
        <KnoticeTheme>
          {children}
        </KnoticeTheme>
      </body>
    </html>
  );
}
