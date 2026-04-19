"use client";

import { useState } from "react";
import { Send, CheckCircle, Loader2, XCircle } from "lucide-react";

type EmailType = "owner" | "customer" | "gift" | "cancellation";

interface ButtonState {
  status: "idle" | "sending" | "done" | "error";
}

const emails: { type: EmailType; label: string; desc: string; color: string }[] = [
  {
    type: "owner",
    label: "Notif. nouvelle réservation",
    desc: "Email que tu reçois quand un client réserve",
    color: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100",
  },
  {
    type: "customer",
    label: "Confirmation client",
    desc: "Email de confirmation envoyé au client",
    color: "bg-green-50 border-green-200 text-green-700 hover:bg-green-100",
  },
  {
    type: "gift",
    label: "Bon cadeau + PDF",
    desc: "Email avec le PDF du bon cadeau en pièce jointe",
    color: "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100",
  },
  {
    type: "cancellation",
    label: "Email d'annulation",
    desc: "Email envoyé au client en cas d'annulation",
    color: "bg-red-50 border-red-200 text-red-700 hover:bg-red-100",
  },
];

export function TestEmailButtons() {
  const [states, setStates] = useState<Record<EmailType, ButtonState>>({
    owner: { status: "idle" },
    customer: { status: "idle" },
    gift: { status: "idle" },
    cancellation: { status: "idle" },
  });

  const sendTest = async (type: EmailType) => {
    setStates((s) => ({ ...s, [type]: { status: "sending" } }));
    try {
      const res = await fetch("/api/admin/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      if (res.ok) {
        setStates((s) => ({ ...s, [type]: { status: "done" } }));
        setTimeout(() => setStates((s) => ({ ...s, [type]: { status: "idle" } })), 4000);
      } else {
        setStates((s) => ({ ...s, [type]: { status: "error" } }));
      }
    } catch {
      setStates((s) => ({ ...s, [type]: { status: "error" } }));
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-2">
        <p className="text-sm font-medium text-gray-700">
          Tous les emails de test sont envoyés à <strong>amalur.tours@gmail.com</strong>
        </p>
      </div>
      <p className="text-xs text-gray-400 mb-5">
        Vérifie ta boîte Gmail après chaque test ✉️
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {emails.map(({ type, label, desc, color }) => {
          const { status } = states[type];
          return (
            <button
              key={type}
              onClick={() => sendTest(type)}
              disabled={status === "sending"}
              className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all disabled:opacity-60 ${color}`}
            >
              <div className="mt-0.5 flex-shrink-0">
                {status === "idle" && <Send size={16} />}
                {status === "sending" && <Loader2 size={16} className="animate-spin" />}
                {status === "done" && <CheckCircle size={16} className="text-green-600" />}
                {status === "error" && <XCircle size={16} className="text-red-600" />}
              </div>
              <div>
                <p className="font-semibold text-sm">{label}</p>
                <p className="text-xs opacity-70 mt-0.5">{desc}</p>
                {status === "done" && (
                  <p className="text-xs text-green-600 font-medium mt-1">✅ Envoyé !</p>
                )}
                {status === "error" && (
                  <p className="text-xs text-red-600 font-medium mt-1">❌ Erreur</p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
