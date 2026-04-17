import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { voucherId, voucherLabel, price, recipientName, senderName, message, locale } = body;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `🎁 Bon cadeau Amalur Tours — ${voucherLabel}`,
              description: `Visite guidée au Pays Basque · Pour ${recipientName} · De la part de ${senderName}`,
              images: [`${siteUrl}/images/gift-voucher-preview.jpg`],
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${siteUrl}/${locale}/gift/success?session_id={CHECKOUT_SESSION_ID}`,
      allow_promotion_codes: true,
      cancel_url: `${siteUrl}/${locale}/gift`,
      metadata: {
        type: "gift_voucher",
        voucherId,
        voucherLabel,
        recipientName,
        senderName,
        message: message || "",
        locale,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Gift checkout error:", error);
    return NextResponse.json({ error: "Erreur lors de la création du paiement" }, { status: 500 });
  }
}
