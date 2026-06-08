import { prisma } from "@/lib/db/prisma";
import Reveal from "@/components/ui/Reveal";
import Avatar from "@/components/ui/Avatar";
import { translator } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

export default async function Testimonials({ locale }: { locale: Locale }) {
  const items = await prisma.review.findMany({
    where: { isVerified: true, isPublished: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });
  if (items.length === 0) return null;
  const t = translator(locale);
  return (
    <section className="border-y border-line bg-bg-subtle py-16 md:py-24">
      <div className="container-app">
        <Reveal><div className="mx-auto max-w-2xl text-center"><span className="eyebrow">{t("testi.eyebrow")}</span><h2 className="section-title mt-3">{t("testi.title")}</h2><p className="mt-3 text-fg-soft">{t("testi.subtitle")}</p></div></Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map((item, index) => (
            <Reveal key={item.id} delay={index * 70}>
              <figure className="surface h-full p-6">
                <div className="text-gold" aria-label={`${item.rating}/5`}>{"★".repeat(item.rating)}</div>
                <blockquote className="mt-4 leading-relaxed text-fg-soft">&ldquo;{item.text}&rdquo;</blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4"><Avatar src={item.authorImage} name={item.authorName} /><span><span className="block text-sm font-semibold">{item.authorName}</span><a href={item.sourceUrl} target="_blank" rel="noreferrer" className="text-xs text-accent">Google Maps ↗</a></span></figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
