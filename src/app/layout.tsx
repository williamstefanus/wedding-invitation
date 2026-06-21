import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter, Playfair_Display, Cormorant_Garamond, Alegreya_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
  src: "../../design-assets/JustWrite.otf",
  variable: "--font-justwrite",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Wedding Invitation — William & Aziel",
    template: "%s | William & Aziel",
  },
  description:
    "A private digital wedding invitation and guest management platform for William & Aziel's celebration.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${cormorant.variable} ${alegreya.variable} ${justWrite.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-white text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
