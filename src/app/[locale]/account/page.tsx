import Link from "next/link";
import { requireUser } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import { translator } from "@/lib/i18n/dictionaries";
import { Locale } from "@/lib/i18n/config";

const STATUS_BADGE: Record<string, string> = {
  PENDING: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  CONFIRMED: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  PRODUCTION: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  SHIPPED: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  DELIVERED: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  CANCELLED: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
};

export default async function AccountPage({ params }: { params: { locale: string } }) {
  const user = await requireUser(params.locale);
  const t = translator(params.locale as Locale);

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
    take: 50,
  });

  return (
    <div className="container-app py-10 md:py-14">
      <h1 className="font-display text-3xl font-bold md:text-4xl">{t("nav.account")}</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="card h-fit p-6">
          <div className="text-sm font-semibold">{user.name ?? "—"}</div>
          <div className="mt-1 truncate text-xs text-fg-mute">{user.email}</div>
          <div className="mt-3 inline-block rounded-full bg-bg-muted px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-fg-soft">
            {user.role}
          </div>
          <div className="mt-6 grid gap-2 text-sm">
            <Link href={`/${params.locale}/shop`} className="link-soft">{t("nav.shop")}</Link>
            <Link href={`/${params.locale}/cart`} className="link-soft">{t("nav.cart")}</Link>
          </div>
        </aside>

        <section>
          <h2 className="text-lg font-semibold">{t("cart.title")}</h2>
          {orders.length === 0 ? (
            <div className="card mt-4 p-8 text-center text-fg-mute">—</div>
          ) : (
            <div className="mt-4 space-y-3">
              {orders.map((o) => (
                <div key={o.id} className="card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-mono text-sm font-semibold">#{o.number}</div>
                      <div className="text-xs text-fg-mute">
                        {new Date(o.createdAt).toLocaleString(params.locale)}
                      </div>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${STATUS_BADGE[o.status] ?? "bg-bg-muted text-fg-soft"}`}>
                      {o.status}
                    </span>
                  </div>
                  <ul className="mt-3 space-y-1 text-sm text-fg-soft">
                    {o.items.map((it) => (
                      <li key={it.id} className="flex justify-between gap-3">
                        <span className="truncate">{it.brandName} {it.modelName} × {it.qty}</span>
                        <span>{(it.unitPrice * it.qty).toLocaleString("tr-TR")} ₺</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-sm">
                    <span className="text-fg-mute">{t("cart.total")}</span>
                    <span className="font-semibold">{o.total.toLocaleString("tr-TR")} ₺</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
