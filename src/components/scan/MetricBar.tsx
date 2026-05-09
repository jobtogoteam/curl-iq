"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Heart, Droplets, Wind, Zap, Sparkles } from "lucide-react";
import { useMotion } from "@/lib/motion";

export type MetricKey = "health" | "hydration" | "frizz" | "damage" | "definition";

const META: Record<MetricKey, { label: string; Icon: React.ElementType; inverted: boolean }> = {
  health:     { label: "Health",     Icon: Heart,     inverted: false },
  hydration:  { label: "Hydration",  Icon: Droplets,  inverted: false },
  definition: { label: "Definition", Icon: Sparkles,  inverted: false },
  frizz:      { label: "Frizz",      Icon: Wind,      inverted: true  },
  damage:     { label: "Damage",     Icon: Zap,       inverted: true  },
};

/**
 * Returns CSS variable references for the metric's quality level.
 * goodness is always 0–100 where 100 = best, regardless of metric direction.
 */
function getMetricVars(goodness: number): { color: string; bg: string } {
  let level: string;
  if (goodness >= 75) level = "excellent";
  else if (goodness >= 60) level = "good";
  else if (goodness >= 45) level = "fair";
  else if (goodness >= 28) level = "poor";
  else level = "critical";
  return {
    color: `var(--metric-${level})`,
    bg: `color-mix(in srgb, var(--metric-${level}) 12%, transparent)`,
  };
}

interface MetricBarProps {
  metric: MetricKey;
  value: number;
  delay?: number;
}

export function MetricBar({ metric, value, delay = 0 }: MetricBarProps) {
  const { label, Icon, inverted } = META[metric];
  const { shouldReduce } = useMotion();
  const [started, setStarted] = useState(false);
  const [pulsed, setPulsed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 100 + delay * 130);
    return () => clearTimeout(t);
  }, [delay]);

  const goodness = inverted ? 100 - value : value;
  const { color, bg } = getMetricVars(goodness);
  const isGood = goodness >= 75;

  // Count-up animation on raw value
  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, { stiffness: 320, damping: 28 });
  const animatedCount = useTransform(springVal, (v) => Math.round(v));

  useEffect(() => {
    if (shouldReduce) return;
    const t = setTimeout(() => {
      motionVal.set(value);
    }, 150 + delay * 130);
    return () => clearTimeout(t);
  }, [value, delay, motionVal, shouldReduce]);

  return (
    <div className="flex items-center gap-4 py-3">
      {/* Icon */}
      <motion.div
        className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg"
        style={{ background: bg }}
        animate={pulsed && !shouldReduce ? { scale: [1, 1.18, 1] } : {}}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Icon size={14} style={{ color }} strokeWidth={2} />
      </motion.div>

      {/* Bar + label */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-[12px] font-medium text-text-secondary uppercase tracking-[0.08em]">
            {label}
          </span>
          {shouldReduce ? (
            <span
              className="font-display tabular-nums leading-none"
              style={{ color, fontSize: "24px", fontWeight: 600, letterSpacing: "-0.02em" }}
            >
              {value}
              <span
                className="font-sans"
                style={{ fontSize: "11px", fontWeight: 400, color: "var(--text-tertiary)", marginLeft: "2px" }}
              >
                /100
              </span>
            </span>
          ) : (
            <span
              className="font-display tabular-nums leading-none"
              style={{ color, fontSize: "24px", fontWeight: 600, letterSpacing: "-0.02em" }}
            >
              <motion.span>{animatedCount}</motion.span>
              <span
                className="font-sans"
                style={{ fontSize: "11px", fontWeight: 400, color: "var(--text-tertiary)", marginLeft: "2px" }}
              >
                /100
              </span>
            </span>
          )}
        </div>

        {/* Track */}
        <div
          className="h-[3px] rounded-full overflow-hidden"
          style={{ background: "var(--surface-4)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              backgroundColor: color,
              width: `${value}%`,
              transformOrigin: "left center",
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: shouldReduce ? 1 : (started ? 1 : 0) }}
            transition={
              shouldReduce
                ? { duration: 0 }
                : { type: "spring", stiffness: 160, damping: 18, delay: delay * 0.13 + 0.12 }
            }
            onAnimationComplete={() => {
              if (isGood && !pulsed) setPulsed(true);
            }}
          />
        </div>
      </div>
    </div>
  );
}
