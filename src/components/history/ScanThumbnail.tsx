"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useMotion } from "@/lib/motion";
import { ScanImage } from "@/components/ui/ScanImage";
import type { CurlType } from "@/types/hair";

interface ScanThumbnailProps {
  scanId: string;
  createdAt: number;
  healthScore: number | null;
  curlType: CurlType | null;
}

export function ScanThumbnail({ scanId, createdAt, healthScore, curlType }: ScanThumbnailProps) {
  const label = new Date(createdAt * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const { shouldReduce } = useMotion();

  return (
    <Link href={`/scan/${scanId}`} className="block group">
      <motion.div
        className="relative aspect-square rounded-2xl overflow-hidden"
        style={{ border: "1px solid var(--border-bright)" }}
        whileHover={!shouldReduce ? { y: -3, boxShadow: "0 8px 24px rgba(0,0,0,0.35)" } : undefined}
        whileTap={!shouldReduce ? { scale: 0.95 } : undefined}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <ScanImage
          scanId={scanId}
          className="absolute inset-0 group-hover:scale-105 transition-transform duration-500"
          objectFit="cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(12,9,6,0.85) 0%, transparent 55%)" }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-2.5">
          <p className="text-white text-[11px] font-medium">{label}</p>
          {healthScore !== null && (
            <div className="flex items-center gap-1 mt-0.5">
              <Heart size={9} className="fill-current" style={{ color: "#7EA985" }} />
              <span className="text-[10px]" style={{ color: "#7EA985" }}>{healthScore}</span>
            </div>
          )}
        </div>
        {curlType && (
          <div className="absolute top-2 right-2">
            <span
              className="text-[10px] font-bold backdrop-blur-sm px-1.5 py-0.5 rounded-full"
              style={{ background: "rgba(12,9,6,0.65)", color: "var(--primary)", border: "1px solid var(--border-primary)" }}
            >
              {curlType.toUpperCase()}
            </span>
          </div>
        )}
      </motion.div>
    </Link>
  );
}
