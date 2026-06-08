import { notFound } from "next/navigation";
import { isLocale, LOCALES } from "@/lib/i18n/config";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import { CartProvider } from "@/lib/cart/CartProvider";
import { ToastProvider } from "@/components/ui/ToastProvider";
import SessionProviderClient from "@/lib/auth/SessionProviderClient";
import AppShell from "@/components/layout/AppShell";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  return (
    <SessionProviderClient>
      <ThemeProvider>
        <LanguageProvider locale={params.locale}>
          <CartProvider>
            <ToastProvider>
              <AppShell>{children}</AppShell>
            </ToastProvider>
          </CartProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SessionProviderClient>
  );
}
