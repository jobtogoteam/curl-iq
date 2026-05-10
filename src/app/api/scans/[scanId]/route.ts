import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { scans, productRecommendations } from "@/db/schema";
import { requireAuth } from "@/lib/auth/session";
import { eq, and, asc } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ scanId: string }> }
) {
  try {
    const session = await requireAuth();
    const { scanId } = await params;

    const [scan] = db
      .select()
      .from(scans)
      .where(and(eq(scans.id, scanId), eq(scans.userId, session.userId)))
      .limit(1)
      .all();

    if (!scan) {
      return NextResponse.json({ error: "Scan not found" }, { status: 404 });
    }

    const products = db
      .select()
      .from(productRecommendations)
      .where(and(eq(productRecommendations.scanId, scanId), eq(productRecommendations.userId, session.userId)))
      .orderBy(asc(productRecommendations.priority))
      .all();

    return NextResponse.json({ scan, products });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch scan" }, { status: 500 });
  }
}
