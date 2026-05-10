"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Mail } from "lucide-react";
import { CurlIQWordmark } from "@/components/ui/Logo";

export default function ForgotPasswordPage() {
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
            href="/login"
            className="inline-flex items-center gap-1.5 text-[13px] transition-colors"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            <ArrowLeft size={15} />
            Back to sign in
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
              Forgot<br />password?
            </h1>
            <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.35)" }}>
              We&apos;ll help you get back in
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="flex flex-col gap-5 p-5 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.045)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {/* Icon */}
            <div
              className="flex items-center justify-center w-11 h-11 rounded-xl"
              style={{ background: "rgba(212,137,92,0.12)", border: "1px solid rgba(212,137,92,0.2)" }}
            >
              <Mail size={20} style={{ color: "var(--primary)" }} />
            </div>

            <div>
              <p
                className="text-[15px] font-semibold mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                Private beta — manual resets
              </p>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Password resets aren&apos;t automated yet. Just email us and we&apos;ll sort it out quickly.
              </p>
            </div>

            <a
              href="mailto:team@job-to-go.com?subject=Curl IQ — Password Reset Request"
              className="w-full py-3.5 rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 text-white transition-opacity hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                boxShadow: "var(--shadow-primary)",
              }}
            >
              <Mail size={16} />
              Email us to reset
            </a>
          </motion.div>

          <p className="text-center text-[13px] mt-8" style={{ color: "rgba(255,255,255,0.40)" }}>
            Remembered it?{" "}
            <Link href="/login" className="font-semibold" style={{ color: "var(--primary)" }}>
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
