import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { requireApiRole } from "@/lib/auth/apiGuard";

const schema = z.object({ isActive: z.boolean() });

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await requireApiRole(["DIRECTOR"]);
  if (!user) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  const promotion = await prisma.promotionCode.update({ where: { id: params.id }, data: parsed.data });
  return NextResponse.json({ promotion });
}
