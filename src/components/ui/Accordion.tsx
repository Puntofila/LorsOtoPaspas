"use client";

import { useState } from "react";

export type AccordionItem = { q: string; a: string };

/**
 * Smoothly animated FAQ accordion. Uses the CSS grid-rows 0fr→1fr trick so the
 * panel height animates without measuring DOM, and the chevron rotates. Honors
 * prefers-reduced-motion via the global transition-duration override.
 */
export default function Accordion({
  items,
  defaultOpen = 0,
}: {
  items: AccordionItem[];
  /** index open on mount, or null for all-closed */
  defaultOpen?: number | null;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className={`surface overflow-hidden transition-colors duration-300 ${
              isOpen ? "border-accent/40" : ""
            }`}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen ? "true" : "false"}
              className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-start font-medium"
            >
              <span>{item.q}</span>
              <span
                className={`grid h-7 w-7 flex-none place-items-center rounded-full transition-all duration-300 ${
                  isOpen ? "rotate-45 bg-accent text-accent-fg" : "bg-bg-muted text-fg-soft"
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 leading-relaxed text-fg-soft">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
