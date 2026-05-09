"use client";

import { motion } from "framer-motion";
import { useMotion } from "@/lib/motion";

type MotionDivProps = React.ComponentPropsWithoutRef<typeof motion.div>;

interface CardProps extends Omit<MotionDivProps, "animate"> {
  warm?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  hoverable?: boolean;
}

export function Card({ warm = false, padding = "md", hoverable = false, children, className = "", style, ...props }: CardProps) {
  const { shouldReduce } = useMotion();
  const paddings = { none: "", sm: "p-4", md: "p-5", lg: "p-6" };

  return (
    <motion.div
      whileHover={hoverable && !shouldReduce ? { y: -4 } : undefined}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      className={`rounded-2xl ${paddings[padding]} ${hoverable ? "card-hoverable" : ""} ${className}`}
      style={{
        background: warm ? "var(--surface-3)" : "var(--surface-2)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
        ...style,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
