import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { requireApiRole } from "@/lib/auth/apiGuard";
import { CATALOG_STATUSES } from "@/lib/catalog/status";

const upsertSchema = z.object({
  brandSlug: z.string().trim().min(1).max(120),
  brandName: z.string().trim().min(1).max(120),
  modelSlug: z.string().trim().min(1).max(180),
  modelName: z.string().trim().min(1).max(180),
  status: z.enum(CATALOG_STATUSES).default("AVAILABLE"),
  note: z.string().trim().max(500).optional().or(z.literal("")),
});

export async function GET() {
  const user = await requireApiRole(["DIRECTOR", "STAFF"]);
  if (!user) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const entries = await prisma.catalogEntry.findMany({ orderBy: [{ brandName: "asc" }, { modelName: "asc" }] });
  return NextResponse.json({ entries });
}

export async function POST(req: Request) {
  const user = await requireApiRole(["DIRECTOR"]);
  if (!user) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const parsed = upsertSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_input", issues: parsed.error.flatten() }, { status: 400 });
  const data = parsed.data;
  const entry = await prisma.catalogEntry.upsert({
    where: { brandSlug_modelSlug: { brandSlug: data.brandSlug, modelSlug: data.modelSlug } },
    update: { status: data.status, note: data.note || null, brandName: data.brandName, modelName: data.modelName },
    create: { ...data, note: data.note || null },
  });
  return NextResponse.json({ entry });
}
