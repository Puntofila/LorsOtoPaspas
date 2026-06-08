import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { rateLimitResponse } from "@/lib/security/rateLimit";

const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp", "image/svg+xml"]);
const MAX_SIZE = 3 * 1024 * 1024;

export async function POST(req: Request) {
  const limited = rateLimitResponse(req, "logo-upload", 6, 60_000);
  if (limited) return limited;
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "upload_not_configured" }, { status: 503 });
  }
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File) || !ALLOWED.has(file.type) || file.size > MAX_SIZE) {
    return NextResponse.json({ error: "invalid_file" }, { status: 400 });
  }
  const blob = await put(`order-logos/${file.name}`, file, {
    access: "public",
    addRandomSuffix: true,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  return NextResponse.json({ url: blob.url });
}
