"use client";

import Link from "next/link";
import { Fragment, useMemo, useState, useTransition } from "react";
import { adminTranslator } from "@/lib/admin/i18n";
import type { Locale } from "@/lib/i18n/config";
import { calculateCommission } from "@/lib/orders/commission";
import { PRODUCT_OPTIONS } from "@/lib/catalog/product-options";

type Employee = { id: string; name: string | null; email: string };
type Branch = { id: string; shortName: string };
type CatalogChoice = {
  slug: string;
  name: string;
  models: { slug: string; name: string; fullName: string; years: string; bodyType?: string }[];
};
type OrderItem = {
  id: string;
  brandSlug: string;
  brandName: string;
  modelSlug: string;
  modelName: string;
  fullName: string;
  years: string | null;
  bodyType: string | null;
  pattern: string;
  material: string;
  color: string;
  piping: string;
  logo: string;
  customLogoUrl: string | null;
  accessories: string[];
  setType: string;
  qty: number;
  unitPrice: number;
};
type Order = {
  id: string;
  number: string;
  status: string;
  source: string;
  commissionRate: number;
  note: string | null;
  total: number;
  createdAt: string;
  customer: { firstName: string; lastName: string; email?: string; phone: string };
  shipping: { province?: string; district?: string; neighborhood?: string; address?: string; zip?: string };
  user: { email: string; name: string | null } | null;
  acceptedBy: Employee | null;
  acceptedById: string | null;
  createdById: string | null;
  branch: Branch | null;
  itemsCount: number;
  items: OrderItem[];
  events: { id: string; type: string; payload: string | null; createdAt: string; actor: { name: string | null; email: string } | null }[];
};

const STATUSES = ["PENDING", "CONFIRMED", "PRODUCTION", "SHIPPED", "DELIVERED", "CANCELLED"] as const;
const SOURCES = ["WEBSITE", "SOCIAL", "PHONE", "IN_PERSON"] as const;
const BADGE: Record<string, string> = {
  PENDING: "bg-amber-500/15 text-amber-300",
  CONFIRMED: "bg-sky-500/15 text-sky-300",
  PRODUCTION: "bg-violet-500/15 text-violet-300",
  SHIPPED: "bg-blue-500/15 text-blue-300",
  DELIVERED: "bg-emerald-500/15 text-emerald-300",
  CANCELLED: "bg-rose-500/15 text-rose-300",
};

export default function AdminOrdersClient({
  initial,
  employees,
  currentEmployeeId,
  currentRole,
  locale,
  brands,
  branches,
}: {
  initial: Order[];
  employees: Employee[];
  currentEmployeeId: string;
  currentRole: string;
  locale: string;
  brands: CatalogChoice[];
  branches: Branch[];
}) {
  const t = adminTranslator(locale as Locale);
  const [orders, setOrders] = useState(initial);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const value = q.trim().toLowerCase();
    return orders.filter((order) => {
      if (filter !== "ALL" && order.status !== filter) return false;
      if (!value) return true;
      return `${order.number} ${order.customer.firstName} ${order.customer.lastName} ${order.customer.email ?? ""} ${order.acceptedBy?.name ?? ""} ${order.acceptedBy?.email ?? ""}`.toLowerCase().includes(value);
    });
  }, [orders, q, filter]);

  const updateStatus = (id: string, status: string) => {
    if (saving === id) return;
    const previous = orders;
    setSaving(id);
    setOrders((current) => current.map((order) => order.id === id ? { ...order, status } : order));
    startTransition(async () => {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "status", status }),
      });
      if (!response.ok) setOrders(previous);
      else setSaved(id);
      window.setTimeout(() => { setSaving(null); setSaved(null); }, 2000);
    });
  };

  const act = async (order: Order, action: "claim" | "archive" | "assign", value?: string) => {
    const response = await fetch(`/api/admin/orders/${order.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, reason: action === "archive" ? value : undefined, acceptedById: action === "assign" ? value : undefined }) });
    if (!response.ok) return;
    if (action === "archive") setOrders((current) => current.filter((item) => item.id !== order.id));
    else {
      const { order: updated } = await response.json();
      setOrders((current) => current.map((item) => item.id === order.id ? { ...item, acceptedById: updated.acceptedById, acceptedBy: updated.acceptedBy, commissionRate: updated.commissionRate } : item));
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">{t("orders.title")}</h1>
          <p className="mt-2 max-w-2xl text-sm text-fg-soft">{t("orders.subtitle")}</p>
        </div>
        <button type="button" onClick={() => setCreating((value) => !value)} className="btn-primary">
          {creating ? t("common.cancel") : t("orders.new")}
        </button>
      </div>

      {creating && (
        <ManualOrderForm
          employees={employees}
          currentEmployeeId={currentEmployeeId}
          currentRole={currentRole}
          brands={brands}
          branches={branches}
          locale={locale}
          onCreated={(order) => {
            setOrders((current) => [order, ...current]);
            setCreating(false);
          }}
        />
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <input value={q} onChange={(event) => setQ(event.target.value)} placeholder={t("orders.search")} className="input max-w-md" />
        <select value={filter} onChange={(event) => setFilter(event.target.value)} className="input max-w-xs">
          <option value="ALL">{t("common.all")}</option>
          {STATUSES.map((status) => <option key={status} value={status}>{t(`status.${status}`)}</option>)}
        </select>
      </div>

      <div className="card mt-6 overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-fg-mute">{t("orders.empty")}</div>
        ) : (
          <table className="w-full min-w-[940px] text-sm">
            <thead className="border-b border-line bg-bg-subtle text-xs uppercase tracking-wider text-fg-mute">
              <tr>
                <th className="px-4 py-3 text-start font-medium">№</th>
                <th className="px-4 py-3 text-start font-medium">{t("orders.customer")}</th>
                <th className="px-4 py-3 text-start font-medium">{t("orders.employee")}</th>
                <th className="px-4 py-3 text-start font-medium">{t("orders.source")}</th>
                <th className="px-4 py-3 text-start font-medium">{t("common.status")}</th>
                <th className="px-4 py-3 text-end font-medium">{t("common.total")}</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <Fragment key={order.id}>
                  <tr className="cursor-pointer border-b border-line transition hover:bg-bg-subtle" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                    <td className="px-4 py-3">
                      <Link href={`/${locale}/admin/orders/${order.id}`} onClick={(event) => event.stopPropagation()} className="font-mono text-xs text-accent hover:underline">#{order.number}</Link>
                      <div className="mt-1 text-[10px] text-fg-mute">{new Date(order.createdAt).toLocaleString(locale)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{order.customer.firstName} {order.customer.lastName}</div>
                      <div className="text-xs text-fg-mute">{order.customer.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-fg-soft">{order.acceptedBy?.name ?? order.acceptedBy?.email ?? <button type="button" onClick={(event) => { event.stopPropagation(); act(order, "claim"); }} className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">Взять</button>}</td>
                    <td className="px-4 py-3"><span className="pill">{t(`source.${order.source}`)}</span></td>
                    <td className="px-4 py-3" onClick={(event) => event.stopPropagation()}>
                      <select disabled={saving === order.id || (currentRole !== "DIRECTOR" && order.acceptedById !== currentEmployeeId && order.createdById !== currentEmployeeId)} value={order.status} onChange={(event) => updateStatus(order.id, event.target.value)} title={t(`status.help.${order.status}`)} className={`rounded-full border-0 px-2.5 py-1 text-[11px] font-semibold outline-none disabled:opacity-50 ${BADGE[order.status] ?? ""}`}>
                        {STATUSES.map((status) => <option key={status} value={status}>{t(`status.${status}`)}</option>)}
                      </select>
                      <span className="ms-1 text-[10px]">{saving === order.id ? "…" : saved === order.id ? "✓" : ""}</span>
                    </td>
                    <td className="px-4 py-3 text-end font-semibold">{order.total.toLocaleString("tr-TR")} ₺</td>
                    <td className="px-2 text-fg-mute">{expanded === order.id ? "▾" : "▸"}</td>
                  </tr>
                  {expanded === order.id && <OrderDetails order={order} locale={locale} employees={employees} canAssign={currentRole === "DIRECTOR"} onAssign={(employeeId) => act(order, "assign", employeeId)} canArchive={currentRole === "DIRECTOR" || order.acceptedById === currentEmployeeId || order.createdById === currentEmployeeId} onArchive={() => { const reason = window.prompt("Archive reason"); if (reason) act(order, "archive", reason); }} />}
                </Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function OrderDetails({ order, locale, employees, canAssign, onAssign, canArchive, onArchive }: { order: Order; locale: string; employees: Employee[]; canAssign: boolean; onAssign: (employeeId: string) => void; canArchive: boolean; onArchive: () => void }) {
  const t = adminTranslator(locale as Locale);
  return (
    <tr className="border-b border-line bg-bg-subtle">
      <td colSpan={7} className="px-6 py-5">
        <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-fg-mute">{t("orders.items")} ({order.itemsCount})</div>
            <div className="mt-3 space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="rounded-xl border border-line bg-bg-elevated p-4">
                  <div className="flex flex-wrap justify-between gap-2">
                    <strong>{item.brandName} {item.modelName}</strong>
                    <strong>{(item.unitPrice * item.qty).toLocaleString("tr-TR")} ₺</strong>
                  </div>
                  <div className="mt-2 grid gap-2 text-xs text-fg-soft sm:grid-cols-3">
                    <span>{t("orders.set")}: {item.setType}</span>
                    <span>Pattern: {item.pattern}</span>
                    <span>Material: {item.material}</span>
                    <span>{t("orders.color")}: {item.color}</span>
                    <span>{t("orders.piping")}: {item.piping}</span>
                    <span>{t("orders.logo")}: {item.logo}</span>
                    <span>Aksesuar: {item.accessories.join(", ") || "—"}</span>
                    <span>{t("orders.qty")}: {item.qty}</span>
                    <span>{item.years} {item.bodyType}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-line bg-bg-elevated p-4 text-sm">
            <Info label={t("orders.employee")} value={order.acceptedBy?.name ?? order.acceptedBy?.email ?? "—"} />
            {canAssign && <select value={order.acceptedById ?? ""} onChange={(event) => onAssign(event.target.value)} className="input mb-3 py-2"><option value="" disabled>—</option>{employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name ?? employee.email}</option>)}</select>}
            <Info label={t("orders.commission")} value={`${order.commissionRate}% · ${calculateCommission(order.total, order.commissionRate).toLocaleString("tr-TR")} ₺`} />
            <Info label={t("orders.branch")} value={order.branch?.shortName ?? "—"} />
            <Info label={t("orders.address")} value={[order.shipping.province, order.shipping.district, order.shipping.neighborhood, order.shipping.address, order.shipping.zip].filter(Boolean).join(", ") || "—"} />
            <Info label={t("common.note")} value={order.note || "—"} />
            {canArchive && <button type="button" onClick={onArchive} className="mt-3 rounded-xl border border-danger/40 px-3 py-2 text-xs font-semibold text-danger">Archive</button>}
            {order.events.length > 0 && <div className="mt-5 border-t border-line pt-4"><div className="text-xs font-semibold uppercase tracking-wider text-fg-mute">History</div><div className="mt-2 space-y-2">{order.events.map((event) => <div key={event.id} className="text-xs text-fg-soft"><strong>{event.type}</strong> · {event.actor?.name ?? event.actor?.email ?? "System"} · {new Date(event.createdAt).toLocaleString(locale)}</div>)}</div></div>}
          </div>
        </div>
      </td>
    </tr>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="mb-3 last:mb-0"><div className="text-xs uppercase tracking-wider text-fg-mute">{label}</div><div className="mt-1 text-fg-soft">{value}</div></div>;
}

function ManualOrderForm({
  employees,
  currentEmployeeId,
  currentRole,
  brands,
  branches,
  locale,
  onCreated,
}: {
  employees: Employee[];
  currentEmployeeId: string;
  currentRole: string;
  brands: CatalogChoice[];
  branches: Branch[];
  locale: string;
  onCreated: (order: Order) => void;
}) {
  const t = adminTranslator(locale as Locale);
  const [brandSlug, setBrandSlug] = useState(brands[0]?.slug ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const brand = brands.find((item) => item.slug === brandSlug) ?? brands[0];

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const selectedBrand = brands.find((item) => item.slug === data.brandSlug);
    const model = selectedBrand?.models.find((item) => item.slug === data.modelSlug);
    const payload = {
      acceptedById: currentRole === "DIRECTOR" ? data.acceptedById : currentEmployeeId,
      branchId: data.branchId,
      idempotencyKey: `manual-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      source: data.source,
      locale,
      customer: { firstName: data.firstName, lastName: data.lastName, email: data.email, phone: data.phone },
      shipping: { province: data.province, district: data.district, neighborhood: data.neighborhood, address: data.address, zip: data.zip },
      note: data.note,
      items: [{
        brandSlug: selectedBrand?.slug,
        brandName: selectedBrand?.name,
        modelSlug: model?.slug,
        modelName: model?.name,
        fullName: model?.fullName,
        years: model?.years,
        bodyType: model?.bodyType,
        pattern: data.pattern,
        material: data.material,
        color: data.color,
        piping: data.piping,
        logo: data.logo,
        customLogoUrl: "",
        accessories: [data.heelPad ? "heelPad" : null, data.accessoryLogo ? "logo" : null].filter(Boolean),
        setType: data.setType,
        unitPrice: Number(data.unitPrice),
        qty: Number(data.qty),
      }],
    };
    const response = await fetch("/api/admin/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      const { order } = await response.json();
      onCreated({
        ...order,
        createdAt: order.createdAt,
        customer: JSON.parse(order.customer),
        shipping: JSON.parse(order.shippingAdr),
        user: null,
        itemsCount: order.items.length,
      });
    } else {
      const body = await response.json().catch(() => ({}));
      setError(body.error ?? "save_failed");
    }
    setBusy(false);
  };

  return (
    <form onSubmit={submit} className="card mt-6 space-y-6 p-5">
      <FieldGroup title={t("orders.customer")}>
        <input name="firstName" required placeholder={t("people.name")} className="input" />
        <input name="lastName" placeholder={t("orders.lastName")} className="input" />
        <input name="phone" required placeholder={t("people.phone")} className="input" />
        <input name="email" type="email" placeholder={t("people.email")} className="input" />
      </FieldGroup>
      <FieldGroup title={t("orders.items")}>
        <select name="brandSlug" value={brandSlug} onChange={(event) => setBrandSlug(event.target.value)} className="input">
          {brands.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
        </select>
        <select name="modelSlug" className="input">
          {brand?.models.map((model) => <option key={model.slug} value={model.slug}>{model.name}</option>)}
        </select>
        <select name="pattern" className="input">{PRODUCT_OPTIONS.patterns.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select>
        <select name="material" className="input">{PRODUCT_OPTIONS.materials.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select>
        <select name="color" className="input">{PRODUCT_OPTIONS.colors.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select>
        <select name="piping" className="input">{PRODUCT_OPTIONS.colors.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select>
        <select name="logo" className="input">{PRODUCT_OPTIONS.logos.map((item) => <option key={item.id} value={item.id}>{item.id}</option>)}</select>
        <select name="setType" className="input">{PRODUCT_OPTIONS.sets.map((item) => <option key={item.id} value={item.id}>{item.id}</option>)}</select>
        <label className="flex items-center gap-2 text-sm text-fg-soft"><input name="heelPad" type="checkbox" defaultChecked />Topuk desteği</label>
        <label className="flex items-center gap-2 text-sm text-fg-soft"><input name="accessoryLogo" type="checkbox" />Shildik/logo</label>
        <input name="qty" required type="number" min="1" defaultValue="1" placeholder={t("orders.qty")} className="input" />
        <input name="unitPrice" required type="number" min="0" defaultValue="1990" placeholder={t("orders.price")} className="input" />
      </FieldGroup>
      <FieldGroup title={t("orders.employee")}>
        {currentRole === "DIRECTOR" && <select name="acceptedById" defaultValue={currentEmployeeId} className="input">
          {employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name ?? employee.email}</option>)}
        </select>}
        <select name="source" defaultValue="SOCIAL" className="input">
          {SOURCES.map((source) => <option key={source} value={source}>{t(`source.${source}`)}</option>)}
        </select>
        <input name="note" placeholder={t("common.note")} className="input" />
      </FieldGroup>
      <FieldGroup title={t("orders.address")}>
        <select name="branchId" className="input">{branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.shortName}</option>)}</select>
        <input name="province" defaultValue="İstanbul" placeholder="İl" className="input" />
        <input name="district" placeholder="İlçe" className="input" />
        <input name="neighborhood" placeholder="Mahalle" className="input" />
        <input name="address" placeholder={t("orders.address")} className="input" />
        <input name="zip" placeholder={t("orders.zip")} className="input" />
      </FieldGroup>
      {error && <p className="text-sm text-danger">{error}</p>}
      <button type="submit" disabled={busy} className="btn-primary disabled:opacity-60">{busy ? "..." : t("orders.create")}</button>
    </form>
  );
}

function FieldGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return <fieldset><legend className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent">{title}</legend><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{children}</div></fieldset>;
}
