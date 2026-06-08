import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { requireApiRole } from "@/lib/auth/apiGuard";
import {
  canArchiveOrder,
  canClaimOrder,
  canEditOrder,
  type PermissionOrder,
} from "@/lib/admin/permissions";

const STATUSES = ["PENDING", "CONFIRMED", "PRODUCTION", "SHIPPED", "DELIVERED", "CANCELLED"] as const;
const patchSchema = z.object({
  action: z.enum(["status", "claim", "assign", "archive", "restore"]),
  status: z.enum(STATUSES).optional(),
  acceptedById: z.string().min(1).optional(),
  reason: z.string().trim().min(3).max(500).optional(),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await requireApiRole(["DIRECTOR", "STAFF"]);
  if (!user) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const existing = await prisma.order.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      status: true,
      acceptedById: true,
      createdById: true,
      archivedAt: true,
    },
  });
  if (!existing) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const permissionOrder: PermissionOrder = existing;
  const { action } = parsed.data;

  if (action === "claim") {
    if (!canClaimOrder(user, permissionOrder)) {
      return NextResponse.json({ error: "order_already_claimed" }, { status: 409 });
    }
    const employee = await prisma.user.findUnique({
      where: { id: user.id },
      select: { commissionRate: true },
    });
    const result = await prisma.order.updateMany({
      where: { id: params.id, acceptedById: null, archivedAt: null },
      data: { acceptedById: user.id, commissionRate: employee?.commissionRate ?? 0 },
    });
    if (result.count !== 1) {
      return NextResponse.json({ error: "order_already_claimed" }, { status: 409 });
    }
    await prisma.orderEvent.create({
      data: { orderId: params.id, actorId: user.id, type: "CLAIMED" },
    });
  } else if (action === "status") {
    if (!parsed.data.status || !canEditOrder(user, permissionOrder)) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    await prisma.$transaction([
      prisma.order.update({ where: { id: params.id }, data: { status: parsed.data.status } }),
      prisma.orderEvent.create({
        data: {
          orderId: params.id,
          actorId: user.id,
          type: "STATUS_CHANGED",
          payload: JSON.stringify({ from: existing.status, to: parsed.data.status }),
        },
      }),
    ]);
  } else if (action === "assign") {
    if (user.role !== "DIRECTOR" || !parsed.data.acceptedById) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    const employee = await prisma.user.findFirst({
      where: { id: parsed.data.acceptedById, role: { in: ["DIRECTOR", "STAFF"] }, isActive: true },
      select: { id: true, commissionRate: true },
    });
    if (!employee) return NextResponse.json({ error: "invalid_employee" }, { status: 400 });
    await prisma.$transaction([
      prisma.order.update({
        where: { id: params.id },
        data: { acceptedById: employee.id, commissionRate: employee.commissionRate },
      }),
      prisma.orderEvent.create({
        data: {
          orderId: params.id,
          actorId: user.id,
          type: "ASSIGNED",
          payload: JSON.stringify({ from: existing.acceptedById, to: employee.id }),
        },
      }),
    ]);
  } else if (action === "archive") {
    if (!parsed.data.reason || !canArchiveOrder(user, permissionOrder)) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    await prisma.$transaction([
      prisma.order.update({
        where: { id: params.id },
        data: { archivedAt: new Date(), archivedById: user.id, archiveReason: parsed.data.reason },
      }),
      prisma.orderEvent.create({
        data: {
          orderId: params.id,
          actorId: user.id,
          type: "ARCHIVED",
          payload: JSON.stringify({ reason: parsed.data.reason }),
        },
      }),
    ]);
  } else {
    if (user.role !== "DIRECTOR") return NextResponse.json({ error: "forbidden" }, { status: 403 });
    await prisma.$transaction([
      prisma.order.update({
        where: { id: params.id },
        data: { archivedAt: null, archivedById: null, archiveReason: null },
      }),
      prisma.orderEvent.create({
        data: { orderId: params.id, actorId: user.id, type: "RESTORED" },
      }),
    ]);
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true, acceptedBy: { select: { id: true, name: true, email: true } }, events: true },
  });
  return NextResponse.json({ order });
}

export async function DELETE() {
  return NextResponse.json({ error: "use_archive" }, { status: 405 });
}
