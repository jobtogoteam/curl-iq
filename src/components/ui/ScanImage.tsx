"use client";

import { useEffect, useState } from "react";
import { getImageUrl } from "@/lib/image-store";

interface ScanImageProps {
  scanId: string;
  className?: string;
  style?: React.CSSProperties;
  objectFit?: "cover" | "contain";
}

export function ScanImage({ scanId, className, style, objectFit = "cover" }: ScanImageProps) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    getImageUrl(scanId).then((u) => {
      objectUrl = u;
      setUrl(u);
    });
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [scanId]);

  if (!url) {
    return (
      <div
        className={className}
        style={{
          background: "linear-gradient(135deg, var(--surface-4) 0%, var(--surface-2) 100%)",
          ...style,
        }}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt="Hair scan"
      className={className}
      style={{ objectFit, width: "100%", height: "100%", ...style }}
    />
  );
}
