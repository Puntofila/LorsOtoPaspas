"use client";

import { useMemo, useState } from "react";
import { useT } from "@/lib/i18n/LanguageProvider";
import { getFaq } from "@/content/faq";
import Reveal from "@/components/ui/Reveal";
import BackButton from "@/components/ui/BackButton";

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
        <div className="mx-auto max-w-3xl space-y-3">
          {filtered.length === 0 ? (
            <p className="py-10 text-center text-fg-mute">{t("faq.empty")}</p>
          ) : (
            filtered.map((item, i) => (
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}
