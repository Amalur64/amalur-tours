"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send, CheckCircle, Users, Clock, MapPin, CalendarDays } from "lucide-react";
import type { Tour } from "@/lib/tours";

interface TourRequestWidgetProps {
  tour: Tour;
}

export function TourRequestWidget({ tour }: TourRequestWidgetProps) {
  const t = useTranslations("tours");
  const r = useTranslations("request");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const persons = formData.get("persons") as string;
    const date = formData.get("date") as string;
    const extra = formData.get("extra") as string;

    const message = `Tour demandé : ${t(`${tour.translationKey}.title`)}
Nombre de personnes : ${persons}
Date souhaitée : ${date || "À préciser"}
${extra ? `Message : ${extra}` : ""}`;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          type: "tour-request",
          tourSlug: tour.slug,
          persons,
          preferredDate: date,
        }),
      });

      if (res.ok) {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h3 className="font-display text-xl text-basque-dark">{r("successTitle")}</h3>
        <p className="text-sm text-basque-gray leading-relaxed">{r("successText")}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-basque-dark px-6 py-5">
        <p className="text-xs text-white/60 uppercase tracking-wider font-medium mb-1">{r("label")}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white">{tour.groupPrice}€</span>
          <span className="text-white/60 text-sm">/ {r("perGroup")}</span>
        </div>
        <p className="text-white/70 text-xs mt-1">{r("maxPersons", { n: tour.maxGroupSize ?? 3 })}</p>
      </div>

      {/* Info badges */}
      <div className="px-6 py-4 border-b border-gray-100 space-y-2">
        <div className="flex items-center gap-2 text-xs text-basque-gray">
          <Clock size={14} className="text-basque-red shrink-0" />
          <span>{t(`${tour.translationKey}.duration`)}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-basque-gray">
          <Users size={14} className="text-basque-red shrink-0" />
          <span>{r("maxPersons", { n: tour.maxGroupSize ?? 3 })}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-basque-gray">
          <MapPin size={14} className="text-basque-red shrink-0" />
          <span>{t(`${tour.translationKey}.meeting`)}</span>
        </div>
      </div>

      {/* On-request notice */}
      <div className="mx-6 mt-4 mb-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
        <p className="text-xs text-amber-800 font-semibold mb-0.5">{r("onRequestTitle")}</p>
        <p className="text-xs text-amber-700 leading-relaxed">{r("onRequestText")}</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 pb-6 pt-3 space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-medium text-basque-dark mb-1.5">{r("name")}</label>
          <input
            name="name"
            type="text"
            required
            placeholder={r("namePlaceholder")}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-basque-red focus:ring-2 focus:ring-basque-red/20 outline-none transition-all text-sm"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-medium text-basque-dark mb-1.5">{r("email")}</label>
          <input
            name="email"
            type="email"
            required
            placeholder="votre@email.com"
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-basque-red focus:ring-2 focus:ring-basque-red/20 outline-none transition-all text-sm"
          />
        </div>

        {/* Persons + Date */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-basque-dark mb-1.5">{r("persons")}</label>
            <select
              name="persons"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-basque-red focus:ring-2 focus:ring-basque-red/20 outline-none transition-all text-sm bg-white"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-basque-dark mb-1.5">
              <span className="flex items-center gap-1"><CalendarDays size={12} />{r("date")}</span>
            </label>
            <input
              name="date"
              type="date"
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-basque-red focus:ring-2 focus:ring-basque-red/20 outline-none transition-all text-sm"
            />
          </div>
        </div>

        {/* Extra message */}
        <div>
          <label className="block text-xs font-medium text-basque-dark mb-1.5">{r("message")}</label>
          <textarea
            name="extra"
            rows={3}
            placeholder={r("messagePlaceholder")}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-basque-red focus:ring-2 focus:ring-basque-red/20 outline-none transition-all text-sm resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full bg-basque-red hover:bg-basque-red-dark text-white py-3.5 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-basque-red/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
        >
          {status === "sending" ? (
            r("sending")
          ) : (
            <>
              <Send size={16} />
              {r("send")}
            </>
          )}
        </button>

        {status === "error" && (
          <p className="text-xs text-red-600 text-center">{r("error")}</p>
        )}
      </form>
    </div>
  );
}
