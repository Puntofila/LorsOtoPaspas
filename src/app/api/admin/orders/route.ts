import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { requireApiRole } from "@/lib/auth/apiGuard";
import { rateLimitResponse } from "@/lib/security/rateLimit";

const itemSchema = z.object({
  brandSlug: z.string().trim().min(1).max(120),
  brandName: z.string().trim().min(1).max(120),
  modelSlug: z.string().trim().min(1).max(180),
  modelName: z.string().trim().min(1).max(180),
  fullName: z.string().trim().min(1).max(240),
  years: z.string().trim().max(80).optional(),
  bodyType: z.string().trim().max(80).optional(),
  pattern: z.enum(["sota", "romb"]),
  material: z.enum(["hali", "ithal", "premium", "standart"]),
  color: z.string().trim().min(1).max(80),
  piping: z.string().trim().min(1).max(80),
  logo: z.enum(["none", "brand", "custom"]),
  customLogoUrl: z.string().url().optional().or(z.literal("")),
  accessories: z.array(z.enum(["heelPad", "logo"])).max(2).default([]),
  setType: z.string().trim().min(1).max(120),
  unitPrice: z.number().int().nonnegative().max(1_000_000),
  qty: z.number().int().positive().max(99),
});

const schema = z.object({
  acceptedById: z.string().optional(),
  branchId: z.string().min(1),
  source: z.enum(["WEBSITE", "SOCIAL", "PHONE", "IN_PERSON"]),
  idempotencyKey: z.string().min(8).max(120),
  customer: z.object({
    firstName: z.string().trim().min(1).max(120),
    lastName: z.string().trim().max(120).default(""),
    email: z.string().trim().email().max(200).optional().or(z.literal("")),
    phone: z.string().trim().min(1).max(60),
  }),
  shipping: z.object({
    province: z.string().trim().max(120).default("İstanbul"),
    district: z.string().trim().max(120).default(""),
    neighborhood: z.string().trim().max(160).default(""),
    address: z.string().trim().max(300).default(""),
    zip: z.string().trim().max(40).optional().or(z.literal("")),
  }),
  note: z.string().trim().max(2000).optional().or(z.literal("")),
  locale: z.enum(["tr", "ru", "en", "ar"]).default("tr"),
  items: z.array(itemSchema).min(1).max(50),
});

function makeOrderNumber() {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  return `LR-${date}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export async function POST(req: Request) {
  const current = await requireApiRole(["DIRECTOR", "STAFF"]);
  if (!current) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const limited = rateLimitResponse(req, `admin-orders:${current.id}`, 12, 60_000);
  if (limited) return limited;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input", issues: parsed.error.flatten() }, { status: 400 });
  }
  const duplicate = await prisma.order.findUnique({ where: { idempotencyKey: parsed.data.idempotencyKey } });
  if (duplicate) return NextResponse.json({ order: duplicate, duplicate: true }, { status: 200 });
  const cooldown = rateLimitResponse(req, `admin-orders-cooldown:${current.id}`, 1, 5_000);
  if (cooldown) return cooldown;

  const acceptedById =
    current.role === "DIRECTOR" && parsed.data.acceptedById
      ? parsed.data.acceptedById
      : current.id;
  const employee = await prisma.user.findFirst({
    where: { id: acceptedById, role: { in: ["STAFF", "DIRECTOR"] }, isActive: true },
    select: { id: true, commissionRate: true },
  });
  if (!employee) return NextResponse.json({ error: "invalid_employee" }, { status: 400 });
  const branch = await prisma.branch.findFirst({ where: { id: parsed.data.branchId, isActive: true }, select: { id: true } });
  if (!branch) return NextResponse.json({ error: "invalid_branch" }, { status: 400 });

  const subtotal = parsed.data.items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
  const order = await prisma.order.create({
    data: {
      number: makeOrderNumber(),
      createdById: current.id,
      acceptedById: employee.id,
      branchId: branch.id,
      source: parsed.data.source,
      commissionRate: employee.commissionRate,
      idempotencyKey: parsed.data.idempotencyKey,
      status: "CONFIRMED",
      subtotal,
      total: subtotal,
      customer: JSON.stringify(parsed.data.customer),
      shippingAdr: JSON.stringify(parsed.data.shipping),
      note: parsed.data.note || null,
      locale: parsed.data.locale,
      items: {
        create: parsed.data.items.map((item) => ({
          ...item,
          customLogoUrl: item.customLogoUrl || null,
          accessories: JSON.stringify(item.accessories),
        })),
      },
      events: { create: { actorId: current.id, type: "CREATED_MANUALLY" } },
    },
    include: {
      items: true,
      acceptedBy: { select: { id: true, name: true, email: true } },
      branch: true,
      events: true,
    },
  });

  return NextResponse.json({ order }, { status: 201 });
}
