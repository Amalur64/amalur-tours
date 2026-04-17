// Job automatique : chaque matin à 9h, envoie un email de demande d'avis Google
// aux clients dont le tour a eu lieu la veille.
// Déclenché par Vercel Cron (vercel.json)

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { sendReviewRequestEmail } from "@/lib/email";

export async function GET(request: NextRequest) {
  // Sécurité : vérifier le header Vercel Cron
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Date d'hier au format YYYY-MM-DD
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0]; // "2025-04-16"

  // Format alternatif DD/MM/YYYY (au cas où le formulaire utilise ce format)
  const dd = String(yesterday.getDate()).padStart(2, "0");
  const mm = String(yesterday.getMonth() + 1).padStart(2, "0");
  const yyyy = yesterday.getFullYear();
  const yesterdayFr = `${dd}/${mm}/${yyyy}`; // "16/04/2025"

  console.log(`Cron review-requests: checking tours for ${yesterdayStr} / ${yesterdayFr}`);

  try {
    // Récupérer toutes les sessions Stripe des 90 derniers jours
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      created: {
        gte: Math.floor(Date.now() / 1000) - 90 * 24 * 60 * 60, // 90 jours
      },
    });

    let emailsSent = 0;
    const results = [];

    for (const session of sessions.data) {
      const metadata = session.metadata;

      // Ignorer les bons cadeaux et les sessions sans metadata
      if (!metadata || metadata.type === "gift_voucher") continue;

      // Vérifier si le tour a eu lieu hier
      const tourDate = metadata.date || "";
      if (tourDate !== yesterdayStr && tourDate !== yesterdayFr) continue;

      // Vérifier que le paiement est bien complété
      if (session.payment_status !== "paid") continue;

      const customerEmail = session.customer_details?.email || "";
      const customerName = session.customer_details?.name || "cher client";

      if (!customerEmail) continue;

      console.log(`Sending review request to ${customerEmail} (tour: ${metadata.tourId} on ${tourDate})`);

      const result = await sendReviewRequestEmail({
        customerName,
        customerEmail,
        tourName: metadata.tourId || "votre tour",
        language: metadata.locale || "fr",
      });

      if (result) {
        emailsSent++;
        results.push({ email: customerEmail, tour: metadata.tourId, date: tourDate });
      }
    }

    console.log(`Cron review-requests: ${emailsSent} emails sent`);

    return NextResponse.json({
      success: true,
      date: yesterdayStr,
      emailsSent,
      results,
    });
  } catch (error) {
    console.error("Cron review-requests error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
