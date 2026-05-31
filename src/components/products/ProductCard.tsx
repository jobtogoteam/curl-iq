"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useMotion } from "@/lib/motion";
import type { ProductRecommendation } from "@/db/schema";

const CATEGORY_META: Record<string, { label: string; color: string }> = {
  shampoo:      { label: "Shampoo",     color: "var(--cat-shampoo)" },
  conditioner:  { label: "Conditioner", color: "var(--cat-conditioner)" },
  "leave-in":   { label: "Leave-in",    color: "var(--cat-leave-in)" },
  "curl-cream": { label: "Curl Cream",  color: "var(--cat-curl-cream)" },
  gel:          { label: "Gel",         color: "var(--cat-gel)" },
  oil:          { label: "Oil",         color: "var(--cat-oil)" },
  mask:         { label: "Hair Mask",   color: "var(--cat-mask)" },
};

const PRICE_LABELS: Record<string, { label: string; title: string }> = {
  "$":   { label: "$",   title: "Budget" },
  "$$":  { label: "$$",  title: "Mid-range" },
  "$$$": { label: "$$$", title: "Luxury" },
};

function matchScore(priority: number | null): number {
  if (priority === 1) return 96;
  if (priority === 2) return 91;
  if (priority === 3) return 85;
  return 80;
}

export function ProductCard({ product }: { product: ProductRecommendation }) {
  const [expanded, setExpanded] = useState(false);
  const meta = CATEGORY_META[product.category] ?? { label: product.category, color: "var(--cat-default)" };
  const { shouldReduce } = useMotion();
  const score = matchScore(product.priority);

  let ingredients: string[] = [];
  try { ingredients = JSON.parse(product.keyIngredients); } catch { ingredients = []; }

  let whereToBuy: string[] = [];
  try { if (product.whereToBuy) whereToBuy = JSON.parse(product.whereToBuy); } catch { whereToBuy = []; }

  const priceMeta = product.priceRange ? PRICE_LABELS[product.priceRange] : null;

  return (
    <motion.div
      whileHover={!shouldReduce ? { y: -3 } : undefined}
      whileTap={!shouldReduce ? { scale: 0.97 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
      onClick={() => setExpanded((v) => !v)}
    >
      {/* Category accent bar */}
      <div
        className="h-[2px] w-full"
        style={{ background: `linear-gradient(90deg, ${meta.color} 0%, transparent 70%)` }}
      />

      {/* Gradient image placeholder */}
      <div
        className="w-full flex items-center justify-center"
        style={{
          height: 100,
          background: `linear-gradient(135deg, color-mix(in srgb, ${meta.color} 22%, var(--surface-3)) 0%, var(--surface-2) 100%)`,
        }}
      >
        <span
          className="font-display select-none"
          style={{ fontSize: 38, color: meta.color, opacity: 0.25, fontWeight: 600, letterSpacing: "-0.02em" }}
        >
          {meta.label[0]}
        </span>
      </div>

      <div className="px-4 pt-3 pb-4">
        {/* Name + brand + category + chevron */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h3
              className="font-display text-text-primary leading-snug line-clamp-2"
              style={{ fontSize: "16px", fontWeight: 600 }}
            >
              {product.productName}
            </h3>
            {product.brand && (
              <p className="text-[11px] mt-0.5 uppercase tracking-[0.07em]" style={{ color: "var(--text-tertiary)" }}>
                {product.brand}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: `color-mix(in srgb, ${meta.color} 12%, transparent)`,
                color: meta.color,
                border: `1px solid color-mix(in srgb, ${meta.color} 20%, transparent)`,
              }}
            >
              {meta.label}
            </span>
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <ChevronDown size={15} style={{ color: "var(--text-tertiary)" }} />
            </motion.div>
          </div>
        </div>

        {/* Match bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] uppercase tracking-[0.1em]" style={{ color: "var(--text-tertiary)" }}>
              Match
            </span>
            <span className="text-[11px] font-bold" style={{ color: meta.color }}>
              {score}%
            </span>
          </div>
          <div
            className="w-full rounded-full overflow-hidden"
            style={{ height: 5, background: "var(--surface-4)" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${meta.color}, color-mix(in srgb, ${meta.color} 70%, var(--accent)))` }}
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>

        {/* Expandable details */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-3" style={{ borderTop: "1px solid var(--border)" }}>
                {/* Reason */}
                {product.reason && (
                  <p
                    className="text-[13px] leading-relaxed mb-4"
                    style={{
                      color: "var(--text-secondary)",
                      borderLeft: `2px solid color-mix(in srgb, ${meta.color} 40%, transparent)`,
                      paddingLeft: "10px",
                    }}
                  >
                    {product.reason}
                  </p>
                )}

                {/* Ingredients */}
                {ingredients.length > 0 && (
                  <div className="mb-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] mb-2" style={{ color: "var(--text-tertiary)" }}>
                      Key ingredients
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {ingredients.map((ing, i) => (
                        <span
                          key={i}
                          className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                          style={{
                            background: "var(--surface-3)",
                            color: "var(--text-secondary)",
                            border: "1px solid var(--border)",
                          }}
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price, retailers, CGM */}
                <div className="flex flex-wrap items-center gap-2">
                  {priceMeta && (
                    <span
                      className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                      style={{
                        background: "var(--surface-3)",
                        color: "var(--text-secondary)",
                        border: "1px solid var(--border)",
                      }}
                      title={priceMeta.title}
                    >
                      {priceMeta.label} · {priceMeta.title}
                    </span>
                  )}
                  {whereToBuy.slice(0, 4).map((retailer) => (
                    <span
                      key={retailer}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{
                        background: `color-mix(in srgb, ${meta.color} 8%, transparent)`,
                        color: meta.color,
                        border: `1px solid color-mix(in srgb, ${meta.color} 15%, transparent)`,
                      }}
                    >
                      {retailer}
                    </span>
                  ))}
                  {product.cgmSafe === 1 && (
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: "color-mix(in srgb, var(--sage) 10%, transparent)",
                        color: "var(--sage)",
                        border: "1px solid color-mix(in srgb, var(--sage) 22%, transparent)",
                      }}
                    >
                      CGM ✓
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
