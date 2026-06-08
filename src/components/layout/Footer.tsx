"use client";

import Link from "next/link";
import { useState } from "react";
import { useT } from "@/lib/i18n/LanguageProvider";
import {
  getVisibleContacts,
  getVisibleSocials,
  SITE_CONTACTS,
  SITE_SOCIALS,
} from "@/lib/site/contact-config";
import BrandMark from "./BrandMark";
import { COMPANY_PROFILE } from "@/lib/site/company-profile";

export default function Footer() {
  const { t, href } = useT();
  const contacts = getVisibleContacts(SITE_CONTACTS);
  return (
    <footer className="border-t border-line bg-bg-subtle">
      <div className="h-px w-full bg-gradient-to-r from-accent/0 via-accent to-accent-2/0" />

      <div className="container-app pt-12 md:pt-16">
        <div className="dark-panel grid gap-7 rounded-[1.75rem] border p-7 md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div>
            <h2 className="max-w-xl font-display text-3xl font-bold leading-tight md:text-4xl">
              {t("cta.title")}
            </h2>
            <p className="dark-panel-muted mt-2 max-w-xl">{t("cta.subtitle")}</p>
          </div>
          <Link href={href("/contact")} className="btn-primary w-fit px-7 py-3.5 text-base">
            {t("nav.contactUs")} →
          </Link>
        </div>
      </div>

      <div className="container-app grid gap-12 py-14 md:grid-cols-12 md:py-16">
        <div className="md:col-span-5">
          <div className="flex items-center gap-2.5">
            <BrandMark />
          </div>
          <p className="mt-4 max-w-xs text-sm text-fg-soft">{t("footer.tagline")}</p>
          <div className="mt-5 grid gap-2 text-xs text-fg-soft">
            {COMPANY_PROFILE.branches.map((branch) => (
              <a key={branch.id} href={`tel:${branch.phone.replace(/\s/g, "")}`} className="link-soft">
                {branch.shortName}: {branch.phone}
              </a>
            ))}
          </div>

          <Newsletter />
          <Social />
        </div>

        <div className="md:col-span-7">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <FooterCol title={t("footer.shop")}>
              <FooterLink href={href("/shop")}>{t("nav.shop")}</FooterLink>
              <FooterLink href={href("/cart")}>{t("nav.cart")}</FooterLink>
              <FooterLink href={href("/account")}>{t("nav.account")}</FooterLink>
            </FooterCol>

            <FooterCol title={t("footer.help")}>
              <FooterLink href={href("/faq")}>{t("footer.faq")}</FooterLink>
              <FooterLink href={href("/shipping")}>{t("footer.shipping")}</FooterLink>
              <FooterLink href={href("/returns")}>{t("footer.returns")}</FooterLink>
              <FooterLink href={href("/contact")}>{t("footer.contact")}</FooterLink>
            </FooterCol>

            <FooterCol title={t("footer.company")}>
              <FooterLink href={href("/about")}>{t("footer.about")}</FooterLink>
              <FooterLink href={href("/terms")}>{t("footer.terms")}</FooterLink>
              <FooterLink href={href("/privacy")}>{t("footer.privacy")}</FooterLink>
            </FooterCol>
          </div>

          <div className="mt-10 grid gap-2 sm:grid-cols-3">
            <TrustItem label={t("trust.secure")} icon="lock" />
            <TrustItem label={t("trust.warranty")} icon="shield" />
            <TrustItem label={t("trust.fast")} icon="bolt" />
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-app flex flex-col items-center justify-between gap-3 py-5 text-xs text-fg-mute md:flex-row">
          <span>© {new Date().getFullYear()} LORS OTO PASPAS · {t("footer.rights")}</span>
          <span className="hidden text-fg-mute/70 md:inline">Türkçe · Русский · English · العربية</span>
          {contacts.length > 0 && (
            <span className="flex flex-wrap justify-center gap-x-3 gap-y-1">
              {contacts.map((contact) => (
                <a key={contact.label} href={contact.href} className="link-soft">
                  {contact.value}
                </a>
              ))}
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}

function Newsletter() {
  const { t } = useT();
  const [ok, setOk] = useState(false);

  // Frontend-only: there is no newsletter backend. We just acknowledge the
  // submission locally — wire this to a real endpoint when one exists.
  return (
    <div className="mt-7 max-w-sm">
      <div className="text-sm font-semibold">{t("news.title")}</div>
      <p className="mt-1 text-xs text-fg-mute">{t("news.subtitle")}</p>
      {ok ? (
        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-2 text-sm font-medium text-accent">
          ✓ {t("news.thanks")}
        </p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setOk(true);
          }}
          className="mt-3 flex gap-2"
        >
          <input
            type="email"
            required
            placeholder={t("news.placeholder")}
            aria-label={t("news.placeholder")}
            className="input flex-1 py-2.5"
          />
          <button type="submit" className="btn-primary flex-none px-5 py-2.5">
            {t("news.subscribe")}
          </button>
        </form>
      )}
    </div>
  );
}

const SOCIAL_ICON_PATH: Record<string, string> = {
  Instagram: "M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 1.8.25 2.2.42.6.22 1 .48 1.4.9.42.4.7.8.9 1.4.17.4.36 1 .42 2.2.07 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.06 1.2-.25 1.8-.42 2.2-.22.6-.48 1-.9 1.4-.4.42-.8.7-1.4.9-.4.17-1 .36-2.2.42-1.3.07-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.06-1.8-.25-2.2-.42-.6-.22-1-.48-1.4-.9-.42-.4-.7-.8-.9-1.4-.17-.4-.36-1-.42-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.06-1.2.25-1.8.42-2.2.22-.6.48-1 .9-1.4.4-.42.8-.7 1.4-.9.4-.17 1-.36 2.2-.42C8.4 2.2 8.8 2.2 12 2.2Zm0 1.8c-3.1 0-3.5 0-4.7.07-.9.04-1.4.2-1.7.3-.4.17-.7.37-1 .67-.3.3-.5.6-.67 1-.1.3-.26.8-.3 1.7C3.6 8.5 3.6 8.9 3.6 12s0 3.5.07 4.7c.04.9.2 1.4.3 1.7.17.4.37.7.67 1 .3.3.6.5 1 .67.3.1.8.26 1.7.3 1.2.07 1.6.07 4.7.07s3.5 0 4.7-.07c.9-.04 1.4-.2 1.7-.3.4-.17.7-.37 1-.67.3-.3.5-.6.67-1 .1-.3.26-.8.3-1.7.07-1.2.07-1.6.07-4.7s0-3.5-.07-4.7c-.04-.9-.2-1.4-.3-1.7a2.7 2.7 0 0 0-.67-1c-.3-.3-.6-.5-1-.67-.3-.1-.8-.26-1.7-.3C15.5 4 15.1 4 12 4Zm0 3.1a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8Zm0 1.8a3.1 3.1 0 1 0 0 6.2 3.1 3.1 0 0 0 0-6.2Zm5.1-3.3a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z",
};

function Social() {
  const { t } = useT();
  const socials = getVisibleSocials(SITE_SOCIALS);
  if (socials.length === 0) return null;

  return (
    <div className="mt-7">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-fg-mute">
        {t("social.follow")}
      </div>
      <div className="mt-3 flex gap-2.5">
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            title={s.label}
            className="group grid h-10 w-10 place-items-center rounded-full border border-line bg-bg-elevated text-fg-soft transition-all hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:text-accent-fg hover:shadow-glow-sm"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="transition-transform group-hover:scale-110">
              <path d={SOCIAL_ICON_PATH[s.label] ?? ""} />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}

function TrustItem({ label, icon }: { label: string; icon: "lock" | "shield" | "bolt" }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-line bg-bg-elevated/70 px-3 py-3 text-xs font-semibold text-fg-soft">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-accent-soft text-accent">
        <TrustIcon type={icon} />
      </span>
      {label}
    </div>
  );
}

function TrustIcon({ type }: { type: "lock" | "shield" | "bolt" }) {
  if (type === "lock") {
    return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>;
  }
  if (type === "shield") {
    return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>;
  }
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m13 2-9 12h7l-1 8 9-12h-7z"/></svg>;
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-sm font-semibold">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="link-soft">
        {children}
      </Link>
    </li>
  );
}
