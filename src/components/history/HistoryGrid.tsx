"use client";

import { motion } from "framer-motion";
import { ScanThumbnail } from "@/components/history/ScanThumbnail";
import { staggerList, fadeUp, useMotion } from "@/lib/motion";
import type { CurlType } from "@/types/hair";

interface ScanItem {
  id: string;
  imagePath: string;
  createdAt: number;
  healthScore: number | null;
  curlType: CurlType | null;
}

export function HistoryGrid({ scans }: { scans: ScanItem[] }) {
  const { shouldReduce } = useMotion();

  if (scans.length === 0) return null;

  return (
    <motion.div
      variants={shouldReduce ? undefined : staggerList}
      initial="initial"
      animate="animate"
      className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2"
    >
      {scans.map((scan) => (
        <motion.div
          key={scan.id}
          variants={shouldReduce ? undefined : fadeUp}
        >
          <ScanThumbnail
            scanId={scan.id}
            createdAt={scan.createdAt}
            healthScore={scan.healthScore}
            curlType={scan.curlType}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
