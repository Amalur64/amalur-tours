"use client";

import { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import { startOfDay } from "date-fns";
import { useLocale } from "next-intl";
import { Clock, Minus, Plus, CreditCard } from "lucide-react";
import { CalendarPicker } from "./CalendarPicker";
import type { Tour } from "@/lib/tours";
import { calculatePrice, getSchedulesForLocale } from "@/lib/tours";
import type { Locale } from "@/i18n/routing";

interface BookingWidgetProps {
  tour: Tour;
}


export function BookingWidget({ tour }: BookingWidgetProps) {
  const t = useTranslations("booking");
  const locale = useLocale() as Locale;
  const today = startOfDay(new Date());

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [adults, setAdults] = useState(2);
  const [teens, setTeens] = useState(0);
  const [children, setChildren] = useState(0);
  const [loading, setLoading] = useState(false);
  const [blockedTimes, setBlockedTimes] = useState<string[]>([]);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const total = useMemo(
    () => calculatePrice(tour, adults, teens),
    [tour, adults, teens],
  );

  const localeSchedules = useMemo(
    () => getSchedulesForLocale(tour, locale),
    [tour, locale],
  );

  // Vérifie les disponibilités dans Google Calendar quand une date est sélectionnée
  useEffect(() => {
    if (!selectedDate) {
      setBlockedTimes([]);
      return;
    }
    setCheckingAvailability(true);
    setSelectedTime("");
    fetch(`/api/availability?date=${selectedDate}`)
      .then((r) => r.json())
      .then((data) => setBlockedTimes(data.blockedTimes || []))
      .catch(() => setBlockedTimes([]))
      .finally(() => setCheckingAvailability(false));
  }, [selectedDate]);


  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || adults < 1) return;

    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourId: tour.id,
          tourSlug: tour.slug,
          date: selectedDate,
          time: selectedTime,
          adults,
          teens,
          children,
          totalAmount: Math.round(total * 100), // cents
          locale,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Booking error:", err);
    } finally {
      setLoading(false);
    }
  };

  const Counter = ({
    label,
    value,
    onChange,
    min = 0,
    max = 12,
    sublabel,
  }: {
    label: string;
    value: number;
    onChange: (v: number) => void;
    min?: number;
    max?: number;
    sublabel?: string;
  }) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <span className="text-sm font-medium text-basque-dark">{label}</span>
        {sublabel && (
          <span className="block text-xs text-basque-gray">{sublabel}</span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-basque-dark/60 hover:border-basque-red hover:text-basque-red transition-colors disabled:opacity-30"
        >
          <Minus size={14} />
        </button>
        <span className="w-8 text-center font-semibold text-basque-dark">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-basque-dark/60 hover:border-basque-red hover:text-basque-red transition-colors disabled:opacity-30"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-basque-red p-5">
        <h3 className="font-display text-xl text-white">{t("title")}</h3>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-3xl font-bold text-white">{tour.price}€</span>
          <span className="text-white/70 text-sm">{t("perPerson")}</span>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Date Selection */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-basque-dark mb-2">
            <Clock size={16} className="text-basque-red" />
            {t("selectDate")}
          </label>
          <CalendarPicker
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </div>

        {/* Time Selection */}
        {selectedDate && (
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-basque-dark mb-2">
              <Clock size={16} className="text-basque-red" />
              {t("selectTime")}
            </label>
            {checkingAvailability ? (
              <p className="text-sm text-basque-gray text-center py-3">⏳ Vérification des disponibilités...</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {localeSchedules.map((schedule) => {
                  const isBlocked = blockedTimes.includes(schedule.time);
                  return (
                    <button
                      key={schedule.time}
                      type="button"
                      onClick={() => !isBlocked && setSelectedTime(schedule.time)}
                      disabled={isBlocked}
                      className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                        isBlocked
                          ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed opacity-50"
                          : selectedTime === schedule.time
                          ? "border-basque-red bg-basque-red/5 text-basque-red"
                          : "border-gray-200 text-basque-dark/70 hover:border-basque-red/50"
                      }`}
                    >
                      {schedule.time}
                      <span className="block text-xs opacity-60 mt-0.5">
                        {isBlocked ? "Indisponible" : t(schedule.label)}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Participants */}
        <div className="border-t border-gray-100 pt-4">
          <Counter
            label={t("adults")}
            value={adults}
            onChange={setAdults}
            min={1}
            sublabel={`${tour.price}€`}
          />
          <Counter
            label={t("teens")}
            value={teens}
            onChange={setTeens}
            sublabel="5€"
          />
          <Counter
            label={t("children")}
            value={children}
            onChange={setChildren}
            sublabel={t("free")}
          />
        </div>

        {/* Total */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-basque-dark">
              {t("total")}
            </span>
            <span className="text-2xl font-bold text-basque-red">
              {total.toFixed(2)}€
            </span>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleBooking}
          disabled={!selectedDate || !selectedTime || loading}
          className="w-full bg-basque-red hover:bg-basque-red-dark text-white py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:shadow-lg hover:shadow-basque-red/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            t("processing")
          ) : (
            <>
              <CreditCard size={20} />
              {t("pay")} {total.toFixed(2)}€
            </>
          )}
        </button>
      </div>
    </div>
  );
}
