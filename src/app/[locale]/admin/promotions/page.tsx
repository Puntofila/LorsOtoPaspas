import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import AdminPromotionsClient from "@/components/admin/AdminPromotionsClient";

export default async function PromotionsPage({ params }: { params: { locale: string } }) {
  await requireRole(params.locale, ["DIRECTOR"]);
  const rows = await prisma.promotionCode.findMany({ orderBy: { createdAt: "desc" } });
  return <AdminPromotionsClient locale={params.locale} initial={rows.map((row) => ({ ...row, createdAt: row.createdAt.toISOString(), startsAt: row.startsAt?.toISOString() ?? null, endsAt: row.endsAt?.toISOString() ?? null }))} />;
}
