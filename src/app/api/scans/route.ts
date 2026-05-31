import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 120;
import { db } from "@/db";
import { scans, productRecommendations } from "@/db/schema";
import { requireAuth } from "@/lib/auth/session";
import { analyzeHair } from "@/lib/ai/analyze-hair";
import { readUploadedFile } from "@/lib/upload";
import { rateLimit } from "@/lib/rate-limit";
import { nanoid } from "nanoid";
import { count, desc, eq, asc } from "drizzle-orm";

const BETA_SCAN_LIMIT = 10;

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();

    // 5 scans per user per 10 minutes
    const rl = rateLimit(`scan:${session.userId}`, { limit: 5, windowSec: 600 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many scans. Please wait a few minutes before trying again." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) },
        }
      );
    }

    // Beta lifetime scan limit
    const [{ total }] = await db
      .select({ total: count() })
      .from(scans)
      .where(eq(scans.userId, session.userId));

    if (total >= BETA_SCAN_LIMIT) {
      return NextResponse.json(
        { error: `You've reached the beta limit of ${BETA_SCAN_LIMIT} scans. Thanks for testing Curl IQ!` },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    // Fetch previous scan scores for consistency smoothing
    const [prevScan] = await db.select({
      healthScore: scans.healthScore,
      hydrationScore: scans.hydrationScore,
      damageScore: scans.damageScore,
      frizzScore: scans.frizzScore,
      definitionScore: scans.definitionScore,
      heatDamageScore: scans.heatDamageScore,
      chemicalDamageScore: scans.chemicalDamageScore,
    }).from(scans)
      .where(eq(scans.userId, session.userId))
      .orderBy(desc(scans.createdAt))
      .limit(1);

    function smoothScore(newVal: number, prevVal: number | null): number {
      if (prevVal === null) return newVal;
      const isExtreme = newVal > 85 || newVal < 20;
      const newWeight = isExtreme ? 0.85 : 0.65;
      const blended = Math.round(newWeight * newVal + (1 - newWeight) * prevVal);
      const maxSwing = isExtreme ? 30 : 18;
      return Math.max(prevVal - maxSwing, Math.min(prevVal + maxSwing, blended));
    }

    const uploadedFile = await readUploadedFile(file);
    const { analysis, usage } = await analyzeHair(uploadedFile);

    const scanId = nanoid();
    const now = Math.floor(Date.now() / 1000);

    await db.insert(scans).values({
      id: scanId,
      userId: session.userId,
      imagePath: "placeholder",
      washState: analysis.wash_state,
      washStateConfidence: null,
      washStateReasoning: null,
      curlType: analysis.curl_type,
      curlTypeConfidence: null,
      curlTypeReasoning: null,
      curlUniformity: analysis.curl_uniformity ?? null,
      thickness: analysis.thickness,
      density: analysis.density,
      porosity: analysis.porosity,
      porosityReasoning: null,
      elasticity: analysis.elasticity_estimate ?? null,
      proteinMoistureBalance: analysis.protein_moisture_balance ?? null,
      proteinMoistureReasoning: null,
      scalpHealth: analysis.scalp_health ?? null,
      growthStage: analysis.growth_stage ?? null,
      healthScore: smoothScore(analysis.health_score, prevScan?.healthScore ?? null),
      hydrationScore: smoothScore(analysis.hydration_score, prevScan?.hydrationScore ?? null),
      damageScore: smoothScore(analysis.damage_score, prevScan?.damageScore ?? null),
      frizzScore: smoothScore(analysis.frizz_score, prevScan?.frizzScore ?? null),
      definitionScore: smoothScore(analysis.definition_score, prevScan?.definitionScore ?? null),
      heatDamageScore: analysis.heat_damage_score != null ? smoothScore(analysis.heat_damage_score, prevScan?.heatDamageScore ?? null) : null,
      chemicalDamageScore: analysis.chemical_damage_score != null ? smoothScore(analysis.chemical_damage_score, prevScan?.chemicalDamageScore ?? null) : null,
      cgmCompatible: typeof analysis.cgm_compatible === "boolean" ? (analysis.cgm_compatible ? 1 : 0) : null,
      cgmNotes: analysis.cgm_notes ?? null,
      environmentalStress: analysis.environmental_stress ?? null,
      environmentalNotes: analysis.environmental_notes ?? null,
      routineSteps: analysis.routine_steps ? JSON.stringify(analysis.routine_steps) : null,
      ingredientsToAvoid: null,
      ingredientsToSeek: null,
      aiSummary: analysis.summary,
      aiRawResponse: JSON.stringify(analysis),
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens,
      cacheWriteTokens: usage.cacheWriteTokens,
      cacheReadTokens: usage.cacheReadTokens,
      estimatedCostUsd: usage.estimatedCostUsd,
      createdAt: now,
    });

    const products = analysis.product_recommendations ?? [];
    for (const product of products) {
      await db.insert(productRecommendations).values({
        id: nanoid(),
        scanId,
        userId: session.userId,
        productName: product.product_name,
        brand: product.brand ?? null,
        category: product.category,
        keyIngredients: JSON.stringify(product.key_ingredients),
        reason: product.reason,
        priority: product.priority,
        cgmSafe: typeof product.cgm_safe === "boolean" ? (product.cgm_safe ? 1 : 0) : null,
        priceRange: product.price_range ?? null,
        whereToBuy: product.where_to_buy ? JSON.stringify(product.where_to_buy) : null,
        createdAt: now,
      });
    }

    const [scan] = await db
      .select()
      .from(scans)
      .where(eq(scans.id, scanId))
      .limit(1);

    const scanProducts = await db
      .select()
      .from(productRecommendations)
      .where(eq(productRecommendations.scanId, scanId))
      .orderBy(asc(productRecommendations.priority));

    return NextResponse.json({ scan, products: scanProducts });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Scan error:", err);
    const message = err instanceof Error ? err.message : null;
    const isUserFacing = message && !message.includes("ANTHROPIC") && !message.includes("fetch");
    return NextResponse.json(
      { error: isUserFacing ? message : "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await requireAuth();

    const userScans = await db
      .select({
        id: scans.id,
        createdAt: scans.createdAt,
        curlType: scans.curlType,
        healthScore: scans.healthScore,
        hydrationScore: scans.hydrationScore,
        frizzScore: scans.frizzScore,
        imagePath: scans.imagePath,
      })
      .from(scans)
      .where(eq(scans.userId, session.userId))
      .orderBy(desc(scans.createdAt));

    return NextResponse.json({ scans: userScans });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch scans" }, { status: 500 });
  }
}
