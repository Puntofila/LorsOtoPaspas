"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/LanguageProvider";
import Reveal from "@/components/ui/Reveal";

export default function CTASection() {
  const { t, href } = useT();
  return (
    <section className="container-app pb-16 pt-2 md:pb-24">
      <Reveal>
        <div className="dark-panel relative overflow-hidden rounded-[1.75rem] border p-8 shadow-[0_28px_80px_-48px_rgb(0_0_0/0.75)] md:p-14">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgb(var(--accent)/0.32),transparent_40%),linear-gradient(300deg,rgb(var(--accent-2)/0.32),transparent_45%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-white/25" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-black/35" />
          <div className="relative z-10 grid items-center gap-8 md:grid-cols-2">
            <div>
              <h3 className="font-display text-3xl font-bold leading-tight md:text-4xl text-balance">
                {t("cta.title")}
              </h3>
              <p className="dark-panel-muted mt-3 max-w-md">{t("cta.subtitle")}</p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link href={href("/shop")} className="btn-primary px-7 py-3.5 text-base">
                {t("hero.shopCta")} →
              </Link>
              <Link
                href={href("/contact")}
                className="inline-flex items-center justify-center rounded-full border border-current px-7 py-3.5 text-base font-medium opacity-85 transition hover:opacity-100"
              >
                {t("nav.contactUs")}
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
