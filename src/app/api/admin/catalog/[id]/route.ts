import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { requireApiRole } from "@/lib/auth/apiGuard";
import { CATALOG_STATUSES } from "@/lib/catalog/status";

const patchSchema = z.object({
  status: z.enum(CATALOG_STATUSES).optional(),
  note: z.string().trim().max(500).optional().or(z.literal("")),
});

// PATCH — update status/note (ADMIN only)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await requireApiRole(["DIRECTOR"]);
  if (!user) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const data: { status?: string; note?: string | null } = {};
  if (parsed.data.status) data.status = parsed.data.status;
  if (parsed.data.note !== undefined) data.note = parsed.data.note || null;

  const entry = await prisma.catalogEntry.update({ where: { id: params.id }, data });
  return NextResponse.json({ entry });
}
