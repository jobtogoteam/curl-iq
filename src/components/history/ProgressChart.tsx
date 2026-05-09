"use client";

import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface ChartDataPoint {
  date: string;
  health?: number;
  hydration?: number;
  frizz?: number;
  definition?: number;
}

type Metric = "health" | "hydration" | "frizz" | "definition";

const METRICS: { key: Metric; label: string; color: string; invertedAxis?: boolean }[] = [
  { key: "health",     label: "Health",     color: "var(--metric-good)" },
  { key: "hydration",  label: "Hydration",  color: "var(--pm-protein)" },
  { key: "frizz",      label: "Frizz ↓",   color: "var(--primary)", invertedAxis: true },
  { key: "definition", label: "Definition", color: "var(--gold)" },
];

export function ProgressChart({ data }: { data: ChartDataPoint[] }) {
  const [activeMetrics, setActiveMetrics] = useState<Set<Metric>>(new Set(["health", "hydration"]));

  function toggleMetric(key: Metric) {
    setActiveMetrics((prev) => {
      const next = new Set(prev);
      if (next.has(key)) { if (next.size > 1) next.delete(key); }
      else next.add(key);
      return next;
    });
  }

  if (data.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-center">
        <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
          You need at least 2 scans to see progress
        </p>
        <p className="text-[12px] mt-1" style={{ color: "var(--text-tertiary)" }}>
          Take another scan to unlock your chart
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {METRICS.map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => toggleMetric(key)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all"
            style={
              activeMetrics.has(key)
                ? { background: `${color}22`, color, border: `1px solid ${color}44` }
                : {
                    background: "var(--surface-3)",
                    color: "var(--text-tertiary)",
                    border: "1px solid var(--border)",
                  }
            }
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: activeMetrics.has(key) ? color : "var(--text-tertiary)" }}
            />
            {label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -22 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "var(--text-tertiary)", fontFamily: "var(--font-body)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: "var(--text-tertiary)", fontFamily: "var(--font-body)" }}
            axisLine={false}
            tickLine={false}
            ticks={[0, 25, 50, 75, 100]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--surface-3)",
              border: "1px solid var(--border-bright)",
              borderRadius: "12px",
              fontSize: "12px",
              color: "var(--text-primary)",
              boxShadow: "var(--shadow-lg)",
            }}
            labelStyle={{ color: "var(--text-secondary)", marginBottom: "4px" }}
            formatter={(value, name) => {
              const v = value as number;
              if (name === "frizz") return [`${v} (lower = better)`, "Frizz"];
              const label = String(name).charAt(0).toUpperCase() + String(name).slice(1);
              return [v, label];
            }}
          />
          {METRICS.filter((m) => activeMetrics.has(m.key)).map(({ key, color }) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={color}
              strokeWidth={2}
              dot={{ r: 3.5, fill: color, strokeWidth: 0 }}
              activeDot={{ r: 5.5, strokeWidth: 0 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
