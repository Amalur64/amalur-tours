export function generateBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: "Amalur Tours",
    description:
      "Visites guidées à pied à Bayonne et Biarritz au Pays Basque. Tours en français, anglais et espagnol avec une guide locale passionnée.",
    url: "https://amalur-tours.com",
    telephone: "+33600000000",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bayonne",
      addressRegion: "Pyrénées-Atlantiques",
      postalCode: "64100",
      addressCountry: "FR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 43.4929,
      longitude: -1.4748,
    },
    image: "https://amalur-tours.com/images/og-image.jpg",
    priceRange: "25€-45€",
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
      reviewCount: "47",
    },
    availableLanguage: [
      { "@type": "Language", name: "French" },
      { "@type": "Language", name: "English" },
      { "@type": "Language", name: "Spanish" },
    ],
    touristType: ["Cultural tourism", "Walking tours", "Heritage tourism"],
  };
}
