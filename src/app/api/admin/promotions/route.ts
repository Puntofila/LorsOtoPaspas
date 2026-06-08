import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { requireApiRole } from "@/lib/auth/apiGuard";

const schema = z.object({
  code: z.string().trim().toUpperCase().min(3).max(40).regex(/^[A-Z0-9_-]+$/),
  type: z.enum(["PERCENT", "FIXED"]),
  amount: z.number().int().positive().max(1_000_000),
  minSubtotal: z.number().int().nonnegative().max(1_000_000).default(0),
  maxUses: z.number().int().positive().max(1_000_000).nullable().optional(),
  startsAt: z.string().datetime().nullable().optional(),
  endsAt: z.string().datetime().nullable().optional(),
  isActive: z.boolean().default(true),
});

export async function GET() {
  const user = await requireApiRole(["DIRECTOR"]);
  if (!user) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  return NextResponse.json({ promotions: await prisma.promotionCode.findMany({ orderBy: { createdAt: "desc" } }) });
}

export async function POST(req: Request) {
  const user = await requireApiRole(["DIRECTOR"]);
  if (!user) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_input", issues: parsed.error.flatten() }, { status: 400 });
  const promotion = await prisma.promotionCode.create({
    data: {
      ...parsed.data,
      startsAt: parsed.data.startsAt ? new Date(parsed.data.startsAt) : null,
      endsAt: parsed.data.endsAt ? new Date(parsed.data.endsAt) : null,
    },
  }).catch(() => null);
  if (!promotion) return NextResponse.json({ error: "code_taken" }, { status: 409 });
  return NextResponse.json({ promotion }, { status: 201 });
}
