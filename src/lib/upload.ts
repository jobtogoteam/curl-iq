import { nanoid } from "nanoid";
import fs from "fs";
import path from "path";

const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

export interface UploadedFile {
  buffer: Buffer;
  mediaType: string;
}

export interface SavedFile {
  relativePath: string;
  url: string;
  buffer: Buffer;
  mediaType: string;
}

const EXT_MAP: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "jpg",
  "image/heif": "jpg",
};

export async function saveUploadedFile(file: File, userId: string): Promise<SavedFile> {
  if (!ALLOWED_MIMES.includes(file.type)) {
    throw new Error("Invalid file type. Please upload a JPEG, PNG, or WebP image.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const mediaType = file.type === "image/heic" || file.type === "image/heif"
    ? "image/jpeg"
    : file.type;

  // Vercel serverless has a read-only filesystem — skip disk write, store placeholder path
  void nanoid; void fs; void path; // unused on serverless
  return { relativePath: "placeholder", url: "/placeholder", buffer, mediaType };
}
