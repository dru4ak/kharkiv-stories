import type { Metadata, Viewport } from "next";
import { Alegreya, Manrope } from "next/font/google";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const display = Alegreya({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = getSiteUrl();

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3ebe0" },
    { media: "(prefers-color-scheme: dark)", color: "#8b3a2a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Легенды Харькова",
    template: "%s · Легенды Харькова",
  },
  description:
    "Городские байки, слухи и предания о Харькове — из книги Цыпина и из уст харьковчан. Памяти Савелия Цыпина.",
  applicationName: "Легенды Харькова",
  keywords: [
    "Харьков",
    "легенды Харькова",
    "байки Харькова",
    "городские легенды",
    "слухи Харькова",
    "предания Харькова",
    "Савелий Цыпин",
    "Kharkiv legends",
    "Харків легенди",
  ],
  authors: [{ name: "Савелий Цыпин" }],
  creator: "Легенды Харькова",
  publisher: "Легенды Харькова",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Легенды Харькова",
    locale: "ru_RU",
    alternateLocale: ["uk_UA", "en_US"],
    title: "Легенды Харькова",
    description:
      "Городские байки, слухи и предания о Харькове — из книги Цыпина и из уст харьковчан.",
    images: [
      {
        url: "/illustrations/hero-kharkiv-real.jpg",
        width: 1200,
        height: 630,
        alt: "Легенды Харькова",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Легенды Харькова",
    description:
      "Городские байки, слухи и предания о Харькове — из книги Цыпина и из уст харьковчан.",
    images: ["/illustrations/hero-kharkiv-real.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  category: "culture",
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : {}),
    ...(process.env.NEXT_PUBLIC_YANDEX_VERIFICATION
      ? { yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION }
      : {}),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${display.variable} ${body.variable} h-full`} suppressHydrationWarning>
      <body className="site-shell flex min-h-full flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
