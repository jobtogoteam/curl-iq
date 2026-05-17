import { db } from "@/db";
import { scans } from "@/db/schema";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { eq, asc } from "drizzle-orm";
import { ProgressChart } from "@/components/history/ProgressChart";
import { HistoryGrid } from "@/components/history/HistoryGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import { TrendingUp, Camera } from "lucide-react";
import type { CurlType } from "@/types/hair";

export default async function HistoryPage() {
  const session = await getSession();
  if (!session.userId) redirect("/login");

  const allScans = await db
    .select({
      id: scans.id,
      createdAt: scans.createdAt,
      curlType: scans.curlType,
      healthScore: scans.healthScore,
      hydrationScore: scans.hydrationScore,
      frizzScore: scans.frizzScore,
      definitionScore: scans.definitionScore,
      imagePath: scans.imagePath,
    })
    .from(scans)
    .where(eq(scans.userId, session.userId))
    .orderBy(asc(scans.createdAt));

  const chartData = allScans.map((s) => ({
    date: new Date(s.createdAt * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    health:     s.healthScore ?? undefined,
    hydration:  s.hydrationScore ?? undefined,
    frizz:      s.frizzScore ?? undefined,
    definition: s.definitionScore ?? undefined,
  }));

  const reversedScans = [...allScans].reverse();

  return (
    <div className="px-5 pt-14 pb-6" style={{ background: "var(--bg)" }}>
      <div className="mb-8">
        <h1
          className="font-display"
          style={{ fontSize: "34px", fontWeight: 500, color: "var(--text-primary)" }}
        >
          Progress
        </h1>
        <p className="text-[13px] mt-1" style={{ color: "var(--text-secondary)" }}>
          {allScans.length} scan{allScans.length !== 1 ? "s" : ""} recorded
        </p>
      </div>

      <div
        className="rounded-2xl mb-8 p-5"
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--border-bright)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp size={14} style={{ color: "var(--sage)" }} />
          <p className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
            Hair Health Over Time
          </p>
        </div>
        <ProgressChart data={chartData} />
      </div>

      {allScans.length === 0 ? (
        <EmptyState
          icon={<Camera size={26} style={{ color: "var(--text-tertiary)" }} strokeWidth={1.5} />}
          title="No scans yet"
          description="Take your first scan to start tracking your hair health over time."
          cta={{ label: "Take a scan", href: "/scan" }}
        />
      ) : (
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-[0.14em] mb-4"
            style={{ color: "var(--text-tertiary)" }}
          >
            Scan History
          </p>
          <HistoryGrid scans={reversedScans.map((s) => ({ ...s, curlType: s.curlType as CurlType | null }))} />
        </div>
      )}
    </div>
  );
}
