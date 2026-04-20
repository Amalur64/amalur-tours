import type { MetadataRoute } from "next";
import { tours } from "@/lib/tours";
import { blogArticles } from "@/lib/blog";
import { routing } from "@/i18n/routing";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.amalurtours.com";

// Build hreflang alternates for a given path (e.g. "" | "/tours" | "/tours/bayonne")
function alternates(path: string) {
  return {
    languages: Object.fromEntries(
      routing.locales.map((locale) => [locale, `${siteUrl}/${locale}${path}`])
    ) as Record<string, string>,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages — one entry per locale, with hreflang for all locales
  const staticPages = ["", "/tours", "/about", "/contact", "/groups", "/blog", "/reviews"];

  for (const locale of routing.locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${siteUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === "" ? "weekly" : "monthly",
        priority: page === "" ? 1.0 : 0.8,
        alternates: alternates(page),
      });
    }

    // Tour pages
    for (const tour of tours) {
      const path = `/tours/${tour.slug}`;
      entries.push({
        url: `${siteUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
        alternates: alternates(path),
      });
    }

    // Blog articles
    for (const article of blogArticles) {
      const path = `/blog/${article.slug}`;
      entries.push({
        url: `${siteUrl}/${locale}${path}`,
        lastModified: new Date(article.date),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: alternates(path),
      });
    }
  }

  return entries;
}
