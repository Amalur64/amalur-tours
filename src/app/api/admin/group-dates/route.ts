import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { cookies } from "next/headers";

const KV_KEY = "group-dates:san-sebastian-group";

async function checkAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session?.value === process.env.ADMIN_PASSWORD;
}

// GET — list all dates (past + future, for admin view)
export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const dates = await kv.get<string[]>(KV_KEY);
  return NextResponse.json({ dates: (dates || []).sort() });
}

// POST — add a date
export async function POST(request: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { date } = await request.json();
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }
  const current = (await kv.get<string[]>(KV_KEY)) || [];
  if (!current.includes(date)) {
    current.push(date);
    await kv.set(KV_KEY, current);
  }
  return NextResponse.json({ dates: current.sort() });
}

// DELETE — remove a date
export async function DELETE(request: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { date } = await request.json();
  const current = (await kv.get<string[]>(KV_KEY)) || [];
  const updated = current.filter((d) => d !== date);
  await kv.set(KV_KEY, updated);
  return NextResponse.json({ dates: updated.sort() });
}
