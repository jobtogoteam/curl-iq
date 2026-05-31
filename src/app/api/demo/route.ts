import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, scans, productRecommendations } from "@/db/schema";
import { getSession } from "@/lib/auth/session";
import { hashPassword } from "@/lib/auth/password";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

const DEMO_EMAIL = "demo@curliq.app";
const DEMO_NAME = "Demo User";

// Pre-built demo analysis — realistic 3b curly hair profile
const DEMO_SCAN = {
  washState: "hours_after" as const,
  washStateConfidence: 82,
  washStateReasoning:
    "Hair shows moderate sheen loss and visible frizz at the crown, with good curl spring indicating several hours post-wash. Clumps are intact but starting to separate slightly.",
  curlType: "3b" as const,
  curlTypeConfidence: 88,
  thickness: "medium" as const,
  density: "high" as const,
  porosity: "high" as const,
  healthScore: 72,
  hydrationScore: 61,
  damageScore: 28,
  frizzScore: 45,
  definitionScore: 78,
  aiSummary:
    "Your 3b curls show strong definition and impressive density — you clearly have a good wash-day routine. The main opportunity here is moisture retention: your high porosity is letting hydration escape between wash days, which is driving the mid-level frizz score. Focus on sealing moisture with heavier butters or oils after your leave-in to lock that hydration in.",
};

const DEMO_PRODUCTS = [
  {
    productName: "Moisture Retention Shampoo",
    brand: "As I Am",
    category: "shampoo" as const,
    keyIngredients: ["coconut oil", "castor oil", "phytantriol"],
    reason:
      "Sulfate-free with coconut and castor oil — essential for high-porosity 3b hair that loses moisture quickly. Won't strip your natural oils.",
    priority: 1 as const,
    cgmSafe: true,
    priceRange: "$",
    whereToBuy: JSON.stringify(["Target", "Amazon", "Ulta", "Sally Beauty"]),
  },
  {
    productName: "Raw Shea Butter Deep Treatment Masque",
    brand: "SheaMoisture",
    category: "mask" as const,
    keyIngredients: ["raw shea butter", "argan oil", "sea kelp"],
    reason:
      "Your high-porosity hair is losing moisture fast — this weekly deep treatment mask seals the cuticle with shea butter and argan oil, directly addressing your hydration score of 61.",
    priority: 1 as const,
    cgmSafe: true,
    priceRange: "$",
    whereToBuy: JSON.stringify(["Target", "Ulta", "Walmart", "Amazon"]),
  },
  {
    productName: "Knot Today Leave-In Conditioner / Detangler",
    brand: "Kinky-Curly",
    category: "leave-in" as const,
    keyIngredients: ["organic aloe vera", "organic calendula extract", "organic marshmallow root"],
    reason:
      "Lightweight enough to not weigh down your 3b curls while marshmallow root provides exceptional slip — your high-porosity hair needs this moisture bridge between wash days.",
    priority: 1 as const,
    cgmSafe: true,
    priceRange: "$$",
    whereToBuy: JSON.stringify(["Ulta", "Amazon", "Target"]),
  },
  {
    productName: "Curl Activator Cream",
    brand: "Cantu",
    category: "curl-cream" as const,
    keyIngredients: ["shea butter", "coconut oil", "argan oil"],
    reason:
      "Your definition score of 78 is strong — this budget cream will enhance clump formation and push definition higher while keeping frizz in check at your current score of 45.",
    priority: 2 as const,
    cgmSafe: true,
    priceRange: "$",
    whereToBuy: JSON.stringify(["Target", "Walmart", "Sally Beauty", "Amazon"]),
  },
  {
    productName: "Coconut & Hibiscus Frizz-Free Curl Defining Gel",
    brand: "SheaMoisture",
    category: "gel" as const,
    keyIngredients: ["coconut oil", "hibiscus extract", "neem oil"],
    reason:
      "Pairs perfectly with your SheaMoisture masque for a coordinated product routine. The gel locks your 3b curl clumps in place and fights the humidity-driven frizz hours after wash.",
    priority: 2 as const,
    cgmSafe: true,
    priceRange: "$",
    whereToBuy: JSON.stringify(["Target", "Ulta", "Walmart", "Amazon"]),
  },
  {
    productName: "Jamaican Black Castor Oil",
    brand: "Tropic Isle Living",
    category: "oil" as const,
    keyIngredients: ["jamaican black castor oil", "vitamin E"],
    reason:
      "The ideal sealant for high-porosity 3b hair. Apply over your leave-in to physically lock moisture into the cuticle and dramatically reduce frizz between wash days.",
    priority: 2 as const,
    cgmSafe: true,
    priceRange: "$",
    whereToBuy: JSON.stringify(["Amazon", "Sally Beauty", "Ulta"]),
  },
  {
    productName: "Babassu & Mint Deep Conditioner",
    brand: "Mielle Organics",
    category: "mask" as const,
    keyIngredients: ["babassu oil", "peppermint oil", "hydrolyzed protein"],
    reason:
      "Use monthly as a protein treatment — your high porosity creates gaps in the cuticle that hydrolyzed protein temporarily fills, improving elasticity and reducing breakage.",
    priority: 3 as const,
    cgmSafe: true,
    priceRange: "$",
    whereToBuy: JSON.stringify(["Sephora", "Ulta", "Target", "Amazon"]),
  },
  {
    productName: "Olive Oil Styling Gel",
    brand: "Eco Styler",
    category: "gel" as const,
    keyIngredients: ["100% pure olive oil", "carbomer"],
    reason:
      "The original cult-favorite styling gel — use as a budget-friendly alternative when you need strong hold without crunch. Olive oil conditions while carbomer locks in curl pattern.",
    priority: 3 as const,
    cgmSafe: true,
    priceRange: "$",
    whereToBuy: JSON.stringify(["Sally Beauty", "Amazon", "Walmart", "Drugstores"]),
  },
];


export async function POST() {
  try {
    // Check if demo user exists, create if not
    let [demoUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, DEMO_EMAIL))
      .limit(1);

    if (!demoUser) {
      const id = `demo-${nanoid(12)}`;
      const passwordHash = await hashPassword(nanoid(24));
      await db.insert(users).values({
        id,
        email: DEMO_EMAIL,
        passwordHash,
        displayName: DEMO_NAME,
        createdAt: Math.floor(Date.now() / 1000),
      });

      [demoUser] = await db.select().from(users).where(eq(users.email, DEMO_EMAIL)).limit(1);

      // Seed 3 demo scans at different dates
      const baseTime = Math.floor(Date.now() / 1000);
      const scanDates = [
        baseTime - 60 * 60 * 24 * 28, // 28 days ago
        baseTime - 60 * 60 * 24 * 14, // 14 days ago
        baseTime - 60 * 60 * 24 * 2,  // 2 days ago
      ];
      const healthProgression = [58, 65, 72];
      const hydrationProgression = [48, 55, 61];
      const frizzProgression = [62, 52, 45];

      const imagePath = "demo/demo-scan.jpg";

      for (let i = 0; i < scanDates.length; i++) {
        const scanId = nanoid();
        const isLatest = i === scanDates.length - 1;
        await db.insert(scans).values({
          id: scanId,
          userId: demoUser.id,
          imagePath,
          washState: DEMO_SCAN.washState,
          washStateConfidence: DEMO_SCAN.washStateConfidence,
          washStateReasoning: DEMO_SCAN.washStateReasoning,
          curlType: DEMO_SCAN.curlType,
          curlTypeConfidence: DEMO_SCAN.curlTypeConfidence,
          thickness: DEMO_SCAN.thickness,
          density: DEMO_SCAN.density,
          porosity: DEMO_SCAN.porosity,
          healthScore: healthProgression[i],
          hydrationScore: hydrationProgression[i],
          damageScore: DEMO_SCAN.damageScore,
          frizzScore: frizzProgression[i],
          definitionScore: DEMO_SCAN.definitionScore,
          aiSummary: isLatest ? DEMO_SCAN.aiSummary : null,
          aiRawResponse: null,
          createdAt: scanDates[i],
        });

        // Seed products only for latest scan
        if (isLatest) {
          for (const product of DEMO_PRODUCTS) {
            await db.insert(productRecommendations).values({
              id: nanoid(),
              scanId,
              userId: demoUser.id,
              productName: product.productName,
              brand: product.brand,
              category: product.category,
              keyIngredients: JSON.stringify(product.keyIngredients),
              reason: product.reason,
              priority: product.priority,
              cgmSafe: product.cgmSafe ? 1 : 0,
              priceRange: product.priceRange ?? null,
              whereToBuy: product.whereToBuy ?? null,
              createdAt: scanDates[i],
            });
          }
        }
      }
    }

    // Set session
    const session = await getSession();
    session.userId = demoUser.id;
    session.email = demoUser.email;
    session.displayName = "Demo";
    session.isDemo = true;
    session.hairGoals = ["frizz", "moisture", "definition"];
    await session.save();

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Demo error:", err);
    return NextResponse.json({ error: "Demo setup failed" }, { status: 500 });
  }
}
