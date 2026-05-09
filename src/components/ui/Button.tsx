"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { spring, useMotion } from "@/lib/motion";

type ButtonMotionProps = Omit<HTMLMotionProps<"button">, "ref">;

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonMotionProps>, ButtonMotionProps {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading = false, fullWidth = false, children, className = "", disabled, ...props }, ref) => {
    const { shouldReduce } = useMotion();
    const isInactive = disabled || loading;

    const base =
      "inline-flex items-center justify-center font-sans font-semibold transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-1 disabled:opacity-40 disabled:cursor-not-allowed select-none";

    const variants: Record<string, string> = {
      primary:
        "bg-primary text-white hover:bg-primary-dark",
      secondary:
        "bg-surface-3 text-text-primary border border-[var(--border-bright)] hover:bg-surface-4",
      ghost:
        "bg-transparent text-primary hover:bg-[var(--primary-glow)]",
      danger:
        "bg-error/10 text-error border border-error/20 hover:bg-error/20",
    };

    const sizes: Record<string, string> = {
      sm: "px-4 py-2 text-[13px] rounded-[10px] gap-1.5",
      md: "px-6 py-3.5 text-[15px] rounded-[14px] gap-2",
      lg: "px-7 py-4 text-[17px] rounded-[16px] gap-2.5",
    };

    const primaryShadow = variant === "primary" && !isInactive
      ? "shadow-[0_4px_20px_var(--primary-glow),_0_1px_4px_rgba(0,0,0,0.4)]"
      : "";

    return (
      <motion.button
        ref={ref}
        disabled={isInactive}
        whileHover={!isInactive && !shouldReduce ? { scale: 1.02 } : undefined}
        whileTap={!isInactive && !shouldReduce ? { scale: 0.97 } : undefined}
        transition={spring}
        style={variant === "primary" ? { background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)" } : undefined}
        className={`${base} ${variants[variant]} ${sizes[size]} ${primaryShadow} ${fullWidth ? "w-full" : ""} ${className}`}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 size={size === "sm" ? 14 : 16} className="animate-spin" />
            {children}
          </>
        ) : children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
