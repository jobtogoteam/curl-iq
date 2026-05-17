import { pgTable, text, integer, doublePrecision } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  displayName: text("display_name").notNull(),
  createdAt: integer("created_at").notNull(),
});

export const scans = pgTable("scans", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  imagePath: text("image_path").notNull(),
  washState: text("wash_state"),
  washStateConfidence: integer("wash_state_confidence"),
  washStateReasoning: text("wash_state_reasoning"),
  curlType: text("curl_type"),
  curlTypeConfidence: integer("curl_type_confidence"),
  curlTypeReasoning: text("curl_type_reasoning"),
  curlUniformity: text("curl_uniformity"),
  thickness: text("thickness"),
  density: text("density"),
  porosity: text("porosity"),
  porosityReasoning: text("porosity_reasoning"),
  elasticity: text("elasticity"),
  proteinMoistureBalance: text("protein_moisture_balance"),
  proteinMoistureReasoning: text("protein_moisture_reasoning"),
  scalpHealth: text("scalp_health"),
  growthStage: text("growth_stage"),
  healthScore: integer("health_score"),
  hydrationScore: integer("hydration_score"),
  damageScore: integer("damage_score"),
  frizzScore: integer("frizz_score"),
  definitionScore: integer("definition_score"),
  heatDamageScore: integer("heat_damage_score"),
  chemicalDamageScore: integer("chemical_damage_score"),
  cgmCompatible: integer("cgm_compatible"),
  cgmNotes: text("cgm_notes"),
  environmentalStress: text("environmental_stress"),
  environmentalNotes: text("environmental_notes"),
  routineSteps: text("routine_steps"),
  ingredientsToAvoid: text("ingredients_to_avoid"),
  ingredientsToSeek: text("ingredients_to_seek"),
  aiSummary: text("ai_summary"),
  aiRawResponse: text("ai_raw_response"),
  inputTokens: integer("input_tokens"),
  outputTokens: integer("output_tokens"),
  cacheWriteTokens: integer("cache_write_tokens"),
  cacheReadTokens: integer("cache_read_tokens"),
  estimatedCostUsd: doublePrecision("estimated_cost_usd"),
  createdAt: integer("created_at").notNull(),
});

export const productRecommendations = pgTable("product_recommendations", {
  id: text("id").primaryKey(),
  scanId: text("scan_id")
    .notNull()
    .references(() => scans.id),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  productName: text("product_name").notNull(),
  brand: text("brand"),
  category: text("category").notNull(),
  keyIngredients: text("key_ingredients").notNull(),
  reason: text("reason").notNull(),
  priority: integer("priority").notNull(),
  cgmSafe: integer("cgm_safe"),
  priceRange: text("price_range"),
  whereToBuy: text("where_to_buy"),
  createdAt: integer("created_at").notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Scan = typeof scans.$inferSelect;
export type NewScan = typeof scans.$inferInsert;
export type ProductRecommendation = typeof productRecommendations.$inferSelect;
export type NewProductRecommendation = typeof productRecommendations.$inferInsert;
