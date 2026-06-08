import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { rateLimitResponse } from "@/lib/security/rateLimit";
import { calculatePromotionDiscount, isPromotionUsable } from "@/lib/orders/promotion";
import { PRODUCT_OPTIONS } from "@/lib/catalog/product-options";

// Server-side price source of truth. Mirrors ProductPageClient:
// unitPrice = set.basePrice + logo.addon. Never trust client-supplied prices.
const SET_PRICE = new Map<string, number>(PRODUCT_OPTIONS.sets.map((s) => [s.id, s.basePrice]));
const LOGO_ADDON = new Map<string, number>(PRODUCT_OPTIONS.logos.map((l) => [l.id, l.addon]));

function resolveUnitPrice(setType: string, logo: string): number | null {
  const base = SET_PRICE.get(setType);
  const addon = LOGO_ADDON.get(logo);
  if (base === undefined || addon === undefined) return null;
  return base + addon;
}

const itemSchema = z.object({
  brandSlug: z.string(),
  brandName: z.string(),
  modelSlug: z.string(),
  modelName: z.string(),
  fullName: z.string(),
  years: z.string().optional(),
  bodyType: z.string().optional(),
  pattern: z.enum(["sota", "romb"]).default("sota"),
  material: z.enum(["hali", "ithal", "premium", "standart"]).default("hali"),
  color: z.string(),
  piping: z.string(),
  logo: z.enum(["none", "brand", "custom"]),
  customLogoUrl: z.string().url().optional().or(z.literal("")),
  accessories: z.array(z.enum(["heelPad", "logo"])).max(2).default([]),
  setType: z.string(),
  // unitPrice is intentionally NOT accepted from the client; the server computes it.
  qty: z.number().int().positive().max(99),
});

const orderSchema = z.object({
  items: z.array(itemSchema).min(1).max(50),
  customer: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
  }),
  branchId: z.string().min(1),
  promotionCode: z.string().trim().toUpperCase().max(40).optional().or(z.literal("")),
  shipping: z.object({
    province: z.string().min(1).default("İstanbul"),
    district: z.string().min(1),
    neighborhood: z.string().optional().default(""),
    address: z.string().min(1),
    zip: z.string().optional(),
  }),
  note: z.string().max(2000).optional(),
  locale: z.enum(["tr", "ru", "en", "ar"]).default("tr"),
});

function makeOrderNumber() {
  const d = new Date();
  const stamp = `${d.getFullYear()}${(d.getMonth() + 1).toString().padStart(2, "0")}${d.getDate().toString().padStart(2, "0")}`;
  return `LR-${stamp}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export async function POST(req: Request) {
  const limited = rateLimitResponse(req, "orders", 10, 60_000);
  if (limited) return limited;

  const idempotencyKey = req.headers.get("idempotency-key");
  if (!idempotencyKey || idempotencyKey.length < 8 || idempotencyKey.length > 120) {
    return NextResponse.json({ error: "idempotency_key_required" }, { status: 400 });
  }
  const duplicate = await prisma.order.findUnique({ where: { idempotencyKey } });
  if (duplicate) return NextResponse.json({ order: duplicate, duplicate: true });
  const cooldown = rateLimitResponse(req, "orders-cooldown", 1, 5_000);
  if (cooldown) return cooldown;

  const session = await getServerSession(authOptions);
  const body = await req.json().catch(() => null);
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input", issues: parsed.error.flatten() }, { status: 400 });
  }
  const { items, customer, shipping, note, locale, branchId } = parsed.data;
  const branch = await prisma.branch.findFirst({ where: { id: branchId, isActive: true }, select: { id: true } });
  if (!branch) return NextResponse.json({ error: "invalid_branch" }, { status: 400 });

  // Resolve every line price server-side; reject unknown set/logo combinations.
  const pricedItems: Array<(typeof items)[number] & { unitPrice: number }> = [];
  for (const item of items) {
    const unitPrice = resolveUnitPrice(item.setType, item.logo);
    if (unitPrice === null) {
      return NextResponse.json({ error: "invalid_pricing" }, { status: 400 });
    }
    pricedItems.push({ ...item, unitPrice });
  }

  const subtotal = pricedItems.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
  let promotion: Awaited<ReturnType<typeof prisma.promotionCode.findUnique>> = null;
  let discount = 0;
  if (parsed.data.promotionCode) {
    promotion = await prisma.promotionCode.findUnique({ where: { code: parsed.data.promotionCode } });
    if (!promotion || !isPromotionUsable(promotion, subtotal)) {
      return NextResponse.json({ error: "invalid_promotion" }, { status: 400 });
    }
    discount = calculatePromotionDiscount(subtotal, promotion);
  }

  const order = await prisma.$transaction(async (tx) => {
    if (promotion) {
      await tx.promotionCode.update({ where: { id: promotion.id }, data: { usedCount: { increment: 1 } } });
    }
    return tx.order.create({
      data: {
        number: makeOrderNumber(),
        userId: session?.user?.id ?? null,
        branchId,
        promotionCodeId: promotion?.id ?? null,
        idempotencyKey,
        source: "WEBSITE",
        subtotal,
        discount,
        total: subtotal - discount,
        customer: JSON.stringify(customer),
        shippingAdr: JSON.stringify(shipping),
        note,
        locale,
        items: {
          create: pricedItems.map((item) => ({
            ...item,
            customLogoUrl: item.customLogoUrl || null,
            accessories: JSON.stringify(item.accessories),
          })),
        },
        events: { create: { type: "CREATED_FROM_WEBSITE" } },
      },
      include: { items: true, branch: true },
    });
  });
  return NextResponse.json({ order }, { status: 201 });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const where =
    session.user.role === "DIRECTOR"
      ? {}
      : session.user.role === "STAFF"
        ? { OR: [{ acceptedById: null }, { acceptedById: session.user.id }, { createdById: session.user.id }] }
        : { userId: session.user.id };
  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { items: true, branch: true },
    take: 200,
  });
  return NextResponse.json({ orders });
}
