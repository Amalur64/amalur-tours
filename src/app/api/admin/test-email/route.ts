import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  sendOwnerNotification,
  sendCustomerConfirmation,
  sendGiftVoucherEmail,
  sendCancellationEmail,
} from "@/lib/email";

export async function POST(req: Request) {
  // Auth check
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!session || session.value !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type } = await req.json();

  const testData = {
    tourName: "Balade à Bayonne",
    date: "15/06/2026",
    time: "10:00",
    customerName: "Marie Dupont",
    customerEmail: "amalur.tours@gmail.com", // envoyé à toi pour tester
    adults: 2,
    teens: 0,
    children: 1,
    language: "fr",
    amount: 9000, // 90€ en centimes
  };

  try {
    if (type === "owner") {
      await sendOwnerNotification(testData);
    } else if (type === "customer") {
      await sendCustomerConfirmation(testData);
    } else if (type === "gift") {
      await sendGiftVoucherEmail({
        recipientName: "Sophie Martin",
        senderName: "Jean Martin",
        message: "Joyeux anniversaire ! 🎉",
        voucherLabel: "Balade à Bayonne — 2 adultes",
        voucherId: "TEST-2026-001",
        price: 90,
        customerEmail: "amalur.tours@gmail.com",
      });
    } else if (type === "cancellation") {
      await sendCancellationEmail({
        customerName: "Marie Dupont",
        customerEmail: "amalur.tours@gmail.com",
        tourName: "Balade à Bayonne",
        date: "15/06/2026",
        amount: 9000,
        language: "fr",
      });
    } else {
      return NextResponse.json({ error: "Unknown type" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error" },
      { status: 500 }
    );
  }
}
