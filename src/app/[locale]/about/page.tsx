import Image from "next/image";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Heart, Leaf, Flame } from "lucide-react";

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
      icon: Leaf,
      title: t("values.sustainable.title"),
      description: t("values.sustainable.description"),
      color: "bg-basque-green/10 text-basque-green",
    },
    {
      icon: Flame,
      title: t("values.passionate.title"),
      description: t("values.passionate.description"),
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
                  src="/images/about.jpg"
                  alt="Amalur Tours"
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
