import type { Metadata } from "next";
import { isLocale } from "@/lib/i18n/config";
import { translator } from "@/lib/i18n/dictionaries";
import Hero from "@/components/home/Hero";
import FeaturedBrands from "@/components/home/FeaturedBrands";
import StatsBand from "@/components/home/StatsBand";
import Showcase from "@/components/home/Showcase";
import Process from "@/components/home/Process";
import Testimonials from "@/components/home/Testimonials";
import FAQTeaser from "@/components/home/FAQTeaser";
import { getPublicBrands } from "@/lib/catalog/public";

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = isLocale(params.locale) ? params.locale : "tr";
  const t = translator(locale);
  return {
    title: "LORS OTO PASPAS — " + t("hero.eyebrow"),
    description: t("hero.subtitle"),
    alternates: {
      languages: {
        tr: "/tr",
        ru: "/ru",
        en: "/en",
        ar: "/ar",
      },
    },
  };
}

export default async function HomePage({ params }: { params: { locale: string } }) {
  const brands = await getPublicBrands();
  const locale = isLocale(params.locale) ? params.locale : "tr";
  return (
    <>
      <Hero />
      <FeaturedBrands brands={brands} />
      <StatsBand />
      <Showcase />
      <Process />
      <Testimonials locale={locale} />
      <FAQTeaser />
    </>
  );
}
