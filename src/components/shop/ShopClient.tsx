"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Brand } from "@/lib/data/brands";
import BrandLogo from "./BrandLogo";
import { useT } from "@/lib/i18n/LanguageProvider";
import Reveal from "@/components/ui/Reveal";

export default function ShopClient({ brands }: { brands: Brand[] }) {
  const { t, href } = useT();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return brands;
    return brands.filter((b) => b.name.toLowerCase().includes(s));
  }, [brands, q]);

  const alphabetMap = useMemo(() => {
    const map = new Map<string, Brand[]>();
    for (const b of filtered) {
      const letter = b.name.charAt(0).toUpperCase();
      if (!map.has(letter)) map.set(letter, []);
      map.get(letter)!.push(b);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <div className="container-app py-10 md:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">{t("brands.productSearch")}</span>
          <h1 className="section-title mt-3">{t("brands.title")}</h1>
        </div>
        <span className="badge">{brands.length} {t("brands.brandsCount")}</span>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative w-full max-w-md">
          <SearchIcon />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("brands.searchPlaceholder")}
            className="input ps-10"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState onReset={() => setQ("")} />
      ) : (
        <div className="mt-10 space-y-12">
          {alphabetMap.map(([letter, group]) => (
            <div key={letter}>
              <div className="sticky top-16 z-10 mb-4 flex items-baseline gap-3 bg-bg/80 py-2 backdrop-blur">
                <span className="font-display text-3xl font-bold text-fg-mute">{letter}</span>
                <span className="h-px flex-1 bg-line" />
                <span className="text-xs text-fg-mute">{group.length}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {group.map((brand, i) => (
                  <Reveal key={brand.slug} delay={Math.min(i, 6) * 45}>
                    <Link
                      href={href(`/shop/${brand.slug}`)}
                      className="card card-hover group flex h-full flex-col items-center p-5 hover:shadow-glow"
                    >
                      <BrandLogo slug={brand.slug} name={brand.name} className="h-20 w-20" />
                      <div className="mt-3 text-xs font-bold uppercase tracking-wider">{brand.name}</div>
                      <div className="mt-2">
                        <span className="badge">
                          {brand.models.length} {t("brands.modelsCount")}
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  const { t } = useT();
  return (
    <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-line py-16 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-bg-muted text-fg-mute">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
      <p className="mt-4 font-medium">{t("empty.noResults")}</p>
      <p className="mt-1 text-sm text-fg-mute">{t("empty.noResultsDesc")}</p>
      <button type="button" onClick={onReset} className="btn-ghost mt-3">
        {t("empty.reset")}
      </button>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-fg-mute"
    >
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}
