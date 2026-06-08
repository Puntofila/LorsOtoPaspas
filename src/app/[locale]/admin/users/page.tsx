import { prisma } from "@/lib/db/prisma";
import AdminUsersClient from "@/components/admin/AdminUsersClient";
import { requireRole } from "@/lib/auth/guards";

export default async function AdminUsersPage({ params }: { params: { locale: string } }) {
  await requireRole(params.locale, ["DIRECTOR"]);
  const [users, branches] = await Promise.all([prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      commissionRate: true,
      isActive: true,
      primaryBranchId: true,
      createdAt: true,
      _count: { select: { orders: true, acceptedOrders: true } },
    },
  }), prisma.branch.findMany({ where: { isActive: true }, orderBy: { name: "asc" }, select: { id: true, shortName: true } })]);
  return (
    <AdminUsersClient
      initial={users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        phone: u.phone,
        commissionRate: u.commissionRate,
        isActive: u.isActive,
        primaryBranchId: u.primaryBranchId,
        createdAt: u.createdAt.toISOString(),
        ordersCount: u._count.acceptedOrders,
      }))}
      locale={params.locale}
      branches={branches}
    />
  );
}
