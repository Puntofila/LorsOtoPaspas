"use client";

import Link from "next/link";
import type { Brand } from "@/lib/data/brands";
import BrandLogo from "@/components/shop/BrandLogo";
import { useT } from "@/lib/i18n/LanguageProvider";

// Brands that resolve to a real logo icon look best in the marquee.
const MARQUEE_SLUGS = [
  "bmw", "audi", "mercedes-benz", "volkswagen", "porsche", "ferrari",
  "toyota", "ford", "renault", "hyundai", "kia", "tesla", "honda",
  "nissan", "mazda", "volvo", "peugeot", "fiat", "opel", "skoda",
  "lexus", "jaguar", "land-rover", "mini", "jeep", "lamborghini",
];

export default function BrandMarquee({ brands: publicBrands }: { brands: Brand[] }) {
  const { href } = useT();
  const brands = MARQUEE_SLUGS.map((s) => publicBrands.find((b) => b.slug === s)).filter(
    (b): b is NonNullable<typeof b> => !!b
  );
  const row = [...brands, ...brands];

  return (
    <div
      className="group relative overflow-hidden border-y border-line bg-bg-subtle/50 py-6"
      aria-hidden
    >
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 start-0 z-10 w-20 bg-gradient-to-r from-bg-subtle to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 end-0 z-10 w-20 bg-gradient-to-l from-bg-subtle to-transparent" />
      <div className="flex w-max animate-marquee gap-10 group-hover:[animation-play-state:paused]">
        {row.map((brand, i) => (
          <Link
            key={`${brand.slug}-${i}`}
            href={href(`/shop/${brand.slug}`)}
            className="flex flex-none items-center gap-2.5 opacity-60 transition hover:opacity-100"
            tabIndex={-1}
          >
            <BrandLogo slug={brand.slug} name={brand.name} variant="plain" className="h-7 w-7" />
            <span className="text-sm font-semibold uppercase tracking-wide text-fg-soft">
              {brand.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
