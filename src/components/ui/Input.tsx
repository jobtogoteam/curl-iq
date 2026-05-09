"use client";

import { InputHTMLAttributes, forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showPasswordToggle?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, showPasswordToggle, type, className = "", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [focused, setFocused] = useState(false);

    const inputType = showPasswordToggle && type === "password"
      ? (showPassword ? "text" : "password")
      : type;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-tertiary">
            {label}
          </label>
        )}
        <div
          className="relative rounded-xl transition-all"
          style={{
            background: "var(--surface-2)",
            border: `1px solid ${error ? "var(--error)" : focused ? "var(--primary)" : "var(--border-bright)"}`,
            boxShadow: focused && !error ? "0 0 0 1px var(--primary), 0 0 16px var(--primary-glow)" : error ? "0 0 0 1px var(--error)" : "none",
          }}
        >
          <input
            ref={ref}
            type={inputType}
            onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
            onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
            className={`w-full px-4 py-3.5 bg-transparent text-text-primary placeholder:text-text-tertiary focus:outline-none text-[15px] ${showPasswordToggle ? "pr-12" : ""} ${className}`}
            {...props}
          />
          {showPasswordToggle && type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors p-1"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
        {error && (
          <p className="text-[12px] text-error flex items-center gap-1.5">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
