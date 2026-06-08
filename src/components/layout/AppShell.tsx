"use client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/ui/PageTransition";
import ScrollHelper from "@/components/layout/ScrollHelper";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-[60vh]"><PageTransition>{children}</PageTransition></main>
      <Footer />
      <ScrollHelper />
    </>
  );
}
