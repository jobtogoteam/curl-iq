"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ScanImage } from "@/components/ui/ScanImage";
import { Camera, Sparkles, ChevronRight, ArrowUpRight, TrendingUp, ReceiptText } from "lucide-react";
import { fadeUp, staggerContainer, smooth, useMotion } from "@/lib/motion";
import { MetricBar } from "@/components/scan/MetricBar";
import { ProductCard } from "@/components/products/ProductCard";
import { CurlIQWordmark } from "@/components/ui/Logo";
import type { CurlType, WashState } from "@/types/hair";
import { WASH_STATE_LABELS } from "@/types/hair";
import type { ProductRecommendation } from "@/db/schema";

interface LatestScan {
  id: string;
  imagePath: string;
  curlType: CurlType | null;
  thickness: string | null;
  density: string | null;
  washState: WashState | null;
  healthScore: number | null;
  hydrationScore: number | null;
  frizzScore: number | null;
  createdAt: number;
}

export function HomeClient({
  greeting,
  scanCount,
  latestScan,
  latestProducts,
  timeAgoText,
}: {
  greeting: string;
  scanCount: number;
  latestScan: LatestScan | null;
  latestProducts: ProductRecommendation[];
  timeAgoText: string | null;
}) {
  const { shouldReduce } = useMotion();

  return (
    <motion.div
      className="px-5 pt-14 pb-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-start justify-between mb-8">
        <div>
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.16em] mb-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            {scanCount > 0 ? `${scanCount} scan${scanCount !== 1 ? "s" : ""} recorded` : "Welcome"}
          </p>
          <h1
            className="font-display leading-tight"
            style={{ fontSize: "30px", fontWeight: 500, color: "var(--text-primary)" }}
          >
            {greeting}
          </h1>
          {timeAgoText && (
            <p className="text-[12px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
              Last scan {timeAgoText}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <CurlIQWordmark size={26} variant="dark" />
          <Link
            href="/costs"
            className="flex items-center gap-1 px-2 py-1 rounded-lg"
            style={{
              background: "var(--surface-3)",
              border: "1px solid var(--border)",
              color: "var(--text-tertiary)",
            }}
          >
            <ReceiptText size={11} />
            <span className="text-[10px] font-medium">API costs</span>
          </Link>
        </div>
      </motion.div>

      {latestScan ? (
        <>
          {/* Profile card */}
          <motion.div variants={fadeUp} className="mb-5">
            <Link href={`/scan/${latestScan.id}`}>
              <motion.div
                whileTap={{ scale: 0.985 }}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border-bright)",
                  boxShadow: "var(--shadow-md)",
                }}
              >
                <div className="flex items-stretch">
                  {/* Photo strip */}
                  <div className="relative w-[90px] flex-shrink-0 overflow-hidden">
                    <ScanImage
                      scanId={latestScan.id}
                      className="absolute inset-0"
                      objectFit="cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(to right, transparent 60%, var(--surface-2))" }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2.5">
                      <p
                        className="text-[10px] font-bold uppercase tracking-[0.14em]"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        Hair Profile
                      </p>
                      <ChevronRight size={13} style={{ color: "var(--text-tertiary)" }} />
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {latestScan.curlType && (
                        <span
                          className="text-[12px] font-bold px-2.5 py-0.5 rounded-full"
                          style={{
                            background: "var(--primary-glow)",
                            color: "var(--primary)",
                            border: "1px solid var(--border-primary)",
                          }}
                        >
                          {latestScan.curlType.toUpperCase()}
                        </span>
                      )}
                      {latestScan.thickness && (
                        <span
                          className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                          style={{
                            background: "var(--surface-3)",
                            color: "var(--text-secondary)",
                            border: "1px solid var(--border)",
                          }}
                        >
                          {latestScan.thickness}
                        </span>
                      )}
                      {latestScan.density && (
                        <span
                          className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                          style={{
                            background: "var(--surface-3)",
                            color: "var(--text-secondary)",
                            border: "1px solid var(--border)",
                          }}
                        >
                          {latestScan.density} density
                        </span>
                      )}
                    </div>

                    {latestScan.washState && (
                      <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                        {WASH_STATE_LABELS[latestScan.washState]}
                      </p>
                    )}
                  </div>
                </div>

                {/* Metrics strip */}
                <div
                  className="px-4 pb-2"
                  style={{ borderTop: "1px solid var(--border)" }}
                >
                  {latestScan.healthScore !== null && (
                    <MetricBar metric="health" value={latestScan.healthScore} delay={0} />
                  )}
                  {latestScan.hydrationScore !== null && (
                    <MetricBar metric="hydration" value={latestScan.hydrationScore} delay={1} />
                  )}
                  {latestScan.frizzScore !== null && (
                    <MetricBar metric="frizz" value={latestScan.frizzScore} delay={2} />
                  )}
                </div>
              </motion.div>
            </Link>
          </motion.div>

          {/* Progress link */}
          <motion.div variants={fadeUp} className="mb-5">
            <Link href="/history">
              <motion.div
                whileTap={!shouldReduce ? { scale: 0.97 } : undefined}
                whileHover={!shouldReduce ? { x: 2 } : undefined}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                className="flex items-center justify-between px-4 py-3 rounded-xl"
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="flex items-center gap-2.5">
                  <TrendingUp size={14} style={{ color: "var(--sage)" }} />
                  <span className="text-[13px] font-medium" style={{ color: "var(--text-secondary)" }}>
                    View progress over time
                  </span>
                </div>
                <ArrowUpRight size={13} style={{ color: "var(--text-tertiary)" }} />
              </motion.div>
            </Link>
          </motion.div>
        </>
      ) : (
        /* Empty state */
        <motion.div variants={fadeUp} className="mb-5">
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border-bright)" }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{
                background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                boxShadow: "var(--shadow-primary)",
              }}
            >
              <Sparkles size={24} className="text-white" />
            </div>
            <h2
              className="font-display mb-2"
              style={{ fontSize: "24px", fontWeight: 500, color: "var(--text-primary)" }}
            >
              Meet your curls
            </h2>
            <p className="text-[13px] leading-relaxed max-w-[210px] mx-auto" style={{ color: "var(--text-secondary)" }}>
              Take your first scan to discover your curl type, health scores, and personalised products.
            </p>
          </div>
        </motion.div>
      )}

      {/* Scan CTA */}
      <motion.div variants={fadeUp} className="mb-8">
        <Link href="/scan">
          <motion.div
            whileHover={!shouldReduce ? { scale: 1.02 } : undefined}
            whileTap={!shouldReduce ? { scale: 0.97 } : undefined}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-2.5 text-white font-semibold text-[17px]"
            style={{
              background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)",
              boxShadow: "var(--shadow-primary)",
            }}
          >
            <Camera size={20} strokeWidth={1.8} />
            New Scan
          </motion.div>
        </Link>
      </motion.div>

      {/* Products */}
      {latestProducts.length > 0 && (
        <motion.div variants={fadeUp}>
          <div className="flex items-center justify-between mb-4">
            <p
              className="text-[11px] font-bold uppercase tracking-[0.14em]"
              style={{ color: "var(--text-tertiary)" }}
            >
              Recommended for You
            </p>
            <Link
              href="/products"
              className="flex items-center gap-1 text-[12px] font-semibold"
              style={{ color: "var(--primary)" }}
            >
              See all <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
            {latestProducts.map((p, i) => (
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
        </motion.div>
      )}
      {/* Legal footer */}
      <motion.div variants={fadeUp} className="mt-10 flex items-center justify-center gap-4">
        <Link href="/privacy" className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
          Privacy Policy
        </Link>
        <span style={{ color: "var(--border)" }}>·</span>
        <Link href="/terms" className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
          Terms of Service
        </Link>
      </motion.div>
    </motion.div>
  );
}
