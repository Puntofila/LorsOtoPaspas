export const LOCALES = ["tr", "ru", "en", "ar"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "tr";
export const RTL_LOCALES: Locale[] = ["ar"];

export const LOCALE_META: Record<Locale, { native: string; label: string; dir: "ltr" | "rtl" }> = {
  tr: { native: "Türkçe", label: "Turkish", dir: "ltr" },
  ru: { native: "Русский", label: "Russian", dir: "ltr" },
  en: { native: "English", label: "English", dir: "ltr" },
  ar: { native: "العربية", label: "Arabic", dir: "rtl" },
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function localePath(locale: Locale, path = "/") {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (clean === "/") return `/${locale}`;
  return `/${locale}${clean}`;
}
