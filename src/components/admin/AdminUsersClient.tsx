"use client";

import { useMemo, useState, useTransition } from "react";
import { adminTranslator } from "@/lib/admin/i18n";
import type { Locale } from "@/lib/i18n/config";
import Avatar from "@/components/ui/Avatar";

type User = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  phone: string | null;
  commissionRate: number;
  isActive: boolean;
  primaryBranchId: string | null;
  createdAt: string;
  ordersCount: number;
};

const ROLES = ["CUSTOMER", "STAFF", "DIRECTOR"] as const;
const CREATE_ROLES = ["CUSTOMER", "STAFF"] as const;

export default function AdminUsersClient({ initial, locale, branches }: { initial: User[]; locale: string; branches: { id: string; shortName: string }[] }) {
  const t = adminTranslator(locale as Locale);
  const [users, setUsers] = useState(initial);
  const [q, setQ] = useState("");
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const value = q.trim().toLowerCase();
    if (!value) return users;
    return users.filter((user) => `${user.email} ${user.name ?? ""} ${user.phone ?? ""}`.toLowerCase().includes(value));
  }, [users, q]);

  const updateUser = (id: string, data: Partial<Pick<User, "role" | "commissionRate" | "isActive" | "primaryBranchId">>) => {
    const previous = users;
    setUsers((current) => current.map((user) => user.id === id ? { ...user, ...data } : user));
    startTransition(async () => {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) setUsers(previous);
    });
  };

  const createUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries())),
    });
    if (response.ok) {
      const { user } = await response.json();
      setUsers((current) => [{ ...user, createdAt: user.createdAt, ordersCount: user._count?.orders ?? 0 }, ...current]);
      setCreating(false);
    } else {
      const body = await response.json().catch(() => ({}));
      setError(body.error ?? "save_failed");
    }
    setBusy(false);
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">{t("people.title")}</h1>
          <p className="mt-2 max-w-2xl text-sm text-fg-soft">{t("people.subtitle")}</p>
        </div>
        <button type="button" onClick={() => setCreating((value) => !value)} className="btn-primary">
          {creating ? t("common.cancel") : t("people.new")}
        </button>
      </div>

      {creating && (
        <form onSubmit={createUser} className="card mt-6 grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <input name="name" required placeholder={t("people.name")} className="input" />
          <input name="email" required type="email" placeholder={t("people.email")} className="input" />
          <input name="phone" placeholder={t("people.phone")} className="input" />
          <input name="password" required type="password" minLength={8} placeholder={t("people.password")} className="input" />
          <select name="role" defaultValue="CUSTOMER" className="input">
            {CREATE_ROLES.map((role) => <option key={role} value={role}>{t(`role.${role}`)}</option>)}
          </select>
          <input name="commissionRate" type="number" min="0" max="100" defaultValue="0" placeholder="%" className="input" />
          <select name="primaryBranchId" defaultValue="" className="input">
            <option value="">—</option>
            {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.shortName}</option>)}
          </select>
          <button type="submit" disabled={busy} className="btn-primary disabled:opacity-60">{busy ? "..." : t("common.save")}</button>
          {error && <p className="text-sm text-danger sm:col-span-2 lg:col-span-3">{error}</p>}
        </form>
      )}

      <div className="mt-6">
        <input value={q} onChange={(event) => setQ(event.target.value)} placeholder={t("people.search")} className="input max-w-md" />
      </div>

      <div className="card mt-6 overflow-x-auto">
          <table className="w-full min-w-[1050px] text-sm">
          <thead className="border-b border-line bg-bg-subtle text-xs uppercase tracking-wider text-fg-mute">
            <tr>
              <th className="px-4 py-3 text-start font-medium">{t("people.name")}</th>
              <th className="px-4 py-3 text-start font-medium">{t("people.email")}</th>
              <th className="px-4 py-3 text-start font-medium">{t("people.type")}</th>
              <th className="px-4 py-3 text-start font-medium">%</th>
              <th className="px-4 py-3 text-start font-medium">{t("orders.branch")}</th>
              <th className="px-4 py-3 text-start font-medium">{t("common.status")}</th>
              <th className="px-4 py-3 text-end font-medium">{t("people.orders")}</th>
              <th className="px-4 py-3 text-end font-medium">{t("people.joined")}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={user.name} email={user.email} size="sm" />
                    <span><span className="block font-medium">{user.name ?? "—"}</span><span className="block text-xs text-fg-mute">{user.phone ?? "—"}</span></span>
                  </div>
                </td>
                <td className="px-4 py-3 text-fg-soft">{user.email}</td>
                <td className="px-4 py-3">
                  <select value={user.role} onChange={(event) => updateUser(user.id, { role: event.target.value })} className="rounded-full border border-line bg-bg-elevated px-3 py-1 text-xs font-semibold outline-none">
                    {ROLES.map((role) => <option key={role} value={role}>{t(`role.${role}`)}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3"><input type="number" min="0" max="100" defaultValue={user.commissionRate} onBlur={(event) => updateUser(user.id, { commissionRate: Number(event.target.value) })} className="input w-20 py-2" /></td>
                <td className="px-4 py-3"><select value={user.primaryBranchId ?? ""} onChange={(event) => updateUser(user.id, { primaryBranchId: event.target.value || null })} className="input min-w-40 py-2"><option value="">—</option>{branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.shortName}</option>)}</select></td>
                <td className="px-4 py-3"><button type="button" onClick={() => updateUser(user.id, { isActive: !user.isActive })} className={`rounded-full px-3 py-1 text-xs font-semibold ${user.isActive ? "bg-success/15 text-success" : "bg-danger/15 text-danger"}`}>{user.isActive ? "Active" : "Disabled"}</button></td>
                <td className="px-4 py-3 text-end">{user.ordersCount}</td>
                <td className="px-4 py-3 text-end text-fg-mute">{new Date(user.createdAt).toLocaleDateString(locale)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="p-12 text-center text-fg-mute">—</div>}
      </div>
    </div>
  );
}
