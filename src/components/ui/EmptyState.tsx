"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import Link from "next/link";

const MotionLink = motion(Link);

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  cta?: {
    label: string;
    href: string;
  };
}

export function EmptyState({ icon, title, description, cta }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
        style={{ background: "var(--surface-2)", border: "1px solid var(--border-bright)" }}
      >
        {icon}
      </div>
      <h2
        className="font-display mb-2"
        style={{ fontSize: "22px", fontWeight: 500, color: "var(--text-primary)" }}
      >
        {title}
      </h2>
      <p
        className="text-[13px] max-w-xs mx-auto leading-relaxed"
        style={{ color: "var(--text-secondary)" }}
      >
        {description}
      </p>
      {cta && (
        <MotionLink
          href={cta.href}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-[15px] text-white mt-7"
          style={{
            background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
            boxShadow: "var(--shadow-primary)",
          }}
        >
          {cta.label}
        </MotionLink>
      )}
    </motion.div>
  );
}
