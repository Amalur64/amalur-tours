"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ScrollReveal } from "./ScrollReveal";
import { Send, MessageCircle, CheckCircle } from "lucide-react";

export function ContactForm() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const data = {
      name: `${firstName} ${lastName}`.trim(),
      firstName,
      lastName,
      company: formData.get("company"),
      email: formData.get("email"),
      message: formData.get("message"),
      language: formData.get("language"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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

  return (
    <div className="pt-24 lg:pt-28">
      {/* Header */}
      <section className="bg-gradient-to-br from-basque-ocean to-basque-green py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl lg:text-5xl text-white mb-3">
            {t("title")}
          </h1>
          <p className="text-white/80 text-lg">{t("subtitle")}</p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6"
            >
              {/* Prénom + Nom */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-basque-dark mb-2"
                  >
                    {t("firstName")}
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    placeholder={t("placeholder.firstName")}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-basque-red focus:ring-2 focus:ring-basque-red/20 outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-basque-dark mb-2"
                  >
                    {t("lastName")}
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    placeholder={t("placeholder.lastName")}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-basque-red focus:ring-2 focus:ring-basque-red/20 outline-none transition-all text-sm"
                  />
                </div>
              </div>

              {/* Société */}
              <div>
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-basque-dark mb-2"
                >
                  {t("company")}
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  placeholder={t("placeholder.company")}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-basque-red focus:ring-2 focus:ring-basque-red/20 outline-none transition-all text-sm"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-basque-dark mb-2"
                >
                  {t("email")}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder={t("placeholder.email")}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-basque-red focus:ring-2 focus:ring-basque-red/20 outline-none transition-all text-sm"
                />
              </div>

              {/* Language */}
              <div>
                <label
                  htmlFor="language"
                  className="block text-sm font-medium text-basque-dark mb-2"
                >
                  {t("language")}
                </label>
                <select
                  id="language"
                  name="language"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-basque-red focus:ring-2 focus:ring-basque-red/20 outline-none transition-all text-sm bg-white"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-basque-dark mb-2"
                >
                  {t("message")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder={t("placeholder.message")}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-basque-red focus:ring-2 focus:ring-basque-red/20 outline-none transition-all text-sm resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full bg-basque-red hover:bg-basque-red-dark text-white py-3.5 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-basque-red/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === "sending" ? (
                  t("sending")
                ) : (
                  <>
                    <Send size={18} />
                    {t("send")}
                  </>
                )}
              </button>

              {/* Status messages */}
              {status === "success" && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-lg">
                  <CheckCircle size={20} />
                  <p className="text-sm">{t("success")}</p>
                </div>
              )}
              {status === "error" && (
                <div className="text-red-600 bg-red-50 p-4 rounded-lg">
                  <p className="text-sm">{t("error")}</p>
                </div>
              )}
            </form>
          </ScrollReveal>

          {/* WhatsApp */}
          <ScrollReveal className="mt-8">
            <div className="text-center">
              <p className="text-basque-gray mb-4">{t("whatsapp")}</p>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "33600000000"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                <MessageCircle size={20} />
                WhatsApp
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
