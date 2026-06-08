import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BRANDS, getModel } from "@/lib/data/brands";
import { LOCALES } from "@/lib/i18n/config";
import ProductPageClient from "@/components/shop/ProductPageClient";
import { getPublicModel } from "@/lib/catalog/public";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    BRANDS.flatMap((b) => b.models.map((m) => ({ locale, brand: b.slug, model: m.slug })))
  );
}

export function generateMetadata({ params }: { params: { brand: string; model: string } }): Metadata {
  const data = getModel(params.brand, params.model);
  if (!data) return { title: "LORS" };
  const title = `${data.brand.name} ${data.model.name} — LORS OTO PASPAS`;
  return {
    title,
    description: `${data.brand.name} ${data.model.name} (${data.model.years}) — premium custom car mats by LORS.`,
  };
}

export default async function ProductPage({ params }: { params: { brand: string; model: string } }) {
  const data = await getPublicModel(params.brand, params.model);
  if (!data) notFound();
  return <ProductPageClient brand={data.brand} model={data.model} />;
}
