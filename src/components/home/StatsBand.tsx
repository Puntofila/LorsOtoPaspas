"use client";

import { useT } from "@/lib/i18n/LanguageProvider";
import { BRANDS } from "@/lib/data/brands";
import Reveal from "@/components/ui/Reveal";

const brandCount = BRANDS.length;
const modelCount = BRANDS.reduce((sum, b) => sum + b.models.length, 0);
const roundDown = (n: number) => Math.floor(n / 10) * 10;

export default function StatsBand() {
  const { t } = useT();
  const stats = [
    { value: `${roundDown(brandCount)}+`, label: t("stats.brands"), sub: t("stats.brandsSub") },
    { value: `${roundDown(modelCount)}+`, label: t("stats.models"), sub: t("stats.modelsSub") },
    { value: "4", label: t("stats.seasons"), sub: t("stats.seasonsSub") },
    { value: "2", label: t("stats.warranty"), sub: t("stats.warrantySub") },
  ];

  return (
    <section className="container-app py-8 md:py-12">
      <Reveal>
        <div className="dark-panel relative overflow-hidden rounded-[1.75rem] border px-6 py-8 md:px-10 md:py-10">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
            style={{
              backgroundImage:
                "linear-gradient(120deg, rgb(var(--accent)/0.35), transparent 45%), linear-gradient(300deg, rgb(var(--accent-2)/0.30), transparent 45%)",
            }}
          />
          <div className="absolute inset-x-0 top-0 h-px bg-white/20" aria-hidden />
          <div className="relative z-10">
            <div className="max-w-xl">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[rgb(var(--accent-2))]">
                {t("stats.title")}
              </span>
              <p className="dark-panel-muted mt-2">{t("stats.subtitle")}</p>
            </div>
            <div className="mt-9 grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((s, i) => (
                <div key={i}>
                  <div className="font-display text-4xl font-bold leading-none tracking-tight md:text-5xl">
                    {s.value}
                  </div>
                  <div className="mt-2 text-sm font-medium">{s.label}</div>
                  <div className="dark-panel-muted mt-0.5 text-xs">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
