// Email notifications via Brevo (ex-Sendinblue)
// Envoie un email à la fondatrice + un email de confirmation au client

import { generateGiftPdfBuffer } from "./gift-pdf";

const OWNER_EMAIL = "reservations@amalurtours.com";
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
  tourSlug: string;
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

// ── Points de rendez-vous par tour et par langue ──────────────────────────────
const meetingPoints: Record<string, Record<string, string>> = {
  bayonne: {
    fr: "Devant la Mairie de Bayonne (place de la Liberté, près de l'arrêt de bus et de la Nive)",
    en: "In front of Bayonne Town Hall (Place de la Liberté, near the bus stop and the Nive river)",
    es: "Frente al Ayuntamiento de Bayona (plaza de la Liberté, cerca de la parada de autobús y del río Nive)",
  },
  biarritz: {
    fr: "Esplanade supérieure du Casino de Biarritz (face à la mer, côté terrasse)",
    en: "Upper esplanade of the Biarritz Casino (facing the sea, terrace side)",
    es: "Explanada superior del Casino de Biarritz (frente al mar, lado terraza)",
  },
  combo: {
    fr: "Départ Biarritz : Esplanade supérieure du Casino (face à la mer)",
    en: "Start Bayonne: In front of Bayonne Town Hall (Place de la Liberté)",
    es: "Salida Biarritz: Explanada superior del Casino (frente al mar)",
  },
  "san-sebastian": {
    fr: "Prise en charge directement à votre hôtel (Biarritz, Bayonne, Anglet, Bidart ou Saint-Jean-de-Luz)",
    en: "Hotel pickup (Biarritz, Bayonne, Anglet, Bidart or Saint-Jean-de-Luz)",
    es: "Recogida en su hotel (Biarritz, Bayona, Anglet, Bidart o San Juan de Luz)",
  },
};

// ── Durée par tour ─────────────────────────────────────────────────────────────
const tourDurations: Record<string, Record<string, string>> = {
  bayonne: { fr: "1h30", en: "1h30", es: "1h30" },
  biarritz: { fr: "1h30", en: "1h30", es: "1h30" },
  combo: { fr: "4h (Biarritz puis Bayonne)", en: "4h (Bayonne then Biarritz)", es: "4h (Biarritz y luego Bayona)" },
  "san-sebastian": { fr: "Journée (environ 4h)", en: "Full day (approx. 4h)", es: "Día completo (aprox. 4h)" },
};

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
  const lang = data.language || "fr";

  const meetingPoint = meetingPoints[data.tourSlug]?.[lang] || meetingPoints[data.tourSlug]?.fr || "";
  const duration = tourDurations[data.tourSlug]?.[lang] || tourDurations[data.tourSlug]?.fr || "1h30";

  const subjects: Record<string, string> = {
    fr: `✅ Réservation confirmée — ${data.tourName}`,
    en: `✅ Booking confirmed — ${data.tourName}`,
    es: `✅ Reserva confirmada — ${data.tourName}`,
  };

  const t = {
    greeting: { fr: "Bonjour", en: "Hello", es: "Hola" },
    intro: {
      fr: "Votre réservation est confirmée ! Nous avons hâte de vous accueillir. Voici toutes les informations dont vous aurez besoin :",
      en: "Your booking is confirmed! We look forward to welcoming you. Here is all the information you will need:",
      es: "¡Su reserva está confirmada! Estamos deseando recibirle. Aquí tiene toda la información que necesitará:",
    },
    tour: { fr: "Tour", en: "Tour", es: "Tour" },
    date: { fr: "Date", en: "Date", es: "Fecha" },
    time: { fr: "Heure de rendez-vous", en: "Meeting time", es: "Hora de encuentro" },
    participants: { fr: "Participants", en: "Participants", es: "Participantes" },
    duration: { fr: "Durée", en: "Duration", es: "Duración" },
    paid: { fr: "Montant réglé", en: "Amount paid", es: "Importe pagado" },
    meetingTitle: { fr: "📍 Point de rendez-vous", en: "📍 Meeting point", es: "📍 Punto de encuentro" },
    meetingNote: {
      fr: "Soyez là <strong>5 minutes avant</strong> l'heure prévue. Je porterai un signe distinctif pour être facilement reconnaissable !",
      en: "Please arrive <strong>5 minutes before</strong> the scheduled time. I'll be wearing something distinctive so you can easily spot me!",
      es: "Por favor, llegue <strong>5 minutos antes</strong> de la hora prevista. ¡Llevaré algo distintivo para que pueda reconocerme fácilmente!",
    },
    tipsTitle: { fr: "👟 Conseils pratiques", en: "👟 Practical tips", es: "👟 Consejos prácticos" },
    tips: {
      fr: "<li>Chaussures confortables recommandées (pavés et dénivelés)</li><li>Pensez à emporter de l'eau</li><li>Habillez-vous en fonction de la météo</li><li>La visite se déroule entièrement à pied</li>",
      en: "<li>Comfortable shoes recommended (cobblestones and slopes)</li><li>Bring water</li><li>Dress according to the weather</li><li>The tour is entirely on foot</li>",
      es: "<li>Se recomienda calzado cómodo (adoquines y cuestas)</li><li>Lleve agua</li><li>Vístase según el tiempo</li><li>La visita es completamente a pie</li>",
    },
    cancelTitle: { fr: "📋 Politique d'annulation", en: "📋 Cancellation policy", es: "📋 Política de cancelación" },
    cancel: {
      fr: "Annulation gratuite jusqu'à <strong>24h avant</strong> le tour. Répondez à cet email ou écrivez à <a href='mailto:reservations@amalurtours.com' style='color:#C1272D;'>reservations@amalurtours.com</a>.",
      en: "Free cancellation up to <strong>24 hours before</strong> the tour. Reply to this email or write to <a href='mailto:reservations@amalurtours.com' style='color:#C1272D;'>reservations@amalurtours.com</a>.",
      es: "Cancelación gratuita hasta <strong>24 horas antes</strong> del tour. Responda a este correo o escriba a <a href='mailto:reservations@amalurtours.com' style='color:#C1272D;'>reservations@amalurtours.com</a>.",
    },
    signature: {
      fr: "À très bientôt au Pays Basque !",
      en: "See you soon in the Basque Country!",
      es: "¡Hasta pronto en el País Vasco!",
    },
    adultsLabel: { fr: "adulte(s)", en: "adult(s)", es: "adulto(s)" },
    teensLabel: { fr: "ado(s)", en: "teen(s)", es: "adolescente(s)" },
    childrenLabel: { fr: "enfant(s)", en: "child(ren)", es: "niño(s)" },
  };

  const participantsStr = [
    `${data.adults} ${t.adultsLabel[lang as keyof typeof t.adultsLabel]}`,
    data.teens > 0 ? `${data.teens} ${t.teensLabel[lang as keyof typeof t.teensLabel]}` : null,
    data.children > 0 ? `${data.children} ${t.childrenLabel[lang as keyof typeof t.childrenLabel]}` : null,
  ].filter(Boolean).join(", ");

  const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px 0;">

      <!-- Header -->
      <div style="background: #1A1510; padding: 28px 32px; text-align: center; border-radius: 12px 12px 0 0;">
        <p style="color: #EDE8D5; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 1px;">AMALUR TOURS</p>
        <p style="color: rgba(237,232,213,0.65); margin: 6px 0 0; font-size: 13px; letter-spacing: 2px;">PAYS BASQUE</p>
      </div>

      <!-- Confirmed banner -->
      <div style="background: #2D6A4F; padding: 16px 32px; text-align: center;">
        <p style="color: white; margin: 0; font-size: 15px; font-weight: 600;">
          ✅ ${lang === "en" ? "Booking confirmed!" : lang === "es" ? "¡Reserva confirmada!" : "Réservation confirmée !"}
        </p>
      </div>

      <!-- Body -->
      <div style="background: #ffffff; padding: 32px; border-left: 1px solid #eee; border-right: 1px solid #eee;">

        <p style="font-size: 16px; color: #1A1510; margin: 0 0 8px;">
          ${t.greeting[lang as keyof typeof t.greeting]} <strong>${data.customerName}</strong>,
        </p>
        <p style="color: #555; line-height: 1.7; margin: 0 0 24px; font-size: 14px;">
          ${t.intro[lang as keyof typeof t.intro]}
        </p>

        <!-- Booking summary -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
          <tr>
            <td style="padding: 10px 12px; background: #fafafa; color: #888; width: 160px; border-bottom: 1px solid #eee;">${t.tour[lang as keyof typeof t.tour]}</td>
            <td style="padding: 10px 12px; background: #fafafa; font-weight: 600; color: #1A1510; border-bottom: 1px solid #eee;">${data.tourName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; color: #888; border-bottom: 1px solid #eee;">${t.date[lang as keyof typeof t.date]}</td>
            <td style="padding: 10px 12px; font-weight: 600; color: #1A1510; border-bottom: 1px solid #eee;">${data.date}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; background: #fafafa; color: #888; border-bottom: 1px solid #eee;">${t.time[lang as keyof typeof t.time]}</td>
            <td style="padding: 10px 12px; background: #fafafa; font-weight: 700; color: #C1272D; font-size: 16px; border-bottom: 1px solid #eee;">${data.time}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; color: #888; border-bottom: 1px solid #eee;">${t.participants[lang as keyof typeof t.participants]}</td>
            <td style="padding: 10px 12px; font-weight: 600; color: #1A1510; border-bottom: 1px solid #eee;">${participantsStr} (${totalPeople} ${lang === "en" ? "total" : "au total"})</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; background: #fafafa; color: #888; border-bottom: 1px solid #eee;">${t.duration[lang as keyof typeof t.duration]}</td>
            <td style="padding: 10px 12px; background: #fafafa; font-weight: 600; color: #1A1510; border-bottom: 1px solid #eee;">${duration}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; color: #888;">${t.paid[lang as keyof typeof t.paid]}</td>
            <td style="padding: 10px 12px; font-weight: 700; color: #2D6A4F; font-size: 18px;">${amountEur}€</td>
          </tr>
        </table>

        <!-- Meeting point -->
        <div style="background: #EEF6FF; border: 1px solid #BFDBFE; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
          <p style="margin: 0 0 10px; font-weight: 700; color: #1E40AF; font-size: 15px;">
            ${t.meetingTitle[lang as keyof typeof t.meetingTitle]}
          </p>
          <p style="margin: 0 0 10px; color: #1E3A8A; font-size: 14px; font-weight: 600; line-height: 1.6;">
            ${meetingPoint}
          </p>
          <p style="margin: 0; color: #3B82F6; font-size: 13px; line-height: 1.6;">
            ${t.meetingNote[lang as keyof typeof t.meetingNote]}
          </p>
        </div>

        <!-- Practical tips -->
        <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
          <p style="margin: 0 0 10px; font-weight: 700; color: #166534; font-size: 15px;">
            ${t.tipsTitle[lang as keyof typeof t.tipsTitle]}
          </p>
          <ul style="margin: 0; padding-left: 20px; color: #15803D; font-size: 13px; line-height: 1.9;">
            ${t.tips[lang as keyof typeof t.tips]}
          </ul>
        </div>

        <!-- Cancellation policy -->
        <div style="background: #FFF8E1; border: 1px solid #FDE68A; border-radius: 10px; padding: 18px; margin-bottom: 24px;">
          <p style="margin: 0 0 6px; font-weight: 700; color: #92400E; font-size: 14px;">
            ${t.cancelTitle[lang as keyof typeof t.cancelTitle]}
          </p>
          <p style="margin: 0; color: #78350F; font-size: 13px; line-height: 1.6;">
            ${t.cancel[lang as keyof typeof t.cancel]}
          </p>
        </div>

        <p style="color: #555; font-size: 14px; line-height: 1.7; margin: 0;">
          ${t.signature[lang as keyof typeof t.signature]}<br>
          <strong style="color: #1A1510;">Maider</strong><br>
          <em style="color: #888;">Amalur Tours — Guide locale au Pays Basque</em>
        </p>
      </div>

      <!-- Footer -->
      <div style="background: #1A1510; padding: 20px 32px; text-align: center; border-radius: 0 0 12px 12px;">
        <p style="color: rgba(237,232,213,0.9); margin: 0 0 6px; font-size: 13px;">
          📧 <a href="mailto:reservations@amalurtours.com" style="color: #EDE8D5; text-decoration: none;">reservations@amalurtours.com</a>
          &nbsp;·&nbsp;
          📞 <a href="tel:+33750038651" style="color: #EDE8D5; text-decoration: none;">+33 7 50 03 86 51</a>
        </p>
        <p style="color: rgba(237,232,213,0.5); margin: 0; font-size: 12px;">
          <a href="https://www.amalurtours.com" style="color: rgba(237,232,213,0.5); text-decoration: none;">www.amalurtours.com</a>
        </p>
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
        <p style="color: rgba(255,255,255,0.5); margin: 8px 0 0; font-size: 12px;">reservations@amalurtours.com — +33 7 50 03 86 51 — www.amalurtours.com</p>
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
 * Envoie un email d'annulation au client (à déclencher manuellement)
 */
export async function sendCancellationEmail(data: {
  customerName: string;
  customerEmail: string;
  tourName: string;
  date: string;
  amount: number; // in cents
  language: string;
}) {
  const lang = data.language || "fr";
  const amountEur = (data.amount / 100).toFixed(2);

  const subjects: Record<string, string> = {
    fr: `Annulation confirmée — ${data.tourName}`,
    en: `Cancellation confirmed — ${data.tourName}`,
    es: `Cancelación confirmada — ${data.tourName}`,
  };

  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #4B5563; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 22px;">Amalur Tours</h1>
        <p style="color: rgba(255,255,255,0.7); margin: 4px 0 0; font-size: 14px;">
          ${lang === "en" ? "Cancellation confirmation" : lang === "es" ? "Confirmación de cancelación" : "Confirmation d'annulation"}
        </p>
      </div>
      <div style="background: #ffffff; padding: 32px; border: 1px solid #eee;">
        <p style="font-size: 16px; color: #333;">
          ${lang === "en" ? "Hello" : lang === "es" ? "Hola" : "Bonjour"} <strong>${data.customerName}</strong>,
        </p>
        <p style="color: #555; line-height: 1.7;">
          ${lang === "en"
            ? `We confirm the cancellation of your booking for <strong>${data.tourName}</strong> on <strong>${data.date}</strong>.`
            : lang === "es"
            ? `Confirmamos la cancelación de su reserva para <strong>${data.tourName}</strong> el <strong>${data.date}</strong>.`
            : `Nous confirmons l'annulation de votre réservation pour <strong>${data.tourName}</strong> du <strong>${data.date}</strong>.`}
        </p>

        <div style="background: #F0FDF4; border-left: 4px solid #22C55E; border-radius: 8px; padding: 16px; margin: 24px 0;">
          <p style="margin: 0 0 6px; font-weight: bold; color: #166534;">
            ${lang === "en" ? "✅ Refund" : lang === "es" ? "✅ Reembolso" : "✅ Remboursement"}
          </p>
          <p style="margin: 0; color: #15803D; font-size: 15px;">
            ${lang === "en"
              ? `A refund of <strong>${amountEur}€</strong> will be credited to your original payment method within 5 to 10 business days.`
              : lang === "es"
              ? `Un reembolso de <strong>${amountEur}€</strong> será acreditado en su método de pago original en un plazo de 5 a 10 días hábiles.`
              : `Un remboursement de <strong>${amountEur}€</strong> sera crédité sur votre moyen de paiement d'origine sous 5 à 10 jours ouvrés.`}
          </p>
        </div>

        <p style="color: #555; line-height: 1.7;">
          ${lang === "en"
            ? "We hope to see you soon in the Basque Country! Don't hesitate to book again."
            : lang === "es"
            ? "¡Esperamos verle pronto en el País Vasco! No dude en volver a reservar."
            : "Nous espérons vous accueillir prochainement au Pays Basque ! N'hésitez pas à réserver à nouveau."}
        </p>
        <p style="color: #555; font-size: 14px; margin-top: 24px;">
          ${lang === "en" ? "Warm regards," : lang === "es" ? "Un cordial saludo," : "Cordialement,"}<br>
          <strong>Maider</strong><br>
          <em>Amalur Tours</em>
        </p>
      </div>
      <div style="background: #2C3E50; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
        <p style="color: rgba(255,255,255,0.6); margin: 0; font-size: 12px;">
          reservations@amalurtours.com — +33 7 50 03 86 51 — www.amalurtours.com
        </p>
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
        <p style="color: rgba(255,255,255,0.6); margin: 0; font-size: 12px;">reservations@amalurtours.com — +33 7 50 03 86 51 — www.amalurtours.com</p>
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
