"use client";

import { motion } from "framer-motion";
import { useMotion } from "@/lib/motion";

export default function Template({ children }: { children: React.ReactNode }) {
  const { shouldReduce } = useMotion();

  return (
    <motion.div
      initial={shouldReduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        shouldReduce
          ? { duration: 0 }
          : { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
      }
    >
      {children}
    </motion.div>
  );
}
