"use client";

import { useT } from "@/lib/i18n/LanguageProvider";
import MatPreview from "@/components/shop/MatPreview";
import Reveal from "@/components/ui/Reveal";
import Banner from "@/components/ui/Banner";

export default function Showcase() {
  const { t } = useT();
  return (
    <section className="border-y border-line bg-bg-subtle py-16 md:py-24">
      <div className="container-app grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal>
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-fg">
              <span className="h-px w-8 bg-accent" />
              {t("why.title")}
            </span>
            <h2 className="section-title mt-3 text-4xl md:text-5xl">{t("product.spec.fitVal")}</h2>
            <p className="mt-5 max-w-md text-base font-medium leading-relaxed text-fg-soft md:text-lg">{t("modern.c1.desc")}</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <Bullet>{t("why.p1")}</Bullet>
              <Bullet>{t("why.p2")}</Bullet>
              <Bullet>{t("why.p3")}</Bullet>
              <Bullet>{t("why.p4")}</Bullet>
            </ul>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <Banner
            src="/banners/showcase-1.jpg"
            alt={t("product.spec.fitVal")}
            overlayPreset="soft"
            overlay={0.18}
            objectPosition="center"
            childrenAsFallback
            className="aspect-[4/3] w-full rounded-[1.75rem] border border-line-strong shadow-[0_28px_70px_-38px_rgb(0_0_0/0.7)]"
          >
            {/* fallback content: a styled mat preview when no photo is present */}
            <div className="grid h-full place-items-center p-8">
              <div className="w-2/3 max-w-[260px] drop-shadow-2xl">
                <MatPreview color="#0f0f10" piping="#d6b26e" brandName="LORS" className="aspect-[4/5]" />
              </div>
            </div>
          </Banner>
        </Reveal>
      </div>
    </section>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 rounded-xl border border-line bg-bg-elevated/75 p-3.5 text-fg-soft shadow-card">
      <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-accent text-accent-fg">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      <span className="text-base">{children}</span>
    </li>
  );
}
