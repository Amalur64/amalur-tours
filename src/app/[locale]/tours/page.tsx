import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { tours } from "@/lib/tours";
import { TourCard } from "@/components/TourCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { toursMetadata, buildMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata(toursMetadata[locale] || toursMetadata.fr, locale);
}

export default async function ToursPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ToursContent />;
}

function ToursContent() {
  const t = useTranslations("tours");

  return (
    <div className="pt-24 lg:pt-28">
      {/* Header */}
      <section className="bg-gradient-to-br from-basque-ocean to-basque-green py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl lg:text-5xl text-white mb-3">
            {t("title")}
          </h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Tour Cards */}
      <section className="py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Pricing info */}
          <div className="flex flex-wrap gap-4 justify-center mb-10 text-sm text-basque-gray">
            <span className="bg-green-50 text-green-700 px-3 py-1.5 rounded-full">
              {t("freeChildren")}
            </span>
            <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full">
              {t("halfTeen")}
            </span>
            <span className="bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full">
              {t("allLanguages")}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {tours.map((tour, i) => (
              <ScrollReveal key={tour.id} delay={i * 100}>
                <TourCard tour={tour} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
