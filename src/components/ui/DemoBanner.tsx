"use client";

import { FlaskConical, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function DemoBanner() {
  const router = useRouter();

  async function exitDemo() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div
      className="fixed top-0 left-0 right-0 max-w-app mx-auto z-[60] flex items-center justify-between px-5 py-2.5"
      style={{
        background: "linear-gradient(90deg, var(--surface-3) 0%, var(--surface-4) 100%)",
        borderBottom: "1px solid var(--border-bright)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <span className="flex items-center gap-2 text-[12px] font-medium text-text-secondary">
        <FlaskConical size={13} style={{ color: "var(--primary)" }} />
        Demo mode — data is pre-seeded
      </span>
      <button
        onClick={exitDemo}
        className="flex items-center gap-1 text-[12px] font-semibold transition-colors hover:opacity-80"
        style={{ color: "var(--primary)" }}
      >
        Create account
        <ArrowRight size={11} />
      </button>
    </div>
  );
}
