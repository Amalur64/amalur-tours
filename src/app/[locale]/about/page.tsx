import type { Metadata } from "next";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Heart, Users, Globe, MapPin } from "lucide-react";
import { aboutMetadata, buildMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata(aboutMetadata[locale] || aboutMetadata.fr, locale);
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AboutContent />;
}

function AboutContent() {
  const t = useTranslations("about");

  const values = [
    {
      icon: Heart,
      title: t("values.authentic.title"),
      description: t("values.authentic.description"),
      color: "bg-basque-red/10 text-basque-red",
    },
    {
      icon: Users,
      title: t("values.smallGroup.title"),
      description: t("values.smallGroup.description"),
      color: "bg-basque-ocean/10 text-basque-ocean",
    },
    {
      icon: MapPin,
      title: t("values.local.title"),
      description: t("values.local.description"),
      color: "bg-basque-green/10 text-basque-green",
    },
    {
      icon: Globe,
      title: t("values.multilingual.title"),
      description: t("values.multilingual.description"),
      color: "bg-basque-gold/20 text-basque-gold",
    },
  ];

  return (
    <div className="pt-24 lg:pt-28">
      {/* Header */}
      <section className="bg-gradient-to-br from-basque-ocean to-basque-green py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl lg:text-5xl text-white mb-3">
            {t("title")}
          </h1>
          <p className="text-white/80 text-lg">{t("subtitle")}</p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Photo */}
            <ScrollReveal animation="slide-in-left">
              <div className="aspect-[4/5] rounded-2xl relative overflow-hidden">
                <Image
                  src="/images/blog/combo.jpg"
                  alt="Vallée basque au coucher de soleil"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </ScrollReveal>

            {/* Text */}
            <ScrollReveal animation="slide-in-right">
              <div className="space-y-6">
                <h2 className="font-display text-3xl text-basque-dark">
                  {t("subtitle")}
                </h2>
                <p className="text-basque-gray leading-relaxed text-lg">
                  {t("story")}
                </p>
                <p className="text-basque-gray leading-relaxed text-lg">
                  {t("philosophy")}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-12">
            <h2 className="font-display text-3xl lg:text-4xl text-basque-dark">
              {t("values.title")}
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="bg-basque-cream rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                  <div
                    className={`w-16 h-16 rounded-2xl ${value.color} flex items-center justify-center mx-auto mb-5`}
                  >
                    <value.icon size={32} />
                  </div>
                  <h3 className="font-display text-xl text-basque-dark mb-3">
                    {value.title}
                  </h3>
                  <p className="text-basque-gray leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
