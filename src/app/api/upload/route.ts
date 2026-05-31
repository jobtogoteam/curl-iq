import { NextResponse } from "next/server";

// Uploads are handled inline in /api/scans — this endpoint is unused
export async function POST() {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
