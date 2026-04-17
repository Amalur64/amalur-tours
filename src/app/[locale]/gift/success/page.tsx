"use client";

import { CheckCircle, Download, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function GiftSuccessPage() {
  const t = useTranslations("gift");

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>

          <h1 className="font-display text-3xl text-basque-dark mb-3">
            {t("successTitle")} 🎉
          </h1>
          <p className="text-basque-gray mb-6">
            {t("successText")}
          </p>

          <div className="bg-basque-red/5 rounded-xl p-4 mb-6 text-sm text-basque-dark space-y-2">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-basque-red" />
              <span>{t("successEmail")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Download size={16} className="text-basque-red" />
              <span>{t("successValidity")}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              href="/tours"
              className="block w-full bg-basque-red hover:bg-basque-red-dark text-white py-3 rounded-xl font-semibold transition-all"
            >
              {t("successTours")}
            </Link>
            <Link
              href="/"
              className="block w-full border border-gray-200 text-basque-dark py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              {t("successHome")}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
