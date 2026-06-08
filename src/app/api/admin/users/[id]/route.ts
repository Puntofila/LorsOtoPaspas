import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";

const patchSchema = z.object({
  role: z.enum(["CUSTOMER", "STAFF", "DIRECTOR"]).optional(),
  commissionRate: z.number().int().min(0).max(100).optional(),
  isActive: z.boolean().optional(),
  primaryBranchId: z.string().nullable().optional(),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "DIRECTOR") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (session.user.id === params.id && parsedTouchesOwnAccess(await req.clone().json().catch(() => null))) {
    return NextResponse.json({ error: "cannot_change_own_role" }, { status: 400 });
  }
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const user = await prisma.user.update({
    where: { id: params.id },
    data: parsed.data,
    select: { id: true, role: true, email: true, commissionRate: true, isActive: true, primaryBranchId: true },
  });
  return NextResponse.json({ user });
}

function parsedTouchesOwnAccess(body: unknown) {
  if (!body || typeof body !== "object") return false;
  const value = body as { role?: unknown; isActive?: unknown };
  return value.role !== undefined || value.isActive === false;
}
