import type { Metadata } from "next";

const siteUrl = "https://www.amalurtours.com";

const ogImage = {
  url: `${siteUrl}/images/og-image.jpg`,
  width: 1200,
  height: 630,
  alt: "Amalur Tours — Visites guidées au Pays Basque",
};

// ─── Pages statiques ───────────────────────────────────────────────────────────

export const homeMetadata: Record<string, Metadata> = {
  fr: {
    title: "Visites Guidées Bayonne & Biarritz | Amalur Tours — Pays Basque",
    description:
      "Découvrez le Pays Basque avec une guide locale passionnée. Visites guidées à pied à Bayonne et Biarritz en français, anglais et espagnol. Petits groupes, authenticité garantie. À partir de 25€.",
    openGraph: {
      title: "Visites Guidées Bayonne & Biarritz | Amalur Tours",
      description:
        "Guide locale passionnée au Pays Basque. Tours à pied, petits groupes, trilinguisme. Réservez votre expérience unique dès 25€.",
      images: [ogImage],
      locale: "fr_FR",
    },
  },
  en: {
    title: "Guided Tours Bayonne & Biarritz | Amalur Tours — Basque Country",
    description:
      "Discover the Basque Country with a passionate local guide. Walking tours in Bayonne and Biarritz in French, English and Spanish. Small groups, authentic experience. From €25.",
    openGraph: {
      title: "Guided Tours Bayonne & Biarritz | Amalur Tours",
      description:
        "Passionate local guide in the Basque Country. Walking tours, small groups, trilingual experience. Book your unique adventure from €25.",
      images: [ogImage],
      locale: "en_US",
    },
  },
  es: {
    title: "Visitas Guiadas Bayona & Biarritz | Amalur Tours — País Vasco",
    description:
      "Descubre el País Vasco con una guía local apasionada. Visitas guiadas a pie en Bayona y Biarritz en francés, inglés y español. Grupos pequeños, experiencia auténtica. Desde 25€.",
    openGraph: {
      title: "Visitas Guiadas Bayona & Biarritz | Amalur Tours",
      description:
        "Guía local apasionada en el País Vasco. Tours a pie, grupos pequeños, trilingüe. Reserva tu experiencia única desde 25€.",
      images: [ogImage],
      locale: "es_ES",
    },
  },
};

export const toursMetadata: Record<string, Metadata> = {
  fr: {
    title: "Nos Tours au Pays Basque | Bayonne & Biarritz — Amalur Tours",
    description:
      "Choisissez votre visite guidée : Bayonne (cathédrale UNESCO, chocolat, remparts) ou Biarritz (rocher de la Vierge, Grande Plage, villa royale). Tours en français, anglais, espagnol.",
    openGraph: {
      title: "Nos Tours au Pays Basque | Amalur Tours",
      description: "Visites guidées à pied à Bayonne et Biarritz. Guide locale passionnée, petits groupes, 3 langues.",
      images: [ogImage],
      locale: "fr_FR",
    },
  },
  en: {
    title: "Our Tours in the Basque Country | Bayonne & Biarritz — Amalur Tours",
    description:
      "Choose your guided tour: Bayonne (UNESCO cathedral, chocolate, ramparts) or Biarritz (Virgin Rock, Grand Beach, royal villa). Tours in French, English, Spanish.",
    openGraph: {
      title: "Our Tours in the Basque Country | Amalur Tours",
      description: "Walking tours in Bayonne and Biarritz. Passionate local guide, small groups, 3 languages.",
      images: [ogImage],
      locale: "en_US",
    },
  },
  es: {
    title: "Nuestros Tours en el País Vasco | Bayona & Biarritz — Amalur Tours",
    description:
      "Elige tu visita guiada: Bayona (catedral UNESCO, chocolate, murallas) o Biarritz (Roca de la Virgen, Gran Playa, villa real). Tours en francés, inglés, español.",
    openGraph: {
      title: "Nuestros Tours en el País Vasco | Amalur Tours",
      description: "Visitas guiadas a pie en Bayona y Biarritz. Guía local apasionada, grupos pequeños, 3 idiomas.",
      images: [ogImage],
      locale: "es_ES",
    },
  },
};

export const aboutMetadata: Record<string, Metadata> = {
  fr: {
    title: "À Propos | Amalur Tours — Guide Locale au Pays Basque",
    description:
      "Découvrez l'histoire d'Amalur Tours : une guide locale passionnée qui vous fait découvrir Bayonne et Biarritz de façon authentique. Visites en français, anglais et espagnol.",
    openGraph: {
      title: "À Propos | Amalur Tours",
      description: "Une guide locale passionnée au Pays Basque. Découvrez notre histoire et notre engagement pour des visites authentiques.",
      images: [ogImage],
      locale: "fr_FR",
    },
  },
  en: {
    title: "About Us | Amalur Tours — Local Guide in the Basque Country",
    description:
      "Discover the story of Amalur Tours: a passionate local guide who shows you Bayonne and Biarritz authentically. Tours in French, English and Spanish.",
    openGraph: {
      title: "About Us | Amalur Tours",
      description: "A passionate local guide in the Basque Country. Discover our story and commitment to authentic tours.",
      images: [ogImage],
      locale: "en_US",
    },
  },
  es: {
    title: "Sobre Nosotros | Amalur Tours — Guía Local en el País Vasco",
    description:
      "Descubre la historia de Amalur Tours: una guía local apasionada que te muestra Bayona y Biarritz de forma auténtica. Tours en francés, inglés y español.",
    openGraph: {
      title: "Sobre Nosotros | Amalur Tours",
      description: "Una guía local apasionada en el País Vasco. Descubre nuestra historia y compromiso con los tours auténticos.",
      images: [ogImage],
      locale: "es_ES",
    },
  },
};

export const contactMetadata: Record<string, Metadata> = {
  fr: {
    title: "Contact & Réservation | Amalur Tours — Bayonne & Biarritz",
    description:
      "Contactez Amalur Tours pour réserver votre visite guidée à Bayonne ou Biarritz. Réponse rapide, paiement sécurisé en ligne. reservations@amalurtours.com",
    openGraph: {
      title: "Contact | Amalur Tours",
      description: "Réservez votre visite guidée au Pays Basque. Contactez-nous par email ou réservez directement en ligne.",
      images: [ogImage],
      locale: "fr_FR",
    },
  },
  en: {
    title: "Contact & Booking | Amalur Tours — Bayonne & Biarritz",
    description:
      "Contact Amalur Tours to book your guided tour in Bayonne or Biarritz. Quick response, secure online payment. reservations@amalurtours.com",
    openGraph: {
      title: "Contact | Amalur Tours",
      description: "Book your guided tour in the Basque Country. Contact us by email or book directly online.",
      images: [ogImage],
      locale: "en_US",
    },
  },
  es: {
    title: "Contacto & Reserva | Amalur Tours — Bayona & Biarritz",
    description:
      "Contacta con Amalur Tours para reservar tu visita guiada en Bayona o Biarritz. Respuesta rápida, pago seguro en línea. reservations@amalurtours.com",
    openGraph: {
      title: "Contacto | Amalur Tours",
      description: "Reserva tu visita guiada en el País Vasco. Contáctanos por email o reserva directamente en línea.",
      images: [ogImage],
      locale: "es_ES",
    },
  },
};

export const blogMetadata: Record<string, Metadata> = {
  fr: {
    title: "Blog | Amalur Tours — Découvrir le Pays Basque",
    description:
      "Conseils, histoires et bons plans pour votre voyage au Pays Basque. Découvrez Bayonne, Biarritz, la culture basque, la gastronomie et bien plus avec Amalur Tours.",
    openGraph: {
      title: "Blog | Amalur Tours",
      description: "Conseils et histoires pour découvrir le Pays Basque. Culture, gastronomie, patrimoine.",
      images: [ogImage],
      locale: "fr_FR",
    },
  },
  en: {
    title: "Blog | Amalur Tours — Discover the Basque Country",
    description:
      "Tips, stories and insider guides for your trip to the Basque Country. Discover Bayonne, Biarritz, Basque culture, gastronomy and more with Amalur Tours.",
    openGraph: {
      title: "Blog | Amalur Tours",
      description: "Tips and stories to discover the Basque Country. Culture, gastronomy, heritage.",
      images: [ogImage],
      locale: "en_US",
    },
  },
  es: {
    title: "Blog | Amalur Tours — Descubrir el País Vasco",
    description:
      "Consejos, historias y guías para tu viaje al País Vasco. Descubre Bayona, Biarritz, la cultura vasca, la gastronomía y mucho más con Amalur Tours.",
    openGraph: {
      title: "Blog | Amalur Tours",
      description: "Consejos e historias para descubrir el País Vasco. Cultura, gastronomía, patrimonio.",
      images: [ogImage],
      locale: "es_ES",
    },
  },
};

export const giftMetadata: Record<string, Metadata> = {
  fr: {
    title: "Bon Cadeau — Offrez une Visite Guidée au Pays Basque | Amalur Tours",
    description:
      "Offrez une expérience inoubliable au Pays Basque ! Bon cadeau valable 1 an pour une visite guidée à Bayonne ou Biarritz. Livraison par email instantanée avec PDF imprimable.",
    openGraph: {
      title: "Bon Cadeau | Amalur Tours",
      description: "Offrez une visite guidée au Pays Basque. Bon cadeau valable 1 an, livraison instantanée.",
      images: [ogImage],
      locale: "fr_FR",
    },
  },
  en: {
    title: "Gift Voucher — Give a Guided Tour in the Basque Country | Amalur Tours",
    description:
      "Give an unforgettable experience in the Basque Country! Gift voucher valid 1 year for a guided tour in Bayonne or Biarritz. Instant email delivery with printable PDF.",
    openGraph: {
      title: "Gift Voucher | Amalur Tours",
      description: "Give a guided tour in the Basque Country. Valid 1 year, instant delivery.",
      images: [ogImage],
      locale: "en_US",
    },
  },
  es: {
    title: "Bono Regalo — Regala una Visita Guiada en el País Vasco | Amalur Tours",
    description:
      "¡Regala una experiencia inolvidable en el País Vasco! Bono regalo válido 1 año para una visita guiada en Bayona o Biarritz. Entrega instantánea por email con PDF imprimible.",
    openGraph: {
      title: "Bono Regalo | Amalur Tours",
      description: "Regala una visita guiada en el País Vasco. Válido 1 año, entrega instantánea.",
      images: [ogImage],
      locale: "es_ES",
    },
  },
};

// ─── Tours individuels ──────────────────────────────────────────────────────────

export const tourMetadata: Record<string, Record<string, Metadata>> = {
  bayonne: {
    fr: {
      title: "Visite Guidée de Bayonne | Cathédrale UNESCO, Chocolat, Remparts — Amalur Tours",
      description:
        "Explorez Bayonne avec une guide locale : cathédrale Sainte-Marie UNESCO, quartier du chocolat, remparts de Vauban, rives de la Nive. Visites en FR/EN/ES, dès 25€.",
      openGraph: {
        title: "Visite Guidée de Bayonne | Amalur Tours",
        description: "Cathédrale UNESCO, chocolat basque, remparts de Vauban. Guide locale passionnée, petit groupe.",
        images: [{ url: `${siteUrl}/images/tours/bayonne.jpg`, width: 1200, height: 630, alt: "Visite guidée Bayonne" }],
        locale: "fr_FR",
      },
    },
    en: {
      title: "Guided Tour of Bayonne | UNESCO Cathedral, Chocolate, Ramparts — Amalur Tours",
      description:
        "Explore Bayonne with a local guide: UNESCO Sainte-Marie Cathedral, chocolate quarter, Vauban ramparts, Nive riverside. Tours in FR/EN/ES, from €25.",
      openGraph: {
        title: "Guided Tour of Bayonne | Amalur Tours",
        description: "UNESCO Cathedral, Basque chocolate, Vauban ramparts. Passionate local guide, small group.",
        images: [{ url: `${siteUrl}/images/tours/bayonne.jpg`, width: 1200, height: 630, alt: "Guided tour Bayonne" }],
        locale: "en_US",
      },
    },
    es: {
      title: "Visita Guiada de Bayona | Catedral UNESCO, Chocolate, Murallas — Amalur Tours",
      description:
        "Explora Bayona con una guía local: catedral de Santa María UNESCO, barrio del chocolate, murallas de Vauban, orillas del Nive. Tours en FR/EN/ES, desde 25€.",
      openGraph: {
        title: "Visita Guiada de Bayona | Amalur Tours",
        description: "Catedral UNESCO, chocolate vasco, murallas de Vauban. Guía local apasionada, grupo pequeño.",
        images: [{ url: `${siteUrl}/images/tours/bayonne.jpg`, width: 1200, height: 630, alt: "Visita guiada Bayona" }],
        locale: "es_ES",
      },
    },
  },
  biarritz: {
    fr: {
      title: "Visite Guidée de Biarritz | Rocher de la Vierge, Grande Plage — Amalur Tours",
      description:
        "Découvrez Biarritz avec une guide locale : Rocher de la Vierge, Grande Plage, Port des Pêcheurs, Villa Eugénie. Visites en FR/EN/ES, dès 25€.",
      openGraph: {
        title: "Visite Guidée de Biarritz | Amalur Tours",
        description: "Rocher de la Vierge, Grande Plage, hôtel du Palais. Guide locale passionnée, petit groupe.",
        images: [{ url: `${siteUrl}/images/tours/biarritz.jpg`, width: 1200, height: 630, alt: "Visite guidée Biarritz" }],
        locale: "fr_FR",
      },
    },
    en: {
      title: "Guided Tour of Biarritz | Virgin Rock, Grand Beach — Amalur Tours",
      description:
        "Discover Biarritz with a local guide: Virgin Rock, Grand Beach, Fishermen's Port, Villa Eugénie. Tours in FR/EN/ES, from €25.",
      openGraph: {
        title: "Guided Tour of Biarritz | Amalur Tours",
        description: "Virgin Rock, Grand Beach, Hotel du Palais. Passionate local guide, small group.",
        images: [{ url: `${siteUrl}/images/tours/biarritz.jpg`, width: 1200, height: 630, alt: "Guided tour Biarritz" }],
        locale: "en_US",
      },
    },
    es: {
      title: "Visita Guiada de Biarritz | Roca de la Virgen, Gran Playa — Amalur Tours",
      description:
        "Descubre Biarritz con una guía local: Roca de la Virgen, Gran Playa, Puerto de los Pescadores, Villa Eugenia. Tours en FR/EN/ES, desde 25€.",
      openGraph: {
        title: "Visita Guiada de Biarritz | Amalur Tours",
        description: "Roca de la Virgen, Gran Playa, Hotel du Palais. Guía local apasionada, grupo pequeño.",
        images: [{ url: `${siteUrl}/images/tours/biarritz.jpg`, width: 1200, height: 630, alt: "Visita guiada Biarritz" }],
        locale: "es_ES",
      },
    },
  },
  "san-sebastian": {
    fr: {
      title: "Tour Privé de Saint-Sébastien | Expérience Exclusive — Amalur Tours",
      description:
        "Tour privé exclusif à Saint-Sébastien (Donostia) : vieille ville, plage de La Concha, marché de la Bretxa. Max 3 personnes. Guide locale trilingue.",
      openGraph: {
        title: "Tour Privé Saint-Sébastien | Amalur Tours",
        description: "Expérience privée et exclusive à Donostia. Max 3 personnes, guide locale trilingue.",
        images: [{ url: `${siteUrl}/images/tours/sansebastian.jpg`, width: 1200, height: 630, alt: "Tour privé Saint-Sébastien" }],
        locale: "fr_FR",
      },
    },
    en: {
      title: "Private Tour of San Sebastián | Exclusive Experience — Amalur Tours",
      description:
        "Exclusive private tour of San Sebastián (Donostia): old town, La Concha beach, Bretxa market. Max 3 persons. Trilingual local guide.",
      openGraph: {
        title: "Private Tour San Sebastián | Amalur Tours",
        description: "Private and exclusive experience in Donostia. Max 3 persons, trilingual local guide.",
        images: [{ url: `${siteUrl}/images/tours/sansebastian.jpg`, width: 1200, height: 630, alt: "Private tour San Sebastián" }],
        locale: "en_US",
      },
    },
    es: {
      title: "Tour Privado de San Sebastián | Experiencia Exclusiva — Amalur Tours",
      description:
        "Tour privado exclusivo por San Sebastián (Donostia): parte vieja, playa de La Concha, mercado de la Bretxa. Máx 3 personas. Guía local trilingüe.",
      openGraph: {
        title: "Tour Privado San Sebastián | Amalur Tours",
        description: "Experiencia privada y exclusiva en Donostia. Máx 3 personas, guía local trilingüe.",
        images: [{ url: `${siteUrl}/images/tours/sansebastian.jpg`, width: 1200, height: 630, alt: "Tour privado San Sebastián" }],
        locale: "es_ES",
      },
    },
  },
};

// ─── Helper commun ─────────────────────────────────────────────────────────────

export function buildMetadata(base: Metadata, locale: string): Metadata {
  const alternates = {
    canonical: undefined as string | undefined,
    languages: {} as Record<string, string>,
  };

  return {
    metadataBase: new URL(siteUrl),
    ...base,
    openGraph: {
      type: "website",
      siteName: "Amalur Tours",
      ...base.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      title: base.title as string,
      description: base.description as string,
      images: [`${siteUrl}/images/og-image.jpg`],
    },
    alternates,
  };
}
