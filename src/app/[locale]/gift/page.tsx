"use client";

import { useState } from "react";
import { Gift, Heart, Users, User, Baby, CreditCard } from "lucide-react";
import { useLocale } from "next-intl";

const vouchers = [
  {
    id: "solo",
    icon: User,
    label: "Adulte solo",
    description: "1 adulte — Biarritz ou Bayonne",
    price: 25,
    color: "border-basque-red bg-basque-red/5",
    iconColor: "text-basque-red bg-basque-red/10",
  },
  {
    id: "couple",
    icon: Heart,
    label: "Duo / Couple",
    description: "2 adultes — idéal en amoureux",
    price: 45,
    color: "border-basque-red bg-basque-red/5",
    iconColor: "text-basque-red bg-basque-red/10",
    badge: "❤️ Idéal en cadeau",
  },
  {
    id: "family-child",
    icon: Baby,
    label: "Adulte + Enfant",
    description: "1 adulte + 1 enfant (-12 ans)",
    price: 30,
    color: "border-basque-red bg-basque-red/5",
    iconColor: "text-basque-red bg-basque-red/10",
  },
  {
    id: "family",
    icon: Users,
    label: "Famille",
    description: "2 adultes + 1 enfant (-12 ans)",
    price: 50,
    color: "border-basque-red bg-basque-red/5",
    iconColor: "text-basque-red bg-basque-red/10",
  },
];

export default function GiftPage() {
  const locale = useLocale();
  const [selectedVoucher, setSelectedVoucher] = useState(vouchers[1]); // Couple par défaut
  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!recipientName || !senderName) return;

    setLoading(true);
    try {
      const res = await fetch("/api/stripe/gift-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voucherId: selectedVoucher.id,
          voucherLabel: selectedVoucher.label,
          price: selectedVoucher.price,
          recipientName,
          senderName,
          message,
          locale,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Gift checkout error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-basque-red pt-28 pb-16 px-4 text-center">
        <div className="text-5xl mb-4">🎁</div>
        <h1 className="font-display text-4xl md:text-5xl text-white mb-4">
          Offrez une expérience unique
        </h1>
        <p className="text-white/80 text-lg max-w-xl mx-auto">
          Offrez une découverte authentique du Pays Basque — un cadeau inoubliable pour vos proches
        </p>
        <div className="mt-4 inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
          <span className="text-white text-sm font-medium">✓ Valable 1 an · Envoyé par email · Paiement sécurisé</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Étape 1 — Choisir le forfait */}
        <div className="mb-10">
          <h2 className="font-display text-2xl text-basque-dark mb-2">
            1. Choisissez votre forfait
          </h2>
          <p className="text-basque-gray mb-6 text-sm">Tous nos tours durent environ 1h30 — Biarritz ou Bayonne au choix</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {vouchers.map((v) => {
              const Icon = v.icon;
              const isSelected = selectedVoucher.id === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedVoucher(v)}
                  className={`relative p-4 rounded-2xl border-2 text-left transition-all ${
                    isSelected
                      ? "border-basque-red bg-basque-red/5 shadow-md"
                      : "border-gray-200 bg-white hover:border-basque-red/40"
                  }`}
                >
                  {v.badge && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs bg-basque-red text-white px-2 py-0.5 rounded-full whitespace-nowrap">
                      {v.badge}
                    </span>
                  )}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                    isSelected ? "bg-basque-red text-white" : "bg-gray-100 text-gray-500"
                  }`}>
                    <Icon size={20} />
                  </div>
                  <p className="font-semibold text-basque-dark text-sm">{v.label}</p>
                  <p className="text-xs text-basque-gray mt-0.5">{v.description}</p>
                  <p className="text-xl font-bold text-basque-red mt-2">{v.price}€</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Étape 2 — Personnaliser */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="font-display text-2xl text-basque-dark mb-6">
            2. Personnalisez votre bon
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-basque-dark mb-1">
                Prénom du bénéficiaire *
              </label>
              <input
                type="text"
                placeholder="ex: Sophie"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-basque-red transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-basque-dark mb-1">
                Votre prénom (de la part de...) *
              </label>
              <input
                type="text"
                placeholder="ex: Marie"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-basque-red transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-basque-dark mb-1">
                Message personnel (optionnel)
              </label>
              <textarea
                placeholder="ex: Joyeux anniversaire ! J'espère que tu adoreras cette découverte du Pays Basque 🌊"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-basque-red transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Récapitulatif + Payer */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-display text-2xl text-basque-dark mb-4">
            3. Récapitulatif
          </h2>

          <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-basque-gray">Forfait</span>
              <span className="font-medium text-basque-dark">{selectedVoucher.label}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-basque-gray">Pour</span>
              <span className="font-medium text-basque-dark">{recipientName || "—"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-basque-gray">De la part de</span>
              <span className="font-medium text-basque-dark">{senderName || "—"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-basque-gray">Validité</span>
              <span className="font-medium text-basque-dark">1 an à partir de l'achat</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between">
              <span className="font-semibold text-basque-dark">Total</span>
              <span className="text-xl font-bold text-basque-red">{selectedVoucher.price}€</span>
            </div>
          </div>

          <p className="text-xs text-basque-gray mb-4 text-center">
            📧 Vous recevrez votre bon cadeau PDF par email immédiatement après le paiement
          </p>

          <button
            onClick={handlePayment}
            disabled={!recipientName || !senderName || loading}
            className="w-full bg-basque-red hover:bg-basque-red-dark text-white py-4 rounded-xl font-semibold text-lg transition-all hover:shadow-lg hover:shadow-basque-red/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              "Redirection..."
            ) : (
              <>
                <CreditCard size={20} />
                Payer {selectedVoucher.price}€ et recevoir mon bon
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
