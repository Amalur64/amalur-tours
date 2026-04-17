"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

function FlagFR() {
  return (
    <svg viewBox="0 0 640 480" className="w-4 h-3 rounded-[2px] shrink-0">
      <rect width="213.3" height="480" fill="#002654" />
      <rect x="213.3" width="213.4" height="480" fill="#fff" />
      <rect x="426.7" width="213.3" height="480" fill="#ce1126" />
    </svg>
  );
}

function FlagGB() {
  return (
    <svg viewBox="0 0 640 480" className="w-4 h-3 rounded-[2px] shrink-0">
      <path fill="#012169" d="M0 0h640v480H0z" />
      <path fill="#FFF" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0z" />
      <path fill="#C8102E" d="m424 281 216 159v40L369 281zm-184 20 6 35L54 480H0zM640 0v3L391 191l2-44L590 0zM0 0l239 176h-60L0 42z" />
      <path fill="#FFF" d="M241 0v480h160V0zM0 160v160h640V160z" />
      <path fill="#C8102E" d="M0 193v96h640v-96zM273 0v480h96V0z" />
    </svg>
  );
}

function FlagES() {
  return (
    <svg viewBox="0 0 640 480" className="w-4 h-3 rounded-[2px] shrink-0">
      <rect width="640" height="480" fill="#c60b1e" />
      <rect y="120" width="640" height="240" fill="#ffc400" />
    </svg>
  );
}

const localeData: Record<Locale, { Flag: () => React.JSX.Element; label: string }> = {
  fr: { Flag: FlagFR, label: "FR" },
  en: { Flag: FlagGB, label: "EN" },
  es: { Flag: FlagES, label: "ES" },
};

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  const handleChange = (newLocale: Locale) => {
    router.replace(
      { pathname },
      { locale: newLocale },
    );
  };

  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
      {routing.locales.map((l) => {
        const { Flag, label } = localeData[l];
        return (
          <button
            key={l}
            onClick={() => handleChange(l)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
              locale === l
                ? "bg-white text-basque-red shadow-sm"
                : "text-basque-dark/50 hover:text-basque-dark/80"
            }`}
          >
            <Flag />
            {label}
          </button>
        );
      })}
    </div>
  );
}
