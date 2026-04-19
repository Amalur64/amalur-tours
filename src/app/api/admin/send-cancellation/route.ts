import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { sendCancellationEmail } from "@/lib/email";

export async function POST(req: Request) {
  // Auth check
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!session || session.value !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { customerName, customerEmail, tourName, date, amount, language } =
    await req.json();

  if (!customerEmail || !customerName || !tourName) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const ok = await sendCancellationEmail({
    customerName,
    customerEmail,
    tourName,
    date,
    amount: amount || 0,
    language: language || "fr",
  });

  if (!ok) {
    return NextResponse.json({ error: "Email send failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
