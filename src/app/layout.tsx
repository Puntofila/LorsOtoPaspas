import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin", "cyrillic"], variable: "--font-playfair", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://lors-oto.com"),
  title: {
    default: "LORS OTO PASPAS",
    template: "%s",
  },
  description: "Model-specific premium car mats. Custom colors, logos, fast production.",
  keywords: ["car mats", "oto paspas", "custom car mats", "автоковрики", "premium floor mats", "LORS"],
  applicationName: "LORS OTO PASPAS",
  openGraph: {
    type: "website",
    siteName: "LORS OTO PASPAS",
    title: "LORS OTO PASPAS",
    description: "Model-specific premium car mats. Custom colors, logos, fast production.",
    images: [{ url: "/banners/og.jpg", width: 1200, height: 630, alt: "LORS OTO PASPAS" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LORS OTO PASPAS",
    description: "Model-specific premium car mats. Custom colors, logos, fast production.",
    images: ["/banners/og.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#09090A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning className={`dark ${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen overflow-x-clip bg-bg text-fg antialiased">{children}</body>
    </html>
  );
}
