import type { Metadata } from "next";
import { isLocale } from "@/lib/i18n/config";
import { translator } from "@/lib/i18n/dictionaries";
import ShopClient from "@/components/shop/ShopClient";
import { getPublicBrands } from "@/lib/catalog/public";

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = isLocale(params.locale) ? params.locale : "tr";
  const t = translator(locale);
  return { title: `${t("brands.title")} — LORS OTO PASPAS`, description: t("models.subtitle") };
}

export default async function ShopPage() {
  return <ShopClient brands={await getPublicBrands()} />;
}
