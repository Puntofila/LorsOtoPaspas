import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { rateLimitResponse } from "@/lib/security/rateLimit";

// SVG is intentionally excluded: it can carry inline <script> and is served
// from a public URL, which would be a stored-XSS vector. Only raster formats.
const MAX_SIZE = 3 * 1024 * 1024;

// Magic-byte signatures. We verify the real file content rather than trusting
// the client-supplied MIME type, which is forgeable.
function sniffImage(bytes: Uint8Array): { ext: string } | null {
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 &&
    bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a
  ) {
    return { ext: "png" };
  }
  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { ext: "jpg" };
  }
  // WEBP: "RIFF"...."WEBP"
  if (
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    return { ext: "webp" };
  }
  return null;
}

export async function POST(req: Request) {
  const limited = rateLimitResponse(req, "logo-upload", 6, 60_000);
  if (limited) return limited;
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "upload_not_configured" }, { status: 503 });
  }
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0 || file.size > MAX_SIZE) {
    return NextResponse.json({ error: "invalid_file" }, { status: 400 });
  }

  // Verify real content by magic bytes, not the forgeable file.type header.
  const buffer = Buffer.from(await file.arrayBuffer());
  const sniffed = sniffImage(buffer);
  if (!sniffed) {
    return NextResponse.json({ error: "invalid_file" }, { status: 400 });
  }

  // Server-generated name; the client filename never reaches the storage path.
  const blob = await put(`order-logos/${randomUUID()}.${sniffed.ext}`, buffer, {
    access: "public",
    contentType: `image/${sniffed.ext === "jpg" ? "jpeg" : sniffed.ext}`,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  return NextResponse.json({ url: blob.url });
}
