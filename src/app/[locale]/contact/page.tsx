import type { Metadata } from "next";
import { isLocale } from "@/lib/i18n/config";
import { translator } from "@/lib/i18n/dictionaries";
import ContactClient from "@/components/pages/ContactClient";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = isLocale(params.locale) ? params.locale : "tr";
  const t = translator(locale);
  return { title: `${t("contact.title")} — LORS OTO PASPAS`, description: t("contact.subtitle") };
}

export default function ContactPage() {
  return <ContactClient />;
}
