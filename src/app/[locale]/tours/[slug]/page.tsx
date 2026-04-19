import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { tours, getTourBySlug } from "@/lib/tours";
import { BookingWidget } from "@/components/BookingWidget";
import { TourRequestWidget } from "@/components/TourRequestWidget";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Clock, Users, Globe, MapPin, CheckCircle } from "lucide-react";
import { tourMetadata, buildMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return tours.map((tour) => ({ slug: tour.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const slugMeta = tourMetadata[slug];
  if (!slugMeta) return {};
  return buildMetadata(slugMeta[locale] || slugMeta.fr, locale);
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const tour = getTourBySlug(slug);
  if (!tour) notFound();

  return <TourDetailContent slug={slug} />;
}

function TourDetailContent({ slug }: { slug: string }) {
  const t = useTranslations("tours");
  const tour = getTourBySlug(slug)!;

  return (
    <div className="pt-24 lg:pt-28">
      {/* Hero */}
      <section className="relative h-[40vh] sm:h-[50vh] overflow-hidden">
        <Image
          src={tour.image}
          alt={t(`${tour.translationKey}.title`)}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
            <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur text-basque-dark text-sm font-medium px-3 py-1.5 rounded-full mb-4">
              <MapPin size={16} />
              {tour.city}
            </span>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mb-2">
              {t(`${tour.translationKey}.title`)}
            </h1>
            <p className="text-white/80 text-lg max-w-2xl">
              {t(`${tour.translationKey}.description`)}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
            {/* Left - Info */}
            <div className="lg:col-span-2 space-y-10">
              {/* Quick Info */}
              <ScrollReveal>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    {
                      icon: Clock,
                      label: t("schedule"),
                      value: t(`${tour.translationKey}.duration`),
                    },
                    {
                      icon: Users,
                      label: t("groupSize"),
                      value: tour.isPrivate
                        ? t("privateMaxPersons", { n: tour.maxGroupSize ?? 3 })
                        : t("maxPersons"),
                    },
                    {
                      icon: Globe,
                      label: t("languages"),
                      value: t("allLanguages"),
                    },
                    {
                      icon: MapPin,
                      label: t("meetingPoint"),
                      value: t(`${tour.translationKey}.meeting`),
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl p-4 border border-gray-100"
                    >
                      <item.icon
                        size={20}
                        className="text-basque-red mb-2"
                      />
                      <p className="text-xs text-basque-gray mb-1">
                        {item.label}
                      </p>
                      <p className="text-sm font-medium text-basque-dark">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

              {/* Description */}
              <ScrollReveal>
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                  <h2 className="font-display text-xl text-basque-dark mb-4">
                    {t("aboutTour")}
                  </h2>
                  <p className="text-basque-gray leading-relaxed text-sm">
                    {t(`${tour.translationKey}.about`)}
                  </p>
                </div>
              </ScrollReveal>

              {/* Highlights */}
              <ScrollReveal>
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                  <h2 className="font-display text-xl text-basque-dark mb-4">
                    {t("included")}
                  </h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {tour.highlights.map((highlight, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-basque-dark/80"
                      >
                        <CheckCircle
                          size={16}
                          className="text-basque-green shrink-0"
                        />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>

              {/* Pricing info */}
              <ScrollReveal>
                <div className="bg-basque-cream rounded-xl p-6">
                  <h2 className="font-display text-xl text-basque-dark mb-3">
                    {t("pricing")}
                  </h2>
                  {tour.isPrivate ? (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-basque-gray">{t("privateGroup")}</span>
                        <span className="font-semibold text-basque-dark">{tour.groupPrice}€</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-basque-gray">{t("privateMaxPersons", { n: tour.maxGroupSize ?? 3 })}</span>
                        <span className="font-semibold text-basque-green">{t("included")}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-basque-gray">{t("adults")}</span>
                        <span className="font-semibold text-basque-dark">{tour.price}€</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-basque-gray">{t("halfTeen")}</span>
                        <span className="font-semibold text-basque-dark">5€</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-basque-gray">{t("freeChildren")}</span>
                        <span className="font-semibold text-basque-green">0€</span>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            </div>

            {/* Right - Booking or Request Widget */}
            <div className="lg:col-span-1">
              <div className="sticky top-28">
                {tour.isPrivate ? (
                  <TourRequestWidget tour={tour} />
                ) : (
                  <BookingWidget tour={tour} />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
