"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Users, Calendar, MapPin, Minus, Plus, CreditCard, Info } from "lucide-react";
import type { Tour } from "@/lib/tours";

interface GroupTourBookingWidgetProps {
  tour: Tour;
}

function formatDateDisplay(dateStr: string, locale: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(locale === "fr" ? "fr-FR" : locale === "es" ? "es-ES" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function GroupTourBookingWidget({ tour }: GroupTourBookingWidgetProps) {
  const t = useTranslations("groupBooking");
  const locale = useLocale();

  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [loadingDates, setLoadingDates] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [persons, setPersons] = useState(2);
  const [loading, setLoading] = useState(false);

  const min = tour.minGroupSize ?? 2;
  const max = tour.maxGroupSize ?? 8;
  const total = persons * tour.price;

  useEffect(() => {
    fetch("/api/group-dates")
      .then((r) => r.json())
      .then((data) => setAvailableDates(data.dates || []))
      .catch(() => setAvailableDates([]))
      .finally(() => setLoadingDates(false));
  }, []);

  const handleBooking = async () => {
    if (!selectedDate || persons < min) return;
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourSlug: tour.slug,
          date: selectedDate,
          time: "flex",
          adults: persons,
          teens: 0,
          children: 0,
          totalAmount: total * 100,
          locale,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  };

  const canBook = selectedDate && persons >= min;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
      <h3 className="font-display text-lg text-basque-dark">{t("title")}</h3>

      {/* Price display */}
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-basque-red">{tour.price}€</span>
        <span className="text-basque-gray text-sm">{t("perPerson")}</span>
      </div>

      {/* Date selector */}
      <div>
        <label className="block text-sm font-medium text-basque-dark mb-2">
          <Calendar size={14} className="inline mr-1.5" />
          {t("dateLabel")}
        </label>
        {loadingDates ? (
          <div className="h-10 bg-gray-100 rounded-xl animate-pulse" />
        ) : availableDates.length === 0 ? (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            {t("noAvailableDates")}
          </div>
        ) : (
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-basque-dark focus:outline-none focus:ring-2 focus:ring-basque-red/30"
          >
            <option value="">{t("selectDate")}</option>
            {availableDates.map((d) => (
              <option key={d} value={d}>
                {formatDateDisplay(d, locale)}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Person count */}
      <div>
        <label className="block text-sm font-medium text-basque-dark mb-2">
          <Users size={14} className="inline mr-1.5" />
          {t("persons")}
        </label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setPersons((p) => Math.max(min, p - 1))}
            disabled={persons <= min}
            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-basque-dark hover:bg-gray-50 disabled:opacity-30 transition-colors"
          >
            <Minus size={16} />
          </button>
          <span className="text-xl font-semibold text-basque-dark w-8 text-center">
            {persons}
          </span>
          <button
            onClick={() => setPersons((p) => Math.min(max, p + 1))}
            disabled={persons >= max}
            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-basque-dark hover:bg-gray-50 disabled:opacity-30 transition-colors"
          >
            <Plus size={16} />
          </button>
          <span className="text-sm text-basque-gray">
            (min {min} / max {max})
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="bg-basque-cream rounded-xl p-4 flex items-center justify-between">
        <span className="text-sm font-medium text-basque-dark">{t("total")}</span>
        <span className="text-2xl font-bold text-basque-dark">{total}€</span>
      </div>

      {/* Pickup note */}
      <div className="flex gap-2 text-xs text-basque-gray bg-blue-50 border border-blue-100 rounded-xl p-3">
        <MapPin size={14} className="shrink-0 text-blue-500 mt-0.5" />
        <span>{t("pickupNote")}</span>
      </div>

      {/* Pay button */}
      <button
        onClick={handleBooking}
        disabled={!canBook || loading}
        className="w-full bg-basque-red text-white font-semibold py-3.5 rounded-xl hover:bg-basque-red/90 disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
      >
        <CreditCard size={18} />
        {loading ? t("processing") : t("pay")}
      </button>

      {persons < min && (
        <p className="text-xs text-amber-600 text-center flex items-center justify-center gap-1">
          <Info size={12} />
          {t("minPersons")}
        </p>
      )}
    </div>
  );
}
