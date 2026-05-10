import Image from "next/image";

export function CurlIQLogo({
  size = 40,
}: {
  size?: number;
  variant?: "dark" | "light";
}) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
      <Image
        src="/logo.png"
        alt="Curl IQ"
        width={size}
        height={size}
        style={{ objectFit: "cover", objectPosition: "center", width: "100%", height: "100%" }}
        priority
      />
    </div>
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
