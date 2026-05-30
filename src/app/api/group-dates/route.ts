import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

const KV_KEY = "group-dates:san-sebastian-group";

export async function GET(_request: NextRequest) {
  try {
    const dates = await kv.get<string[]>(KV_KEY);
    const today = new Date().toISOString().split("T")[0];
    // Return only future dates, sorted ascending
    const futureDates = (dates || [])
      .filter((d) => d >= today)
      .sort();
    return NextResponse.json({ dates: futureDates });
  } catch (error) {
    console.error("KV error:", error);
    return NextResponse.json({ dates: [] });
  }
}
