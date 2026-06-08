"use client";

import { useMemo, useState } from "react";
import { useT } from "@/lib/i18n/LanguageProvider";
import { getFaq } from "@/content/faq";
import Reveal from "@/components/ui/Reveal";
import BackButton from "@/components/ui/BackButton";
import Accordion from "@/components/ui/Accordion";

export default function FAQClient() {
  const { t, locale } = useT();
  const items = getFaq(locale);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => i.q.toLowerCase().includes(q) || i.a.toLowerCase().includes(q));
  }, [items, query]);

  return (
    <div>
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: items.map((i) => ({
              "@type": "Question",
              name: i.q,
              acceptedAnswer: { "@type": "Answer", text: i.a },
            })),
          }),
        }}
      />

      <section className="relative overflow-hidden border-b border-line bg-bg-subtle">
        <div
          className="pointer-events-none absolute inset-0 -z-0 opacity-[0.5]"
          aria-hidden
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgb(var(--accent)/0.12), transparent 42%), linear-gradient(300deg, rgb(var(--accent-2)/0.12), transparent 42%)",
          }}
        />
        <div className="container-app relative z-10 py-16 md:py-24">
          <Reveal>
            <div className="mb-8 flex flex-col items-start gap-5">
              <BackButton />
              <span className="eyebrow">{t("faq.eyebrow")}</span>
            </div>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.08] tracking-tight md:text-5xl text-balance">
              {t("faq.title")}
            </h1>
            <p className="mt-4 max-w-2xl text-base text-fg-soft md:text-lg">{t("faq.subtitle")}</p>
            <div className="mt-6 max-w-md">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("faq.searchPlaceholder")}
                className="input"
                aria-label={t("faq.searchPlaceholder")}
              />
            </div>
          </Reveal>
        </div>
      </section>

      <div className="container-app py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          {filtered.length === 0 ? (
            <p className="py-10 text-center text-fg-mute">{t("faq.empty")}</p>
          ) : (
            <Accordion key={query} items={filtered} defaultOpen={null} />
          )}
        </div>
      </div>
    </div>
  );
}
