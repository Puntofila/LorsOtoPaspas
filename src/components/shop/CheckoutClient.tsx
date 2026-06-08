"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useCart } from "@/lib/cart/CartProvider";
import { useT } from "@/lib/i18n/LanguageProvider";
import { COMPANY_PROFILE } from "@/lib/site/company-profile";

export default function CheckoutClient() {
  const { items, subtotal, clear } = useCart();
  const { t, href, locale } = useT();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ number: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const idempotencyKey = useRef(`web-${Date.now()}-${Math.random().toString(36).slice(2)}`);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      items: items.map((it) => ({
        brandSlug: it.brandSlug,
        brandName: it.brandName,
        modelSlug: it.modelSlug,
        modelName: it.modelName,
        fullName: it.fullName,
        years: it.years,
        bodyType: it.bodyType,
        pattern: it.pattern ?? "sota",
        material: it.material ?? "hali",
        color: it.color,
        piping: it.piping,
        logo: it.logo,
        customLogoUrl: it.customLogoUrl,
        accessories: it.accessories ?? [],
        setType: it.setType,
        unitPrice: it.unitPrice,
        qty: it.qty,
      })),
      customer: {
        firstName: String(fd.get("firstName") ?? ""),
        lastName: String(fd.get("lastName") ?? ""),
        email: String(fd.get("email") ?? ""),
        phone: String(fd.get("phone") ?? ""),
      },
      branchId: String(fd.get("branchId") ?? ""),
      promotionCode: String(fd.get("promotionCode") ?? ""),
      shipping: {
        province: String(fd.get("province") ?? "İstanbul"),
        district: String(fd.get("district") ?? ""),
        neighborhood: String(fd.get("neighborhood") ?? ""),
        address: String(fd.get("address") ?? ""),
        zip: String(fd.get("zip") ?? ""),
      },
      note: String(fd.get("note") ?? "") || undefined,
      locale,
    };
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": idempotencyKey.current },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "order_failed");
      }
      const { order } = await res.json();
      clear();
      setDone({ number: order.number });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Order failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="container-app py-24 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success/10 text-success text-2xl">✓</div>
        <h1 className="mt-5 font-display text-3xl font-bold">{t("checkout.success")}</h1>
        <p className="mt-2 font-mono text-sm text-fg-mute">#{done.number}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href={href("/")} className="btn-secondary">{t("nav.home")}</Link>
          <Link href={href("/account")} className="btn-primary">{t("nav.account")}</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-app py-20 text-center">
        <p className="text-fg-soft">{t("cart.empty")}</p>
        <Link href={href("/shop")} className="mt-4 inline-flex btn-primary">{t("cart.continue")}</Link>
      </div>
    );
  }

  return (
    <div className="container-app py-10 md:py-14">
      <h1 className="font-display text-3xl font-bold md:text-4xl">{t("checkout.title")}</h1>
      <form onSubmit={submit} className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <Section title={t("checkout.contact")}>
            <Field name="email" type="email" label={t("checkout.email")} required />
            <Field name="phone" label={t("checkout.phone")} required />
          </Section>
          <Section title={t("checkout.shipping")}>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-fg-soft">{t("checkout.branch")} *</span>
              <select name="branchId" required className="input">
                {COMPANY_PROFILE.branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>{branch.shortName}</option>
                ))}
              </select>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="firstName" label={t("checkout.firstName")} required />
              <Field name="lastName" label={t("checkout.lastName")} required />
              <Field name="province" label={t("checkout.province")} defaultValue="İstanbul" required />
              <Field name="district" label={t("checkout.district")} required />
            </div>
            <Field name="neighborhood" label={t("checkout.neighborhood")} />
            <Field name="address" label={t("checkout.address")} required />
            <Field name="zip" label={t("checkout.zip")} />
            <Field name="note" label={t("checkout.note")} textarea />
          </Section>
          {error && (
            <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
          )}
        </div>

        <aside className="card h-fit p-6">
          <div className="mb-3 text-sm font-semibold">{t("cart.title")}</div>
          <ul className="space-y-2 text-sm">
            {items.map((it) => (
              <li key={it.id} className="flex items-start justify-between gap-3">
                <span className="min-w-0">
                  <span className="block truncate font-medium">{it.brandName} {it.modelName}</span>
                  <span className="text-xs text-fg-mute">×{it.qty}</span>
                </span>
                <span className="font-medium">{(it.unitPrice * it.qty).toLocaleString("tr-TR")} ₺</span>
              </li>
            ))}
          </ul>
          <div className="my-4 h-px bg-line" />
          <Row label={t("cart.subtotal")} value={`${subtotal.toLocaleString("tr-TR")} ₺`} />
          <Row label={t("cart.shipping")} value={t("cart.free")} muted />
          <Row label={t("cart.total")} value={`${subtotal.toLocaleString("tr-TR")} ₺`} bold />
          <label className="mt-4 block">
            <span className="mb-1.5 block text-xs font-medium text-fg-soft">{t("checkout.promotion")}</span>
            <input name="promotionCode" className="input uppercase" maxLength={40} />
          </label>
          <button type="submit" disabled={submitting} className="mt-6 flex btn-primary w-full justify-center py-3.5 disabled:opacity-60">
            {submitting ? "..." : t("checkout.placeOrder")}
          </button>
        </aside>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  textarea,
  defaultValue,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-fg-soft">{label}{required && " *"}</span>
      {textarea ? (
        <textarea name={name} required={required} rows={3} className="input resize-none" />
      ) : (
        <input name={name} type={type} required={required} defaultValue={defaultValue} className="input" />
      )}
    </label>
  );
}

function Row({ label, value, bold, muted }: { label: string; value: string; bold?: boolean; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <span className={muted ? "text-fg-mute" : "text-fg-soft"}>{label}</span>
      <span className={bold ? "text-lg font-bold" : "font-medium"}>{value}</span>
    </div>
  );
}
