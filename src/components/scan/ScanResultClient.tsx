"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, FileText, ChevronDown, ShieldCheck, ShieldX,
  Leaf, FlaskConical, Zap, Star,
  CheckCircle2, XCircle,
} from "lucide-react";
import { MetricBar } from "@/components/scan/MetricBar";
import { ProductCard } from "@/components/products/ProductCard";
import type { CurlType, ProteinMoistureBalance, RoutineStep } from "@/types/hair";
import type { ProductRecommendation } from "@/db/schema";
import { useState, useEffect, useRef } from "react";
import {
  PROTEIN_MOISTURE_LABELS,
  GROWTH_STAGE_LABELS,
  ROUTINE_PHASE_LABELS,
  ROUTINE_PHASE_COLORS,
} from "@/types/hair";
import { spring, smooth, fadeUp, staggerSections, useMotion } from "@/lib/motion";

interface Props {
  curlType: CurlType | null;
  curlTypeReasoning: string | null;
  curlUniformity: string | null;
  thickness: string | null;
  density: string | null;
  porosity: string | null;
  porosityReasoning: string | null;
  elasticity: string | null;
  proteinMoistureBalance: ProteinMoistureBalance | null;
  proteinMoistureReasoning: string | null;
  scalpHealth: string | null;
  growthStage: string | null;
  healthScore: number | null;
  hydrationScore: number | null;
  definitionScore: number | null;
  frizzScore: number | null;
  damageScore: number | null;
  heatDamageScore: number | null;
  chemicalDamageScore: number | null;
  cgmCompatible: boolean | null;
  cgmNotes: string | null;
  environmentalStress: string | null;
  environmentalNotes: string | null;
  aiSummary: string | null;
  washStateReasoning: string | null;
  routineSteps: RoutineStep[];
  ingredientsToAvoid: string[];
  ingredientsToSeek: string[];
  products: ProductRecommendation[];
}

function getOrbColor(score: number): string {
  if (score >= 72) return "var(--metric-good)";
  if (score >= 45) return "var(--primary)";
  return "var(--error)";
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-text-tertiary mb-3">
      {children}
    </p>
  );
}

const PM_COLOR_VARS: Record<ProteinMoistureBalance, string> = {
  protein_overload: "var(--pm-protein)",
  balanced:         "var(--pm-balanced)",
  moisture_overload:"var(--pm-moisture)",
  unknown:          "var(--pm-unknown)",
};

function ProteinMoistureMeter({ balance, reasoning }: { balance: ProteinMoistureBalance; reasoning: string | null }) {
  const positions: Record<ProteinMoistureBalance, number> = {
    protein_overload: 10,
    balanced: 50,
    moisture_overload: 90,
    unknown: 50,
  };
  const pct = positions[balance];
  const color = PM_COLOR_VARS[balance];

  return (
    <div className="rounded-2xl px-4 pt-3 pb-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      <div className="flex justify-between text-[10px] font-semibold mb-2" style={{ color: "var(--text-tertiary)" }}>
        <span>← Protein</span>
        <span>Moisture →</span>
      </div>
      <div
        className="relative h-2 rounded-full overflow-visible"
        style={{ background: `linear-gradient(90deg, color-mix(in srgb, var(--pm-protein) 12%, transparent) 0%, color-mix(in srgb, var(--pm-balanced) 20%, transparent) 50%, color-mix(in srgb, var(--pm-moisture) 12%, transparent) 100%)` }}
      >
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full shadow-sm border-2 border-white"
          style={{ left: `calc(${pct}% - 8px)`, backgroundColor: color }}
          initial={{ left: "50%" }}
          animate={{ left: `calc(${pct}% - 8px)` }}
          transition={{ type: "spring", stiffness: 180, damping: 18, delay: 0.2 }}
        />
      </div>
      <div className="flex justify-center mt-3">
        <span
          className="text-[12px] font-semibold px-3 py-1 rounded-full"
          style={{
            background: `color-mix(in srgb, ${color} 12%, transparent)`,
            color,
            border: `1px solid color-mix(in srgb, ${color} 22%, transparent)`,
          }}
        >
          {PROTEIN_MOISTURE_LABELS[balance]}
        </span>
      </div>
      {reasoning && (
        <p className="text-[12px] text-text-secondary leading-relaxed mt-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
          {reasoning}
        </p>
      )}
    </div>
  );
}

const ROUTINE_PHASE_CSS_VARS: Record<string, string> = {
  "pre-wash":    "var(--phase-pre-wash)",
  wash:          "var(--phase-wash)",
  condition:     "var(--phase-condition)",
  styling:       "var(--phase-styling)",
  drying:        "var(--phase-drying)",
  maintenance:   "var(--phase-maintenance)",
};

function RoutineCard({ step, index }: { step: RoutineStep; index: number }) {
  const [open, setOpen] = useState(false);
  const color = ROUTINE_PHASE_CSS_VARS[step.phase] ?? "var(--primary)";
  const phaseLabel = ROUTINE_PHASE_LABELS[step.phase] ?? step.phase;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl overflow-hidden"
      style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
    >
      <button
        className="w-full flex items-center gap-3 p-4 text-left"
        onClick={() => setOpen(!open)}
      >
        <div
          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold"
          style={{ background: `color-mix(in srgb, ${color} 14%, transparent)`, color }}
        >
          {step.step}
        </div>
        <div className="flex-1 min-w-0">
          <span
            className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1"
            style={{ background: `color-mix(in srgb, ${color} 10%, transparent)`, color }}
          >
            {phaseLabel}
          </span>
          <p className="text-[13px] font-semibold text-text-primary leading-snug">{step.action}</p>
          <p className="text-[11px] text-text-tertiary mt-0.5">{step.frequency}</p>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0">
          <ChevronDown size={14} style={{ color: "var(--text-tertiary)" }} />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0">
              <div className="h-px mb-3" style={{ background: "var(--border)" }} />
              <p className="text-[12px] text-text-secondary leading-relaxed mb-2.5">{step.why}</p>
              <div className="flex items-start gap-2 rounded-xl p-3" style={{ background: `color-mix(in srgb, ${color} 6%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 15%, transparent)` }}>
                <Star size={11} style={{ color, marginTop: 2, flexShrink: 0 }} />
                <p className="text-[11px] font-medium leading-relaxed" style={{ color }}>{step.tip}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function ScanResultClient({
  curlType,
  curlTypeReasoning,
  curlUniformity,
  thickness,
  density,
  porosity,
  porosityReasoning,
  elasticity,
  proteinMoistureBalance,
  proteinMoistureReasoning,
  scalpHealth,
  growthStage,
  healthScore,
  hydrationScore,
  definitionScore,
  frizzScore,
  damageScore,
  heatDamageScore,
  chemicalDamageScore,
  cgmCompatible,
  cgmNotes,
  environmentalStress,
  environmentalNotes,
  aiSummary,
  washStateReasoning,
  routineSteps,
  ingredientsToAvoid,
  ingredientsToSeek,
  products,
}: Props) {
  const [showDetails, setShowDetails] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);
  const { shouldReduce } = useMotion();

  useEffect(() => {
    if (healthScore === null || shouldReduce) { setDisplayScore(healthScore ?? 0); return; }
    const start = performance.now();
    const duration = 900;
    const raf = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayScore(Math.round(eased * healthScore));
      if (t < 1) requestAnimationFrame(raf);
    };
    const id = requestAnimationFrame(raf);
    return () => cancelAnimationFrame(id);
  }, [healthScore, shouldReduce]);

  const mainBadges = [
    curlType && { label: curlType.toUpperCase(), accent: true },
    thickness && { label: thickness.charAt(0).toUpperCase() + thickness.slice(1) },
    density && { label: density.charAt(0).toUpperCase() + density.slice(1) + " density" },
    porosity && { label: porosity.charAt(0).toUpperCase() + porosity.slice(1) + " porosity" },
  ].filter(Boolean) as { label: string; accent?: boolean }[];

  const extraBadges = [
    elasticity && { label: elasticity.charAt(0).toUpperCase() + elasticity.slice(1) + " elasticity", color: "var(--badge-elasticity)" },
    curlUniformity && curlUniformity !== "uniform" && {
      label: curlUniformity === "mixed" ? "Mixed pattern" : "Highly varied",
      color: "var(--badge-mixed)",
    },
    growthStage && growthStage !== "unknown" && growthStage !== "healthy_growth" && {
      label: GROWTH_STAGE_LABELS[growthStage as keyof typeof GROWTH_STAGE_LABELS] ?? growthStage,
      color: "var(--error)",
    },
  ].filter(Boolean) as { label: string; color: string }[];

  const orbColor = healthScore !== null ? getOrbColor(healthScore) : "var(--primary)";

  return (
    <div className="px-5 pt-5" style={{ paddingBottom: "calc(7rem + env(safe-area-inset-bottom))" }}>
      {/* Health score orb — springs in first before stagger sequence */}
      {healthScore !== null && (
        <motion.div
          className="flex flex-col items-center pt-2 pb-6"
          initial={shouldReduce ? false : { scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={shouldReduce ? { duration: 0 } : spring}
        >
          <div
            className="relative flex items-center justify-center w-24 h-24 rounded-full"
            style={{
              background: `color-mix(in srgb, ${orbColor} 8%, transparent)`,
              border: `2px solid color-mix(in srgb, ${orbColor} 28%, transparent)`,
              boxShadow: `0 0 32px color-mix(in srgb, ${orbColor} 14%, transparent)`,
            }}
          >
            {/* One-shot expanding ring after orb springs in */}
            {!shouldReduce && (
              <motion.div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ border: `1.5px solid ${orbColor}` }}
                initial={{ scale: 1, opacity: 0.55 }}
                animate={{ scale: 1.75, opacity: 0 }}
                transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
              />
            )}
            <div className="text-center">
              <span
                className="font-display tabular-nums"
                style={{ fontSize: "38px", fontWeight: 700, color: orbColor, letterSpacing: "-0.03em", lineHeight: 1 }}
              >
                {displayScore}
              </span>
            </div>
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-widest mt-3" style={{ color: "var(--text-tertiary)" }}>
            Overall Health
          </p>
        </motion.div>
      )}

      <motion.div
        variants={staggerSections}
        initial="initial"
        animate="animate"
      >
      {/* Hair type badges */}
      {mainBadges.length > 0 && (
        <motion.div variants={fadeUp} className="mb-6">
          <SectionLabel>Hair Type</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {mainBadges.map((b, i) => (
              <motion.span
                key={i}
                initial={
                  shouldReduce ? false
                  : i === 0
                    ? { opacity: 0, x: -24 }
                    : { opacity: 0, scale: 0.85 }
                }
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={
                  shouldReduce ? { duration: 0 }
                  : i === 0
                    ? { ...smooth, delay: 0.2 }
                    : { delay: 0.25 + i * 0.06, duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
                }
                className="text-[13px] font-semibold px-3.5 py-1.5 rounded-full"
                style={
                  b.accent
                    ? {
                        background: "color-mix(in srgb, var(--primary) 12%, transparent)",
                        color: "var(--primary)",
                        border: "1px solid color-mix(in srgb, var(--primary) 22%, transparent)",
                      }
                    : { background: "var(--surface-warm)", color: "var(--text-secondary)", border: "1px solid var(--border)" }
                }
              >
                {b.label}
              </motion.span>
            ))}
          </div>
          {extraBadges.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {extraBadges.map((b, i) => (
                <motion.span
                  key={i}
                  initial={shouldReduce ? false : { opacity: 0, scale: 0.82 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={shouldReduce ? { duration: 0 } : { delay: 0.38 + i * 0.07, duration: 0.28, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                  style={{
                    background: `color-mix(in srgb, ${b.color} 10%, transparent)`,
                    color: b.color,
                    border: `1px solid color-mix(in srgb, ${b.color} 18%, transparent)`,
                  }}
                >
                  {b.label}
                </motion.span>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* CGM Compatibility */}
      {cgmCompatible !== null && (
        <motion.div variants={fadeUp} className="mb-6">
          <div
            className="rounded-2xl p-4 flex items-start gap-3"
            style={{
              background: cgmCompatible
                ? "color-mix(in srgb, var(--sage) 8%, transparent)"
                : "color-mix(in srgb, var(--error) 5%, transparent)",
              border: `1px solid ${cgmCompatible
                ? "color-mix(in srgb, var(--sage) 22%, transparent)"
                : "color-mix(in srgb, var(--error) 14%, transparent)"}`,
            }}
          >
            {cgmCompatible ? (
              <ShieldCheck size={20} style={{ color: "var(--sage)", flexShrink: 0, marginTop: 1 }} />
            ) : (
              <ShieldX size={20} style={{ color: "var(--error)", flexShrink: 0, marginTop: 1 }} />
            )}
            <div>
              <p className="text-[13px] font-semibold" style={{ color: cgmCompatible ? "var(--sage)" : "var(--error)" }}>
                {cgmCompatible ? "CGM Compatible" : "Not CGM Compatible"}
              </p>
              {cgmNotes && (
                <p className="text-[12px] text-text-secondary mt-1 leading-relaxed">{cgmNotes}</p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* AI Summary */}
      {aiSummary && (
        <motion.div variants={fadeUp} className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={12} style={{ color: "var(--primary)" }} />
            <SectionLabel>AI Analysis</SectionLabel>
          </div>
          <div
            className="rounded-2xl p-4"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <p className="font-serif text-[15px] leading-relaxed italic" style={{ color: "var(--text-secondary)" }}>
              &ldquo;{aiSummary}&rdquo;
            </p>
          </div>
        </motion.div>
      )}

      {/* Health metrics */}
      <motion.div variants={fadeUp} className="mb-6">
        <SectionLabel>Health Metrics</SectionLabel>
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 1px 4px rgba(45,32,22,0.05)" }}
        >
          <div className="px-4 py-1 divide-y" style={{ "--divide-color": "var(--border)" } as React.CSSProperties}>
            {healthScore !== null && <div className="py-0.5"><MetricBar metric="health" value={healthScore} delay={0} /></div>}
            {hydrationScore !== null && <div className="py-0.5"><MetricBar metric="hydration" value={hydrationScore} delay={1} /></div>}
            {definitionScore !== null && <div className="py-0.5"><MetricBar metric="definition" value={definitionScore} delay={2} /></div>}
            {frizzScore !== null && <div className="py-0.5"><MetricBar metric="frizz" value={frizzScore} delay={3} /></div>}
            {damageScore !== null && <div className="py-0.5"><MetricBar metric="damage" value={damageScore} delay={4} /></div>}
          </div>
        </div>

        {/* Damage type mini-cards */}
        {(heatDamageScore !== null || chemicalDamageScore !== null) && (
          <div className="mt-2 flex gap-2">
            {heatDamageScore !== null && (
              <motion.div
                initial={shouldReduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={shouldReduce ? { duration: 0 } : { delay: 0.65, duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                className="flex-1 rounded-xl p-3 flex items-center gap-2"
                style={{ background: "var(--surface-warm)", border: "1px solid var(--border)" }}
              >
                <Zap size={12} style={{ color: "var(--primary)" }} />
                <div>
                  <p className="text-[10px] text-text-tertiary font-medium">Heat damage</p>
                  <p
                    className="text-[16px] font-semibold"
                    style={{ color: heatDamageScore > 50 ? "var(--error)" : heatDamageScore > 25 ? "var(--primary)" : "var(--metric-good)" }}
                  >
                    {heatDamageScore}
                    <span className="text-[10px] font-normal text-text-tertiary">/100</span>
                  </p>
                </div>
              </motion.div>
            )}
            {chemicalDamageScore !== null && (
              <motion.div
                initial={shouldReduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={shouldReduce ? { duration: 0 } : { delay: 0.75, duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                className="flex-1 rounded-xl p-3 flex items-center gap-2"
                style={{ background: "var(--surface-warm)", border: "1px solid var(--border)" }}
              >
                <FlaskConical size={12} style={{ color: "var(--badge-elasticity)" }} />
                <div>
                  <p className="text-[10px] text-text-tertiary font-medium">Chemical damage</p>
                  <p
                    className="text-[16px] font-semibold"
                    style={{ color: chemicalDamageScore > 50 ? "var(--error)" : chemicalDamageScore > 25 ? "var(--primary)" : "var(--metric-good)" }}
                  >
                    {chemicalDamageScore}
                    <span className="text-[10px] font-normal text-text-tertiary">/100</span>
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>

      {/* Protein/Moisture Balance */}
      {proteinMoistureBalance && proteinMoistureBalance !== "unknown" && (
        <motion.div variants={fadeUp} className="mb-6">
          <SectionLabel>Protein–Moisture Balance</SectionLabel>
          <ProteinMoistureMeter balance={proteinMoistureBalance} reasoning={proteinMoistureReasoning} />
        </motion.div>
      )}

      {/* Wash day routine */}
      {routineSteps.length > 0 && (
        <motion.div variants={fadeUp} className="mb-6">
          <SectionLabel>Personalised Wash Day Routine</SectionLabel>
          <div className="flex flex-col gap-2">
            {routineSteps.map((step, i) => (
              <RoutineCard key={step.step} step={step} index={i} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Ingredient Guide */}
      {(ingredientsToAvoid.length > 0 || ingredientsToSeek.length > 0) && (
        <motion.div variants={fadeUp} className="mb-6">
          <SectionLabel>Ingredient Guide</SectionLabel>
          <div className="flex flex-col gap-3">
            {ingredientsToSeek.length > 0 && (
              <div
                className="rounded-2xl p-4"
                style={{
                  background: "color-mix(in srgb, var(--sage) 5%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--sage) 18%, transparent)",
                }}
              >
                <div className="flex items-center gap-2 mb-2.5">
                  <CheckCircle2 size={13} style={{ color: "var(--sage)" }} />
                  <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--sage)" }}>
                    Look for these
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {ingredientsToSeek.map((ing, i) => (
                    <motion.span
                      key={i}
                      initial={shouldReduce ? false : { opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={shouldReduce ? { duration: 0 } : { delay: i * 0.045, duration: 0.22, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                      style={{
                        background: "color-mix(in srgb, var(--sage) 10%, transparent)",
                        color: "var(--sage)",
                        border: "1px solid color-mix(in srgb, var(--sage) 18%, transparent)",
                      }}
                    >
                      {ing}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}
            {ingredientsToAvoid.length > 0 && (
              <div
                className="rounded-2xl p-4"
                style={{
                  background: "color-mix(in srgb, var(--error) 4%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--error) 12%, transparent)",
                }}
              >
                <div className="flex items-center gap-2 mb-2.5">
                  <XCircle size={13} style={{ color: "var(--error)" }} />
                  <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--error)" }}>
                    Avoid these
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {ingredientsToAvoid.map((ing, i) => (
                    <motion.span
                      key={i}
                      initial={shouldReduce ? false : { opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={shouldReduce ? { duration: 0 } : { delay: i * 0.045, duration: 0.22, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                      style={{
                        background: "color-mix(in srgb, var(--error) 8%, transparent)",
                        color: "var(--error)",
                        border: "1px solid color-mix(in srgb, var(--error) 16%, transparent)",
                      }}
                    >
                      {ing}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Environmental notes */}
      {environmentalNotes && environmentalStress && environmentalStress !== "none" && (
        <motion.div variants={fadeUp} className="mb-6">
          <div
            className="rounded-2xl p-4 flex items-start gap-3"
            style={{
              background: "color-mix(in srgb, var(--primary) 5%, transparent)",
              border: "1px solid color-mix(in srgb, var(--primary) 14%, transparent)",
            }}
          >
            <Leaf size={15} style={{ color: "var(--primary)", flexShrink: 0, marginTop: 2 }} />
            <div>
              <p className="text-[12px] font-semibold text-text-primary mb-1">
                Environmental stress:{" "}
                <span style={{ color: "var(--primary)" }}>{environmentalStress}</span>
              </p>
              <p className="text-[12px] text-text-secondary leading-relaxed">{environmentalNotes}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Clinical reasoning (collapsible) */}
      {(washStateReasoning || curlTypeReasoning || porosityReasoning) && (
        <motion.div variants={fadeUp} className="mb-6">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between py-3 px-4 rounded-xl transition-colors"
            style={{ background: "var(--surface-warm)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center gap-2">
              <FileText size={13} style={{ color: "var(--text-tertiary)" }} />
              <span className="text-[12px] font-semibold text-text-secondary">Clinical reasoning</span>
            </div>
            <motion.div animate={{ rotate: showDetails ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={14} style={{ color: "var(--text-tertiary)" }} />
            </motion.div>
          </button>
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-3 flex flex-col gap-3">
                  {[
                    washStateReasoning && { label: "Wash state", text: washStateReasoning },
                    curlTypeReasoning  && { label: "Curl type",  text: curlTypeReasoning  },
                    porosityReasoning  && { label: "Porosity",   text: porosityReasoning  },
                  ].filter(Boolean).map((item, i) => (
                    <motion.div
                      key={(item as { label: string }).label}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                      className="px-4 py-3 rounded-xl"
                      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                    >
                      <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary mb-1.5">{(item as { label: string }).label}</p>
                      <p className="text-[12px] text-text-secondary leading-relaxed">{(item as { text: string }).text}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Product recommendations */}
      <motion.div variants={fadeUp}>
        <SectionLabel>Recommended Products</SectionLabel>
        {products.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
            {products.map((p, i) => (
              <motion.div
                key={p.id}
                className="snap-start shrink-0 w-[72vw] max-w-[280px]"
                initial={shouldReduce ? false : { opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={shouldReduce ? { duration: 0 } : { delay: 0.1 + i * 0.07, ...smooth }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-[13px] py-2" style={{ color: "var(--text-secondary)" }}>
            No product recommendations for this scan.
          </p>
        )}
      </motion.div>
      </motion.div>
    </div>
  );
}
