import type { Metadata } from "next";
import { isLocale } from "@/lib/i18n/config";
import { getContent } from "@/content/pages";
import ContentPage from "@/components/pages/ContentPage";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = isLocale(params.locale) ? params.locale : "tr";
  const page = getContent("shipping", locale);
  return { title: `${page.title} — LORS OTO PASPAS`, description: page.intro };
}

export default function ShippingPage() {
  return <ContentPage slug="shipping" />;
}
