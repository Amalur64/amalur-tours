"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ScrollReveal } from "./ScrollReveal";
import {
  Lock,
  Palette,
  FileText,
  Globe,
  Send,
  CheckCircle,
} from "lucide-react";

export function GroupsForm() {
  const t = useTranslations("groups");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const features = [
    { icon: Lock, label: t("features.private") },
    { icon: Palette, label: t("features.custom") },
    { icon: FileText, label: t("features.billing") },
    { icon: Globe, label: t("features.multilingual") },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const data = {
      ...Object.fromEntries(formData),
      name: `${firstName} ${lastName}`.trim(),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, type: "group" }),
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
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left - Info */}
            <ScrollReveal animation="slide-in-left">
              <div>
                <p className="text-basque-gray text-lg leading-relaxed mb-8">
                  {t("description")}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {features.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100"
                    >
                      <div className="w-10 h-10 rounded-lg bg-basque-red/10 flex items-center justify-center shrink-0">
                        <feature.icon size={20} className="text-basque-red" />
                      </div>
                      <span className="text-sm font-medium text-basque-dark">
                        {feature.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Right - Form */}
            <ScrollReveal animation="slide-in-right">
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-5"
              >
                {/* Prénom + Nom */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-basque-dark mb-2">
                      Prénom
                    </label>
                    <input
                      name="firstName"
                      type="text"
                      required
                      placeholder="Votre prénom"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-basque-red focus:ring-2 focus:ring-basque-red/20 outline-none transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-basque-dark mb-2">
                      Nom
                    </label>
                    <input
                      name="lastName"
                      type="text"
                      required
                      placeholder="Votre nom"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-basque-red focus:ring-2 focus:ring-basque-red/20 outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-basque-dark mb-2">
                    {t("form.company")}
                  </label>
                  <input
                    name="company"
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-basque-red focus:ring-2 focus:ring-basque-red/20 outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-basque-dark mb-2">
                    {t("form.groupType")}
                  </label>
                  <select
                    name="groupType"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-basque-red focus:ring-2 focus:ring-basque-red/20 outline-none transition-all text-sm bg-white"
                  >
                    <option value="agency">Agence de voyage</option>
                    <option value="corporate">CE / Entreprise</option>
                    <option value="mice">MICE / Incentive</option>
                    <option value="school">École / Université</option>
                    <option value="cruise">Croisière</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-basque-dark mb-2">
                      {t("form.groupSize")}
                    </label>
                    <input
                      name="groupSize"
                      type="number"
                      min="1"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-basque-red focus:ring-2 focus:ring-basque-red/20 outline-none transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-basque-dark mb-2">
                      {t("form.dates")}
                    </label>
                    <input
                      name="dates"
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-basque-red focus:ring-2 focus:ring-basque-red/20 outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-basque-dark mb-2">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-basque-red focus:ring-2 focus:ring-basque-red/20 outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-basque-dark mb-2">
                    {t("form.needs")}
                  </label>
                  <textarea
                    name="needs"
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-basque-red focus:ring-2 focus:ring-basque-red/20 outline-none transition-all text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full bg-basque-red hover:bg-basque-red-dark text-white py-3.5 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-basque-red/25 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  {t("form.submit")}
                </button>

                {status === "success" && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-lg">
                    <CheckCircle size={20} />
                    <p className="text-sm">Message envoyé !</p>
                  </div>
                )}
              </form>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
