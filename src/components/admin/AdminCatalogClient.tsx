"use client";

import { useMemo, useState } from "react";
import { adminTranslator } from "@/lib/admin/i18n";
import { CATALOG_STATUSES, normalizeCatalogStatus } from "@/lib/catalog/status";
import type { Locale } from "@/lib/i18n/config";

type Entry = {
  id: string | null;
  brandSlug: string;
  brandName: string;
  modelSlug: string;
  modelName: string;
  status: string;
  note: string | null;
};

const PAGE_SIZE = 40;
const STATUS_STYLE: Record<string, string> = {
  AVAILABLE: "bg-success/15 text-success",
  OUT_OF_STOCK: "bg-amber-500/15 text-amber-300",
  NOT_OFFERED: "bg-danger/15 text-danger",
};

export default function AdminCatalogClient({ initial, canEdit, locale }: { initial: Entry[]; canEdit: boolean; locale: string }) {
  const t = adminTranslator(locale as Locale);
  const [entries, setEntries] = useState(initial.map((entry) => ({ ...entry, status: normalizeCatalogStatus(entry.status) })));
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    return entries.filter((entry) => {
      if (filter !== "ALL" && entry.status !== filter) return false;
      return !value || `${entry.brandName} ${entry.modelName} ${entry.note ?? ""}`.toLowerCase().includes(value);
    });
  }, [entries, filter, query]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((Math.min(page, pageCount) - 1) * PAGE_SIZE, Math.min(page, pageCount) * PAGE_SIZE);

  const update = async (entry: Entry, data: { status?: string; note?: string }) => {
    const key = `${entry.brandSlug}:${entry.modelSlug}`;
    if (saving === key) return;
    const previous = entries;
    setSaving(key);
    setSaved(null);
    setEntries((current) => current.map((item) => item.brandSlug === entry.brandSlug && item.modelSlug === entry.modelSlug ? { ...item, ...data, status: data.status ? normalizeCatalogStatus(data.status) : item.status } : item));
    const response = await fetch(entry.id ? `/api/admin/catalog/${entry.id}` : "/api/admin/catalog", {
      method: entry.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...entry, ...data }),
    });
    if (response.ok) {
      const { entry: savedEntry } = await response.json();
      setEntries((current) => current.map((item) => item.brandSlug === entry.brandSlug && item.modelSlug === entry.modelSlug ? { ...item, id: savedEntry.id, status: normalizeCatalogStatus(savedEntry.status), note: savedEntry.note } : item));
      setSaved(key);
    } else {
      setEntries(previous);
    }
    window.setTimeout(() => {
      setSaving(null);
      setSaved(null);
    }, 2000);
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">{t("catalog.title")}</h1>
          <p className="mt-2 max-w-2xl text-sm text-fg-soft">{t("catalog.subtitle")}</p>
        </div>
        <div className="text-sm text-fg-mute">{filtered.length} {t("dashboard.models")}</div>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {CATALOG_STATUSES.map((item) => (
          <div key={item} className="rounded-xl border border-line bg-bg-elevated p-4">
            <div className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[item]}`}>{t(`catalog.status.${item}`)}</div>
            <p className="mt-2 text-xs leading-relaxed text-fg-soft">{t(`catalog.help.${item}`)}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder={t("common.search")} className="input max-w-md" />
        <select value={filter} onChange={(event) => { setFilter(event.target.value); setPage(1); }} className="input max-w-xs">
          <option value="ALL">{t("common.all")}</option>
          {CATALOG_STATUSES.map((item) => <option key={item} value={item}>{t(`catalog.status.${item}`)}</option>)}
        </select>
      </div>
      <div className="card mt-6 overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="border-b border-line bg-bg-subtle text-xs uppercase tracking-wider text-fg-mute">
            <tr><th className="px-4 py-3 text-start font-medium">{t("catalog.brand")}</th><th className="px-4 py-3 text-start font-medium">{t("catalog.model")}</th><th className="px-4 py-3 text-start font-medium">{t("common.status")}</th><th className="px-4 py-3 text-start font-medium">{t("common.note")}</th></tr>
          </thead>
          <tbody>
            {visible.map((entry) => {
              const key = `${entry.brandSlug}:${entry.modelSlug}`;
              return (
                <tr key={key} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-medium">{entry.brandName}</td>
                  <td className="px-4 py-3 text-fg-soft">{entry.modelName}</td>
                  <td className="px-4 py-3">
                    {canEdit ? <select disabled={saving === key} value={entry.status} onChange={(event) => update(entry, { status: event.target.value })} className={`rounded-full px-2.5 py-1 text-xs font-semibold disabled:opacity-60 ${STATUS_STYLE[entry.status]}`}>{CATALOG_STATUSES.map((item) => <option key={item} value={item}>{t(`catalog.status.${item}`)}</option>)}</select> : <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[entry.status]}`}>{t(`catalog.status.${entry.status}`)}</span>}
                    <span className="ms-2 text-[10px] text-fg-mute">{saving === key ? "…" : saved === key ? "✓" : ""}</span>
                  </td>
                  <td className="px-4 py-3">{canEdit ? <input defaultValue={entry.note ?? ""} onBlur={(event) => event.target.value !== (entry.note ?? "") && update(entry, { note: event.target.value })} className="input py-2" /> : entry.note ?? "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 text-sm text-fg-soft">
        <button type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="btn-secondary disabled:opacity-40">←</button>
        <span>{Math.min(page, pageCount)} / {pageCount}</span>
        <button type="button" disabled={page >= pageCount} onClick={() => setPage((value) => value + 1)} className="btn-secondary disabled:opacity-40">→</button>
      </div>
    </div>
  );
}
