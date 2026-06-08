import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { requireApiRole } from "@/lib/auth/apiGuard";

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().toLowerCase().email().max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  password: z.string().min(8).max(200),
  role: z.enum(["CUSTOMER", "STAFF"]),
  commissionRate: z.coerce.number().int().min(0).max(100).default(0),
  primaryBranchId: z.string().optional().or(z.literal("")),
});

export async function POST(req: Request) {
  const current = await requireApiRole(["DIRECTOR"]);
  if (!current) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input", issues: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return NextResponse.json({ error: "email_taken" }, { status: 409 });

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      passwordHash,
      role: parsed.data.role,
      commissionRate: parsed.data.role === "STAFF" ? parsed.data.commissionRate : 0,
      primaryBranchId: parsed.data.primaryBranchId || null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      commissionRate: true,
      isActive: true,
      primaryBranchId: true,
      createdAt: true,
      _count: { select: { orders: true, acceptedOrders: true } },
    },
  });

  return NextResponse.json({ user }, { status: 201 });
}
