"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Camera, Sun, Droplets, ScanSearch, FlaskConical, X } from "lucide-react";
import { spring, smooth, useMotion } from "@/lib/motion";
import { startScan, getPendingScan, popResolvedScan, clearScan } from "@/lib/scan-store";

const ANALYSIS_MESSAGES = [
  "Reading your curl pattern…",
  "Assessing hydration levels…",
  "Classifying your curl type…",
  "Detecting wash state…",
  "Evaluating frizz & definition…",
  "Selecting product matches…",
  "Building your curl profile…",
];

const TIPS = [
  { icon: Sun,        text: "Good natural or bright lighting" },
  { icon: Droplets,   text: "Works with wet or dry hair" },
  { icon: ScanSearch, text: "Close-up of curl pattern preferred" },
];

export default function ScanPage() {
  const router = useRouter();
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef  = useRef<HTMLInputElement>(null);

  const [file,        setFile]        = useState<File | null>(null);
  const [previewUrl,  setPreviewUrl]  = useState<string | null>(null);
  const [loading,     setLoading]     = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error,       setError]       = useState("");
  const [msgIndex,    setMsgIndex]    = useState(0);
  const [isDemo,      setIsDemo]      = useState(false);
  const { shouldReduce } = useMotion();

  // Re-attach to any in-flight scan
  useEffect(() => {
    const resolved = popResolvedScan();
    if (resolved) {
      if ("scanId" in resolved) { router.push(`/scan/${resolved.scanId}`); return; }
      if ("error"  in resolved) { setError(resolved.error); return; }
    }
    const pending = getPendingScan();
    if (pending) {
      setLoading(true);
      setPreviewUrl(pending.previewUrl);
      pending.promise
        .then((scanId) => router.push(`/scan/${scanId}`))
        .catch((err) => {
          setError(err instanceof Error ? err.message : "Analysis failed.");
          setLoading(false);
          clearScan();
        });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.user?.isDemo) setIsDemo(true);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!loading) return;
    const iv = setInterval(() => setMsgIndex(i => (i + 1) % ANALYSIS_MESSAGES.length), 2200);
    return () => clearInterval(iv);
  }, [loading]);

  function handleFileSelected(f: File) {
    if (!f.type.startsWith("image/")) return;
    setFile(f);
    setError("");
    setPreviewUrl(URL.createObjectURL(f));
  }

  function handleClear() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null); setPreviewUrl(null); setError("");
  }

  async function handleAnalyze() {
    if (!file || !previewUrl) return;
    setLoading(true);
    setError("");
    try {
      const scanId = await startScan(file, previewUrl);
      router.push(`/scan/${scanId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
      clearScan();
    }
  }

  async function handleDemoScan() {
    setDemoLoading(true);
    try {
      const res  = await fetch("/api/demo/scan", { method: "POST" });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Demo failed."); return; }
      router.push(`/scan/${data.scanId}`);
    } catch {
      setError("Something went wrong.");
    } finally { setDemoLoading(false); }
  }

  const isLoading = loading || demoLoading;

  return (
    <div className="px-5 pt-14 pb-6 min-h-screen" style={{ background: "var(--bg)" }}>

      {/* Hidden file inputs */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelected(f); }}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelected(f); }}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="mb-6"
      >
        <h1
          className="font-display"
          style={{ fontSize: "34px", fontWeight: 500, color: "var(--text-primary)" }}
        >
          Scan Your Hair
        </h1>
        <p className="text-[13px] mt-1" style={{ color: "var(--text-secondary)" }}>
          {isDemo ? "Demo mode — upload any photo to try the experience" : "Get personalised curl analysis powered by AI"}
        </p>
      </motion.div>

      {/* Upload zone / preview */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="mb-6"
      >
        <AnimatePresence mode="wait" initial={false}>
          {previewUrl ? (
            /* Photo preview */
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="relative w-full aspect-square rounded-2xl overflow-hidden"
              style={{ border: "1px solid var(--border-bright)" }}
            >
              <Image src={previewUrl} alt="Hair photo preview" fill className="object-cover" />
              <AnimatePresence>
                {!isLoading && (
                  <motion.button
                    key="clear-btn"
                    type="button"
                    onClick={handleClear}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                    whileTap={!shouldReduce ? { scale: 0.88 } : undefined}
                    className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full backdrop-blur-sm"
                    style={{ background: "rgba(12,9,6,0.72)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)" }}
                  >
                    <X size={15} />
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            /* Animated upload zone */
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full rounded-2xl overflow-hidden flex flex-col items-center justify-center cursor-pointer select-none"
              style={{
                minHeight: 240,
                background: "var(--surface-2)",
                border: "2px dashed rgba(212,137,92,0.35)",
              }}
              whileHover={!shouldReduce ? { borderColor: "rgba(212,137,92,0.65)" } as any : undefined}
              whileTap={!shouldReduce ? { scale: 0.985 } : undefined}
              transition={spring}
              onClick={() => galleryInputRef.current?.click()}
            >
              {/* Subtle rotating gradient sheen */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "conic-gradient(from 0deg at 50% 50%, transparent 60%, rgba(212,137,92,0.08) 80%, transparent 100%)",
                  borderRadius: "inherit",
                }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
              />

              {/* Floating camera icon */}
              <motion.div
                className="relative mb-4 flex items-center justify-center w-16 h-16 rounded-2xl"
                style={{
                  background: "var(--primary-glow)",
                  border: "1px solid var(--border-primary)",
                }}
                animate={!shouldReduce ? { y: [0, -6, 0] } : {}}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              >
                <Camera size={28} style={{ color: "var(--primary)" }} strokeWidth={1.5} />
              </motion.div>

              <p className="text-[15px] font-medium relative" style={{ color: "var(--text-primary)" }}>
                Tap to upload a photo
              </p>
              <p className="text-[12px] mt-1 relative" style={{ color: "var(--text-tertiary)" }}>
                or drag and drop
              </p>

              {/* Camera shortcut */}
              <button
                type="button"
                className="relative mt-5 flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium transition-colors"
                style={{
                  background: "var(--surface-3)",
                  border: "1px solid var(--border)",
                  color: "var(--text-secondary)",
                }}
                onClick={(e) => { e.stopPropagation(); cameraInputRef.current?.click(); }}
              >
                <Camera size={14} strokeWidth={1.7} />
                Take a photo
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Error */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 text-[13px] px-4 py-3 rounded-xl"
            style={{
              color: "var(--error)",
              background: "var(--error-glow)",
              border: "1px solid rgba(192,57,43,0.25)",
            }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Tips */}
      {!previewUrl && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="mb-6"
        >
          <p
            className="text-[11px] font-bold uppercase tracking-[0.14em] mb-3"
            style={{ color: "var(--text-tertiary)" }}
          >
            Tips for best results
          </p>
          <div className="flex flex-col gap-2.5">
            {TIPS.map(({ icon: Icon, text }, i) => (
              <motion.div
                key={text}
                initial={shouldReduce ? false : { opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={shouldReduce ? { duration: 0 } : { delay: 0.3 + i * 0.07, ...smooth }}
                className="flex items-center gap-3"
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
                >
                  <Icon size={14} style={{ color: "var(--primary)" }} strokeWidth={1.7} />
                </div>
                <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
                  {text}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Analyse button */}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, ...smooth }}
          className="flex flex-col gap-3"
        >
          <motion.button
            onClick={handleAnalyze}
            disabled={!file}
            animate={file && !shouldReduce ? { scale: [1, 1.015, 1] } : {}}
            transition={file ? { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } : spring}
            whileHover={file && !shouldReduce ? { scale: 1.025 } : undefined}
            whileTap={file && !shouldReduce ? { scale: 0.96 } : undefined}
            className="w-full py-4 rounded-2xl text-white font-semibold text-[17px] flex items-center justify-center gap-2.5 disabled:opacity-35 transition-opacity"
            style={{
              background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
              boxShadow: file ? "var(--shadow-primary)" : "none",
            }}
          >
            <Camera size={20} strokeWidth={1.7} />
            Analyse My Hair
          </motion.button>

          {isDemo && (
            <button
              onClick={handleDemoScan}
              disabled={demoLoading}
              className="w-full py-3.5 rounded-2xl font-semibold text-[15px] flex items-center justify-center gap-2 disabled:opacity-40 transition-colors"
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--border-bright)",
                color: "var(--text-secondary)",
              }}
            >
              <FlaskConical size={17} style={{ color: "var(--primary)" }} />
              Use demo scan results
            </button>
          )}

          {!file && !isDemo && (
            <p className="text-center text-[13px]" style={{ color: "var(--text-tertiary)" }}>
              Upload a photo of your hair to get started
            </p>
          )}
        </motion.div>
      )}

      {/* Loading overlay — full screen with scanning beam */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loading-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 px-6"
            style={{ background: "rgba(12,9,6,0.9)", backdropFilter: "blur(24px)" }}
          >
            {/* Photo preview with scanning beam + corner brackets */}
            {previewUrl && (
              <motion.div
                className="relative rounded-2xl overflow-hidden flex-shrink-0"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                style={{ width: 180, height: 180, border: "1px solid rgba(212,137,92,0.25)" }}
              >
                <Image src={previewUrl} alt="Scanning" fill className="object-cover" />

                {/* Scanning beam */}
                <motion.div
                  className="absolute left-0 right-0 pointer-events-none"
                  style={{
                    height: 48,
                    background: "linear-gradient(to bottom, transparent, rgba(212,137,92,0.5), transparent)",
                  }}
                  animate={{ y: ["-100%", "500%"] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
                />

                {/* Animated corner brackets */}
                {[
                  { top: 8, left: 8, rotate: 0 },
                  { top: 8, right: 8, rotate: 90 },
                  { bottom: 8, right: 8, rotate: 180 },
                  { bottom: 8, left: 8, rotate: 270 },
                ].map((pos, i) => (
                  <motion.div
                    key={i}
                    className="absolute pointer-events-none"
                    style={{
                      ...pos,
                      width: 16,
                      height: 16,
                      borderColor: "rgba(212,137,92,0.85)",
                      borderStyle: "solid",
                      borderWidth: "2px 0 0 2px",
                      rotate: `${pos.rotate}deg`,
                    }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                  />
                ))}
              </motion.div>
            )}

            {/* Progress bar */}
            <div
              className="w-full max-w-[220px] rounded-full overflow-hidden"
              style={{ height: 4, background: "rgba(255,255,255,0.08)" }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, var(--primary), var(--accent))" }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 14, ease: "linear" }}
              />
            </div>

            {/* Title + cycling message */}
            <div className="text-center">
              <p
                className="font-display mb-1.5"
                style={{ fontSize: "22px", fontWeight: 500, color: "var(--text-primary)" }}
              >
                Analysing your curls
              </p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={msgIndex}
                  initial={shouldReduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="text-[13px]"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {ANALYSIS_MESSAGES[msgIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
