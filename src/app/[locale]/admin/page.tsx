import { prisma } from "@/lib/db/prisma";
import { Sparkline } from "@/components/admin/Charts";
import { adminTranslator } from "@/lib/admin/i18n";
import type { Locale } from "@/lib/i18n/config";
import { requireRole } from "@/lib/auth/guards";
import { calculateCommission } from "@/lib/orders/commission";

export default async function AdminDashboard({ params }: { params: { locale: string } }) {
  const current = await requireRole(params.locale, ["DIRECTOR", "STAFF"]);
  const t = adminTranslator(params.locale as Locale);
  const where = current.role === "DIRECTOR"
    ? { archivedAt: null }
    : { archivedAt: null, OR: [{ acceptedById: current.id }, { createdById: current.id }] };
  const [orders, employees] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: { id: true, number: true, status: true, total: true, commissionRate: true, customer: true, createdAt: true, acceptedById: true, acceptedBy: { select: { name: true, email: true } } },
    }),
    current.role === "DIRECTOR" ? prisma.user.findMany({
      where: { role: "STAFF", isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, email: true, commissionRate: true, acceptedOrders: { where: { archivedAt: null }, select: { status: true, total: true, commissionRate: true } } },
    }) : Promise.resolve([]),
  ]);

  const active = orders.filter((order) => !["DELIVERED", "CANCELLED"].includes(order.status));
  const completed = orders.filter((order) => order.status === "DELIVERED");
  const revenue = orders.filter((order) => order.status !== "CANCELLED").reduce((sum, order) => sum + order.total, 0);
  const commission = completed.reduce((sum, order) => sum + calculateCommission(order.total, order.commissionRate), 0);
  const days: { label: string; value: number }[] = [];
  for (let index = 29; index >= 0; index--) {
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - index);
    const next = new Date(day);
    next.setDate(next.getDate() + 1);
    days.push({ label: day.toLocaleDateString(params.locale, { day: "2-digit", month: "short" }), value: orders.filter((order) => order.createdAt >= day && order.createdAt < next).length });
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">{t("dashboard.title")}</h1>
      <p className="mt-2 text-sm text-fg-soft">{t("dashboard.subtitle")}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label={t("dashboard.orders")} value={orders.length} description={t("dashboard.ordersHelp")} />
        <Stat label={t("dashboard.pending")} value={active.length} description={t("status.help.PENDING")} />
        <Stat label={t("dashboard.revenue")} value={`${revenue.toLocaleString("tr-TR")} ₺`} description={t("dashboard.revenueHelp")} accent />
        <Stat label={t("orders.commission")} value={`${commission.toLocaleString("tr-TR")} ₺`} description={t("orders.commission")} />
      </div>
      <div className="card mt-6 p-5">
        <div className="flex items-baseline justify-between gap-3"><h2 className="text-sm font-semibold">30 gün</h2><span className="text-xs text-fg-mute">{orders.length} {t("dashboard.total")}</span></div>
        <Sparkline points={days.map((day) => day.value)} labels={days.map((day) => day.label)} height={150} dayDescription={t("chart.dayHelp")} emptyLabel={t("chart.hover")} emptyDescription={t("chart.details")} />
      </div>
      {current.role === "DIRECTOR" && employees.length > 0 && (
        <div className="mt-8"><h2 className="text-lg font-semibold">{t("nav.people")}</h2><div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{employees.map((employee) => {
          const delivered = employee.acceptedOrders.filter((order) => order.status === "DELIVERED");
          const employeeCommission = delivered.reduce((sum, order) => sum + calculateCommission(order.total, order.commissionRate), 0);
          return <div key={employee.id} className="card p-5"><div className="font-semibold">{employee.name ?? employee.email}</div><div className="mt-1 text-xs text-fg-mute">{employee.commissionRate}%</div><div className="mt-4 grid grid-cols-2 gap-3"><Metric value={employee.acceptedOrders.length} label={t("dashboard.orders")} /><Metric value={`${employeeCommission.toLocaleString("tr-TR")} ₺`} label={t("orders.commission")} /></div></div>;
        })}</div></div>
      )}
      <div className="mt-8"><h2 className="text-lg font-semibold">{t("dashboard.latest")}</h2><div className="card mt-4 divide-y divide-line">{orders.slice(0, 8).map((order) => {
        const customer = JSON.parse(order.customer) as { firstName?: string; lastName?: string };
        return <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm"><span><strong className="font-mono text-xs">#{order.number}</strong><span className="ms-3 text-fg-soft">{customer.firstName} {customer.lastName}</span></span><span className="text-fg-mute">{t(`status.${order.status}`)}</span><strong>{order.total.toLocaleString("tr-TR")} ₺</strong></div>;
      })}</div></div>
    </div>
  );
}

function Stat({ label, value, description, accent }: { label: string; value: number | string; description: string; accent?: boolean }) {
  return <div className="card group relative p-5 transition hover:-translate-y-0.5"><div className="text-xs uppercase tracking-wider text-fg-mute">{label}</div><div className={`mt-1.5 font-display text-3xl font-bold ${accent ? "text-accent" : ""}`}>{value}</div><div className="pointer-events-none absolute start-3 top-full z-20 mt-2 max-w-xs rounded-xl border border-line bg-bg-elevated p-3 text-xs text-fg-soft opacity-0 shadow-soft transition group-hover:opacity-100">{description}</div></div>;
}

function Metric({ value, label }: { value: number | string; label: string }) {
  return <div className="rounded-xl border border-line bg-bg-subtle p-3"><div className="font-display text-xl font-bold text-accent">{value}</div><div className="text-[11px] text-fg-mute">{label}</div></div>;
}
