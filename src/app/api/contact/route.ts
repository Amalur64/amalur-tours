import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message, language, type, company, groupType, groupSize, dates, needs } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 },
      );
    }

    // TODO: Send email via Resend
    // For now, log the contact form submission
    console.log("Contact form submission:", {
      type: type || "contact",
      name,
      email,
      message,
      language,
      company,
      groupType,
      groupSize,
      dates,
      needs,
      timestamp: new Date().toISOString(),
    });

    // TODO: Send notification email to founder
    // TODO: Send confirmation email to sender

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to process contact form" },
      { status: 500 },
    );
  }
}
