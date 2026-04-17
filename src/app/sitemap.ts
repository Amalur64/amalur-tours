import type { MetadataRoute } from "next";
import { tours } from "@/lib/tours";
import { blogArticles } from "@/lib/blog";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.amalurtours.com";

  const entries: MetadataRoute.Sitemap = [];

  // Static pages per locale
  const staticPages = ["", "/tours", "/about", "/contact", "/groups", "/blog"];

  for (const locale of routing.locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${siteUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === "" ? "weekly" : "monthly",
        priority: page === "" ? 1.0 : 0.8,
      });
    }

    // Tour pages
    for (const tour of tours) {
      entries.push({
        url: `${siteUrl}/${locale}/tours/${tour.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
      });
    }

    // Blog articles
    for (const article of blogArticles) {
      entries.push({
        url: `${siteUrl}/${locale}/blog/${article.slug}`,
        lastModified: new Date(article.date),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
