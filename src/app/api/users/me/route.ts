import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, scans, productRecommendations } from "@/db/schema";
import { requireAuth, getSession } from "@/lib/auth/session";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";

export async function DELETE() {
  try {
    const session = await requireAuth();
    const userId = session.userId;

    await db.delete(productRecommendations).where(eq(productRecommendations.userId, userId));
    await db.delete(scans).where(eq(scans.userId, userId));
    await db.delete(users).where(eq(users.id, userId));

    const uploadsDir = path.join(process.cwd(), "public", "uploads", userId);
    if (fs.existsSync(uploadsDir)) {
      fs.rmSync(uploadsDir, { recursive: true, force: true });
    }

    const iron = await getSession();
    iron.destroy();

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Account deletion error:", err);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
