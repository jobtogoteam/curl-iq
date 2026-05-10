import Link from "next/link";
import { Home } from "lucide-react";
import { CurlIQWordmark } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 text-center"
      style={{ background: "linear-gradient(160deg, #0C0906 0%, #191008 50%, #0A0D09 100%)" }}
    >
      {/* Grain */}
      <div className="grain" aria-hidden />

      {/* Ambient orbs */}
      <div className="orb orb-3" style={{ opacity: 0.18 }} />
      <div className="orb orb-4" style={{ opacity: 0.12 }} />

      <div className="relative z-10 flex flex-col items-center max-w-app w-full">
        <div className="mb-10 flex justify-center">
          <CurlIQWordmark size={28} variant="dark" />
        </div>

        {/* 404 display */}
        <p
          className="font-display mb-4 select-none"
          style={{
            fontSize: "clamp(80px, 22vw, 120px)",
            fontWeight: 300,
            lineHeight: 1,
            color: "transparent",
            backgroundImage: "linear-gradient(135deg, var(--primary) 0%, var(--gold) 60%, rgba(240,230,216,0.3) 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
          }}
        >
          404
        </p>

        <h1
          className="font-display mb-3"
          style={{ fontSize: "24px", fontWeight: 400, color: "rgba(240,230,216,0.9)" }}
        >
          Page not found
        </h1>
        <p
          className="text-[14px] mb-8 leading-relaxed"
          style={{ color: "rgba(255,255,255,0.35)", maxWidth: "260px" }}
        >
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>

        <Link
          href="/home"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-[15px] text-white transition-opacity hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
            boxShadow: "var(--shadow-primary)",
          }}
        >
          <Home size={16} />
          Go home
        </Link>

        <Link
          href="/login"
          className="mt-4 text-[13px] transition-colors"
          style={{ color: "rgba(255,255,255,0.30)" }}
        >
          Sign in instead
        </Link>
      </div>
    </div>
  );
}
