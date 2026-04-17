// Email notifications via Resend
// Envoie un email à la fondatrice + un email de confirmation au client

const OWNER_EMAIL = "amalur.tours@gmail.com";
const FROM_EMAIL = "Amalur Tours <reservations@amalurtours.com>";

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
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === "re_REPLACE_ME") {
    console.warn("Resend not configured — skipping owner notification email");
    return null;
  }

  const totalPeople = data.adults + data.teens + data.children;
  const amountEur = (data.amount / 100).toFixed(2);

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #C1272D; padding: 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Nouvelle réservation !</h1>
      </div>
      <div style="background: #f9f9f9; padding: 24px; border-radius: 0 0 12px 12px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #666; width: 140px;">Tour</td>
            <td style="padding: 8px 0; font-weight: bold;">${data.tourName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;">Date</td>
            <td style="padding: 8px 0; font-weight: bold;">${data.date} à ${data.time}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;">Client</td>
            <td style="padding: 8px 0; font-weight: bold;">${data.customerName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;">Email client</td>
            <td style="padding: 8px 0;"><a href="mailto:${data.customerEmail}">${data.customerEmail}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;">Participants</td>
            <td style="padding: 8px 0; font-weight: bold;">
              ${data.adults} adulte(s)${data.teens > 0 ? `, ${data.teens} ado(s)` : ""}${data.children > 0 ? `, ${data.children} enfant(s)` : ""}
              — ${totalPeople} au total
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;">Langue</td>
            <td style="padding: 8px 0;">${data.language === "fr" ? "Français" : data.language === "en" ? "English" : "Español"}</td>
          </tr>
          <tr style="border-top: 2px solid #ddd;">
            <td style="padding: 12px 0; color: #666; font-size: 18px;">Montant</td>
            <td style="padding: 12px 0; font-weight: bold; font-size: 18px; color: #C1272D;">${amountEur}€</td>
          </tr>
        </table>
      </div>
    </div>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [OWNER_EMAIL],
        subject: `🎯 Réservation: ${data.tourName} — ${data.date} (${totalPeople} pers.)`,
        html,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Resend error (owner):", error);
      return null;
    }

    const result = await res.json();
    console.log("Owner notification email sent:", result.id);
    return result;
  } catch (error) {
    console.error("Failed to send owner notification:", error);
    return null;
  }
}

/**
 * Envoie un email de confirmation au client
 */
export async function sendCustomerConfirmation(data: BookingEmailData) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === "re_REPLACE_ME") {
    console.warn("Resend not configured — skipping customer confirmation email");
    return null;
  }

  const totalPeople = data.adults + data.teens + data.children;
  const amountEur = (data.amount / 100).toFixed(2);

  const subjects: Record<string, string> = {
    fr: `Confirmation de réservation — ${data.tourName}`,
    en: `Booking confirmation — ${data.tourName}`,
    es: `Confirmación de reserva — ${data.tourName}`,
  };

  const greetings: Record<string, string> = {
    fr: `Bonjour ${data.customerName},`,
    en: `Hello ${data.customerName},`,
    es: `Hola ${data.customerName},`,
  };

  const messages: Record<string, string> = {
    fr: "Merci pour votre réservation ! Voici le récapitulatif :",
    en: "Thank you for your booking! Here is the summary:",
    es: "¡Gracias por tu reserva! Aquí tienes el resumen:",
  };

  const labels: Record<string, { tour: string; date: string; participants: string; amount: string; footer: string }> = {
    fr: { tour: "Tour", date: "Date", participants: "Participants", amount: "Montant payé", footer: "À bientôt au Pays Basque ! 🌊" },
    en: { tour: "Tour", date: "Date", participants: "Participants", amount: "Amount paid", footer: "See you soon in the Basque Country! 🌊" },
    es: { tour: "Tour", date: "Fecha", participants: "Participantes", amount: "Importe pagado", footer: "¡Nos vemos pronto en el País Vasco! 🌊" },
  };

  const lang = data.language || "fr";
  const l = labels[lang] || labels.fr;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1B6B93, #4E9F3D); padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 22px;">Amalur Tours</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0;">Visites guidées au Pays Basque</p>
      </div>
      <div style="background: #ffffff; padding: 24px; border: 1px solid #eee;">
        <p style="font-size: 16px; color: #333;">${greetings[lang] || greetings.fr}</p>
        <p style="color: #666;">${messages[lang] || messages.fr}</p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 10px; background: #f9f9f9; color: #666; width: 140px; border-bottom: 1px solid #eee;">${l.tour}</td>
            <td style="padding: 10px; background: #f9f9f9; font-weight: bold; border-bottom: 1px solid #eee;">${data.tourName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; color: #666; border-bottom: 1px solid #eee;">${l.date}</td>
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eee;">${data.date} — ${data.time}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background: #f9f9f9; color: #666; border-bottom: 1px solid #eee;">${l.participants}</td>
            <td style="padding: 10px; background: #f9f9f9; font-weight: bold; border-bottom: 1px solid #eee;">${totalPeople}</td>
          </tr>
          <tr>
            <td style="padding: 10px; color: #666;">${l.amount}</td>
            <td style="padding: 10px; font-weight: bold; color: #C1272D; font-size: 18px;">${amountEur}€</td>
          </tr>
        </table>
      </div>
      <div style="background: #333; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
        <p style="color: rgba(255,255,255,0.8); margin: 0; font-size: 14px;">${l.footer}</p>
        <p style="color: rgba(255,255,255,0.5); margin: 8px 0 0; font-size: 12px;">amalur.tours@gmail.com — +33 7 50 03 86 51</p>
      </div>
    </div>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [data.customerEmail],
        subject: subjects[lang] || subjects.fr,
        html,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Resend error (customer):", error);
      return null;
    }

    const result = await res.json();
    console.log("Customer confirmation email sent:", result.id);
    return result;
  } catch (error) {
    console.error("Failed to send customer confirmation:", error);
    return null;
  }
}
