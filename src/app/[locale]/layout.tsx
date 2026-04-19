import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { DM_Serif_Display, DM_Sans, Righteous } from "next/font/google";
import Script from "next/script";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { generateBusinessSchema } from "@/lib/schema";

const siteUrl = "https://www.amalurtours.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "Amalur Tours — Visites Guidées au Pays Basque",
      template: "%s | Amalur Tours",
    },
    description:
      "Visites guidées à pied à Bayonne et Biarritz avec une guide locale passionnée. Tours en français, anglais et espagnol. À partir de 25€.",
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        "fr": `${siteUrl}/fr`,
        "en": `${siteUrl}/en`,
        "es": `${siteUrl}/es`,
        "x-default": `${siteUrl}/fr`,
      },
    },
    openGraph: {
      type: "website",
      siteName: "Amalur Tours",
      images: [{ url: `${siteUrl}/images/og-image.jpg`, width: 1200, height: 630 }],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const righteous = Righteous({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-righteous",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`h-full ${dmSerif.variable} ${dmSans.variable} ${righteous.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateBusinessSchema()),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-basque-cream text-basque-dark font-body antialiased">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
        {/* Google Analytics — désactivé pour les visites admin */}
        <Script id="ga-filter-admin" strategy="afterInteractive">
          {`
            if (document.cookie.split(';').some(c => c.trim().startsWith('admin_session='))) {
              window['ga-disable-G-1DE66DXBEP'] = true;
            }
          `}
        </Script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1DE66DXBEP"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1DE66DXBEP');
          `}
        </Script>
      </body>
    </html>
  );
}
