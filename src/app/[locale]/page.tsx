import type { Metadata } from "next";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { tours } from "@/lib/tours";
import { TourCard } from "@/components/TourCard";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { ScrollReveal } from "@/components/ScrollReveal";
import { MapPin, Globe, Users, Heart, ChevronDown } from "lucide-react";
import { homeMetadata, buildMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata(homeMetadata[locale] || homeMetadata.fr, locale);
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations("hero");
  const whyUs = useTranslations("whyUs");

  const features = [
    {
      icon: MapPin,
      title: whyUs("local.title"),
      description: whyUs("local.description"),
    },
    {
      icon: Globe,
      title: whyUs("languages.title"),
      description: whyUs("languages.description"),
    },
    {
      icon: Users,
      title: whyUs("small.title"),
      description: whyUs("small.description"),
    },
    {
      icon: Heart,
      title: whyUs("authentic.title"),
      description: whyUs("authentic.description"),
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <Image
          src="/images/hero.jpg"
          alt="Port des Pêcheurs, Biarritz"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-6 animate-fade-in-up">
            {t("title")}
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200">
            {t("subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
            <Link
              href="/tours"
              className="bg-basque-red hover:bg-basque-red-dark text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 hover:shadow-2xl hover:shadow-basque-red/30 hover:-translate-y-0.5"
            >
              {t("cta")}
            </Link>
            <a
              href="#tours"
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200"
            >
              {t("discover")}
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <a
          href="#tours"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce"
          aria-label="Scroll"
        >
          <ChevronDown size={32} />
        </a>
      </section>

      {/* Tours */}
      <section id="tours" className="py-16 lg:py-24 bg-basque-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-12">
            <ToursHeader />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {tours.map((tour, i) => (
              <ScrollReveal key={tour.id} delay={i * 100}>
                <TourCard tour={tour} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-12">
            <h2 className="font-display text-3xl lg:text-4xl text-basque-dark">
              {whyUs("title")}
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="text-center p-6">
                  <div className="w-14 h-14 rounded-2xl bg-basque-red/10 flex items-center justify-center mx-auto mb-4">
                    <feature.icon size={28} className="text-basque-red" />
                  </div>
                  <h3 className="font-display text-lg text-basque-dark mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-basque-gray leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialCarousel />

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-basque-red to-basque-red-dark">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="font-display text-3xl lg:text-4xl text-white mb-4">
              {t("cta")}
            </h2>
            <p className="text-white/80 text-lg mb-8">{t("subtitle")}</p>
            <Link
              href="/tours"
              className="inline-block bg-white text-basque-red hover:bg-basque-cream px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 hover:shadow-2xl hover:-translate-y-0.5"
            >
              {t("cta")}
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}

function ToursHeader() {
  const t = useTranslations("tours");
  return (
    <>
      <h2 className="font-display text-3xl lg:text-4xl text-basque-dark mb-3">
        {t("title")}
      </h2>
      <p className="text-basque-gray text-lg max-w-xl mx-auto">
        {t("subtitle")}
      </p>
    </>
  );
}
