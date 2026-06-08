"use client";

import { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { DICTIONARIES, translator } from "./dictionaries";
import { Locale, LOCALES, LOCALE_META, RTL_LOCALES, isLocale } from "./config";

type Ctx = {
  locale: Locale;
  t: (key: string) => string;
  isRTL: boolean;
  changeLocale: (next: Locale) => void;
  href: (path: string) => string;
};

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = RTL_LOCALES.includes(locale) ? "rtl" : "ltr";
    document.cookie = `lors.locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`;
  }, [locale]);

  const t = useMemo(() => translator(locale), [locale]);

  const href = useCallback(
    (path: string) => {
      const clean = path.startsWith("/") ? path : `/${path}`;
      if (clean === "/") return `/${locale}`;
      return `/${locale}${clean}`;
    },
    [locale]
  );

  const changeLocale = useCallback(
    (next: Locale) => {
      const segments = (pathname ?? "/").split("/").filter(Boolean);
      if (segments[0] && isLocale(segments[0])) segments[0] = next;
      else segments.unshift(next);
      router.push("/" + segments.join("/"));
    },
    [pathname, router]
  );

  return (
    <LanguageContext.Provider
      value={{ locale, t, isRTL: RTL_LOCALES.includes(locale), changeLocale, href }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useT() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useT must be used within LanguageProvider");
  return ctx;
}

export { LOCALES, LOCALE_META };
export type { Locale };
