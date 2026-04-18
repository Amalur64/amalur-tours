export type TourLocale = "fr" | "en" | "es";

export interface Schedule {
  time: string;
  label: string;
  locales: TourLocale[];
}

export interface Tour {
  id: string;
  slug: string;
  translationKey: string;
  city: string;
  price: number;
  image: string;
  schedules: Schedule[];
  highlights: string[];
  isPrivate?: boolean;
  groupPrice?: number;
  maxGroupSize?: number;
}

export const tours: Tour[] = [
  {
    id: "Bayonne Walking Tour",
    slug: "bayonne",
    translationKey: "bayonne",
    city: "Bayonne",
    price: 25,
    image: "/images/tours/bayonne.jpg",
    schedules: [
      { time: "09:30", label: "morning", locales: ["en"] },
      { time: "16:30", label: "afternoon", locales: ["fr", "es"] },
    ],
    highlights: [
      "Cathédrale Sainte-Marie (UNESCO)",
      "Quartier du Petit Bayonne",
      "Remparts de Vauban",
      "Quartier du chocolat",
      "Rives de la Nive",
      "Halles de Bayonne",
    ],
  },
  {
    id: "Biarritz Walking Tour",
    slug: "biarritz",
    translationKey: "biarritz",
    city: "Biarritz",
    price: 25,
    image: "/images/tours/biarritz.jpg",
    schedules: [
      { time: "11:45", label: "morning", locales: ["en"] },
      { time: "14:00", label: "afternoon", locales: ["fr", "es"] },
    ],
    highlights: [
      "Rocher de la Vierge",
      "Grande Plage & Casino",
      "Port des Pêcheurs",
      "Côte des Basques",
      "Villa Eugénie & Hôtel du Palais",
      "Plateau de l'Atalaye",
    ],
  },
  {
    id: "Bayonne + Biarritz Combo",
    slug: "combo",
    translationKey: "combo",
    city: "Bayonne & Biarritz",
    price: 45,
    image: "/images/tours/combo.jpg",
    schedules: [
      { time: "09:30", label: "morning", locales: ["en"] },
      { time: "14:00", label: "afternoon", locales: ["fr", "es"] },
    ],
    highlights: [
      "Cathédrale Sainte-Marie (UNESCO)",
      "Remparts de Vauban & chocolat",
      "Rocher de la Vierge",
      "Grande Plage & Port des Pêcheurs",
      "Transport inclus entre les deux villes",
      "Expérience complète du Pays Basque",
    ],
  },
  {
    id: "San Sebastián Private Tour",
    slug: "san-sebastian",
    translationKey: "sansebastian",
    city: "San Sebastián",
    price: 450,
    groupPrice: 450,
    isPrivate: true,
    maxGroupSize: 3,
    image: "/images/tours/sansebastian.jpg",
    schedules: [
      { time: "09:00", label: "morning", locales: ["fr", "en", "es"] },
    ],
    highlights: [
      "Prise en charge à votre hôtel",
      "Plage de la Concha",
      "Mairie & Port",
      "Casco Viejo (Vieille Ville)",
      "Kursaal & Quartier Romantique",
      "Pont & Hôtel Maria Cristina",
      "Théâtre Victoria Eugenia",
      "Cathédrale Buen Pastor",
      "Recommandations pintxos & visites",
    ],
  },
];

export function getTourBySlug(slug: string): Tour | undefined {
  return tours.find((t) => t.slug === slug);
}

export function getSchedulesForLocale(
  tour: Tour,
  locale: string,
): Schedule[] {
  return tour.schedules.filter((s) =>
    s.locales.includes(locale as TourLocale),
  );
}

export function calculatePrice(
  tour: Tour,
  adults: number,
  teens: number,
): number {
  return adults * tour.price + teens * 5;
}
