"use client";

import Link from "next/link";
import { useState } from "react";
import { useT } from "@/lib/i18n/LanguageProvider";
import { useCart } from "@/lib/cart/CartProvider";
import LanguageSwitcher from "./LanguageSwitcher";
import UserMenu from "./UserMenu";
import BrandMark from "./BrandMark";

export default function Header() {
  const { t, href } = useT();
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg-elevated/90 shadow-[0_12px_34px_-34px_rgb(var(--fg))] backdrop-blur-xl">
      <div className="container-app flex h-16 items-center justify-between gap-2 lg:h-[4.5rem]">
        <Link href={href("/")} className="flex items-center gap-2.5">
          <BrandMark />
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold lg:flex">
          <Link href={href("/")} className="link-soft">{t("nav.home")}</Link>
          <Link href={href("/shop")} className="link-soft">{t("nav.shop")}</Link>
          <Link href={href("/contact")} className="link-soft">{t("nav.contact")}</Link>
        </nav>

        <div className="flex items-center gap-1.5">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          <UserMenu />

          <Link href={href("/cart")} className="btn-ghost relative hidden !px-2.5 sm:inline-flex">
            <CartIcon />
            <span className="hidden sm:inline">{t("nav.cart")}</span>
            {count > 0 && (
              <span className="absolute -top-1 -end-1 grid h-5 min-w-[20px] place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-fg">
                {count}
              </span>
            )}
          </Link>

          <Link href={href("/contact")} className="btn-primary hidden xl:inline-flex">
            {t("nav.contactUs")}
          </Link>

          <button
            type="button"
            className="btn-ghost lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-bg-elevated lg:hidden">
          <nav className="container-app flex flex-col py-2 text-sm">
            <MobileLink onClick={() => setOpen(false)} href={href("/")}>{t("nav.home")}</MobileLink>
            <MobileLink onClick={() => setOpen(false)} href={href("/shop")}>{t("nav.shop")}</MobileLink>
            <MobileLink onClick={() => setOpen(false)} href={href("/contact")}>{t("nav.contact")}</MobileLink>
            <MobileLink onClick={() => setOpen(false)} href={href("/cart")}>{t("nav.cart")}</MobileLink>
            <MobileLink onClick={() => setOpen(false)} href={href("/login")}>{t("nav.login")}</MobileLink>
            <div className="flex items-center gap-2 border-t border-line px-3 py-3 sm:hidden">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function MobileLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="rounded-lg px-3 py-3 text-fg hover:bg-bg-muted">
      {children}
    </Link>
  );
}

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  );
}
