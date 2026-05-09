"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Wind, Crosshair, Droplets, Layers,
  Wrench, ScanSearch, ArrowUpFromLine, Leaf,
  Check, Eye, EyeOff, Loader2,
} from "lucide-react";
import { CurlIQWordmark } from "@/components/ui/Logo";

// ─── Animated background ─────────────────────────────────────────────────────
function AnimatedBg() {
  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0e0805 0%, #190d07 50%, #0a0d09 100%)" }}
    >
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="orb orb-4" />
      {/* grain */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "160px",
        }}
      />
    </div>
  );
}

// ─── Progress indicator ───────────────────────────────────────────────────────
function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            width: i === current ? 20 : 6,
            opacity: i <= current ? 1 : 0.22,
            backgroundColor:
              i === current ? "var(--primary)" : i < current ? "var(--sage)" : "rgba(255,255,255,0.3)",
          }}
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
          className="h-1.5 rounded-full"
        />
      ))}
    </div>
  );
}

// ─── Goals list ───────────────────────────────────────────────────────────────
const GOALS = [
  { id: "frizz",      label: "Frizz Control",    sub: "Tame flyaways",      Icon: Wind },
  { id: "definition", label: "More Definition",   sub: "Sharper curls",      Icon: Crosshair },
  { id: "moisture",   label: "Deep Moisture",     sub: "End dryness",        Icon: Droplets },
  { id: "volume",     label: "Volume & Density",  sub: "Boost fullness",     Icon: Layers },
  { id: "repair",     label: "Repair Damage",     sub: "Restore strength",   Icon: Wrench },
  { id: "type",       label: "Know My Type",      sub: "Find my curl code",  Icon: ScanSearch },
  { id: "length",     label: "Grow Length",       sub: "Retain every inch",  Icon: ArrowUpFromLine },
  { id: "scalp",      label: "Scalp Health",      sub: "Healthy roots",      Icon: Leaf },
];

// ─── Slide variants ───────────────────────────────────────────────────────────
const slide = {
  enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
  center: {
    x: 0, opacity: 1,
    transition: { type: "spring" as const, stiffness: 340, damping: 34 },
  },
  exit: (d: number) => ({
    x: d > 0 ? "-55%" : "55%", opacity: 0,
    transition: { duration: 0.22, ease: "easeIn" as const },
  }),
};

// ─── Dark styled input ────────────────────────────────────────────────────────
function Field({
  label, value, onChange, type = "text", placeholder, autoFocus,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; autoFocus?: boolean;
}) {
  const [show, setShow] = useState(false);
  const isPw = type === "password";

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/35">{label}</span>
      <div className="relative">
        <input
          type={isPw && show ? "text" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete={isPw ? "new-password" : type === "email" ? "email" : "name"}
          className="w-full rounded-xl px-4 py-3.5 text-[16px] text-white placeholder:text-white/20 focus:outline-none transition-all"
          style={{
            background: "rgba(255,255,255,0.055)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
          onFocus={(e) => {
            e.target.style.background = "rgba(255,255,255,0.09)";
            e.target.style.borderColor = "color-mix(in srgb, var(--primary) 40%, transparent)";
          }}
          onBlur={(e) => {
            e.target.style.background = "rgba(255,255,255,0.055)";
            e.target.style.borderColor = "rgba(255,255,255,0.1)";
          }}
        />
        {isPw && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/55 transition-colors"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Primary CTA button ───────────────────────────────────────────────────────
function PrimaryBtn({
  children, onClick, disabled, loading, type = "button",
}: {
  children: React.ReactNode; onClick?: () => void;
  disabled?: boolean; loading?: boolean; type?: "button" | "submit";
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.015 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.975 }}
      className="w-full py-4 rounded-2xl text-white font-semibold text-[17px] flex items-center justify-center gap-2.5 disabled:opacity-35 transition-opacity"
      style={{
        background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)",
        boxShadow: (disabled || loading) ? "none" : "var(--shadow-primary)",
      }}
    >
      {loading ? <><Loader2 size={18} className="animate-spin" /> Working…</> : children}
    </motion.button>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [name, setName] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    fetch("/api/auth/me").then((r) => { if (r.ok) router.replace("/home"); }).catch(() => {});
  }, [router]);

  const next = () => { setDir(1); setStep((s) => s + 1); setError(""); };
  const back = () => { setDir(-1); setStep((s) => s - 1); setError(""); };
  const toggleGoal = (id: string) =>
    setGoals((g) => (g.includes(id) ? g.filter((x) => x !== id) : [...g, id]));

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const r = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, displayName: name, goals }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.error || "Registration failed"); return; }
      router.push("/home"); router.refresh();
    } catch { setError("Something went wrong."); }
    finally { setLoading(false); }
  }

  async function handleDemo() {
    setDemoLoading(true);
    try {
      const r = await fetch("/api/demo", { method: "POST" });
      if (r.ok) { router.push("/home"); router.refresh(); }
    } catch { setDemoLoading(false); }
  }

  if (!ready) return null;

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <AnimatedBg />

      <div className="relative z-10 flex flex-col min-h-screen max-w-app mx-auto w-full px-5">

        {/* Topbar */}
        <div className="flex items-center justify-between pt-14 pb-8">
          {step > 0 ? (
            <button
              onClick={back}
              className="flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors text-sm"
            >
              <ArrowRight size={15} className="rotate-180" />
              Back
            </button>
          ) : (
            <CurlIQWordmark size={32} variant="dark" />
          )}
          <StepDots total={3} current={step} />
        </div>

        {/* Steps */}
        <div className="flex-1 flex flex-col justify-center pb-10">
          <AnimatePresence mode="wait" custom={dir}>

            {/* ── Step 0: Name ── */}
            {step === 0 && (
              <motion.div key="name" custom={dir} variants={slide}
                initial="enter" animate="center" exit="exit" className="flex flex-col gap-6">

                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}>
                  <h1 className="font-display text-[46px] leading-[1.08] text-white mb-4">
                    Your curls<br />
                    <span className="shimmer-text">deserve better.</span>
                  </h1>
                  <p className="text-white/40 text-[15px] leading-relaxed max-w-[270px]">
                    AI-powered hair analysis built for curl girls, coil queens, and wave warriors.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-2xl p-5 flex flex-col gap-4"
                  style={{ background: "rgba(255,255,255,0.055)", border: "1px solid rgba(255,255,255,0.09)" }}
                >
                  <p className="text-white/50 text-[13px]">What should we call you?</p>
                  <Field label="Your name" value={name} onChange={setName} placeholder="e.g. Sofia" autoFocus />
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.32 }}
                  className="flex flex-col gap-3">
                  <PrimaryBtn onClick={() => name.trim() && next()} disabled={!name.trim()}>
                    Continue <ArrowRight size={18} />
                  </PrimaryBtn>
                  <button
                    onClick={handleDemo}
                    disabled={demoLoading}
                    className="flex items-center justify-center gap-2 py-3 rounded-2xl text-white/35 hover:text-white/60 text-[14px] transition-colors"
                    style={{ border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    {demoLoading
                      ? <Loader2 size={15} className="animate-spin" />
                      : <span className="w-4 h-4 rounded-full border border-white/25 flex items-center justify-center text-[10px]">✦</span>
                    }
                    Try demo — no account needed
                  </button>
                  <a href="/login" className="text-center text-white/40 hover:text-white/60 text-[13px] transition-colors py-1">
                    Already have an account? Sign in
                  </a>
                </motion.div>
              </motion.div>
            )}

            {/* ── Step 1: Goals ── */}
            {step === 1 && (
              <motion.div key="goals" custom={dir} variants={slide}
                initial="enter" animate="center" exit="exit" className="flex flex-col gap-6">

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                  <h2 className="font-display text-[38px] leading-[1.1] text-white mb-2">
                    What are your<br /><span className="text-primary">curl goals?</span>
                  </h2>
                  <p className="text-white/35 text-[13px]">Select all that apply — we personalise your results</p>
                </motion.div>

                <div className="grid grid-cols-2 gap-2.5">
                  {GOALS.map(({ id, label, sub, Icon }, i) => {
                    const sel = goals.includes(id);
                    return (
                      <motion.button
                        key={id}
                        initial={{ opacity: 0, y: 18, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.04 * i, type: "spring", stiffness: 420, damping: 30 }}
                        onClick={() => toggleGoal(id)}
                        whileTap={{ scale: 0.94 }}
                        className="relative flex flex-col items-start gap-2.5 p-4 rounded-2xl text-left transition-all overflow-hidden"
                        style={{
                          background: sel ? "color-mix(in srgb, var(--primary) 14%, transparent)" : "rgba(255,255,255,0.05)",
                          border: sel ? "1px solid color-mix(in srgb, var(--primary) 40%, transparent)" : "1px solid rgba(255,255,255,0.08)",
                          boxShadow: sel ? "0 0 0 1px color-mix(in srgb, var(--primary) 22%, transparent), inset 0 1px 0 rgba(255,255,255,0.05)" : "none",
                        }}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div
                            className="flex items-center justify-center w-8 h-8 rounded-xl"
                            style={{ background: sel ? "color-mix(in srgb, var(--primary) 20%, transparent)" : "rgba(255,255,255,0.07)" }}
                          >
                            <Icon size={15} className={sel ? "text-primary" : "text-white/45"} />
                          </div>
                          <AnimatePresence>
                            {sel && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 600, damping: 30 }}
                                className="w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                              >
                                <Check size={11} className="text-white" strokeWidth={3} />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <div>
                          <p className={`text-[13px] font-semibold leading-tight ${sel ? "text-white" : "text-white/55"}`}>{label}</p>
                          <p className={`text-[11px] mt-0.5 ${sel ? "text-white/50" : "text-white/25"}`}>{sub}</p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                <PrimaryBtn onClick={next}>
                  {goals.length > 0 ? `Continue with ${goals.length} goal${goals.length > 1 ? "s" : ""}` : "Skip for now"}
                  <ArrowRight size={18} />
                </PrimaryBtn>
              </motion.div>
            )}

            {/* ── Step 2: Account ── */}
            {step === 2 && (
              <motion.div key="account" custom={dir} variants={slide}
                initial="enter" animate="center" exit="exit" className="flex flex-col gap-6">

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                  <h2 className="font-display text-[38px] leading-[1.1] text-white mb-2">
                    Almost there,<br /><span className="text-primary">{name || "you"}.</span>
                  </h2>
                  <p className="text-white/35 text-[13px]">Create your account to save your progress</p>
                </motion.div>

                <form onSubmit={handleCreate} className="flex flex-col gap-5">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-2xl p-5 flex flex-col gap-5"
                    style={{ background: "rgba(255,255,255,0.055)", border: "1px solid rgba(255,255,255,0.09)" }}
                  >
                    <Field label="Email address" type="email" value={email} onChange={setEmail}
                      placeholder="you@example.com" autoFocus />
                    <Field label="Password" type="password" value={password} onChange={setPassword}
                      placeholder="8+ characters" />

                    <AnimatePresence>
                      {error && (
                        <motion.p
                          initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="text-red-400 text-[13px] bg-red-500/10 border border-red-500/20 rounded-xl px-3.5 py-3"
                        >
                          {error}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }}>
                    <PrimaryBtn type="submit" loading={loading} disabled={!email || password.length < 8}>
                      Enter Curl IQ <ArrowRight size={18} />
                    </PrimaryBtn>
                  </motion.div>
                </form>

                <p className="text-center text-white/35 text-[12px] leading-relaxed">
                  Your data is only used to power your personal hair profile.
                </p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
