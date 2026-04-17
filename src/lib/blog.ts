export interface BlogArticle {
  slug: string;
  titleKey: string;
  category: "culture" | "gastronomie" | "nature" | "histoire" | "pratique";
  image: string;
  date: string;
  readingTime: number;
  seoKeywords: string[];
}

export const blogArticles: BlogArticle[] = [
  {
    slug: "secrets-chocolat-bayonne",
    titleKey: "chocolat",
    category: "gastronomie",
    image: "/images/blog/chocolat.jpg",
    date: "2026-03-15",
    readingTime: 7,
    seoKeywords: ["chocolat bayonne", "chocolat basque", "histoire chocolat france"],
  },
  {
    slug: "maisons-labourdines-architecture-basque",
    titleKey: "architecture",
    category: "culture",
    image: "/images/blog/maisons.jpg",
    date: "2026-03-10",
    readingTime: 7,
    seoKeywords: ["maison basque", "architecture labourdine", "colombages pays basque"],
  },
  {
    slug: "pelote-basque-sport-ancestral",
    titleKey: "pelote",
    category: "culture",
    image: "/images/blog/pelote.jpg",
    date: "2026-03-05",
    readingTime: 8,
    seoKeywords: ["pelote basque", "chistera", "fronton pays basque", "jai alai"],
  },
  {
    slug: "villages-secrets-interieur-pays-basque",
    titleKey: "villages",
    category: "nature",
    image: "/images/blog/villages.jpg",
    date: "2026-02-28",
    readingTime: 8,
    seoKeywords: ["villages pays basque", "villages basques intérieur", "Ainhoa Sare Espelette"],
  },
  {
    slug: "corsaires-bayonnais-histoire-maritime",
    titleKey: "corsaires",
    category: "histoire",
    image: "/images/blog/corsaires.jpg",
    date: "2026-02-20",
    readingTime: 7,
    seoKeywords: ["corsaires bayonne", "histoire maritime basque", "pirates golfe gascogne"],
  },
  {
    slug: "euskara-langue-mysterieuse-europe",
    titleKey: "euskara",
    category: "culture",
    image: "/images/blog/euskara.jpg",
    date: "2026-02-15",
    readingTime: 7,
    seoKeywords: ["langue basque", "euskara", "basque langue isolée", "apprendre basque"],
  },
  {
    slug: "surf-biarritz-origines-culture-glisse",
    titleKey: "surf",
    category: "culture",
    image: "/images/blog/surf.jpg",
    date: "2026-02-10",
    readingTime: 7,
    seoKeywords: ["surf biarritz", "histoire surf france", "côte basque surf", "spots surf pays basque"],
  },
  {
    slug: "gastronomie-basque-au-dela-pintxos",
    titleKey: "gastronomie",
    category: "gastronomie",
    image: "/images/blog/gastronomie.jpg",
    date: "2026-02-05",
    readingTime: 8,
    seoKeywords: ["gastronomie basque", "cuisine pays basque", "spécialités basques", "axoa piment espelette"],
  },
  {
    slug: "fetes-bayonne-traditions-vivantes",
    titleKey: "fetes",
    category: "culture",
    image: "/images/blog/fetes.jpg",
    date: "2026-01-30",
    readingTime: 7,
    seoKeywords: ["fêtes de bayonne", "fêtes basques", "traditions bayonne", "roi léon"],
  },
  {
    slug: "sentiers-cotiers-pays-basque-randonnee",
    titleKey: "sentiers",
    category: "nature",
    image: "/images/blog/sentiers.jpg",
    date: "2026-01-25",
    readingTime: 7,
    seoKeywords: ["randonnée côte basque", "sentier littoral pays basque", "corniche basque", "GR10"],
  },
  {
    slug: "cathedrale-bayonne-tresor-gothique-meconnu",
    titleKey: "cathedrale",
    category: "histoire",
    image: "/images/blog/cathedrale.jpg",
    date: "2026-01-20",
    readingTime: 7,
    seoKeywords: ["cathédrale bayonne", "Sainte-Marie bayonne", "gothique pays basque", "UNESCO bayonne"],
  },
  {
    slug: "piment-espelette-or-rouge-pays-basque",
    titleKey: "piment",
    category: "gastronomie",
    image: "/images/blog/piment.jpg",
    date: "2026-01-15",
    readingTime: 7,
    seoKeywords: ["piment espelette", "piment basque", "AOP espelette", "gorria"],
  },
];

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return blogArticles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(category: string): BlogArticle[] {
  return blogArticles.filter((a) => a.category === category);
}
