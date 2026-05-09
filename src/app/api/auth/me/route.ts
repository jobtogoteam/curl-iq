import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({
      user: {
        id: session.userId,
        email: session.email,
        displayName: session.displayName,
        isDemo: session.isDemo ?? false,
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to get session" }, { status: 500 });
  }
}