export interface BlogArticle {
  slug: string;
  titleKey: string;
  category: "culture" | "gastronomie" | "nature" | "histoire" | "pratique";
  image: string;
  date: string;
  readingTime: number;
  seoKeywords: string[];
  // Numéros de paragraphes (1-indexés) où commence chaque section (h1, h2, h3...)
  sectionBreaks: number[];
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
    sectionBreaks: [1, 3, 5, 7, 9],   // 5 sections × 2 paragraphes
  },
  {
    slug: "maisons-labourdines-architecture-basque",
    titleKey: "architecture",
    category: "culture",
    image: "/images/blog/maisons.jpg",
    date: "2026-03-10",
    readingTime: 7,
    seoKeywords: ["maison basque", "architecture labourdine", "colombages pays basque"],
    sectionBreaks: [1, 3, 5, 7, 9],   // 5 sections × 2 paragraphes
  },
  {
    slug: "pelote-basque-sport-ancestral",
    titleKey: "pelote",
    category: "culture",
    image: "/images/blog/pelote.jpg",
    date: "2026-03-05",
    readingTime: 8,
    seoKeywords: ["pelote basque", "chistera", "fronton pays basque", "jai alai"],
    sectionBreaks: [1, 3, 5, 7, 9],   // 5 sections × 2 paragraphes
  },
  {
    slug: "villages-secrets-interieur-pays-basque",
    titleKey: "villages",
    category: "nature",
    image: "/images/blog/villages.jpg",
    date: "2026-02-28",
    readingTime: 8,
    seoKeywords: ["villages pays basque", "villages basques intérieur", "Ainhoa Sare Espelette"],
    sectionBreaks: [1, 3, 5, 7, 9],   // 5 sections × 2 paragraphes
  },
  {
    slug: "corsaires-bayonnais-histoire-maritime",
    titleKey: "corsaires",
    category: "histoire",
    image: "/images/blog/corsaires.jpg",
    date: "2026-02-20",
    readingTime: 7,
    seoKeywords: ["corsaires bayonne", "histoire maritime basque", "pirates golfe gascogne"],
    sectionBreaks: [1, 3, 5, 7],      // 4 sections × 2 paragraphes
  },
  {
    slug: "euskara-langue-mysterieuse-europe",
    titleKey: "euskara",
    category: "culture",
    image: "/images/blog/euskara.jpg",
    date: "2026-02-15",
    readingTime: 7,
    seoKeywords: ["langue basque", "euskara", "basque langue isolée", "apprendre basque"],
    sectionBreaks: [1, 3, 5, 7],      // 4 sections × 2 paragraphes
  },
  {
    slug: "surf-biarritz-origines-culture-glisse",
    titleKey: "surf",
    category: "culture",
    image: "/images/blog/surf.jpg",
    date: "2026-02-10",
    readingTime: 7,
    seoKeywords: ["surf biarritz", "histoire surf france", "côte basque surf", "spots surf pays basque"],
    sectionBreaks: [1, 3, 5, 7],      // 4 sections × 2 paragraphes
  },
  {
    slug: "gastronomie-basque-au-dela-pintxos",
    titleKey: "gastronomie",
    category: "gastronomie",
    image: "/images/blog/gastronomie.jpg",
    date: "2026-02-05",
    readingTime: 8,
    seoKeywords: ["gastronomie basque", "cuisine pays basque", "spécialités basques", "axoa piment espelette"],
    sectionBreaks: [1, 3, 5, 7],      // 4 sections × 2 paragraphes
  },
  {
    slug: "fetes-bayonne-traditions-vivantes",
    titleKey: "fetes",
    category: "culture",
    image: "/images/blog/fetes.jpg",
    date: "2026-01-30",
    readingTime: 7,
    seoKeywords: ["fêtes de bayonne", "fêtes basques", "traditions bayonne", "roi léon"],
    sectionBreaks: [1, 3, 5, 7],      // 4 sections × 2 paragraphes
  },
  {
    slug: "sentiers-cotiers-pays-basque-randonnee",
    titleKey: "sentiers",
    category: "nature",
    image: "/images/blog/sentiers.jpg",
    date: "2026-01-25",
    readingTime: 7,
    seoKeywords: ["randonnée côte basque", "sentier littoral pays basque", "corniche basque", "GR10"],
    sectionBreaks: [1, 3, 5, 7],      // 4 sections × 2 paragraphes
  },
  {
    slug: "cathedrale-bayonne-tresor-gothique-meconnu",
    titleKey: "cathedrale",
    category: "histoire",
    image: "/images/blog/cathedrale2.jpg",
    date: "2026-01-20",
    readingTime: 7,
    seoKeywords: ["cathédrale bayonne", "Sainte-Marie bayonne", "gothique pays basque", "UNESCO bayonne"],
    sectionBreaks: [1, 3, 5, 7],      // 4 sections × 2 paragraphes
  },
  {
    slug: "piment-espelette-or-rouge-pays-basque",
    titleKey: "piment",
    category: "gastronomie",
    image: "/images/blog/piment.jpg",
    date: "2026-01-15",
    readingTime: 7,
    seoKeywords: ["piment espelette", "piment basque", "AOP espelette", "gorria"],
    sectionBreaks: [1, 3, 5, 7],      // 4 sections × 2 paragraphes
  },
];

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return blogArticles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(category: string): BlogArticle[] {
  return blogArticles.filter((a) => a.category === category);
}
