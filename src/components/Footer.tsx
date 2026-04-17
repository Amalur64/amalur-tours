import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Mail, Phone } from "lucide-react";
import { FaInstagram, FaFacebookF } from "react-icons/fa";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  return (
    <footer className="bg-basque-dark text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo-dark.png"
                alt="Amalur Tours"
                width={120}
                height={120}
                className="h-16 w-auto"
              />
            </Link>
            <p className="mt-3 text-sm text-white/60 leading-relaxed">
              {t("description")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t("quickLinks")}
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/tours" as const, label: nav("tours") },
                { href: "/about" as const, label: nav("about") },
                { href: "/groups" as const, label: nav("groups") },
                { href: "/contact" as const, label: nav("contact") },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-basque-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-white/60">
                <Mail size={16} />
                <a
                  href="mailto:amalur.tours@gmail.com"
                  className="hover:text-basque-gold transition-colors"
                >
                  amalur.tours@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/60">
                <Phone size={16} />
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "33600000000"}`}
                  className="hover:text-basque-gold transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t("followUs")}
            </h3>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/amalur_tours/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-basque-red transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="https://www.facebook.com/share/1NgKKehTJV/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-basque-red transition-colors"
                aria-label="Facebook"
              >
                <FaFacebookF size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} Amalur Tours. {t("rights")}.
          </p>
          <div className="flex gap-6">
            <Link
              href="/cgv"
              className="text-xs text-white/40 hover:text-white transition-colors"
            >
              CGV & Mentions légales
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
