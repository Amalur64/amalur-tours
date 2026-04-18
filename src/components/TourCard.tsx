import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Clock, Users, MapPin } from "lucide-react";
import type { Tour } from "@/lib/tours";

interface TourCardProps {
  tour: Tour;
}

export function TourCard({ tour }: TourCardProps) {
  const t = useTranslations("tours");

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Image cliquable */}
      <Link href={`/tours/${tour.slug}`}>
        {tour.slug === "combo" ? (
          <div className="relative h-56 sm:h-64 overflow-hidden bg-basque-ocean/10 cursor-pointer flex">
            {/* Photo Bayonne gauche */}
            <div className="relative w-1/2 overflow-hidden">
              <Image
                src="/images/tours/combo-bayonne.jpg"
                alt="Bayonne"
                fill
                sizes="25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <span className="absolute bottom-3 left-3 text-white text-xs font-semibold bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">Bayonne</span>
            </div>
            {/* Séparateur */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/60 z-10" />
            {/* Photo Biarritz droite */}
            <div className="relative w-1/2 overflow-hidden">
              <Image
                src="/images/tours/combo-biarritz.jpg"
                alt="Biarritz"
                fill
                sizes="25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <span className="absolute bottom-3 right-3 text-white text-xs font-semibold bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">Biarritz</span>
            </div>
            <div className="absolute bottom-4 left-4 z-20">
              <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm text-basque-dark text-xs font-semibold px-3 py-1.5 rounded-full">
                <MapPin size={14} />
                {tour.city}
              </span>
            </div>
          </div>
        ) : (
          <div className="relative h-56 sm:h-64 overflow-hidden bg-basque-ocean/10 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
            <Image
              src={tour.image}
              alt={t(`${tour.translationKey}.title`)}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-4 left-4 z-20">
              <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm text-basque-dark text-xs font-semibold px-3 py-1.5 rounded-full">
                <MapPin size={14} />
                {tour.city}
              </span>
            </div>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-5 sm:p-6">
        <Link href={`/tours/${tour.slug}`}>
          <h3 className="font-display text-xl sm:text-2xl text-basque-dark mb-2 hover:text-basque-red transition-colors cursor-pointer">
            {t(`${tour.translationKey}.title`)}
          </h3>
        </Link>
        <p className="text-sm text-basque-gray leading-relaxed mb-4 line-clamp-2">
          {t(`${tour.translationKey}.description`)}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-basque-gray mb-5">
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {t(`${tour.translationKey}.duration`)}
          </span>
          <span className="flex items-center gap-1">
            <Users size={14} />
            {t("maxPersons")}
          </span>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span className="text-xs text-basque-gray">{t("from")}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-basque-dark">
                {tour.price}€
              </span>
              <span className="text-xs text-basque-gray">{t("perPerson")}</span>
            </div>
          </div>
          <Link
            href={`/tours/${tour.slug}`}
            className="bg-basque-red hover:bg-basque-red-dark text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-basque-red/25"
          >
            {t("bookNow")}
          </Link>
        </div>
      </div>
    </div>
  );
}
