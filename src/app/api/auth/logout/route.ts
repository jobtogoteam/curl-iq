import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

export async function POST() {
  try {
    const session = await getSession();
    session.destroy();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // always succeed on logout
  }
}