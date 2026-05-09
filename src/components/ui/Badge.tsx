import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "peach" | "sage" | "primary" | "accent" | "surface";
  size?: "sm" | "md";
}

export function Badge({
  variant = "peach",
  size = "md",
  children,
  className = "",
  ...props
}: BadgeProps) {
  const variants = {
    peach: "bg-peach text-accent",
    sage: "bg-sage/20 text-sage",
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent",
    surface: "bg-surface-warm text-text-secondary border border-border",
  };

  const sizes = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
