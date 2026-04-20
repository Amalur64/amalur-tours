import { NextRequest, NextResponse } from "next/server";

const OWNER_EMAIL = "reservations@amalurtours.com";
const FROM_EMAIL = "reservations@amalurtours.com";
const FROM_NAME = "Amalur Tours";
const BREVO_API = "https://api.brevo.com/v3/smtp/email";

async function sendBrevoEmail(payload: object): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY || "";
  if (!apiKey) {
    console.warn("Brevo API key not configured");
    return false;
  }
  const res = await fetch(BREVO_API, {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.text();
    console.error("Brevo error:", error);
    return false;
  }
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message, language, type, company, groupType, groupSize, dates, needs } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const isDevis = type === "devis" || type === "group";

    // ── Email de notification à la propriétaire ──────────────────────────────
    const ownerSubject = isDevis
      ? `📋 Nouvelle demande de devis — ${name}${company ? ` (${company})` : ""}`
      : `✉️ Nouveau message de contact — ${name}`;

    const ownerHtml = isDevis
      ? `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#1A1510;padding:20px 30px;border-radius:12px 12px 0 0;">
            <h2 style="color:#EDE8D5;margin:0;font-size:20px;">📋 Nouvelle demande de devis</h2>
          </div>
          <div style="background:#f9f9f9;padding:24px 30px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr><td style="padding:8px 0;color:#6b7280;width:140px;">Nom</td><td style="padding:8px 0;font-weight:600;">${name}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#1d4ed8;">${email}</a></td></tr>
              ${company ? `<tr><td style="padding:8px 0;color:#6b7280;">Entreprise</td><td style="padding:8px 0;font-weight:600;">${company}</td></tr>` : ""}
              ${groupType ? `<tr><td style="padding:8px 0;color:#6b7280;">Type de groupe</td><td style="padding:8px 0;">${groupType}</td></tr>` : ""}
              ${groupSize ? `<tr><td style="padding:8px 0;color:#6b7280;">Taille du groupe</td><td style="padding:8px 0;font-weight:600;">${groupSize} personnes</td></tr>` : ""}
              ${dates ? `<tr><td style="padding:8px 0;color:#6b7280;">Dates souhaitées</td><td style="padding:8px 0;">${dates}</td></tr>` : ""}
              ${needs ? `<tr><td style="padding:8px 0;color:#6b7280;vertical-align:top;">Besoins</td><td style="padding:8px 0;">${needs}</td></tr>` : ""}
              ${message ? `<tr><td style="padding:8px 0;color:#6b7280;vertical-align:top;">Message</td><td style="padding:8px 0;">${message}</td></tr>` : ""}
              <tr><td style="padding:8px 0;color:#6b7280;">Langue</td><td style="padding:8px 0;">${language || "fr"}</td></tr>
            </table>
            <div style="margin-top:20px;padding:14px;background:#fef3c7;border-radius:8px;font-size:13px;color:#92400e;">
              💡 Réponds directement à cet email pour contacter ${name}.
            </div>
          </div>
        </div>`
      : `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#1A1510;padding:20px 30px;border-radius:12px 12px 0 0;">
            <h2 style="color:#EDE8D5;margin:0;font-size:20px;">✉️ Nouveau message de contact</h2>
          </div>
          <div style="background:#f9f9f9;padding:24px 30px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr><td style="padding:8px 0;color:#6b7280;width:120px;">Nom</td><td style="padding:8px 0;font-weight:600;">${name}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#1d4ed8;">${email}</a></td></tr>
              ${message ? `<tr><td style="padding:8px 0;color:#6b7280;vertical-align:top;">Message</td><td style="padding:8px 0;">${message}</td></tr>` : ""}
              <tr><td style="padding:8px 0;color:#6b7280;">Langue</td><td style="padding:8px 0;">${language || "fr"}</td></tr>
            </table>
            <div style="margin-top:20px;padding:14px;background:#fef3c7;border-radius:8px;font-size:13px;color:#92400e;">
              💡 Réponds directement à cet email pour contacter ${name}.
            </div>
          </div>
        </div>`;

    await sendBrevoEmail({
      sender: { name: FROM_NAME, email: FROM_EMAIL },
      to: [{ email: OWNER_EMAIL }],
      replyTo: { email, name: name || email },
      subject: ownerSubject,
      htmlContent: ownerHtml,
    });

    // ── Email de confirmation au client ──────────────────────────────────────
    const lang = language || "fr";

    const confirmSubject: Record<string, string> = {
      fr: isDevis ? "Votre demande de devis — Amalur Tours" : "Votre message a bien été reçu — Amalur Tours",
      en: isDevis ? "Your quote request — Amalur Tours" : "We received your message — Amalur Tours",
      es: isDevis ? "Su solicitud de presupuesto — Amalur Tours" : "Hemos recibido su mensaje — Amalur Tours",
    };

    const confirmBody: Record<string, string> = {
      fr: isDevis
        ? `Bonjour ${name},<br><br>Merci pour votre demande de devis ! Nous l'avons bien reçue et vous répondrons dans les <strong>48 heures</strong>.<br><br>En attendant, n'hésitez pas à consulter nos tours sur <a href="https://amalurtours.com">amalurtours.com</a>.`
        : `Bonjour ${name},<br><br>Merci pour votre message ! Nous l'avons bien reçu et vous répondrons dans les <strong>48 heures</strong>.`,
      en: isDevis
        ? `Hello ${name},<br><br>Thank you for your quote request! We have received it and will get back to you within <strong>48 hours</strong>.<br><br>In the meantime, feel free to browse our tours at <a href="https://amalurtours.com">amalurtours.com</a>.`
        : `Hello ${name},<br><br>Thank you for your message! We have received it and will get back to you within <strong>48 hours</strong>.`,
      es: isDevis
        ? `Hola ${name},<br><br>¡Gracias por su solicitud de presupuesto! La hemos recibido y le responderemos en <strong>48 horas</strong>.<br><br>Mientras tanto, puede consultar nuestros tours en <a href="https://amalurtours.com">amalurtours.com</a>.`
        : `Hola ${name},<br><br>¡Gracias por su mensaje! Lo hemos recibido y le responderemos en <strong>48 horas</strong>.`,
    };

    const clientHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#1A1510;padding:20px 30px;border-radius:12px 12px 0 0;text-align:center;">
          <p style="color:#EDE8D5;margin:0;font-size:13px;letter-spacing:3px;">AMALUR TOURS · PAYS BASQUE</p>
        </div>
        <div style="background:#ffffff;padding:30px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;text-align:center;">
          <p style="font-size:15px;color:#374151;line-height:1.7;">${confirmBody[lang] || confirmBody["fr"]}</p>
          <hr style="border:none;border-top:1px solid #f3f4f6;margin:24px 0;">
          <p style="font-size:13px;color:#9ca3af;">
            L'équipe Amalur Tours<br>
            <a href="mailto:reservations@amalurtours.com" style="color:#6b7280;">reservations@amalurtours.com</a> ·
            <a href="https://amalurtours.com" style="color:#6b7280;">amalurtours.com</a>
          </p>
        </div>
      </div>`;

    await sendBrevoEmail({
      sender: { name: FROM_NAME, email: FROM_EMAIL },
      to: [{ email, name: name || email }],
      subject: confirmSubject[lang] || confirmSubject["fr"],
      htmlContent: clientHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to process contact form" }, { status: 500 });
  }
}
