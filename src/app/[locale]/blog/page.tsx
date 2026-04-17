import Image from "next/image";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { blogArticles } from "@/lib/blog";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Clock, ArrowRight } from "lucide-react";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <BlogContent />;
}

function BlogContent() {
  const t = useTranslations("blog");

  const categoryColors: Record<string, string> = {
    culture: "bg-basque-ocean/10 text-basque-ocean",
    gastronomie: "bg-basque-red/10 text-basque-red",
    nature: "bg-basque-green/10 text-basque-green",
    histoire: "bg-basque-gold/20 text-basque-gold",
    pratique: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="pt-24 lg:pt-28">
      {/* Header */}
      <section className="bg-gradient-to-br from-basque-ocean to-basque-green py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl lg:text-5xl text-white mb-3">
            Blog
          </h1>
          <p className="text-white/80 text-lg">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {blogArticles.map((article, i) => (
              <ScrollReveal key={article.slug} delay={i * 80}>
                <article className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={article.image}
                      alt={t(`articles.${article.titleKey}.title`)}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className="absolute top-3 left-3 z-10">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[article.category] || "bg-gray-100 text-gray-600"}`}>
                        {t(`categories.${article.category}`)}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-3 text-xs text-basque-gray mb-3">
                      <time>{new Date(article.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</time>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {article.readingTime} min
                      </span>
                    </div>

                    <h2 className="font-display text-lg text-basque-dark mb-2 group-hover:text-basque-red transition-colors line-clamp-2">
                      {t(`articles.${article.titleKey}.title`)}
                    </h2>

                    <p className="text-sm text-basque-gray leading-relaxed mb-4 line-clamp-3">
                      {t(`articles.${article.titleKey}.excerpt`)}
                    </p>

                    <Link
                      href={`/blog/${article.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-basque-red hover:text-basque-red-dark transition-colors"
                    >
                      {t("readMore")}
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
