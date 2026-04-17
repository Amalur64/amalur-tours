import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getTourBySlug } from "@/lib/tours";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tourSlug, date, time, adults, teens, children, totalAmount, locale } = body;

    const tour = getTourBySlug(tourSlug);
    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    // Validate amount server-side
    const expectedAmount =
      Math.round(
        (adults * tour.price + teens * 5) * 100,
      );

    if (totalAmount !== expectedAmount) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 },
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      locale: locale === "fr" ? "fr" : locale === "es" ? "es" : "en",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: tour.id,
              description: `${date} @ ${time} — ${adults} adulte(s)${teens ? `, ${teens} ado(s)` : ""}${children ? `, ${children} enfant(s)` : ""}`,
              metadata: {
                tourId: tour.id,
                date,
                time,
                adults: String(adults),
                teens: String(teens),
                children: String(children),
              },
            },
            unit_amount: totalAmount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        tourId: tour.id,
        tourSlug: tour.slug,
        date,
        time,
        adults: String(adults),
        teens: String(teens),
        children: String(children),
        locale,
      },
      success_url: `${siteUrl}/${locale}/tours/${tour.slug}?booking=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/${locale}/tours/${tour.slug}?booking=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
