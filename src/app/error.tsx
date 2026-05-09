"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: "var(--bg)" }}
    >
      <div
        className="flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
        style={{ background: "rgba(192,57,43,0.12)", border: "1px solid rgba(192,57,43,0.2)" }}
      >
        <AlertTriangle size={24} style={{ color: "var(--error)" }} />
      </div>
      <h1
        className="font-display mb-2"
        style={{ fontSize: "24px", fontWeight: 500, color: "var(--text-primary)" }}
      >
        Something went wrong
      </h1>
      <p className="text-[14px] mb-6" style={{ color: "var(--text-secondary)", maxWidth: "280px" }}>
        An unexpected error occurred. Your data is safe.
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 rounded-xl font-semibold text-[14px] text-white"
        style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-dark))" }}
      >
        Try again
      </button>
    </div>
  );
}