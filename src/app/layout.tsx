import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.amalurtours.com",
  ),
  title: {
    default: "Amalur Tours — Visites Guidées au Pays Basque",
    template: "%s | Amalur Tours",
  },
  description:
    "Découvrez Bayonne et Biarritz avec une guide locale passionnée. Walking tours en français, anglais et espagnol.",
  icons: {
    icon: [
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    siteName: "Amalur Tours",
    locale: "fr_FR",
    alternateLocale: ["en_GB", "es_ES"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
