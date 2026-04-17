import Image from "next/image";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { blogArticles, getArticleBySlug } from "@/lib/blog";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Clock, ArrowLeft, MapPin } from "lucide-react";

export function generateStaticParams() {
  return blogArticles.map((article) => ({ slug: article.slug }));
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const article = getArticleBySlug(slug);
  if (!article) notFound();

  return <ArticleContent slug={slug} />;
}

function ArticleContent({ slug }: { slug: string }) {
  const t = useTranslations("blog");
  const article = getArticleBySlug(slug)!;

  const categoryColors: Record<string, string> = {
    culture: "bg-basque-ocean/10 text-basque-ocean",
    gastronomie: "bg-basque-red/10 text-basque-red",
    nature: "bg-basque-green/10 text-basque-green",
    histoire: "bg-basque-gold/20 text-basque-gold",
    pratique: "bg-purple-100 text-purple-700",
  };

  // Get content paragraphs
  const contentKey = `articles.${article.titleKey}.content`;
  const paragraphs: string[] = [];
  for (let i = 1; i <= 20; i++) {
    try {
      const p = t(`${contentKey}.p${i}` as "readMore");
      if (p && !p.startsWith("blog.")) {
        paragraphs.push(p);
      }
    } catch {
      break;
    }
  }

  // Get subtitles
  const subtitles: Record<number, string> = {};
  for (let i = 1; i <= 10; i++) {
    try {
      const s = t(`${contentKey}.h${i}` as "readMore");
      if (s && !s.startsWith("blog.")) {
        subtitles[i] = s;
      }
    } catch {
      break;
    }
  }

  return (
    <div className="pt-24 lg:pt-28">
      {/* Hero */}
      <section className="relative h-[35vh] sm:h-[45vh] overflow-hidden">
        <Image
          src={article.image}
          alt={t(`articles.${article.titleKey}.title`)}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full flex items-end">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
            <span className={`inline-block text-xs font-semibold px-3 py-1.5 rounded-full mb-4 ${categoryColors[article.category]}`}>
              {t(`categories.${article.category}`)}
            </span>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mb-3">
              {t(`articles.${article.titleKey}.title`)}
            </h1>
            <div className="flex items-center gap-4 text-white/70 text-sm">
              <time>
                {new Date(article.date).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {article.readingTime} min de lecture
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 lg:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm text-basque-gray hover:text-basque-red transition-colors mb-8"
          >
            <ArrowLeft size={14} />
            {t("backToBlog")}
          </Link>

          <ScrollReveal>
            <article className="prose prose-lg max-w-none">
              {paragraphs.map((paragraph, i) => {
                const elements: React.ReactNode[] = [];

                // Check if there's a subtitle before this paragraph
                if (subtitles[i + 1]) {
                  elements.push(
                    <h2 key={`h-${i}`} className="font-display text-2xl text-basque-dark mt-10 mb-4">
                      {subtitles[i + 1]}
                    </h2>
                  );
                }

                elements.push(
                  <p key={`p-${i}`} className="text-basque-dark/80 leading-relaxed mb-5">
                    {paragraph}
                  </p>
                );

                return elements;
              })}
            </article>
          </ScrollReveal>

          {/* CTA */}
          <ScrollReveal>
            <div className="mt-12 bg-basque-cream rounded-2xl p-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <MapPin size={20} className="text-basque-red" />
                <h3 className="font-display text-xl text-basque-dark">
                  {t("ctaTitle")}
                </h3>
              </div>
              <p className="text-basque-gray mb-5">
                {t("ctaText")}
              </p>
              <Link
                href="/tours"
                className="inline-block bg-basque-red hover:bg-basque-red-dark text-white px-6 py-3 rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-basque-red/25"
              >
                {t("ctaButton")}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
