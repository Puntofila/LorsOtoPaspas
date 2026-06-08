"use client";

import { useT } from "@/lib/i18n/LanguageProvider";
import Reveal from "@/components/ui/Reveal";

const STEPS = [
  { n: "01", titleKey: "process.s1.title", descKey: "process.s1.desc" },
  { n: "02", titleKey: "process.s2.title", descKey: "process.s2.desc" },
  { n: "03", titleKey: "process.s3.title", descKey: "process.s3.desc" },
  { n: "04", titleKey: "process.s4.title", descKey: "process.s4.desc" },
];

export default function Process() {
  const { t } = useT();
  return (
    <section className="container-app py-16 md:py-24">
      <Reveal>
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">{t("process.eyebrow")}</span>
          <h2 className="section-title mt-3">{t("process.title")}</h2>
          <p className="mt-3 text-fg-soft">{t("process.subtitle")}</p>
        </div>
      </Reveal>

      <div className="relative mt-14">
        {/* connecting line */}
        <div
          className="pointer-events-none absolute inset-x-0 top-7 hidden h-px bg-gradient-to-r from-accent/0 via-accent/40 to-accent-2/0 md:block"
          aria-hidden
        />
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 90}>
              <div className="relative border-t border-line pt-7">
                <div className="grid h-14 w-14 place-items-center rounded-2xl border border-line-strong bg-bg-elevated shadow-card">
                  <span className="gradient-text font-display text-xl font-bold">{s.n}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold">{t(s.titleKey)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-soft">{t(s.descKey)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
