"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/LanguageProvider";
import { getFaq } from "@/content/faq";
import Reveal from "@/components/ui/Reveal";

export default function FAQTeaser() {
  const { t, locale, href } = useT();
  const items = getFaq(locale).slice(0, 4);

  return (
    <section className="container-app py-16 md:py-24">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-start">
        <Reveal>
          <div className="lg:sticky lg:top-24">
            <span className="eyebrow">{t("faq.eyebrow")}</span>
            <h2 className="section-title mt-3">{t("faq.title")}</h2>
            <p className="mt-3 max-w-sm text-fg-soft">{t("faq.subtitle")}</p>
            <Link href={href("/faq")} className="btn-secondary mt-6">
              {t("faq.seeAll")} →
            </Link>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="space-y-3">
            {items.map((item, i) => (
              <details
                key={i}
                className="group surface px-5 py-1 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-start font-medium">
                  <span>{item.q}</span>
                  <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-bg-muted text-fg-soft transition group-open:rotate-45 group-open:bg-accent group-open:text-accent-fg">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                </summary>
                <p className="pb-5 text-fg-soft leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
