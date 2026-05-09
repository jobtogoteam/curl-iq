import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { scans, productRecommendations } from "@/db/schema";
import { requireAuth } from "@/lib/auth/session";
import { analyzeHair } from "@/lib/ai/analyze-hair";
import { saveUploadedFile } from "@/lib/upload";
import { rateLimit } from "@/lib/rate-limit";
import { nanoid } from "nanoid";
import { desc, eq, asc } from "drizzle-orm";

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

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    // Save uploaded file
    const { relativePath } = await saveUploadedFile(file, session.userId);

    // Run AI analysis
    const analysis = await analyzeHair(relativePath);

    const scanId = nanoid();
    const now = Math.floor(Date.now() / 1000);

    // Insert scan with all new fields
    db.insert(scans).values({
      id: scanId,
      userId: session.userId,
      imagePath: relativePath,
      washState: analysis.wash_state,
      washStateConfidence: analysis.wash_state_confidence,
      washStateReasoning: analysis.wash_state_reasoning,
      curlType: analysis.curl_type,
      curlTypeConfidence: analysis.curl_type_confidence,
      curlTypeReasoning: analysis.curl_type_reasoning ?? null,
      curlUniformity: analysis.curl_uniformity ?? null,
      thickness: analysis.thickness,
      density: analysis.density,
      porosity: analysis.porosity,
      porosityReasoning: analysis.porosity_reasoning ?? null,
      elasticity: analysis.elasticity_estimate ?? null,
      proteinMoistureBalance: analysis.protein_moisture_balance ?? null,
      proteinMoistureReasoning: analysis.protein_moisture_reasoning ?? null,
      scalpHealth: analysis.scalp_health ?? null,
      growthStage: analysis.growth_stage ?? null,
      healthScore: analysis.health_score,
      hydrationScore: analysis.hydration_score,
      damageScore: analysis.damage_score,
      frizzScore: analysis.frizz_score,
      definitionScore: analysis.definition_score,
      heatDamageScore: analysis.heat_damage_score ?? null,
      chemicalDamageScore: analysis.chemical_damage_score ?? null,
      cgmCompatible: typeof analysis.cgm_compatible === "boolean" ? (analysis.cgm_compatible ? 1 : 0) : null,
      cgmNotes: analysis.cgm_notes ?? null,
      environmentalStress: analysis.environmental_stress ?? null,
      environmentalNotes: analysis.environmental_notes ?? null,
      routineSteps: analysis.routine_steps ? JSON.stringify(analysis.routine_steps) : null,
      ingredientsToAvoid: analysis.ingredients_to_avoid ? JSON.stringify(analysis.ingredients_to_avoid) : null,
      ingredientsToSeek: analysis.ingredients_to_seek ? JSON.stringify(analysis.ingredients_to_seek) : null,
      aiSummary: analysis.summary,
      aiRawResponse: JSON.stringify(analysis),
      createdAt: now,
    }).run();

    // Insert product recommendations
    const products = analysis.product_recommendations ?? [];
    for (const product of products) {
      db.insert(productRecommendations).values({
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
      }).run();
    }

    // Fetch and return the complete scan with products
    const [scan] = db
      .select()
      .from(scans)
      .where(eq(scans.id, scanId))
      .limit(1)
      .all();

    const scanProducts = db
      .select()
      .from(productRecommendations)
      .where(eq(productRecommendations.scanId, scanId))
      .orderBy(asc(productRecommendations.priority))
      .all();

    return NextResponse.json({ scan, products: scanProducts });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Scan error:", err);
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await requireAuth();

    const userScans = db
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
      .orderBy(desc(scans.createdAt))
      .all();

    return NextResponse.json({ scans: userScans });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch scans" }, { status: 500 });
  }
}
