import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword } from "@/lib/auth/password";
import { getSession } from "@/lib/auth/session";
import { rateLimit } from "@/lib/rate-limit";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const rl = rateLimit(`register:${ip}`, { limit: 5, windowSec: 3600 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many registration attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      );
    }

    const { email, password, displayName, goals } = await req.json();

    if (!email || !password || !displayName) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (typeof email !== "string" || typeof password !== "string" || typeof displayName !== "string") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const sanitizedName = displayName.trim().slice(0, 64).replace(/[<>"'&]/g, "");
    if (!sanitizedName) {
      return NextResponse.json({ error: "Display name is required" }, { status: 400 });
    }

    const sanitizedGoals = Array.isArray(goals)
      ? goals
          .filter((g): g is string => typeof g === "string")
          .map((g) => g.trim().slice(0, 200).replace(/[<>"'&]/g, ""))
          .filter(Boolean)
          .slice(0, 10)
      : [];

    const [existing] = db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase().trim()))
      .limit(1)
      .all();

    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const id = nanoid();
    const passwordHash = await hashPassword(password);

    const normalizedEmail = email.toLowerCase().trim();

    db.insert(users).values({
      id,
      email: normalizedEmail,
      passwordHash,
      displayName: sanitizedName,
      createdAt: Math.floor(Date.now() / 1000),
    }).run();

    const session = await getSession();
    session.userId = id;
    session.email = normalizedEmail;
    session.displayName = sanitizedName;
    if (sanitizedGoals.length > 0) session.hairGoals = sanitizedGoals;
    await session.save();

    return NextResponse.json({
      user: { id, email: normalizedEmail, displayName: sanitizedName },
    });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
