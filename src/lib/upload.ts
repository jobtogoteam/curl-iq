const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

export interface UploadedFile {
  buffer: Buffer;
  mediaType: string;
}

export async function readUploadedFile(file: File): Promise<UploadedFile> {
  if (!ALLOWED_MIMES.includes(file.type)) {
    throw new Error("Invalid file type. Please upload a JPEG, PNG, or WebP image.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const mediaType = file.type === "image/heic" || file.type === "image/heif"
    ? "image/jpeg"
    : file.type;

  return { buffer, mediaType };
}
