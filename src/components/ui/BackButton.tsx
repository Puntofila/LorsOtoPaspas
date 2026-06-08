"use client";

import { useRouter } from "next/navigation";
import { useT } from "@/lib/i18n/LanguageProvider";

/**
 * "Back" button for sub-pages (FAQ, legal, content). Uses browser history when
 * possible, otherwise falls back to the localized home page so users are never
 * stranded.
 */
export default function BackButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  const { t, href } = useT();

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(href("/"));
    }
  };

  return (
    <button
      type="button"
      onClick={goBack}
      className={`inline-flex items-center gap-2 rounded-full border border-line bg-bg-elevated px-4 py-2 text-sm font-medium text-fg-soft transition hover:border-accent hover:text-fg ${className}`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rtl:rotate-180">
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </svg>
      {t("nav.back")}
    </button>
  );
}
