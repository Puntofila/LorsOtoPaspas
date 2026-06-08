import { prisma } from "@/lib/db/prisma";
import AdminOrdersClient from "@/components/admin/AdminOrdersClient";
import { BRANDS } from "@/lib/data/brands";
import { requireRole } from "@/lib/auth/guards";

export default async function AdminOrdersPage({ params }: { params: { locale: string } }) {
  const current = await requireRole(params.locale, ["DIRECTOR", "STAFF"]);
  const [orders, employees, branches] = await Promise.all([prisma.order.findMany({
    where: current.role === "DIRECTOR"
      ? { archivedAt: null }
      : { archivedAt: null, OR: [{ acceptedById: null }, { acceptedById: current.id }, { createdById: current.id }] },
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      user: { select: { email: true, name: true } },
      acceptedBy: { select: { id: true, email: true, name: true } },
      branch: { select: { id: true, shortName: true } },
      events: { orderBy: { createdAt: "desc" }, take: 20, include: { actor: { select: { name: true, email: true } } } },
    },
    take: 200,
  }), prisma.user.findMany({
    where: { role: { in: ["DIRECTOR", "STAFF"] } },
    orderBy: { name: "asc" },
    select: { id: true, name: true, email: true },
  }), prisma.branch.findMany({ where: { isActive: true }, orderBy: { name: "asc" }, select: { id: true, shortName: true } })]);
  const serialized = orders.map((o) => ({
    id: o.id,
    number: o.number,
    status: o.status,
    total: o.total,
    createdAt: o.createdAt.toISOString(),
    customer: JSON.parse(o.customer) as { firstName: string; lastName: string; email: string; phone: string },
    user: o.user,
    acceptedBy: o.acceptedBy,
    acceptedById: o.acceptedById,
    createdById: o.createdById,
    branch: o.branch,
    source: o.source,
    commissionRate: o.commissionRate,
    note: o.note,
    shipping: JSON.parse(o.shippingAdr) as { province?: string; district?: string; neighborhood?: string; address?: string; zip?: string },
    itemsCount: o.items.length,
    items: o.items.map((it) => ({
      id: it.id,
      brandSlug: it.brandSlug,
      brandName: it.brandName,
      modelSlug: it.modelSlug,
      modelName: it.modelName,
      fullName: it.fullName,
      years: it.years,
      bodyType: it.bodyType,
      pattern: it.pattern,
      material: it.material,
      color: it.color,
      piping: it.piping,
      logo: it.logo,
      customLogoUrl: it.customLogoUrl,
      accessories: JSON.parse(it.accessories) as string[],
      setType: it.setType,
      qty: it.qty,
      unitPrice: it.unitPrice,
    })),
    events: o.events.map((event) => ({ id: event.id, type: event.type, payload: event.payload, createdAt: event.createdAt.toISOString(), actor: event.actor })),
  }));
  return (
    <AdminOrdersClient
      initial={serialized}
      employees={employees}
      currentEmployeeId={current.id}
      currentRole={current.role}
      locale={params.locale}
      branches={branches}
      brands={BRANDS.map((brand) => ({
        slug: brand.slug,
        name: brand.name,
        models: brand.models.map((model) => ({
          slug: model.slug,
          name: model.name,
          fullName: model.fullName,
          years: model.years,
          bodyType: model.bodyType,
        })),
      }))}
    />
  );
}
