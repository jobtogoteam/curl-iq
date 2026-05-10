import { db } from "@/db";
import { scans } from "@/db/schema";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { eq, asc } from "drizzle-orm";
import { CostDashboard } from "@/components/costs/CostDashboard";
import { ReceiptText } from "lucide-react";

// Claude Sonnet 4.6 pricing per token
const PRICING = {
  input:      3.00  / 1_000_000,
  output:     15.00 / 1_000_000,
  cacheWrite: 3.75  / 1_000_000,
  cacheRead:  0.30  / 1_000_000,
};

export default async function CostsPage() {
  const session = await getSession();
  if (!session.userId) redirect("/login");

  const allScans = db
    .select({
      id: scans.id,
      createdAt: scans.createdAt,
      inputTokens: scans.inputTokens,
      outputTokens: scans.outputTokens,
      cacheWriteTokens: scans.cacheWriteTokens,
      cacheReadTokens: scans.cacheReadTokens,
      estimatedCostUsd: scans.estimatedCostUsd,
    })
    .from(scans)
    .where(eq(scans.userId, session.userId))
    .orderBy(asc(scans.createdAt))
    .all();

  const scanData = allScans.map((s, i) => {
    const inputTokens      = s.inputTokens      ?? 0;
    const outputTokens     = s.outputTokens     ?? 0;
    const cacheWriteTokens = s.cacheWriteTokens ?? 0;
    const cacheReadTokens  = s.cacheReadTokens  ?? 0;
    const estimatedCostUsd = s.estimatedCostUsd ?? 0;

    const inputCost      = inputTokens      * PRICING.input;
    const outputCost     = outputTokens     * PRICING.output;
    const cacheWriteCost = cacheWriteTokens * PRICING.cacheWrite;
    const cacheReadCost  = cacheReadTokens  * PRICING.cacheRead;

    const date = new Date(s.createdAt * 1000);
    const label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const fullDate = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    return {
      id: s.id,
      label: `#${i + 1} ${label}`,
      fullDate,
      scanNumber: i + 1,
      inputTokens,
      outputTokens,
      cacheWriteTokens,
      cacheReadTokens,
      estimatedCostUsd,
      inputCost,
      outputCost,
      cacheWriteCost,
      cacheReadCost,
    };
  });

  const totalCost   = scanData.reduce((s, d) => s + d.estimatedCostUsd, 0);
  const avgCost     = scanData.length > 0 ? totalCost / scanData.length : 0;
  const totalTokens = scanData.reduce(
    (s, d) => s + d.inputTokens + d.outputTokens + d.cacheWriteTokens + d.cacheReadTokens,
    0
  );
  const cacheHits = scanData.filter((d) => d.cacheReadTokens > 0).length;

  return (
    <div className="px-5 pt-14 pb-6" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-xl"
            style={{ background: "var(--primary-glow)", border: "1px solid var(--border-primary)" }}
          >
            <ReceiptText size={16} style={{ color: "var(--primary)" }} />
          </div>
          <h1
            className="font-display"
            style={{ fontSize: "34px", fontWeight: 500, color: "var(--text-primary)" }}
          >
            API Costs
          </h1>
        </div>
        <p className="text-[13px] mt-1" style={{ color: "var(--text-secondary)" }}>
          Claude Sonnet 4.6 · per-scan token usage &amp; spend
        </p>
      </div>

      <CostDashboard
        scans={scanData}
        totalCost={totalCost}
        avgCost={avgCost}
        totalScans={allScans.length}
        totalTokens={totalTokens}
        cacheHits={cacheHits}
      />
    </div>
  );
}
