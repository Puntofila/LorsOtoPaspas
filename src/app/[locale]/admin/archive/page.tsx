import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import AdminArchiveClient from "@/components/admin/AdminArchiveClient";

export default async function AdminArchivePage({ params }: { params: { locale: string } }) {
  await requireRole(params.locale, ["DIRECTOR"]);
  const orders = await prisma.order.findMany({ where: { archivedAt: { not: null } }, orderBy: { archivedAt: "desc" }, include: { acceptedBy: { select: { name: true, email: true } } }, take: 300 });
  return <AdminArchiveClient locale={params.locale} initial={orders.map((order) => ({ id: order.id, number: order.number, status: order.status, total: order.total, customer: JSON.parse(order.customer) as { firstName?: string; lastName?: string }, employee: order.acceptedBy?.name ?? order.acceptedBy?.email ?? null, archivedAt: order.archivedAt!.toISOString(), reason: order.archiveReason }))} />;
}
