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

export const metadata: Metadata = {
  title: {
    default: "Wedding Invitation — John & Jane",
    template: "%s | John & Jane",
  },
  description:
    "A private digital wedding invitation and guest management platform for John & Jane's celebration.",
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
      className={`${inter.variable} ${playfair.variable} ${cormorant.variable} ${alegreya.variable} ${justWrite.variable} ${egizio.variable} ${montserrat.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-white text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
