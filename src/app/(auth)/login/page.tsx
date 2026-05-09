"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { CurlIQWordmark } from "@/components/ui/Logo";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Login failed"); return; }
      router.push("/home"); router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally { setLoading(false); }
  }

  return (
    <div
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0C0906 0%, #191008 50%, #0A0D09 100%)" }}
    >
      {/* Grain */}
      <div className="grain" aria-hidden />

      {/* Ambient orbs */}
      <div className="orb orb-1" style={{ opacity: 0.3 }} />
      <div className="orb orb-2" style={{ opacity: 0.2 }} />

      <div className="relative z-10 flex flex-col min-h-screen max-w-app mx-auto w-full px-5">
        {/* Back */}
        <div className="pt-14 pb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] transition-colors"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            <ArrowLeft size={15} />
            Back
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="flex-1 flex flex-col justify-center pb-16"
        >
          <div className="mb-10">
            <CurlIQWordmark size={30} variant="dark" />
            <h1
              className="font-display mt-8 mb-2"
              style={{ fontSize: "42px", fontWeight: 400, color: "rgba(240,230,216,0.95)", lineHeight: 1.08 }}
            >
              Welcome<br />back.
            </h1>
            <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.35)" }}>
              Sign in to continue your curl journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="flex flex-col gap-4 p-5 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.045)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
              <div>
                <Input
                  label="Password"
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  showPasswordToggle
                  autoComplete="current-password"
                  required
                />
                <div className="flex justify-end mt-1.5">
                  <Link
                    href="/forgot-password"
                    className="text-[12px] transition-colors"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
            </motion.div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[13px] px-4 py-3 rounded-xl"
                style={{
                  color: "#FF6B6B",
                  background: "rgba(192,57,43,0.12)",
                  border: "1px solid rgba(192,57,43,0.25)",
                }}
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={loading || !email || !password}
              whileHover={{ scale: loading ? 1 : 1.015 }}
              whileTap={{ scale: loading ? 1 : 0.975 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full py-4 rounded-2xl text-white font-semibold text-[17px] flex items-center justify-center gap-2.5 disabled:opacity-35"
              style={{
                background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                boxShadow: "var(--shadow-primary)",
              }}
            >
              {loading
                ? <><Loader2 size={18} className="animate-spin" /> Signing in…</>
                : <>Sign in <ArrowRight size={18} /></>
              }
            </motion.button>
          </form>

          <p className="text-center text-[13px] mt-8" style={{ color: "rgba(255,255,255,0.40)" }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold" style={{ color: "var(--primary)" }}>
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
