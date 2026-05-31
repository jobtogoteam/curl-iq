import Link from "next/link";
import Image from "next/image";
import { db } from "@/db";
import { scans, productRecommendations } from "@/db/schema";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { eq, desc, asc } from "drizzle-orm";
import { ProductCard } from "@/components/products/ProductCard";
import { Camera, Sparkles, ChevronRight } from "lucide-react";
import type { CurlType } from "@/types/hair";
import { WASH_STATE_LABELS } from "@/types/hair";
import type { WashState } from "@/types/hair";
import { HomeClient } from "@/components/home/HomeClient";

function timeAgo(ts: number) {
  const s = Math.floor(Date.now() / 1000) - ts;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  const d = Math.floor(s / 86400);
  return d === 1 ? "yesterday" : `${d} days ago`;
}

function greeting(name: string) {
  const h = new Date().getHours();
  const g = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  return `${g}, ${name}`;
}

export default async function HomePage() {
  const session = await getSession();
  if (!session.userId) redirect("/login");

  const [latestScan] = await db.select().from(scans)
    .where(eq(scans.userId, session.userId))
    .orderBy(desc(scans.createdAt)).limit(1);

  const latestProducts = latestScan
    ? await db.select().from(productRecommendations)
        .where(eq(productRecommendations.scanId, latestScan.id))
        .orderBy(asc(productRecommendations.priority)).limit(3)
    : [];

  const firstName = session.displayName.split(" ")[0];
  const allScans = await db.select({ id: scans.id }).from(scans)
    .where(eq(scans.userId, session.userId));
  const scanCount = allScans.length;

  return (
    <HomeClient
      greeting={greeting(firstName)}
      scanCount={scanCount}
      latestScan={latestScan ? {
        id: latestScan.id,
        imagePath: latestScan.imagePath,
        curlType: latestScan.curlType as CurlType | null,
        thickness: latestScan.thickness,
        density: latestScan.density,
        washState: latestScan.washState as WashState | null,
        healthScore: latestScan.healthScore,
        hydrationScore: latestScan.hydrationScore,
        frizzScore: latestScan.frizzScore,
        createdAt: latestScan.createdAt,
      } : null}
      latestProducts={latestProducts}
      timeAgoText={latestScan ? timeAgo(latestScan.createdAt) : null}
    />
  );
}
