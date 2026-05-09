import Image from "next/image";

export function CurlIQLogo({
  size = 40,
}: {
  size?: number;
  variant?: "dark" | "light";
}) {
  return (
    <Image
      src="/logo.png"
      alt="Curl IQ"
      width={size}
      height={size}
      style={{ borderRadius: "50%" }}
      priority
    />
  );
}

// Compact inline wordmark for nav bars
export function CurlIQWordmark({
  size = 28,
  variant = "dark",
}: {
  size?: number;
  variant?: "dark" | "light";
}) {
  return (
    <div className="flex items-center gap-2.5">
      <CurlIQLogo size={size} variant={variant} />
      <span
        className="font-display tracking-wide"
        style={{
          fontSize: size * 0.57,
          fontWeight: 500,
          color: "rgba(240,230,216,0.9)",
        }}
      >
        Curl IQ
      </span>
    </div>
  );
}
