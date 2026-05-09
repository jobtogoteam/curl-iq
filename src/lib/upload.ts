import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";

export async function saveUploadedFile(
  file: File,
  userId: string
): Promise<{ relativePath: string; url: string }> {
  const uploadsDir = path.join(process.cwd(), "public", "uploads", userId);

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
  if (!allowedMimes.includes(file.type)) {
    throw new Error("Invalid file type. Please upload a JPEG, PNG, or WebP image.");
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const allowedExts = ["jpg", "jpeg", "png", "webp", "heic", "heif"];
  const safeExt = allowedExts.includes(ext) ? ext : "jpg";

  const filename = `${nanoid()}.${safeExt}`;
  const fullPath = path.join(uploadsDir, filename);

  const arrayBuffer = await file.arrayBuffer();
  fs.writeFileSync(fullPath, Buffer.from(arrayBuffer));

  const relativePath = `uploads/${userId}/${filename}`;
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/${relativePath}`;

  return { relativePath, url };
}
