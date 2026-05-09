import { CURL_TYPE_DESCRIPTIONS, type CurlType } from "@/types/hair";

interface CurlTypeBadgeProps {
  curlType: CurlType;
  size?: "sm" | "md" | "lg";
}

export function CurlTypeBadge({ curlType, size = "md" }: CurlTypeBadgeProps) {
  const sizes = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3.5 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary font-semibold ${sizes[size]}`}
      title={CURL_TYPE_DESCRIPTIONS[curlType]}
    >
      <span className="font-serif">{curlType.toUpperCase()}</span>
      <span className="text-primary/60 font-normal text-xs hidden sm:inline">
        {CURL_TYPE_DESCRIPTIONS[curlType].split(" — ")[1]}
      </span>
    </span>
  );
}
