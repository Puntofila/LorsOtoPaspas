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

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <Reveal key={s.n} delay={i * 90}>
            <div className="group h-full rounded-2xl border border-line bg-bg-elevated/70 p-6 shadow-card backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-glow-sm">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 flex-none place-items-center rounded-xl border border-accent/30 bg-gradient-to-br from-accent/20 via-bg-elevated to-transparent">
                  <span className="gradient-text font-display text-lg font-bold">{s.n}</span>
                </div>
                <span className="h-px flex-1 bg-gradient-to-r from-accent/30 to-transparent" aria-hidden />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{t(s.titleKey)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-soft">{t(s.descKey)}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
