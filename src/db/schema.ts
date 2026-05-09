import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  displayName: text("display_name").notNull(),
  createdAt: integer("created_at").notNull(),
});

export const scans = sqliteTable("scans", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  imagePath: text("image_path").notNull(),
  washState: text("wash_state", {
    enum: ["just_washed", "minutes_after", "hours_after", "dry", "unknown"],
  }),
  washStateConfidence: integer("wash_state_confidence"),
  washStateReasoning: text("wash_state_reasoning"),
  curlType: text("curl_type", {
    enum: ["2a", "2b", "2c", "3a", "3b", "3c", "4a", "4b", "4c"],
  }),
  curlTypeConfidence: integer("curl_type_confidence"),
  curlTypeReasoning: text("curl_type_reasoning"),
  curlUniformity: text("curl_uniformity", {
    enum: ["uniform", "mixed", "highly_varied"],
  }),
  thickness: text("thickness", { enum: ["fine", "medium", "coarse"] }),
  density: text("density", { enum: ["low", "medium", "high"] }),
  porosity: text("porosity", { enum: ["low", "normal", "high"] }),
  porosityReasoning: text("porosity_reasoning"),
  elasticity: text("elasticity", { enum: ["low", "normal", "high"] }),
  proteinMoistureBalance: text("protein_moisture_balance", {
    enum: ["balanced", "protein_overload", "moisture_overload", "unknown"],
  }),
  proteinMoistureReasoning: text("protein_moisture_reasoning"),
  scalpHealth: text("scalp_health", {
    enum: ["not_visible", "healthy", "dry", "oily", "flaky", "irritated"],
  }),
  growthStage: text("growth_stage", {
    enum: ["healthy_growth", "breakage_concern", "transitioning", "color_treated", "heat_styled", "unknown"],
  }),
  healthScore: integer("health_score"),
  hydrationScore: integer("hydration_score"),
  damageScore: integer("damage_score"),
  frizzScore: integer("frizz_score"),
  definitionScore: integer("definition_score"),
  heatDamageScore: integer("heat_damage_score"),
  chemicalDamageScore: integer("chemical_damage_score"),
  cgmCompatible: integer("cgm_compatible"), // 0 or 1
  cgmNotes: text("cgm_notes"),
  environmentalStress: text("environmental_stress", {
    enum: ["none", "mild", "moderate", "severe"],
  }),
  environmentalNotes: text("environmental_notes"),
  routineSteps: text("routine_steps"), // JSON array
  ingredientsToAvoid: text("ingredients_to_avoid"), // JSON array
  ingredientsToSeek: text("ingredients_to_seek"), // JSON array
  aiSummary: text("ai_summary"),
  aiRawResponse: text("ai_raw_response"),
  createdAt: integer("created_at").notNull(),
});

export const productRecommendations = sqliteTable("product_recommendations", {
  id: text("id").primaryKey(),
  scanId: text("scan_id")
    .notNull()
    .references(() => scans.id),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  productName: text("product_name").notNull(),
  brand: text("brand"),
  category: text("category", {
    enum: [
      "shampoo",
      "conditioner",
      "leave-in",
      "curl-cream",
      "gel",
      "oil",
      "mask",
    ],
  }).notNull(),
  keyIngredients: text("key_ingredients").notNull(), // JSON array
  reason: text("reason").notNull(),
  priority: integer("priority").notNull(), // 1=high, 2=medium, 3=low
  cgmSafe: integer("cgm_safe"), // 0 or 1
  priceRange: text("price_range"),   // "$" | "$$" | "$$$"
  whereToBuy: text("where_to_buy"), // JSON string[]
  createdAt: integer("created_at").notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Scan = typeof scans.$inferSelect;
export type NewScan = typeof scans.$inferInsert;
export type ProductRecommendation = typeof productRecommendations.$inferSelect;
export type NewProductRecommendation =
  typeof productRecommendations.$inferInsert;
