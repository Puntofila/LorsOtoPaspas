import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/guards";
import { canViewOrder } from "@/lib/admin/permissions";
import { adminTranslator } from "@/lib/admin/i18n";
import type { Locale } from "@/lib/i18n/config";

export default async function AdminOrderPage({ params }: { params: { locale: string; id: string } }) {
  const current = await requireRole(params.locale, ["DIRECTOR", "STAFF"]);
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true, branch: true, acceptedBy: { select: { name: true, email: true } }, events: { orderBy: { createdAt: "desc" }, include: { actor: { select: { name: true, email: true } } } } },
  });
  if (!order || !canViewOrder(current, order)) notFound();
  const t = adminTranslator(params.locale as Locale);
  const customer = JSON.parse(order.customer) as Record<string, string>;
  const shipping = JSON.parse(order.shippingAdr) as Record<string, string>;
  return (
    <div>
      <Link href={`/${params.locale}/admin/orders`} className="link-soft text-sm">← {t("nav.orders")}</Link>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-4"><div><div className="font-mono text-xs text-accent">#{order.number}</div><h1 className="mt-2 font-display text-3xl font-bold">{customer.firstName} {customer.lastName}</h1></div><span className="pill">{t(`status.${order.status}`)}</span></div>
      <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">{order.items.map((item) => <article key={item.id} className="card p-5"><div className="flex justify-between gap-3"><h2 className="font-semibold">{item.fullName}</h2><strong>{(item.unitPrice * item.qty).toLocaleString("tr-TR")} ₺</strong></div><dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><Item k="Hücre" v={item.pattern} /><Item k="Mat kalitesi" v={item.material} /><Item k={t("orders.color")} v={item.color} /><Item k={t("orders.piping")} v={item.piping} /><Item k={t("orders.logo")} v={item.logo} /><Item k="Aksesuarlar" v={(JSON.parse(item.accessories) as string[]).join(", ") || "—"} /></dl></article>)}</div>
        <aside className="space-y-4"><div className="card p-5"><Item k={t("orders.phone")} v={customer.phone} /><Item k={t("people.email")} v={customer.email || "—"} /><Item k={t("orders.employee")} v={order.acceptedBy?.name ?? order.acceptedBy?.email ?? "—"} /><Item k={t("orders.branch")} v={order.branch?.shortName ?? "—"} /><Item k={t("orders.address")} v={[shipping.province, shipping.district, shipping.neighborhood, shipping.address, shipping.zip].filter(Boolean).join(", ")} /><Item k={t("common.total")} v={`${order.total.toLocaleString("tr-TR")} ₺`} /></div><div className="card p-5"><h2 className="text-sm font-semibold">History</h2><div className="mt-3 space-y-3">{order.events.map((event) => <div key={event.id} className="border-s-2 border-accent/40 ps-3 text-xs text-fg-soft"><strong className="block text-fg">{event.type}</strong>{event.actor?.name ?? event.actor?.email ?? "System"} · {event.createdAt.toLocaleString(params.locale)}</div>)}</div></div></aside>
      </div>
    </div>
  );
}

function Item({ k, v }: { k: string; v: string }) {
  return <div className="mb-3 last:mb-0"><dt className="text-xs uppercase tracking-wider text-fg-mute">{k}</dt><dd className="mt-1 text-fg-soft">{v}</dd></div>;
}
