import { notFound } from "next/navigation";
import Link from "next/link";
import { ScanImage } from "@/components/ui/ScanImage";
import { db } from "@/db";
import { scans, productRecommendations } from "@/db/schema";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { and, eq, asc } from "drizzle-orm";
import { ScanResultClient } from "@/components/scan/ScanResultClient";
import { ArrowLeft } from "lucide-react";
import type { CurlType, ProteinMoistureBalance, RoutineStep } from "@/types/hair";

export default async function ScanResultPage({
  params,
}: {
  params: Promise<{ scanId: string }>;
}) {
  const session = await getSession();
  if (!session.userId) redirect("/login");

  const { scanId } = await params;

  const [scan] = await db.select().from(scans)
    .where(and(eq(scans.id, scanId), eq(scans.userId, session.userId)))
    .limit(1);

  if (!scan) notFound();

  const products = await db.select().from(productRecommendations)
    .where(eq(productRecommendations.scanId, scanId))
    .orderBy(asc(productRecommendations.priority));

  const date = new Date(scan.createdAt * 1000).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  // Parse JSON fields safely
  let routineSteps: RoutineStep[] = [];
  try { if (scan.routineSteps) routineSteps = JSON.parse(scan.routineSteps); } catch { /* no-op */ }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Sticky header */}
      <div
        className="sticky top-0 z-20 flex items-center gap-3 px-5 pt-14 pb-3"
        style={{
          background: "rgba(12, 9, 6, 0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <Link
          href="/history"
          className="flex items-center justify-center w-8 h-8 rounded-xl text-text-secondary hover:text-text-primary transition-colors"
          style={{ background: "var(--surface-warm)", border: "1px solid var(--border)" }}
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="font-serif text-[20px] text-text-primary leading-tight">Scan Results</h1>
          <p className="text-[11px] text-text-tertiary">{date}</p>
        </div>
      </div>

      {/* Hero photo */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <ScanImage scanId={scan.id} className="absolute inset-0" objectFit="cover" />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, rgba(12,9,6,0.2) 0%, transparent 40%, rgba(12,9,6,0.85) 100%)"
        }} />
      </div>

      {/* Client section */}
      <ScanResultClient
        curlType={scan.curlType as CurlType | null}
        curlUniformity={scan.curlUniformity ?? null}
        thickness={scan.thickness}
        density={scan.density}
        porosity={scan.porosity}
        elasticity={scan.elasticity ?? null}
        proteinMoistureBalance={scan.proteinMoistureBalance as ProteinMoistureBalance | null}
        scalpHealth={scan.scalpHealth ?? null}
        growthStage={scan.growthStage ?? null}
        healthScore={scan.healthScore}
        hydrationScore={scan.hydrationScore}
        definitionScore={scan.definitionScore}
        frizzScore={scan.frizzScore}
        damageScore={scan.damageScore}
        heatDamageScore={scan.heatDamageScore ?? null}
        chemicalDamageScore={scan.chemicalDamageScore ?? null}
        cgmCompatible={scan.cgmCompatible !== null ? scan.cgmCompatible === 1 : null}
        cgmNotes={scan.cgmNotes ?? null}
        environmentalStress={scan.environmentalStress ?? null}
        environmentalNotes={scan.environmentalNotes ?? null}
        aiSummary={scan.aiSummary}
        routineSteps={routineSteps}
        products={products}
      />
    </div>
  );
}
