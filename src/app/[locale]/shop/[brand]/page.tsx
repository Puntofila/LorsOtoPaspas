import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BRANDS, getBrand } from "@/lib/data/brands";
import { LOCALES, isLocale } from "@/lib/i18n/config";
import { translator } from "@/lib/i18n/dictionaries";
import BrandPageClient from "@/components/shop/BrandPageClient";
import { getPublicBrand } from "@/lib/catalog/public";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => BRANDS.map((b) => ({ locale, brand: b.slug })));
}

export function generateMetadata({ params }: { params: { locale: string; brand: string } }): Metadata {
  const brand = getBrand(params.brand);
  if (!brand) return { title: "LORS" };
  const locale = isLocale(params.locale) ? params.locale : "tr";
  const t = translator(locale);
  return {
    title: `${brand.name} — LORS OTO PASPAS`,
    description: `${brand.name} ${t("models.subtitle")}`,
  };
}

export default async function BrandPage({ params }: { params: { brand: string } }) {
  const brand = await getPublicBrand(params.brand);
  if (!brand) notFound();
  return <BrandPageClient brand={brand} />;
}
