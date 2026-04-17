export interface Testimonial {
  rating: number;
  text: {
    fr: string;
    en: string;
    es: string;
  };
  name: string;
  country: string;
  tour: string;
  source: string;
}

export const testimonials: Testimonial[] = [
  {
    rating: 5,
    text: {
      fr: "Une visite extraordinaire ! Notre guide connaissait chaque recoin de Bayonne et nous a raconté des anecdotes passionnantes. Le meilleur tour que nous ayons fait.",
      en: "An extraordinary tour! Our guide knew every corner of Bayonne and shared fascinating stories. The best tour we've ever taken.",
      es: "¡Un tour extraordinario! Nuestra guía conocía cada rincón de Bayona y nos contó anécdotas fascinantes. El mejor tour que hemos hecho.",
    },
    name: "Sophie & Marc",
    country: "Paris, France",
    tour: "Bayonne Walking Tour",
    source: "Google Reviews",
  },
  {
    rating: 5,
    text: {
      fr: "Biarritz comme on ne l'avait jamais vue ! Des histoires incroyables sur les surfeurs, les impératrices et les pêcheurs. Vraiment authentique.",
      en: "Biarritz like we'd never seen it before! Incredible stories about surfers, empresses and fishermen. Truly authentic.",
      es: "¡Biarritz como nunca lo habíamos visto! Historias increíbles sobre surfistas, emperatrices y pescadores. Realmente auténtico.",
    },
    name: "James & Laura",
    country: "London, UK",
    tour: "Biarritz Walking Tour",
    source: "TripAdvisor",
  },
  {
    rating: 5,
    text: {
      fr: "Le combo Bayonne + Biarritz est parfait pour découvrir les deux villes en une journée. Notre guide était passionnée et très cultivée. Nous recommandons vivement !",
      en: "The Bayonne + Biarritz combo is perfect to discover both cities in one day. Our guide was passionate and very knowledgeable. Highly recommended!",
      es: "El combo Bayona + Biarritz es perfecto para descubrir ambas ciudades en un día. Nuestra guía era apasionada y muy culta. ¡Lo recomendamos mucho!",
    },
    name: "Carlos & Ana",
    country: "Madrid, España",
    tour: "Combo Bayonne + Biarritz",
    source: "Google Reviews",
  },
  {
    rating: 5,
    text: {
      fr: "Un moment magique dans le Petit Bayonne ! On a appris tellement de choses sur l'histoire du chocolat et des corsaires. Merci pour cette belle découverte.",
      en: "A magical moment in Petit Bayonne! We learned so much about the history of chocolate and corsairs. Thank you for this wonderful discovery.",
      es: "¡Un momento mágico en el Petit Bayonne! Aprendimos muchísimo sobre la historia del chocolate y los corsarios. Gracias por este hermoso descubrimiento.",
    },
    name: "Marie-Claire",
    country: "Lyon, France",
    tour: "Bayonne Walking Tour",
    source: "TripAdvisor",
  },
  {
    rating: 5,
    text: {
      fr: "Le tour de Biarritz était fantastique. Vue imprenable depuis le Rocher de la Vierge et plein d'histoires que nous ne connaissions pas. Petit groupe, ambiance conviviale.",
      en: "The Biarritz tour was fantastic. Stunning views from the Rocher de la Vierge and so many stories we didn't know. Small group, friendly atmosphere.",
      es: "El tour de Biarritz fue fantástico. Vistas impresionantes desde la Roca de la Virgen y muchas historias que no conocíamos. Grupo pequeño, ambiente agradable.",
    },
    name: "Hans & Petra",
    country: "München, Deutschland",
    tour: "Biarritz Walking Tour",
    source: "Google Reviews",
  },
];
