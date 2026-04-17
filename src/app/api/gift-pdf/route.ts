import { NextRequest, NextResponse } from "next/server";
import { generateGiftPdfBuffer } from "@/lib/gift-pdf";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { voucherLabel, price, recipientName, senderName, message, voucherId } = body;

    const buffer = await generateGiftPdfBuffer({
      voucherLabel,
      price: Number(price),
      recipientName,
      senderName,
      message,
      voucherId,
    });

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="bon-cadeau-amalur-tours.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json({ error: "Erreur génération PDF" }, { status: 500 });
  }
}
