"use client";

import { useState } from "react";
import { adminTranslator } from "@/lib/admin/i18n";
import type { Locale } from "@/lib/i18n/config";

type ArchivedOrder = { id: string; number: string; status: string; total: number; customer: { firstName?: string; lastName?: string }; employee: string | null; archivedAt: string; reason: string | null };

export default function AdminArchiveClient({ initial, locale }: { initial: ArchivedOrder[]; locale: string }) {
  const t = adminTranslator(locale as Locale);
  const [orders, setOrders] = useState(initial);
  const restore = async (id: string) => {
    const response = await fetch(`/api/admin/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "restore" }) });
    if (response.ok) setOrders((current) => current.filter((order) => order.id !== id));
  };
  return <div><h1 className="font-display text-3xl font-bold">{t("nav.archive")}</h1><p className="mt-2 text-sm text-fg-soft">Archived orders remain in statistics and can be restored.</p><div className="card mt-6 overflow-x-auto"><table className="w-full min-w-[760px] text-sm"><thead className="border-b border-line bg-bg-subtle text-xs uppercase text-fg-mute"><tr><th className="px-4 py-3 text-start">№</th><th className="px-4 py-3 text-start">{t("orders.customer")}</th><th className="px-4 py-3 text-start">{t("orders.employee")}</th><th className="px-4 py-3 text-start">{t("common.note")}</th><th className="px-4 py-3 text-end">{t("common.total")}</th><th /></tr></thead><tbody>{orders.map((order) => <tr key={order.id} className="border-b border-line last:border-0"><td className="px-4 py-3 font-mono text-xs">#{order.number}<div className="mt-1 text-[10px] text-fg-mute">{new Date(order.archivedAt).toLocaleString(locale)}</div></td><td className="px-4 py-3">{order.customer.firstName} {order.customer.lastName}</td><td className="px-4 py-3 text-fg-soft">{order.employee ?? "—"}</td><td className="px-4 py-3 text-fg-soft">{order.reason ?? "—"}</td><td className="px-4 py-3 text-end font-semibold">{order.total.toLocaleString("tr-TR")} ₺</td><td className="px-4 py-3 text-end"><button type="button" onClick={() => restore(order.id)} className="btn-secondary py-2">Restore</button></td></tr>)}</tbody></table>{orders.length === 0 && <div className="p-12 text-center text-fg-mute">—</div>}</div></div>;
}
