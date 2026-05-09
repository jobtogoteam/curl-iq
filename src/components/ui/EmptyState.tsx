"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  cta?: {
    label: string;
    href: string;
  };
}

export function EmptyState({ icon: Icon, title, description, cta }: EmptyStateProps) {
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
        <Icon size={26} style={{ color: "var(--text-tertiary)" }} strokeWidth={1.5} />
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
        <Link
          href={cta.href}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-[15px] text-white mt-7"
          style={{
            background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
            boxShadow: "var(--shadow-primary)",
          }}
        >
          {cta.label}
        </Link>
      )}
    </motion.div>
  );
}
