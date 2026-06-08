import Link from "next/link";
import { requireRole } from "@/lib/auth/guards";
import { adminTranslator } from "@/lib/admin/i18n";
import type { Locale } from "@/lib/i18n/config";
import BrandMark from "@/components/layout/BrandMark";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const user = await requireRole(params.locale, ["DIRECTOR", "STAFF"]);
  const t = adminTranslator(params.locale as Locale);
  const base = `/${params.locale}/admin`;
  return (
    <div className="container-app py-8 md:py-12">
      <div className="grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="card h-fit p-4 lg:sticky lg:top-24">
          <div className="px-3 py-2"><BrandMark /></div>
          <div className="mt-4 rounded-xl border border-line bg-bg-subtle px-3 py-3">
            <div className="text-sm font-semibold">{user.name ?? user.email}</div>
            <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
              {t(`role.${user.role}`)}
            </span>
          </div>
          <nav className="mt-4 grid gap-1 text-sm">
            <AdminLink href={base}>{t("nav.dashboard")}</AdminLink>
            <AdminLink href={`${base}/orders`}>{t("nav.orders")}</AdminLink>
            {user.role === "DIRECTOR" && (
              <>
                <AdminLink href={`${base}/users`}>{t("nav.people")}</AdminLink>
                <AdminLink href={`${base}/promotions`}>{t("nav.promotions")}</AdminLink>
                <AdminLink href={`${base}/archive`}>{t("nav.archive")}</AdminLink>
                <AdminLink href={`${base}/reviews`}>{t("nav.reviews")}</AdminLink>
              </>
            )}
            <AdminLink href={`${base}/catalog`}>{t("nav.catalog")}</AdminLink>
          </nav>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}

function AdminLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="rounded-xl border border-transparent px-3 py-2.5 font-medium text-fg-soft transition hover:border-line hover:bg-bg-muted hover:text-fg">{children}</Link>;
}
