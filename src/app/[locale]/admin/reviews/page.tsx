import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import AdminReviewsClient from "@/components/admin/AdminReviewsClient";

export default async function AdminReviewsPage({ params }: { params: { locale: string } }) {
  await requireRole(params.locale, ["DIRECTOR"]);
  const reviews = await prisma.review.findMany({ orderBy: { createdAt: "desc" } });
  return <AdminReviewsClient locale={params.locale} initial={reviews.map((review) => ({ ...review, createdAt: review.createdAt.toISOString(), updatedAt: review.updatedAt.toISOString() }))} />;
}
