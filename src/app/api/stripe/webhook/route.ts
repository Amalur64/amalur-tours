import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createCalendarEvent } from "@/lib/google-calendar";
import { sendOwnerNotification, sendCustomerConfirmation, sendGiftVoucherEmail } from "@/lib/email";
import { getTourBySlug } from "@/lib/tours";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata;

    if (metadata) {
      // ─── BON CADEAU ───────────────────────────────────────────────────────
      if (metadata.type === "gift_voucher") {
        const customerEmail = session.customer_details?.email || "";
        const priceEur = (session.amount_total || 0) / 100;

        console.log("Gift voucher purchased:", {
          voucherId: metadata.voucherId,
          voucherLabel: metadata.voucherLabel,
          recipientName: metadata.recipientName,
          senderName: metadata.senderName,
          email: customerEmail,
          amount: priceEur,
        });

        await sendGiftVoucherEmail({
          recipientName: metadata.recipientName || "",
          senderName: metadata.senderName || "",
          message: metadata.message || "",
          voucherLabel: metadata.voucherLabel || "",
          voucherId: metadata.voucherId || "",
          price: priceEur,
          customerEmail,
        });
      }

      // ─── RÉSERVATION TOUR ─────────────────────────────────────────────────
      else {
        const tour = getTourBySlug(metadata.tourSlug);
        const customerEmail = session.customer_details?.email || "";
        const customerName = session.customer_details?.name || "Client";

        console.log("Booking confirmed:", {
          tourId: metadata.tourId,
          date: metadata.date,
          time: metadata.time,
          adults: metadata.adults,
          teens: metadata.teens,
          children: metadata.children,
          email: customerEmail,
          amount: session.amount_total,
        });

        // Créer l'événement Google Calendar
        if (tour) {
          const durationMinutes = tour.slug === "combo" ? 240 : 90;
          await createCalendarEvent({
            tourName: tour.id,
            date: metadata.date,
            time: metadata.time,
            duration: durationMinutes,
            customerName,
            customerEmail,
            adults: parseInt(metadata.adults || "0"),
            teens: parseInt(metadata.teens || "0"),
            children: parseInt(metadata.children || "0"),
            language: metadata.locale || "fr",
            amount: session.amount_total || 0,
          });
        }

        // Envoyer les emails de confirmation
        if (tour) {
          const emailData = {
            tourName: tour.id,
            date: metadata.date,
            time: metadata.time,
            customerName,
            customerEmail,
            adults: parseInt(metadata.adults || "0"),
            teens: parseInt(metadata.teens || "0"),
            children: parseInt(metadata.children || "0"),
            language: metadata.locale || "fr",
            amount: session.amount_total || 0,
          };

          await Promise.all([
            sendOwnerNotification(emailData),
            customerEmail ? sendCustomerConfirmation(emailData) : Promise.resolve(),
          ]);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
