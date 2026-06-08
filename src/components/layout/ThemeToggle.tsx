"use client";

import { useTheme } from "@/lib/theme/ThemeProvider";
import { useT } from "@/lib/i18n/LanguageProvider";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const { t } = useT();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t("theme.toggle")}
      className="btn-ghost relative h-9 w-9 !rounded-full !p-0"
    >
      <span className={`absolute inset-0 grid place-items-center transition-transform duration-300 ${isDark ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"}`}>
        <SunIcon />
      </span>
      <span className={`absolute inset-0 grid place-items-center transition-transform duration-300 ${isDark ? "rotate-90 opacity-0" : "rotate-0 opacity-100"}`}>
        <MoonIcon />
      </span>
    </button>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
    </svg>
  );
}
