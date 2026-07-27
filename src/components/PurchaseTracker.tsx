"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { gtagEvent, hasAlreadyFired } from "@/lib/gtag";

// Fires a GA4/Google Ads `purchase` event from success_url query params set by
// the Stripe checkout routes. requireBookingFlag guards routes (like the tour
// detail page) that are also visited outside of a successful payment.
export function PurchaseTracker({
  requireBookingFlag = false,
}: {
  requireBookingFlag?: boolean;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (requireBookingFlag && searchParams.get("booking") !== "success") return;

    const sessionId = searchParams.get("session_id");
    if (!sessionId || hasAlreadyFired(`purchase_${sessionId}`)) return;

    gtagEvent("purchase", {
      transaction_id: sessionId,
      value: Number(searchParams.get("value") ?? "0"),
      currency: searchParams.get("currency") ?? "EUR",
      items: [
        {
          item_name: searchParams.get("item_name") ?? undefined,
          quantity: Number(searchParams.get("qty") ?? "1"),
        },
      ],
    });
  }, [searchParams, requireBookingFlag]);

  return null;
}
