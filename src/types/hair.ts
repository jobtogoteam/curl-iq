export type WashState =
  | "just_washed"
  | "minutes_after"
  | "hours_after"
  | "dry"
  | "unknown";

export type CurlType =
  | "2a"
  | "2b"
  | "2c"
  | "3a"
  | "3b"
  | "3c"
  | "4a"
  | "4b"
  | "4c";

export type Thickness = "fine" | "medium" | "coarse";
export type Density = "low" | "medium" | "high";
export type Porosity = "low" | "normal" | "high";
export type Elasticity = "low" | "normal" | "high";
export type ProteinMoistureBalance =
  | "balanced"
  | "protein_overload"
  | "moisture_overload"
  | "unknown";
export type ScalpHealth =
  | "not_visible"
  | "healthy"
  | "dry"
  | "oily"
  | "flaky"
  | "irritated";
export type GrowthStage =
  | "healthy_growth"
  | "breakage_concern"
  | "transitioning"
  | "color_treated"
  | "heat_styled"
  | "unknown";
export type CurlUniformity = "uniform" | "mixed" | "highly_varied";
export type EnvironmentalStress = "none" | "mild" | "moderate" | "severe";
export type RoutinePhase =
  | "pre-wash"
  | "wash"
  | "condition"
  | "styling"
  | "drying"
  | "maintenance";

export type ProductCategory =
  | "shampoo"
  | "conditioner"
  | "leave-in"
  | "curl-cream"
  | "gel"
  | "oil"
  | "mask";

export interface RoutineStep {
  step: number;
  phase: RoutinePhase;
  action: string;
  why: string;
  frequency: string;
  tip: string;
}

export type PriceTier = "$" | "$$" | "$$$";

export interface ProductRecommendation {
  product_name: string;
  brand: string | null;
  category: ProductCategory;
  key_ingredients: string[];
  reason: string;
  priority: 1 | 2 | 3;
  cgm_safe: boolean;
  price_range?: PriceTier;
  where_to_buy?: string[];
}

export interface HairAnalysis {
  wash_state: WashState;
  wash_state_confidence: number;
  wash_state_reasoning: string;

  curl_type: CurlType;
  curl_type_confidence: number;
  curl_type_reasoning: string;
  curl_uniformity: CurlUniformity;

  thickness: Thickness;
  density: Density;
  porosity: Porosity;
  porosity_reasoning: string;

  elasticity_estimate: Elasticity;
  protein_moisture_balance: ProteinMoistureBalance;
  protein_moisture_reasoning: string;

  scalp_health: ScalpHealth;
  growth_stage: GrowthStage;

  health_score: number;
  hydration_score: number;
  damage_score: number;
  frizz_score: number;
  definition_score: number;
  heat_damage_score: number;
  chemical_damage_score: number;

  cgm_compatible: boolean;
  cgm_notes: string;

  environmental_stress: EnvironmentalStress;
  environmental_notes: string;

  summary: string;

  routine_steps: RoutineStep[];
  ingredients_to_avoid: string[];
  ingredients_to_seek: string[];

  product_recommendations: ProductRecommendation[];
}

export const WASH_STATE_LABELS: Record<WashState, string> = {
  just_washed: "Just washed",
  minutes_after: "Minutes after wash",
  hours_after: "Hours after wash",
  dry: "Dry hair",
  unknown: "Unknown",
};

export const WASH_STATE_ICONS: Record<WashState, string> = {
  just_washed: "💧",
  minutes_after: "🌊",
  hours_after: "💨",
  dry: "☀️",
  unknown: "❓",
};

export const CURL_TYPE_DESCRIPTIONS: Record<CurlType, string> = {
  "2a": "2a — Loose waves",
  "2b": "2b — Defined waves",
  "2c": "2c — Wavy with curls",
  "3a": "3a — Loose curls",
  "3b": "3b — Springy curls",
  "3c": "3c — Tight curls",
  "4a": "4a — Soft coils",
  "4b": "4b — Z-pattern coils",
  "4c": "4c — Tight coils",
};

export const PROTEIN_MOISTURE_LABELS: Record<ProteinMoistureBalance, string> = {
  balanced: "Balanced",
  protein_overload: "Protein overload",
  moisture_overload: "Moisture overload",
  unknown: "Unknown",
};

export const GROWTH_STAGE_LABELS: Record<GrowthStage, string> = {
  healthy_growth: "Healthy growth",
  breakage_concern: "Breakage concern",
  transitioning: "Transitioning",
  color_treated: "Colour treated",
  heat_styled: "Heat styled",
  unknown: "Unknown",
};

export const ROUTINE_PHASE_LABELS: Record<RoutinePhase, string> = {
  "pre-wash": "Pre-Wash",
  wash: "Wash",
  condition: "Condition",
  styling: "Styling",
  drying: "Drying",
  maintenance: "Maintenance",
};

export const ROUTINE_PHASE_COLORS: Record<RoutinePhase, string> = {
  "pre-wash":  "var(--phase-pre-wash)",
  wash:        "var(--phase-wash)",
  condition:   "var(--phase-condition)",
  styling:     "var(--phase-styling)",
  drying:      "var(--phase-drying)",
  maintenance: "var(--phase-maintenance)",
};
