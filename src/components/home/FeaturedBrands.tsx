"use client";

import Link from "next/link";
import type { Brand } from "@/lib/data/brands";
import BrandLogo from "@/components/shop/BrandLogo";
import { useT } from "@/lib/i18n/LanguageProvider";
import Reveal from "@/components/ui/Reveal";
import BrandMarquee from "@/components/home/BrandMarquee";

const FEATURED = [
  "bmw", "audi", "mercedes-benz", "volkswagen",
  "porsche", "toyota", "ford", "tesla",
];

export default function FeaturedBrands({ brands }: { brands: Brand[] }) {
  const { t, href } = useT();
  const featured = FEATURED.map((s) => brands.find((b) => b.slug === s)).filter((b): b is NonNullable<typeof b> => !!b);

  return (
    <section className="border-b border-line bg-bg pt-16 md:pt-24">
      <div className="container-app">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="eyebrow">{t("brands.featuredTitle")}</span>
              <h2 className="section-title mt-3 text-4xl md:text-5xl">{t("brands.title")}</h2>
            </div>
            <Link href={href("/shop")} className="hidden link-soft text-sm font-medium md:inline-flex">
              {t("models.all")} →
            </Link>
          </div>
        </Reveal>

        <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {featured.map((brand, i) => (
            <Reveal key={brand.slug} delay={Math.min(i, 4) * 70}>
              <Link
                href={href(`/shop/${brand.slug}`)}
                className="card card-hover group flex h-full min-h-40 flex-col items-center justify-center p-4 hover:border-accent/60 hover:shadow-glow"
              >
                <BrandLogo slug={brand.slug} name={brand.name} className="h-14 w-14" />
                <div className="mt-4 text-center text-[11px] font-bold uppercase tracking-wider">{brand.name}</div>
                <div className="mt-1.5 text-[11px] font-medium text-fg-mute">
                  {brand.models.length} {t("brands.modelsCount")}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-14 md:mt-20">
        <BrandMarquee brands={brands} />
      </div>
    </section>
  );
}
