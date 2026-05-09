"use client";

import { useRef } from "react";
import Image from "next/image";
import { Camera, ImagePlus, X } from "lucide-react";

interface PhotoUploaderProps {
  onFileSelected: (file: File) => void;
  previewUrl?: string | null;
  onClear?: () => void;
}

export function PhotoUploader({ onFileSelected, previewUrl, onClear }: PhotoUploaderProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    onFileSelected(file);
  };

  if (previewUrl) {
    return (
      <div
        className="relative w-full aspect-square rounded-2xl overflow-hidden"
        style={{ border: "1px solid var(--border-bright)" }}
      >
        <Image src={previewUrl} alt="Hair photo preview" fill className="object-cover" />
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full backdrop-blur-sm transition-colors"
            style={{ background: "rgba(12,9,6,0.72)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)" }}
          >
            <X size={15} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />

      {/* Drop zone */}
      <div
        className="w-full aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-5 cursor-pointer transition-colors"
        style={{
          borderColor: "var(--surface-4)",
          background: "var(--surface-2)",
        }}
        onClick={() => galleryInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f) handleFile(f);
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "var(--primary)";
          (e.currentTarget as HTMLDivElement).style.background = "var(--surface-3)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "var(--surface-4)";
          (e.currentTarget as HTMLDivElement).style.background = "var(--surface-2)";
        }}
      >
        <div
          className="flex items-center justify-center w-16 h-16 rounded-2xl"
          style={{ background: "var(--primary-glow)", border: "1px solid var(--border-primary)" }}
        >
          <ImagePlus size={28} style={{ color: "var(--primary)" }} strokeWidth={1.5} />
        </div>
        <div className="text-center">
          <p className="font-medium text-[15px]" style={{ color: "var(--text-primary)" }}>
            Choose a photo
          </p>
          <p className="text-[12px] mt-1" style={{ color: "var(--text-tertiary)" }}>
            tap, click, or drag and drop
          </p>
        </div>
      </div>

      {/* Camera button */}
      <button
        type="button"
        onClick={() => cameraInputRef.current?.click()}
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl transition-colors font-medium text-[14px]"
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--border)",
          color: "var(--text-secondary)",
        }}
      >
        <Camera size={17} strokeWidth={1.7} />
        Take a new photo
      </button>
    </div>
  );
}
