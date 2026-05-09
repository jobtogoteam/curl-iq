import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { HAIR_ANALYSIS_SYSTEM_PROMPT, HAIR_ANALYSIS_USER_PROMPT } from "./prompts";
import type { HairAnalysis } from "@/types/hair";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function analyzeHair(imagePath: string): Promise<HairAnalysis> {
  const absolutePath = path.join(process.cwd(), "public", imagePath);
  const imageBuffer = fs.readFileSync(absolutePath);
  const base64Image = imageBuffer.toString("base64");

  // Determine media type from extension
  const ext = path.extname(imagePath).toLowerCase();
  const mediaType =
    ext === ".png"
      ? "image/png"
      : ext === ".webp"
      ? "image/webp"
      : "image/jpeg";

  const response = await anthropic.beta.messages.create({
    betas: ["prompt-caching-2024-07-31"],
    model: "claude-sonnet-4-6",
    max_tokens: 2500,
    system: [
      {
        type: "text",
        text: HAIR_ANALYSIS_SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType,
              data: base64Image,
            },
          },
          {
            type: "text",
            text: HAIR_ANALYSIS_USER_PROMPT,
          },
        ],
      },
    ],
  }, { timeout: 45_000 });

  const rawText = response.content[0].type === "text" ? response.content[0].text : "";

  // Strip markdown code fences if Claude wrapped the JSON
  const cleaned = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`Claude returned invalid JSON. Raw response: ${rawText.slice(0, 200)}`);
  }

  validateHairAnalysis(parsed);
  return parsed;
}

const REQUIRED_FIELDS: (keyof HairAnalysis)[] = [
  "wash_state",
  "curl_type",
  "thickness",
  "density",
  "porosity",
  "health_score",
  "hydration_score",
  "damage_score",
  "frizz_score",
  "definition_score",
  "summary",
  "routine_steps",
  "product_recommendations",
];

function validateHairAnalysis(data: unknown): asserts data is HairAnalysis {
  if (typeof data !== "object" || data === null) {
    throw new Error("Claude response is not an object");
  }
  const obj = data as Record<string, unknown>;
  const missing = REQUIRED_FIELDS.filter((f) => obj[f] === undefined || obj[f] === null);
  if (missing.length > 0) {
    throw new Error(`Claude response missing required fields: ${missing.join(", ")}`);
  }
  if (!Array.isArray(obj.routine_steps)) {
    throw new Error("Claude response: routine_steps must be an array");
  }
  if (!Array.isArray(obj.product_recommendations)) {
    throw new Error("Claude response: product_recommendations must be an array");
  }
}
