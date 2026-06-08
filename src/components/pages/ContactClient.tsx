"use client";

import { useRef, useState } from "react";
import { useT } from "@/lib/i18n/LanguageProvider";
import { COMPANY_PROFILE } from "@/lib/site/company-profile";

export default function ContactClient() {
  const { t } = useT();
  const [sent, setSent] = useState(false);
  const honeypot = useRef<HTMLInputElement>(null);
  const mountedAt = useRef(Date.now());

  // Frontend-only form. Basic bot defense: a hidden honeypot field (bots fill it)
  // and a minimum fill time. There is no backend endpoint yet — wire one up later.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot.current?.value) return; // bot filled the trap
    if (Date.now() - mountedAt.current < 1500) return; // submitted too fast
    setSent(true);
  };

  return (
    <div className="container-app grid gap-12 py-14 md:grid-cols-[1fr_1fr] md:py-20">
      <div>
        <h1 className="font-display text-4xl font-bold">{t("contact.title")}</h1>
        <p className="mt-3 text-fg-soft">{t("contact.subtitle")}</p>

        <p className="mt-6 max-w-xl text-sm leading-relaxed text-fg-soft">{COMPANY_PROFILE.description}</p>

        <div className="mt-8 grid gap-4">
          {COMPANY_PROFILE.branches.map((branch) => (
            <article key={branch.id} className="surface p-5">
              <h2 className="font-display text-xl font-bold">{branch.name}</h2>
              <div className="mt-4 space-y-3 text-sm">
                <Row icon={<PhoneIcon />} label={branch.phone} href={`tel:${branch.phone.replace(/\s/g, "")}`} />
                <Row icon={<PinIcon />} label={branch.address} href={branch.mapsUrl} />
                {branch.hours.map((hours) => (
                  <Row key={hours.days} icon={<ClockIcon />} label={`${hours.days}: ${hours.hours}`} />
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="surface space-y-4 p-6">
        {sent ? (
          <div className="py-10 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success/10 text-success text-2xl">✓</div>
            <p className="mt-4 font-medium">{t("contact.thanks")}</p>
          </div>
        ) : (
          <>
            {/* honeypot — hidden from users, bots tend to fill it */}
            <input
              ref={honeypot}
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              title="Leave this field empty"
              placeholder="Leave this field empty"
              className="hidden"
            />
            <Field label={t("contact.name")} required />
            <Field label={t("checkout.email")} type="email" required />
            <Field label={t("checkout.phone")} />
            <Field label={t("contact.message")} required textarea />
            <button type="submit" className="btn-primary w-full py-3.5">
              {t("contact.send")}
            </button>
          </>
        )}
      </form>
    </div>
  );
}

function Row({ icon, label, href }: { icon: React.ReactNode; label: string; href?: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-9 w-9 place-items-center rounded-full border border-line bg-bg-elevated text-fg-soft">{icon}</span>
      {href ? (
        <a href={href} className="link-soft font-medium">
          {label}
        </a>
      ) : (
        <span>{label}</span>
      )}
    </div>
  );
}

function Field({
  label,
  type = "text",
  required,
  textarea,
}: {
  label: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-fg-soft">{label}{required && " *"}</span>
      {textarea ? (
        <textarea required={required} rows={4} className="input resize-none" />
      ) : (
        <input type={type} required={required} className="input" />
      )}
    </label>
  );
}

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.94.36 1.85.68 2.72a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.36-1.36a2 2 0 0 1 2.11-.45c.87.32 1.78.55 2.72.68A2 2 0 0 1 22 16.92z"/>
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
