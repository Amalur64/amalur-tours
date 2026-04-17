"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials } from "@/lib/testimonials";
import type { Locale } from "@/i18n/routing";

export function TestimonialCarousel() {
  const t = useTranslations("testimonials");
  const locale = useLocale() as Locale;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const prev = () =>
    setCurrent(
      (current - 1 + testimonials.length) % testimonials.length,
    );
  const next = () =>
    setCurrent((current + 1) % testimonials.length);

  const testimonial = testimonials[current];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl lg:text-4xl text-center text-basque-dark mb-12">
          {t("title")}
        </h2>

        <div className="relative">
          <div className="bg-basque-cream rounded-2xl p-8 sm:p-10 text-center min-h-[250px] flex flex-col items-center justify-center">
            {/* Stars */}
            <div className="flex gap-1 justify-center mb-4">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className="fill-basque-gold text-basque-gold"
                />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-lg sm:text-xl text-basque-dark/80 leading-relaxed mb-6 italic">
              &ldquo;{testimonial.text[locale]}&rdquo;
            </blockquote>

            {/* Author */}
            <div>
              <p className="font-semibold text-basque-dark">
                {testimonial.name}
              </p>
              <p className="text-sm text-basque-gray">
                {testimonial.country} — {testimonial.tour}
              </p>
              <p className="text-xs text-basque-gray/60 mt-1">
                {testimonial.source}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-basque-dark/60 hover:text-basque-red transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-basque-dark/60 hover:text-basque-red transition-colors"
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? "bg-basque-red w-6"
                  : "bg-basque-dark/20 hover:bg-basque-dark/40"
              }`}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
