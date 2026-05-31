import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";

export async function GET() {
  const checks: Record<string, string> = {
    DATABASE_URL: process.env.DATABASE_URL ? "set" : "MISSING",
    SESSION_SECRET: process.env.SESSION_SECRET ? "set" : "MISSING",
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ? "set" : "MISSING",
  };

  try {
    await db.select().from(users).limit(1);
    checks.db = "ok";
  } catch (e: unknown) {
    checks.db = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json(checks);
}
