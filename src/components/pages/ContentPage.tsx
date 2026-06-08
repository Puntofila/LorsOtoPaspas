"use client";

import { useT } from "@/lib/i18n/LanguageProvider";
import { getContent, type ContentSlug } from "@/content/pages";
import Reveal from "@/components/ui/Reveal";
import BackButton from "@/components/ui/BackButton";

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ContentPage({ slug }: { slug: ContentSlug }) {
  const { t, locale } = useT();
  const page = getContent(slug, locale);
  const showNav = page.sections.length > 2;

  return (
    <div>
      {/* Hero header */}
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
            <BackButton className="mb-6" />
            <span className="eyebrow">LORS</span>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-[1.08] tracking-tight md:text-5xl text-balance">
              {page.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base text-fg-soft md:text-lg">{page.intro}</p>
            {page.updated && (
              <p className="mt-4 text-xs uppercase tracking-[0.18em] text-fg-mute">
                {t("content.updated")}: {page.updated}
              </p>
            )}
          </Reveal>
        </div>
      </section>

      {/* Body */}
      <div className="container-app py-14 md:py-20">
        <div
          className={
            showNav ? "grid gap-10 lg:grid-cols-[220px_1fr]" : "mx-auto max-w-3xl"
          }
        >
          {showNav && (
            <aside className="hidden lg:block">
              <div className="lg:sticky lg:top-24">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-fg-mute">
                  {t("content.onThisPage")}
                </div>
                <ul className="mt-3 space-y-2 text-sm">
                  {page.sections.map((s) => (
                    <li key={s.heading}>
                      <a href={`#${slugify(s.heading)}`} className="link-soft">
                        {s.heading}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          )}

          <article className="max-w-3xl space-y-10">
            {page.sections.map((s) => (
              <section key={s.heading} id={slugify(s.heading)} className="scroll-mt-24">
                <h2 className="font-display text-2xl font-bold tracking-tight">{s.heading}</h2>
                <div className="mt-3 space-y-3 text-fg-soft leading-relaxed">
                  {s.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </article>
        </div>
      </div>
    </div>
  );
}
