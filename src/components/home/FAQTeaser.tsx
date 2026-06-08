"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/LanguageProvider";
import { getFaq } from "@/content/faq";
import Reveal from "@/components/ui/Reveal";
import Accordion from "@/components/ui/Accordion";

export default function FAQTeaser() {
  const { t, locale, href } = useT();
  const items = getFaq(locale).slice(0, 4);

  return (
    <section className="border-t border-line py-16 md:py-24">
      <div className="container-app grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-start">
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
          <Accordion items={items} />
        </Reveal>
      </div>
    </section>
  );
}
