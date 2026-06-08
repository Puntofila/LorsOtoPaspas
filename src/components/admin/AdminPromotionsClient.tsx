"use client";

import { useState } from "react";
import { adminTranslator } from "@/lib/admin/i18n";
import type { Locale } from "@/lib/i18n/config";

type Promotion = {
  id: string;
  code: string;
  type: string;
  amount: number;
  minSubtotal: number;
  maxUses: number | null;
  usedCount: number;
  startsAt: string | null;
  endsAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: Date | string;
};

export default function AdminPromotionsClient({ initial, locale }: { initial: Promotion[]; locale: string }) {
  const t = adminTranslator(locale as Locale);
  const [items, setItems] = useState(initial);
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const create = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await fetch("/api/admin/promotions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: data.code,
        type: data.type,
        amount: Number(data.amount),
        minSubtotal: Number(data.minSubtotal),
        maxUses: data.maxUses ? Number(data.maxUses) : null,
        isActive: true,
      }),
    });
    if (response.ok) {
      const { promotion } = await response.json();
      setItems((current) => [promotion, ...current]);
      setCreating(false);
    } else setError((await response.json().catch(() => ({}))).error ?? "save_failed");
    setBusy(false);
  };

  const toggle = async (promotion: Promotion) => {
    const response = await fetch(`/api/admin/promotions/${promotion.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !promotion.isActive }) });
    if (response.ok) setItems((current) => current.map((item) => item.id === promotion.id ? { ...item, isActive: !item.isActive } : item));
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="font-display text-3xl font-bold">{t("promotions.title")}</h1><p className="mt-2 text-sm text-fg-soft">{t("promotions.subtitle")}</p></div><button type="button" onClick={() => setCreating((value) => !value)} className="btn-primary">{creating ? t("common.cancel") : t("promotions.new")}</button></div>
      {creating && <form onSubmit={create} className="card mt-6 grid gap-3 p-5 md:grid-cols-5"><input name="code" required minLength={3} placeholder={t("promotions.code")} className="input uppercase" /><select name="type" className="input"><option value="PERCENT">%</option><option value="FIXED">₺</option></select><input name="amount" type="number" min="1" required placeholder={t("promotions.amount")} className="input" /><input name="minSubtotal" type="number" min="0" defaultValue="0" placeholder={t("promotions.minimum")} className="input" /><input name="maxUses" type="number" min="1" placeholder={t("promotions.limit")} className="input" /><button disabled={busy} className="btn-primary md:col-span-5">{busy ? "..." : t("common.save")}</button>{error && <p className="text-danger md:col-span-5">{error}</p>}</form>}
      <div className="card mt-6 overflow-x-auto"><table className="w-full min-w-[760px] text-sm"><thead className="border-b border-line bg-bg-subtle text-xs uppercase text-fg-mute"><tr><th className="px-4 py-3 text-start">{t("promotions.code")}</th><th className="px-4 py-3 text-start">{t("promotions.amount")}</th><th className="px-4 py-3 text-start">{t("promotions.minimum")}</th><th className="px-4 py-3 text-start">{t("promotions.limit")}</th><th className="px-4 py-3 text-start">{t("promotions.active")}</th></tr></thead><tbody>{items.map((item) => <tr key={item.id} className="border-b border-line last:border-0"><td className="px-4 py-3 font-mono font-bold text-accent">{item.code}</td><td className="px-4 py-3">{item.amount}{item.type === "PERCENT" ? "%" : " ₺"}</td><td className="px-4 py-3">{item.minSubtotal.toLocaleString("tr-TR")} ₺</td><td className="px-4 py-3">{item.usedCount} / {item.maxUses ?? "∞"}</td><td className="px-4 py-3"><button type="button" onClick={() => toggle(item)} className={`rounded-full px-3 py-1 text-xs font-semibold ${item.isActive ? "bg-success/15 text-success" : "bg-danger/15 text-danger"}`}>{item.isActive ? "✓" : "—"}</button></td></tr>)}</tbody></table></div>
    </div>
  );
}
