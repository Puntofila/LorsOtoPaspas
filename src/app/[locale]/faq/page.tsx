import type { Metadata } from "next";
import { isLocale } from "@/lib/i18n/config";
import { translator } from "@/lib/i18n/dictionaries";
import FAQClient from "@/components/pages/FAQClient";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = isLocale(params.locale) ? params.locale : "tr";
  const t = translator(locale);
  return { title: `${t("faq.title")} — LORS OTO PASPAS`, description: t("faq.subtitle") };
}

export default function FAQPage() {
  return <FAQClient />;
}
