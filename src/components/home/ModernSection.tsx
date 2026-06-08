"use client";

import { useT } from "@/lib/i18n/LanguageProvider";
import Reveal from "@/components/ui/Reveal";

const ITEMS = [
  { titleKey: "modern.c1.title", descKey: "modern.c1.desc", icon: RulerIcon },
  { titleKey: "modern.c2.title", descKey: "modern.c2.desc", icon: GemIcon },
  { titleKey: "modern.c3.title", descKey: "modern.c3.desc", icon: TruckIcon },
];

export default function ModernSection() {
  const { t } = useT();
  return (
    <section className="container-app py-20 md:py-28">
      <Reveal>
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">{t("hero.eyebrow")}</span>
          <h2 className="section-title mt-3">{t("modern.title")}</h2>
          <p className="mt-3 text-fg-soft">{t("modern.subtitle")}</p>
        </div>
      </Reveal>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {ITEMS.map(({ titleKey, descKey, icon: Icon }, i) => (
          <Reveal key={titleKey} delay={i * 90}>
            <div className="card card-hover group h-full p-7">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent-soft text-accent transition group-hover:scale-105">
                <Icon />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{t(titleKey)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-soft">{t(descKey)}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function RulerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 3 3 21l-2-2L19 1z"/><path d="M7 15l2 2M11 11l2 2M15 7l2 2"/>
    </svg>
  );
}
function GemIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12l4 6-10 12L2 9z"/><path d="M12 22 8 9l4-6 4 6z"/><path d="M2 9h20"/>
    </svg>
  );
}
function TruckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  );
}
