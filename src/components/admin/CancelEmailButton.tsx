"use client";

import { useState } from "react";
import { Mail, X, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";

interface Props {
  customerName: string;
  customerEmail: string;
  tourName: string;
  date: string;       // formatted DD/MM/YYYY (for display)
  rawDate?: string;   // YYYY-MM-DD (for calendar deletion)
  time?: string;      // HH:MM (for calendar deletion)
  amount: number;     // cents
  language: string;
}

export function CancelEmailButton({
  customerName,
  customerEmail,
  tourName,
  date,
  rawDate,
  time,
  amount,
  language,
}: Props) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const amountEur = (amount / 100).toFixed(2);

  const handleSend = async () => {
    setStatus("sending");
    try {
      const res = await fetch("/api/admin/send-cancellation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          tourName,
          date,
          rawDate,
          time,
          amount,
          language,
        }),
      });

      if (res.ok) {
        setStatus("done");
        setTimeout(() => {
          setOpen(false);
          setStatus("idle");
        }, 2500);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      {/* Bouton déclencheur */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-all font-medium border border-transparent hover:border-red-200"
        title="Envoyer email d'annulation"
      >
        <Mail size={13} />
        Annuler
      </button>

      {/* Modal de confirmation */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Fond sombre */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => status === "idle" && setOpen(false)}
          />

          {/* Carte modale */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">

            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle size={20} className="text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Envoyer l&apos;email d&apos;annulation</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Cette action enverra un email au client</p>
                </div>
              </div>
              {status === "idle" && (
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Récap réservation */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Client</span>
                <span className="font-medium text-gray-900">{customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="font-medium text-gray-900 text-xs">{customerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tour</span>
                <span className="font-medium text-gray-900">{tourName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span className="font-medium text-gray-900">{date}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-gray-500">Remboursement</span>
                <span className="font-bold text-green-600">{amountEur}€</span>
              </div>
            </div>

            {/* Rappel remboursement manuel */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800">
              ⚠️ <strong>N&apos;oublie pas</strong> de faire le remboursement manuellement sur{" "}
              <a
                href="https://dashboard.stripe.com/payments"
                target="_blank"
                rel="noreferrer"
                className="underline font-semibold"
              >
                Stripe Dashboard
              </a>{" "}
              avant d&apos;envoyer cet email.
            </div>

            {/* État envoi */}
            {status === "done" && (
              <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-xl px-4 py-3 text-sm font-medium">
                <CheckCircle size={16} />
                Email d&apos;annulation envoyé à {customerEmail} ✅
              </div>
            )}
            {status === "error" && (
              <p className="text-red-600 text-sm text-center">
                Erreur lors de l&apos;envoi. Réessaie.
              </p>
            )}

            {/* Boutons */}
            {status !== "done" && (
              <div className="flex gap-3">
                <button
                  onClick={() => setOpen(false)}
                  disabled={status === "sending"}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSend}
                  disabled={status === "sending"}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Envoi…
                    </>
                  ) : (
                    <>
                      <Mail size={14} />
                      Envoyer l&apos;email
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
