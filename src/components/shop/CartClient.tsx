"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/CartProvider";
import { useT } from "@/lib/i18n/LanguageProvider";
import { useToast } from "@/components/ui/ToastProvider";
import MatPreview from "./MatPreview";

const COLOR_MAP: Record<string, string> = {
  black: "#0f0f10",
  beige: "#d6c4a3",
  gray: "#6b6b6f",
  brown: "#5a3a2a",
  red: "#8a1c1c",
  darkBlue: "#15202b",
  gold: "#c9a44a",
};

export default function CartClient() {
  const { items, remove, setQty, subtotal } = useCart();
  const { t, href } = useT();
  const toast = useToast();

  const handleRemove = (id: string) => {
    remove(id);
    toast.show(t("toast.removed"), "default");
  };

  if (items.length === 0) {
    return (
      <div className="container-app flex flex-col items-center py-24 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-bg-muted text-fg-mute">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
          </svg>
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold">{t("cart.title")}</h1>
        <p className="mt-3 text-fg-soft">{t("cart.empty")}</p>
        <Link href={href("/shop")} className="btn-primary mt-6">{t("cart.continue")} →</Link>
      </div>
    );
  }

  return (
    <div className="container-app py-10 md:py-14">
      <h1 className="font-display text-3xl font-bold md:text-4xl">{t("cart.title")}</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map((it) => (
            <div key={it.id} className="card flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap">
              <div className="h-24 w-24 flex-none">
                <MatPreview
                  color={COLOR_MAP[it.color] ?? "#0f0f10"}
                  piping={COLOR_MAP[it.piping] ?? "#c9a44a"}
                  className="h-full w-full"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold">{it.brandName} {it.modelName}</div>
                <div className="text-xs text-fg-mute">
                  {it.years}{it.bodyType ? ` · ${it.bodyType}` : ""}
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5 text-[11px]">
                  <Tag>{t(`set.${it.setType}`)}</Tag>
                  <Tag>{t(`color.${it.color}`)}</Tag>
                  <Tag>{t(`color.${it.piping}`)}</Tag>
                  <Tag>{t(`logo.${it.logo}`)}</Tag>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center rounded-full border border-line">
                  <button type="button" onClick={() => setQty(it.id, it.qty - 1)} className="px-3 py-1.5">−</button>
                  <span className="w-8 text-center text-sm">{it.qty}</span>
                  <button type="button" onClick={() => setQty(it.id, it.qty + 1)} className="px-3 py-1.5">+</button>
                </div>
                <div className="w-24 text-end text-sm font-semibold">
                  {(it.unitPrice * it.qty).toLocaleString("tr-TR")} ₺
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(it.id)}
                  className="grid h-8 w-8 flex-none place-items-center rounded-full text-fg-mute transition hover:bg-danger/10 hover:text-danger"
                  aria-label={t("cart.remove")}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="surface h-fit p-6 lg:sticky lg:top-24">
          <Row label={t("cart.subtotal")} value={`${subtotal.toLocaleString("tr-TR")} ₺`} />
          <Row label={t("cart.shipping")} value={t("cart.free")} muted />
          <div className="my-4 h-px bg-line" />
          <Row label={t("cart.total")} value={`${subtotal.toLocaleString("tr-TR")} ₺`} bold />
          <Link href={href("/checkout")} className="btn-primary mt-6 flex w-full justify-center py-3.5">
            {t("cart.checkout")} →
          </Link>
          <Link href={href("/shop")} className="mt-3 block text-center text-xs text-fg-mute hover:text-fg">
            {t("cart.continue")}
          </Link>
          <div className="mt-5 flex flex-wrap justify-center gap-2 border-t border-line pt-5">
            <span className="pill text-[10px]">🔒 {t("trust.secure")}</span>
            <span className="pill text-[10px]">⚡ {t("trust.fast")}</span>
            <span className="pill text-[10px]">🛡 {t("trust.warranty")}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-bg-subtle px-2 py-0.5 text-fg-soft">{children}</span>;
}

function Row({ label, value, bold, muted }: { label: string; value: string; bold?: boolean; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className={muted ? "text-fg-mute" : "text-fg-soft"}>{label}</span>
      <span className={bold ? "text-lg font-bold" : "font-medium"}>{value}</span>
    </div>
  );
}
