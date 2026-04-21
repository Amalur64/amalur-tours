import { Star, Quote } from "lucide-react";
import Link from "next/link";

const reviews = [
  {
    name: "Herpin",
    country: "France",
    date: "Avril 2026",
    rating: 5,
    text: "Maider, est un rayon de soleil à elle toute seule ! Son envie de vous faire passer un bon moment n'a d'égal que son plaisir à le faire. Attentionnée, enthousiaste, elle nous dévoile Biarritz et ses secrets bien cachés. Une belle excursion en terre basque guidée par une amoureuse des lieux. Un Must !",
    tour: "Biarritz",
    platform: "GetYourGuide",
  },
  {
    name: "Christopher B.",
    country: "International",
    date: "Septembre 2025",
    rating: 5,
    text: "Fantastique ! J'ai passé une matinée parfaite, riche en histoire et en culture basque. Bayonne est magnifique et se visite facilement à pied, mais j'aurais manqué tellement de choses sans guide. Maider est extrêmement compétente et passionnée.",
    tour: "Bayonne",
    platform: "Google",
  },
  {
    name: "James J.",
    country: "International",
    date: "Septembre 2025",
    rating: 5,
    text: "Cette visite était parfaite ! Tout était organisé, et notre guide était super sympathique, bien informée. Nous avons vu des endroits magnifiques, appris des histoires intéressantes sur Bayonne. Si vous visitez Bayonne, vous devez faire cette visite – une expérience que vous n'oublierez pas !",
    tour: "Bayonne",
    platform: "Viator",
  },
  {
    name: "Suzanne W.",
    country: "International",
    date: "Septembre 2025",
    rating: 5,
    text: "Nous avons été absolument ravis de notre excursion. Maider est compétente, charmante et très gentille. Nous avons énormément apprécié la visite et avons eu l'impression d'avoir bien utilisé notre temps.",
    tour: "Bayonne",
    platform: "Google",
  },
  {
    name: "Scarlett",
    country: "France",
    date: "Avril 2026",
    rating: 5,
    text: "La visite a été très agréable, notre guide est passionnée et très chaleureuse, elle fait partager son amour pour la ville.",
    tour: "Biarritz",
    platform: "GetYourGuide",
  },
  {
    name: "Julien B.",
    country: "France",
    date: "Octobre 2025",
    rating: 5,
    text: "Notre guide était incroyable, super attachante, partageant à la fois l'histoire de la ville et la culture basque avec beaucoup d'humour et d'enthousiasme. Le point culminant pour moi était certainement la dégustation de chocolat ! Je recommande vivement !",
    tour: "Bayonne",
    platform: "Viator",
  },
  {
    name: "Alexandre P.",
    country: "France",
    date: "Avril 2026",
    rating: 5,
    text: "Super tour au cœur de Bayonne avec Maïder ! Encore merci 👌",
    tour: "Bayonne",
    platform: "Google",
  },
  {
    name: "Dos Santos",
    country: "France",
    date: "Avril 2026",
    rating: 5,
    text: "Excellent, Maïder a été très cool et sa connaissance de Bayonne et du Pays Basque a rendu la visite encore plus attrayante.",
    tour: "Bayonne",
    platform: "GetYourGuide",
  },
  {
    name: "Martine",
    country: "France",
    date: "Mars 2026",
    rating: 5,
    text: "Merci beaucoup à notre gentille guide, qui s'est adaptée à nous, et nous a fait découvrir quelques pépites. Amalur Tours top, je recommande !",
    tour: "Biarritz",
    platform: "GetYourGuide",
  },
  {
    name: "Javier B.",
    country: "Espagne",
    date: "Janvier 2026",
    rating: 5,
    text: "Nous avons été très satisfaits du professionnalisme et de la gentillesse de Maider.",
    tour: "Bayonne",
    platform: "Google",
  },
  {
    name: "Dmitri A.",
    country: "International",
    date: "Avril 2026",
    rating: 5,
    text: "J'ai eu une super visite de la belle Bayonne avec Maider. Elle connaissait les petits détails qui rendent cette ville si intéressante, avec une grande connaissance de la culture et l'histoire basque. Fortement recommandé.",
    tour: "Bayonne",
    platform: "Viator",
  },
  {
    name: "François",
    country: "France",
    date: "Avril 2026",
    rating: 5,
    text: "Notre guide Maïder nous a bien montré l'essentiel du centre de Bayonne, la visite a été très agréable et nous recommandons de la faire, n'hésitez pas !",
    tour: "Bayonne",
    platform: "GetYourGuide",
  },
];

const platformColors: Record<string, string> = {
  GetYourGuide: "bg-orange-50 text-orange-600",
  Viator: "bg-purple-50 text-purple-600",
  Google: "bg-blue-50 text-blue-600",
};

const reviewsSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://www.amalurtours.com",
  name: "Amalur Tours",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    bestRating: "5",
    worstRating: "1",
    reviewCount: String(reviews.length),
  },
  review: reviews.map((r) => ({
    "@type": "Review",
    author: { "@type": "Person", name: r.name },
    reviewRating: {
      "@type": "Rating",
      ratingValue: String(r.rating),
      bestRating: "5",
      worstRating: "1",
    },
    reviewBody: r.text,
    datePublished: r.date,
    publisher: { "@type": "Organization", name: r.platform },
  })),
};

export default function ReviewsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsSchema) }}
      />
      {/* Hero */}
      <div className="bg-basque-red pt-28 pb-20 px-4 text-center">
        <div className="flex justify-center gap-1 mb-5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={32} className="fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <h1 className="font-display text-4xl md:text-5xl text-white mb-4">
          Ils ont adoré leurs visites
        </h1>
        <p className="text-white/80 text-lg max-w-xl mx-auto">
          Des clients ravis à Biarritz et Bayonne, sur toutes les plateformes
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-5 py-2">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
            <span className="text-white font-semibold text-sm">5.0 sur GetYourGuide</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-5 py-2">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
            <span className="text-white font-semibold text-sm">5.0 sur Viator</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-5 py-2">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
            <span className="text-white font-semibold text-sm">5.0 sur Google</span>
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 hover:shadow-md transition-shadow"
            >
              {/* Stars + Platform */}
              <div className="flex items-center justify-between">
                <div className="flex gap-0.5">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${platformColors[review.platform]}`}>
                  {review.platform}
                </span>
              </div>

              {/* Quote */}
              <div className="relative">
                <Quote size={20} className="text-basque-red/20 absolute -top-1 -left-1" />
                <p className="text-basque-dark/80 text-sm leading-relaxed pl-4 italic">
                  &ldquo;{review.text}&rdquo;
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-basque-red/10 flex items-center justify-center text-basque-red font-bold text-sm">
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-basque-dark text-sm">{review.name}</p>
                    <p className="text-xs text-basque-gray">{review.country} · {review.date}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  review.tour === "Biarritz"
                    ? "bg-blue-50 text-blue-600"
                    : "bg-green-50 text-green-600"
                }`}>
                  {review.tour}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <h2 className="font-display text-2xl text-basque-dark mb-3">
            Rejoignez nos clients ravis !
          </h2>
          <p className="text-basque-gray mb-6">
            Réservez votre visite guidée à Biarritz ou Bayonne dès maintenant.
          </p>
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 bg-basque-red hover:bg-basque-red-dark text-white px-8 py-3 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-basque-red/25"
          >
            Voir nos tours →
          </Link>
        </div>
      </div>
    </main>
  );
}
