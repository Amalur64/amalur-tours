// Email notifications via Brevo (ex-Sendinblue)
// Envoie un email à la fondatrice + un email de confirmation au client

import { generateGiftPdfBuffer } from "./gift-pdf";

const OWNER_EMAIL = "amalur.tours@gmail.com";
const FROM_EMAIL = "reservations@amalurtours.com";
const FROM_NAME = "Amalur Tours";

const BREVO_API = "https://api.brevo.com/v3/smtp/email";

function getBrevoKey() {
  return process.env.BREVO_API_KEY || "";
}

async function sendBrevoEmail(payload: object): Promise<boolean> {
  const apiKey = getBrevoKey();
  if (!apiKey) {
    console.warn("Brevo API key not configured");
    return false;
  }

  const res = await fetch(BREVO_API, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error("Brevo error:", error);
    return false;
  }

  const result = await res.json();
  console.log("Brevo email sent:", result.messageId);
  return true;
}

interface BookingEmailData {
  tourName: string;
  date: string;
  time: string;
  customerName: string;
  customerEmail: string;
  adults: number;
  teens: number;
  children: number;
  language: string;
  amount: number; // in cents
}

/**
 * Envoie un email de notification à la fondatrice
 */
export async function sendOwnerNotification(data: BookingEmailData) {
  const totalPeople = data.adults + data.teens + data.children;
  const amountEur = (data.amount / 100).toFixed(2);

  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #C1272D; padding: 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Nouvelle réservation !</h1>
      </div>
      <div style="background: #f9f9f9; padding: 24px; border-radius: 0 0 12px 12px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #666; width: 140px;">Tour</td><td style="padding: 8px 0; font-weight: bold;">${data.tourName}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Date</td><td style="padding: 8px 0; font-weight: bold;">${data.date} à ${data.time}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Client</td><td style="padding: 8px 0; font-weight: bold;">${data.customerName}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Email client</td><td style="padding: 8px 0;"><a href="mailto:${data.customerEmail}">${data.customerEmail}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Participants</td><td style="padding: 8px 0; font-weight: bold;">${data.adults} adulte(s)${data.teens > 0 ? `, ${data.teens} ado(s)` : ""}${data.children > 0 ? `, ${data.children} enfant(s)` : ""} — ${totalPeople} au total</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Langue</td><td style="padding: 8px 0;">${data.language === "fr" ? "Français" : data.language === "en" ? "English" : "Español"}</td></tr>
          <tr style="border-top: 2px solid #ddd;"><td style="padding: 12px 0; color: #666; font-size: 18px;">Montant</td><td style="padding: 12px 0; font-weight: bold; font-size: 18px; color: #C1272D;">${amountEur}€</td></tr>
        </table>
      </div>
    </div>
  `;

  return sendBrevoEmail({
    sender: { name: FROM_NAME, email: FROM_EMAIL },
    to: [{ email: OWNER_EMAIL, name: "Maider" }],
    subject: `🎯 Réservation: ${data.tourName} — ${data.date} (${totalPeople} pers.)`,
    htmlContent,
  });
}

/**
 * Envoie un email de confirmation au client
 */
export async function sendCustomerConfirmation(data: BookingEmailData) {
  const totalPeople = data.adults + data.teens + data.children;
  const amountEur = (data.amount / 100).toFixed(2);

  const subjects: Record<string, string> = {
    fr: `Confirmation de réservation — ${data.tourName}`,
    en: `Booking confirmation — ${data.tourName}`,
    es: `Confirmación de reserva — ${data.tourName}`,
  };

  const lang = data.language || "fr";

  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1B6B93, #4E9F3D); padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 22px;">Amalur Tours</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0;">Visites guidées au Pays Basque</p>
      </div>
      <div style="background: #ffffff; padding: 24px; border: 1px solid #eee;">
        <p style="font-size: 16px; color: #333;">${lang === "en" ? "Hello" : lang === "es" ? "Hola" : "Bonjour"} <strong>${data.customerName}</strong>,</p>
        <p style="color: #666;">${lang === "en" ? "Thank you for your booking! Here is the summary:" : lang === "es" ? "¡Gracias por tu reserva! Aquí tienes el resumen:" : "Merci pour votre réservation ! Voici le récapitulatif :"}</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 10px; background: #f9f9f9; color: #666; width: 140px; border-bottom: 1px solid #eee;">Tour</td><td style="padding: 10px; background: #f9f9f9; font-weight: bold; border-bottom: 1px solid #eee;">${data.tourName}</td></tr>
          <tr><td style="padding: 10px; color: #666; border-bottom: 1px solid #eee;">${lang === "en" ? "Date" : "Date"}</td><td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eee;">${data.date} — ${data.time}</td></tr>
          <tr><td style="padding: 10px; background: #f9f9f9; color: #666; border-bottom: 1px solid #eee;">${lang === "en" ? "Participants" : lang === "es" ? "Participantes" : "Participants"}</td><td style="padding: 10px; background: #f9f9f9; font-weight: bold; border-bottom: 1px solid #eee;">${totalPeople}</td></tr>
          <tr><td style="padding: 10px; color: #666;">${lang === "en" ? "Amount paid" : lang === "es" ? "Importe pagado" : "Montant payé"}</td><td style="padding: 10px; font-weight: bold; color: #C1272D; font-size: 18px;">${amountEur}€</td></tr>
        </table>
      </div>
      <div style="background: #333; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
        <p style="color: rgba(255,255,255,0.8); margin: 0; font-size: 14px;">${lang === "en" ? "See you soon in the Basque Country! 🌊" : lang === "es" ? "¡Nos vemos pronto en el País Vasco! 🌊" : "À bientôt au Pays Basque ! 🌊"}</p>
        <p style="color: rgba(255,255,255,0.5); margin: 8px 0 0; font-size: 12px;">amalur.tours@gmail.com — +33 7 50 03 86 51</p>
      </div>
    </div>
  `;

  return sendBrevoEmail({
    sender: { name: FROM_NAME, email: FROM_EMAIL },
    to: [{ email: data.customerEmail, name: data.customerName }],
    subject: subjects[lang] || subjects.fr,
    htmlContent,
  });
}

/**
 * Envoie un bon cadeau PDF au client + notification à la fondatrice
 */
export async function sendGiftVoucherEmail(data: {
  recipientName: string;
  senderName: string;
  message: string;
  voucherLabel: string;
  voucherId: string;
  price: number;
  customerEmail: string;
}) {
  // 1. Générer le PDF
  let pdfBase64: string;
  try {
    const pdfBuffer = await generateGiftPdfBuffer({
      voucherLabel: data.voucherLabel,
      price: data.price,
      recipientName: data.recipientName,
      senderName: data.senderName,
      message: data.message,
      voucherId: data.voucherId,
    });
    pdfBase64 = pdfBuffer.toString("base64");
  } catch (err) {
    console.error("Gift PDF generation failed:", err);
    return null;
  }

  const clientHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #C0392B; padding: 32px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 26px;">Merci pour votre achat !</h1>
        <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 15px;">Votre bon cadeau Amalur Tours est prêt</p>
      </div>
      <div style="background: #ffffff; padding: 32px; border: 1px solid #eee;">
        <p style="font-size: 16px; color: #333;">Bonjour <strong>${data.senderName}</strong>,</p>
        <p style="color: #666; line-height: 1.6;">Votre bon cadeau <strong>${data.voucherLabel}</strong> pour <strong>${data.recipientName}</strong> est en pièce jointe. Imprimez-le ou envoyez-le directement !</p>
        <div style="background: #FDF2F0; border-left: 4px solid #C0392B; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <p style="margin: 4px 0; color: #333;"><strong>Offert à :</strong> ${data.recipientName}</p>
          <p style="margin: 4px 0; color: #333;"><strong>Forfait :</strong> ${data.voucherLabel}</p>
          <p style="margin: 4px 0; color: #333;"><strong>Montant :</strong> <span style="color: #C0392B; font-weight: bold;">${data.price}€</span></p>
          <p style="margin: 4px 0; color: #333;"><strong>Validité :</strong> 1 an à partir d'aujourd'hui</p>
        </div>
        <p style="color: #666; font-size: 14px; line-height: 1.6;">Pour utiliser ce bon, contactez-nous par email avec le code unique imprimé sur le PDF.</p>
      </div>
      <div style="background: #2C3E50; padding: 24px; text-align: center; border-radius: 0 0 12px 12px;">
        <p style="color: rgba(255,255,255,0.8); margin: 0; font-size: 14px;">À bientôt au Pays Basque ! 🌊⛰️</p>
        <p style="color: rgba(255,255,255,0.5); margin: 8px 0 0; font-size: 12px;">amalur.tours@gmail.com — +33 7 50 03 86 51 — www.amalurtours.com</p>
      </div>
    </div>
  `;

  const ownerHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #C0392B; padding: 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 22px;">🎁 Nouveau bon cadeau vendu !</h1>
      </div>
      <div style="background: #f9f9f9; padding: 24px; border-radius: 0 0 12px 12px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #666; width: 160px;">Forfait</td><td style="padding: 8px 0; font-weight: bold;">${data.voucherLabel}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Offert à</td><td style="padding: 8px 0; font-weight: bold;">${data.recipientName}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">De la part de</td><td style="padding: 8px 0; font-weight: bold;">${data.senderName}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Email acheteur</td><td style="padding: 8px 0;"><a href="mailto:${data.customerEmail}">${data.customerEmail}</a></td></tr>
          ${data.message ? `<tr><td style="padding: 8px 0; color: #666;">Message</td><td style="padding: 8px 0; font-style: italic;">"${data.message}"</td></tr>` : ""}
          <tr style="border-top: 2px solid #ddd;"><td style="padding: 12px 0; color: #666; font-size: 18px;">Montant encaissé</td><td style="padding: 12px 0; font-weight: bold; font-size: 18px; color: #C0392B;">${data.price}€</td></tr>
        </table>
        <p style="color: #666; font-size: 13px; margin-top: 16px;">Le PDF a été envoyé automatiquement à l'acheteur (${data.customerEmail}).</p>
      </div>
    </div>
  `;

  // Envoyer les deux emails en parallèle
  const [clientOk, ownerOk] = await Promise.all([
    sendBrevoEmail({
      sender: { name: FROM_NAME, email: FROM_EMAIL },
      to: [{ email: data.customerEmail, name: data.senderName }],
      subject: `🎁 Votre bon cadeau Amalur Tours — ${data.voucherLabel}`,
      htmlContent: clientHtml,
      attachment: [{ content: pdfBase64, name: "bon-cadeau-amalur-tours.pdf" }],
    }),
    sendBrevoEmail({
      sender: { name: FROM_NAME, email: FROM_EMAIL },
      to: [{ email: OWNER_EMAIL, name: "Maider" }],
      subject: `🎁 Bon cadeau vendu : ${data.voucherLabel} (${data.price}€) — Pour ${data.recipientName}`,
      htmlContent: ownerHtml,
    }),
  ]);

  return { clientOk, ownerOk };
}

/**
 * Envoie un email de demande d'avis Google après le tour
 */
export async function sendReviewRequestEmail(data: {
  customerName: string;
  customerEmail: string;
  tourName: string;
  language: string;
}) {
  const googleReviewUrl = process.env.GOOGLE_REVIEW_URL || "https://g.page/r/amalurtours/review";
  const lang = data.language || "fr";

  const subjects: Record<string, string> = {
    fr: `Merci pour votre visite — votre avis compte beaucoup ! ⭐`,
    en: `Thank you for your tour — your review means a lot! ⭐`,
    es: `Gracias por su visita — ¡su opinión importa mucho! ⭐`,
  };

  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #C1272D, #8B0000); padding: 32px; text-align: center; border-radius: 12px 12px 0 0;">
        <p style="font-size: 40px; margin: 0;">⭐⭐⭐⭐⭐</p>
        <h1 style="color: white; margin: 12px 0 0; font-size: 22px;">${lang === "en" ? "Thank you for your tour!" : lang === "es" ? "¡Gracias por su visita!" : "Merci pour votre visite !"}</h1>
      </div>
      <div style="background: #ffffff; padding: 32px; border: 1px solid #eee;">
        <p style="font-size: 16px; color: #333;">${lang === "en" ? "Hello" : lang === "es" ? "Hola" : "Bonjour"} <strong>${data.customerName}</strong>,</p>
        <p style="color: #555; line-height: 1.7;">${lang === "en" ? `It was a real pleasure guiding you through <strong>${data.tourName}</strong>. A quick Google review would help me enormously!` : lang === "es" ? `Fue un placer guiarles por <strong>${data.tourName}</strong>. ¡Una reseña en Google me ayudaría enormemente!` : `Ce fut un plaisir de vous guider à travers <strong>${data.tourName}</strong>. Un petit avis Google m'aiderait énormément !`}</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${googleReviewUrl}" style="background: #C1272D; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
            ⭐ ${lang === "en" ? "Leave a Google review" : lang === "es" ? "Dejar una reseña en Google" : "Laisser un avis Google"}
          </a>
        </div>
        <p style="color: #555; font-size: 14px;">${lang === "en" ? "See you soon," : lang === "es" ? "¡Hasta pronto!" : "À bientôt,"}<br><strong>Maider</strong><br><em>Amalur Tours</em></p>
      </div>
      <div style="background: #2C3E50; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
        <p style="color: rgba(255,255,255,0.6); margin: 0; font-size: 12px;">amalur.tours@gmail.com — www.amalurtours.com</p>
      </div>
    </div>
  `;

  return sendBrevoEmail({
    sender: { name: FROM_NAME, email: FROM_EMAIL },
    to: [{ email: data.customerEmail, name: data.customerName }],
    subject: subjects[lang] || subjects.fr,
    htmlContent,
  });
}
