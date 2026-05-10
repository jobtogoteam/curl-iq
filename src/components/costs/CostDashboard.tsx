"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import { DollarSign, Zap, Database, TrendingDown, Info } from "lucide-react";

interface ScanCost {
  id: string;
  label: string;        // short date label
  fullDate: string;     // tooltip date
  scanNumber: number;
  inputTokens: number;
  outputTokens: number;
  cacheWriteTokens: number;
  cacheReadTokens: number;
  estimatedCostUsd: number;
  // Derived cost breakdown
  inputCost: number;
  outputCost: number;
  cacheWriteCost: number;
  cacheReadCost: number;
}

interface Props {
  scans: ScanCost[];
  totalCost: number;
  avgCost: number;
  totalScans: number;
  totalTokens: number;
  cacheHits: number;
}

const COLORS = {
  input:      "#5B9BD5",
  output:     "#D4895C",
  cacheWrite: "#C8963C",
  cacheRead:  "#7EA985",
};

function formatCost(usd: number) {
  if (usd === 0) return "$0.000000";
  if (usd < 0.001) return `$${usd.toFixed(6)}`;
  return `$${usd.toFixed(4)}`;
}

function formatTokens(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CostTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s: number, p: { value: number }) => s + (p.value ?? 0), 0);
  return (
    <div
      className="rounded-2xl p-4 text-[12px]"
      style={{
        background: "var(--surface-3)",
        border: "1px solid var(--border-bright)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        minWidth: 200,
      }}
    >
      <p className="font-semibold mb-3" style={{ color: "var(--text-primary)", fontSize: 13 }}>
        {label}
      </p>
      {payload.map((p: { name: string; value: number; fill: string }) => (
        <div key={p.name} className="flex items-center justify-between gap-6 mb-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.fill }} />
            <span style={{ color: "var(--text-secondary)" }}>{p.name}</span>
          </div>
          <span style={{ color: "var(--text-primary)" }}>${p.value.toFixed(6)}</span>
        </div>
      ))}
      <div
        className="flex items-center justify-between mt-3 pt-3 font-semibold"
        style={{ borderTop: "1px solid var(--border)", color: "var(--primary)" }}
      >
        <span>Total</span>
        <span>{formatCost(total)}</span>
      </div>
    </div>
  );
}

export function CostDashboard({ scans, totalCost, avgCost, totalScans, totalTokens, cacheHits }: Props) {
  const [view, setView] = useState<"chart" | "table">("chart");

  const hasData = scans.some((s) => s.estimatedCostUsd > 0);

  const chartData = scans.map((s) => ({
    name: s.label,
    fullDate: s.fullDate,
    scanNumber: s.scanNumber,
    "Input": s.inputCost,
    "Output": s.outputCost,
    "Cache write": s.cacheWriteCost,
    "Cache read": s.cacheReadCost,
    total: s.estimatedCostUsd,
  }));

  const cacheSavings =
    scans.reduce((sum, s) => {
      // What it would have cost without caching (all cache reads billed as full input)
      const withoutCache = s.cacheReadTokens * (3.00 / 1_000_000);
      const withCache    = s.cacheReadCost;
      return sum + (withoutCache - withCache);
    }, 0);

  const statCards = [
    {
      icon: DollarSign,
      label: "Total spent",
      value: formatCost(totalCost),
      sub: `across ${totalScans} scan${totalScans !== 1 ? "s" : ""}`,
      color: "var(--primary)",
    },
    {
      icon: Zap,
      label: "Avg per scan",
      value: formatCost(avgCost),
      sub: hasData ? "Claude Sonnet 4.6" : "no data yet",
      color: "var(--gold)",
    },
    {
      icon: Database,
      label: "Total tokens",
      value: formatTokens(totalTokens),
      sub: `${cacheHits} cache hit${cacheHits !== 1 ? "s" : ""}`,
      color: "var(--sage)",
    },
    {
      icon: TrendingDown,
      label: "Cache savings",
      value: formatCost(cacheSavings),
      sub: "vs. no caching",
      color: "#5B9BD5",
    },
  ];

  return (
    <div>
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {statCards.map(({ icon: Icon, label, value, sub, color }) => (
          <div
            key={label}
            className="rounded-2xl p-4"
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border-bright)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="flex items-center justify-center w-7 h-7 rounded-lg"
                style={{ background: `${color}18` }}
              >
                <Icon size={14} style={{ color }} />
              </div>
              <span className="text-[11px] font-medium" style={{ color: "var(--text-tertiary)" }}>
                {label}
              </span>
            </div>
            <p className="font-mono font-semibold leading-none" style={{ color, fontSize: 15 }}>
              {value}
            </p>
            <p className="text-[11px] mt-1" style={{ color: "var(--text-tertiary)" }}>
              {sub}
            </p>
          </div>
        ))}
      </div>

      {/* View toggle */}
      <div className="flex gap-2 mb-4">
        {(["chart", "table"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className="px-4 py-1.5 rounded-full text-[12px] font-medium transition-all"
            style={
              view === v
                ? { background: "var(--primary-glow)", color: "var(--primary)", border: "1px solid rgba(212,137,92,0.3)" }
                : { background: "var(--surface-3)", color: "var(--text-tertiary)", border: "1px solid var(--border)" }
            }
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      {/* Chart view */}
      {view === "chart" && (
        <div
          className="rounded-2xl p-5 mb-5"
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--border-bright)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <p className="text-[12px] font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
            Cost per scan — stacked by token type
          </p>
          {!hasData ? (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
                No cost data yet
              </p>
              <p className="text-[12px] mt-1" style={{ color: "var(--text-tertiary)" }}>
                New scans will be tracked automatically
              </p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: -8 }}>
                  <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: "var(--text-tertiary)", fontFamily: "var(--font-body)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(v) => `$${v.toFixed(3)}`}
                    tick={{ fontSize: 9, fill: "var(--text-tertiary)", fontFamily: "var(--font-body)" }}
                    axisLine={false}
                    tickLine={false}
                    width={48}
                  />
                  <Tooltip content={<CostTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                  <Bar dataKey="Input"       stackId="a" fill={COLORS.input}      radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Output"      stackId="a" fill={COLORS.output}     radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Cache write" stackId="a" fill={COLORS.cacheWrite} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Cache read"  stackId="a" fill={COLORS.cacheRead}  radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
                {[
                  { key: "Input",       color: COLORS.input,      price: "$3.00/MTok" },
                  { key: "Output",      color: COLORS.output,     price: "$15.00/MTok" },
                  { key: "Cache write", color: COLORS.cacheWrite,  price: "$3.75/MTok" },
                  { key: "Cache read",  color: COLORS.cacheRead,   price: "$0.30/MTok" },
                ].map(({ key, color, price }) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: color }} />
                    <span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>{key}</span>
                    <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>({price})</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Table view */}
      {view === "table" && (
        <div
          className="rounded-2xl overflow-hidden mb-5"
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--border-bright)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {scans.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>No scans yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    {["Scan", "Date", "Input", "Output", "Cache W", "Cache R", "Total"].map((h) => (
                      <th
                        key={h}
                        className="px-3 py-3 text-left font-semibold uppercase tracking-wide"
                        style={{ color: "var(--text-tertiary)", fontSize: 10 }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {scans.map((s, i) => (
                    <tr
                      key={s.id}
                      style={{
                        borderBottom: i < scans.length - 1 ? "1px solid var(--border)" : undefined,
                      }}
                    >
                      <td className="px-3 py-3 font-mono" style={{ color: "var(--text-secondary)" }}>
                        #{s.scanNumber}
                      </td>
                      <td className="px-3 py-3" style={{ color: "var(--text-secondary)" }}>
                        {s.fullDate}
                      </td>
                      <td className="px-3 py-3 font-mono" style={{ color: COLORS.input }}>
                        {formatTokens(s.inputTokens)}
                      </td>
                      <td className="px-3 py-3 font-mono" style={{ color: COLORS.output }}>
                        {formatTokens(s.outputTokens)}
                      </td>
                      <td className="px-3 py-3 font-mono" style={{ color: COLORS.cacheWrite }}>
                        {s.cacheWriteTokens > 0 ? formatTokens(s.cacheWriteTokens) : "—"}
                      </td>
                      <td className="px-3 py-3 font-mono" style={{ color: COLORS.cacheRead }}>
                        {s.cacheReadTokens > 0 ? formatTokens(s.cacheReadTokens) : "—"}
                      </td>
                      <td className="px-3 py-3 font-mono font-semibold" style={{ color: "var(--primary)" }}>
                        {s.estimatedCostUsd > 0 ? formatCost(s.estimatedCostUsd) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Pricing note */}
      <div
        className="rounded-xl p-4 flex gap-3"
        style={{ background: "var(--surface-3)", border: "1px solid var(--border)" }}
      >
        <Info size={14} className="flex-shrink-0 mt-0.5" style={{ color: "var(--text-tertiary)" }} />
        <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
          Costs are estimates based on Claude Sonnet 4.6 pricing. Cache reads ($0.30/MTok) are 10× cheaper
          than input tokens ($3.00/MTok). The system prompt (~3,500 tokens) is cached after the first call,
          dramatically reducing cost on subsequent scans within the same 5-minute window.
        </p>
      </div>
    </div>
  );
}
