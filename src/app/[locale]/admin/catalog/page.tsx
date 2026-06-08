import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import AdminCatalogClient from "@/components/admin/AdminCatalogClient";
import { BRANDS } from "@/lib/data/brands";

export default async function AdminCatalogPage({ params }: { params: { locale: string } }) {
  const user = await requireRole(params.locale, ["DIRECTOR", "STAFF"]);
  const rows = await prisma.catalogEntry.findMany({ orderBy: { createdAt: "desc" } });
  const managed = new Map(rows.filter((row) => row.modelSlug).map((row) => [`${row.brandSlug}:${row.modelSlug}`, row]));
  const initial = BRANDS.flatMap((brand) => brand.models.map((model) => {
    const row = managed.get(`${brand.slug}:${model.slug}`);
    return {
      id: row?.id ?? null,
      brandSlug: brand.slug,
      brandName: brand.name,
      modelSlug: model.slug,
      modelName: model.name,
      status: row?.status ?? "AVAILABLE",
      note: row?.note ?? null,
    };
  }));
  return <AdminCatalogClient initial={initial} canEdit={user.role === "DIRECTOR"} locale={params.locale} />;
}
