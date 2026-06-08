"use client";

import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n/LanguageProvider";
import Link from "next/link";

/**
 * Mobile-first floating helper. Appears after the user scrolls down a bit and
 * offers two smooth actions: jump back to the top, and a quick shortcut to the
 * shop ("make an order"). Hidden on large screens where the header nav suffices.
 */
export default function ScrollHelper() {
  const { t, href } = useT();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div
      className={`fixed bottom-5 right-4 z-40 flex flex-col items-end gap-2.5 transition-all duration-300 lg:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <Link
        href={href("/shop")}
        className="btn-primary px-5 py-3 text-sm shadow-glow-sm"
        aria-label={t("hero.shopCta")}
      >
        {t("hero.shopCta")} →
      </Link>
      <button
        type="button"
        onClick={toTop}
        aria-label="Yukarı"
        className="grid h-11 w-11 place-items-center rounded-full border border-line bg-bg-elevated/90 text-fg shadow-card backdrop-blur transition hover:border-accent/50"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      </button>
    </div>
  );
}
