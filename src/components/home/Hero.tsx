"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/LanguageProvider";
import Banner from "@/components/ui/Banner";

export default function Hero() {
  const { t, href } = useT();
  return (
    <section className="relative">
      <Banner
        src="/banners/hero.jpg"
        mobileSrc="/banners/hero-mobile.jpg"
        alt="LORS premium car mats"
        overlay={0.66}
        overlayPreset="hero"
        objectPosition="100% center"
        mobileObjectPosition="72% center"
        priority
        className="min-h-[520px] w-full md:min-h-[560px] lg:min-h-[600px]"
      >
        <div className="container-app flex min-h-[520px] flex-col justify-end pb-12 pt-24 text-[rgb(var(--dark-fg))] md:min-h-[560px] md:justify-center md:py-16 lg:min-h-[600px]">
          <div className="max-w-[580px]">
            <span className="inline-flex max-w-full flex-wrap items-center gap-2 text-[10px] font-semibold uppercase leading-relaxed tracking-[0.16em] text-[rgb(var(--accent-2))] md:text-xs md:tracking-[0.26em]">
              <span className="h-px w-8 bg-[rgb(var(--gold))]" />
              {t("hero.eyebrow")}
            </span>
            <h1 className="mt-5 max-w-full break-words font-display text-[2.35rem] font-bold leading-[1.02] tracking-tight sm:text-6xl md:mt-6 md:text-7xl text-balance">
              {t("hero.title")}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[rgb(var(--dark-fg-soft))] md:mt-6 md:text-lg">
              {t("hero.subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3 md:mt-10">
              <Link href={href("/shop")} className="btn-primary px-7 py-3.5 text-base">
                {t("hero.shopCta")} →
              </Link>
              <Link
                href={href("/shop")}
                className="inline-flex items-center justify-center rounded-full border border-[rgb(var(--dark-line))] bg-black/20 px-7 py-3.5 text-base font-semibold text-[rgb(var(--dark-fg))] backdrop-blur-sm transition hover:border-[rgb(var(--accent-2))] hover:bg-black/35"
              >
                {t("hero.trunkCta")}
              </Link>
            </div>
          </div>

          {/* compact trust row */}
          <div>
            <div className="mt-9 grid max-w-2xl grid-cols-3 gap-3 border-t border-white/15 pt-6 text-sm sm:flex sm:flex-wrap sm:items-center sm:gap-x-10 sm:gap-y-4 md:mt-12 md:pt-7">
              <TrustItem big="4" small={t("hero.badge.seasons")} />
              <span className="hidden h-8 w-px bg-white/15 sm:block" />
              <TrustItem big={t("hero.badge.years")} small={t("hero.badge.warranty")} />
              <span className="hidden h-8 w-px bg-white/15 sm:block" />
              <TrustItem big="100%" small={t("hero.fit.title")} />
            </div>
          </div>
        </div>
      </Banner>
    </section>
  );
}

function TrustItem({ big, small }: { big: string; small: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2">
      <span className="font-display text-xl font-bold text-[rgb(var(--gold))] sm:text-2xl">{big}</span>
      <span className="break-words text-[8px] font-semibold uppercase leading-tight tracking-[0.12em] text-[rgb(var(--dark-fg-soft))] sm:text-xs sm:tracking-[0.16em]">{small}</span>
    </div>
  );
}
