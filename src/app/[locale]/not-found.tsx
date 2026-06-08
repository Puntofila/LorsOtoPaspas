"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/LanguageProvider";

export default function NotFound() {
  const { t, href } = useT();
  return (
    <div className="container-app flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <div className="gradient-text font-display text-7xl font-bold md:text-8xl">404</div>
      <h1 className="mt-4 font-display text-2xl font-bold md:text-3xl">{t("notFound.title")}</h1>
      <p className="mt-3 max-w-md text-fg-soft">{t("notFound.desc")}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href={href("/")} className="btn-primary">{t("notFound.home")}</Link>
        <Link href={href("/shop")} className="btn-secondary">{t("notFound.shop")} →</Link>
      </div>
    </div>
  );
}
