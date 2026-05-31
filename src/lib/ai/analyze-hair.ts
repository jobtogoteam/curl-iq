import Anthropic from "@anthropic-ai/sdk";
import { HAIR_ANALYSIS_SYSTEM_PROMPT, HAIR_ANALYSIS_USER_PROMPT } from "./prompts";
import type { HairAnalysis } from "@/types/hair";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Claude Sonnet 4.6 pricing per token
const PRICING = {
  input:      3.00  / 1_000_000,
  output:     15.00 / 1_000_000,
  cacheWrite: 3.75  / 1_000_000,
  cacheRead:  0.30  / 1_000_000,
};

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  cacheWriteTokens: number;
  cacheReadTokens: number;
  estimatedCostUsd: number;
}

export interface HairAnalysisResult {
  analysis: HairAnalysis;
  usage: TokenUsage;
}

export async function analyzeHair(
  image: { buffer: Buffer; mediaType: string }
): Promise<HairAnalysisResult> {
  const base64Image = image.buffer.toString("base64");
  const mediaType = image.mediaType as "image/jpeg" | "image/png" | "image/webp" | "image/gif";

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
  }, { timeout: 90_000 });

  const rawText = response.content[0].type === "text" ? response.content[0].text : "";

  console.error("[analyzeHair] stop_reason:", response.stop_reason, "| raw chars:", rawText.length);
  if (response.stop_reason === "max_tokens") {
    console.error("[analyzeHair] TRUNCATED — response hit max_tokens limit");
  }

  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error("[analyzeHair] No JSON object found in response. Raw:\n", rawText.slice(0, 500));
    throw new Error("We couldn't read the AI response. Please try again.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error("[analyzeHair] JSON.parse failed:", e, "\nExtracted:\n", jsonMatch[0].slice(-300));
    throw new Error("We couldn't read the AI response. Please try again.");
  }

  if (
    typeof parsed === "object" &&
    parsed !== null &&
    (parsed as Record<string, unknown>).can_analyze === false
  ) {
    const reason = (parsed as Record<string, unknown>).cannot_analyze_reason;
    throw new Error(
      typeof reason === "string" && reason.length > 0
        ? reason
        : "We couldn't detect hair in this photo. Please try a clear, close-up shot of your hair."
    );
  }

  validateHairAnalysis(parsed);

  const u = response.usage as {
    input_tokens: number;
    output_tokens: number;
    cache_creation_input_tokens?: number;
    cache_read_input_tokens?: number;
  };
  const inputTokens      = u.input_tokens ?? 0;
  const outputTokens     = u.output_tokens ?? 0;
  const cacheWriteTokens = u.cache_creation_input_tokens ?? 0;
  const cacheReadTokens  = u.cache_read_input_tokens ?? 0;
  const estimatedCostUsd =
    inputTokens      * PRICING.input +
    outputTokens     * PRICING.output +
    cacheWriteTokens * PRICING.cacheWrite +
    cacheReadTokens  * PRICING.cacheRead;

  return {
    analysis: parsed,
    usage: { inputTokens, outputTokens, cacheWriteTokens, cacheReadTokens, estimatedCostUsd },
  };
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
