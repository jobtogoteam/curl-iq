import { NextResponse } from "next/server";
import { db } from "@/db";
import { productRecommendations, scans } from "@/db/schema";
import { requireAuth } from "@/lib/auth/session";
import { eq, desc, asc } from "drizzle-orm";

export async function GET() {
  try {
    const session = await requireAuth();

    const [latestScan] = await db
      .select({ id: scans.id })
      .from(scans)
      .where(eq(scans.userId, session.userId))
      .orderBy(desc(scans.createdAt))
      .limit(1);

    if (!latestScan) {
      return NextResponse.json({ products: [] });
    }

    const products = await db
      .select()
      .from(productRecommendations)
      .where(eq(productRecommendations.scanId, latestScan.id))
      .orderBy(asc(productRecommendations.priority));

    return NextResponse.json({ products });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
