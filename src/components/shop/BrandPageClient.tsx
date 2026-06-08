"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Brand } from "@/lib/data/brands";
import BrandLogo from "./BrandLogo";
import MatPreview from "./MatPreview";
import { useT } from "@/lib/i18n/LanguageProvider";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Reveal from "@/components/ui/Reveal";

export default function BrandPageClient({ brand }: { brand: Brand }) {
  const { t, href } = useT();
  const [q, setQ] = useState("");

  const models = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return brand.models;
    return brand.models.filter((m) => m.name.toLowerCase().includes(s));
  }, [brand, q]);

  return (
    <div className="container-app py-10 md:py-14">
      <Breadcrumbs
        items={[
          { label: t("brands.title"), href: href("/shop") },
          { label: brand.name },
        ]}
      />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <BrandLogo slug={brand.slug} name={brand.name} className="h-20 w-20" />
          <div>
            <h1 className="font-display text-3xl font-bold md:text-4xl">{brand.name}</h1>
            <p className="mt-1 text-fg-soft">{t("models.subtitle")}</p>
          </div>
        </div>
        <span className="badge">{brand.models.length} {t("brands.modelsCount")}</span>
      </div>

      <div className="mt-8 max-w-md">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("models.searchPlaceholder")}
          className="input"
          aria-label={t("models.searchPlaceholder")}
        />
      </div>

      {models.length === 0 ? (
        <EmptyState onReset={() => setQ("")} />
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {models.map((model, i) => {
            const flags: string[] = [];
            if (model.has3D) flags.push(t("flag.threeD"));
            if (model.hasTrunk) flags.push(t("flag.trunk"));
            if (model.tekParca) flags.push(t("flag.onePiece"));
            return (
              <Reveal key={model.slug} delay={Math.min(i, 8) * 45}>
                <Link
                  href={href(`/shop/${brand.slug}/${model.slug}`)}
                  className="card card-hover group flex h-full flex-col p-5 hover:shadow-glow"
                >
                  <MatPreview
                    color="#10151f"
                    piping="#2563eb"
                    brandName={brand.name}
                    className="aspect-[4/3]"
                  />
                  <div className="mt-4 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate font-semibold">{brand.name} {model.name}</div>
                      <div className="text-xs text-fg-mute">{t("models.years")}: {model.years}</div>
                    </div>
                    <span className="pill flex-none text-[10px]">{t("product.fastShip")}</span>
                  </div>
                  {(model.bodyType || flags.length > 0) && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {model.bodyType && <span className="pill text-[10px]">{model.bodyType}</span>}
                      {flags.map((f) => (
                        <span key={f} className="badge text-[10px]">{f}</span>
                      ))}
                    </div>
                  )}
                </Link>
              </Reveal>
            );
          })}
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
      <p className="mt-4 font-medium">{t("models.empty")}</p>
      <button type="button" onClick={onReset} className="btn-ghost mt-3">
        {t("empty.reset")}
      </button>
    </div>
  );
}
