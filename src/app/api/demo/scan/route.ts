import { NextResponse } from "next/server";
import { db } from "@/db";
import { scans } from "@/db/schema";
import { requireAuth } from "@/lib/auth/session";
import { eq, desc } from "drizzle-orm";

export async function POST() {
  try {
    const session = await requireAuth();

    if (!session.isDemo) {
      return NextResponse.json({ error: "Not in demo mode" }, { status: 403 });
    }

    const [latestScan] = await db
      .select({ id: scans.id })
      .from(scans)
      .where(eq(scans.userId, session.userId))
      .orderBy(desc(scans.createdAt))
      .limit(1);

    if (!latestScan) {
      return NextResponse.json({ error: "No demo scan found" }, { status: 404 });
    }

    return NextResponse.json({ scanId: latestScan.id });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
