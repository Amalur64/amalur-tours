export function generateBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Amalur Tours",
    description:
      "Visites guidées à pied à Bayonne et Biarritz au Pays Basque. Tours en français, anglais et espagnol avec une guide locale passionnée.",
    url: "https://www.amalurtours.com",
    telephone: "+33750038651",
    email: "reservations@amalurtours.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "25 rue de l'Union",
      addressLocality: "Anglet",
      addressRegion: "Pyrénées-Atlantiques",
      postalCode: "64600",
      addressCountry: "FR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 43.4929,
      longitude: -1.4748,
    },
    image: "https://www.amalurtours.com/images/og-image.jpg",
    priceRange: "25€-50€",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "09:00",
      closes: "19:00",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      bestRating: "5",
      worstRating: "1",
      reviewCount: "12",
    },
    availableLanguage: [
      { "@type": "Language", name: "French" },
      { "@type": "Language", name: "English" },
      { "@type": "Language", name: "Spanish" },
    ],
  };
}
