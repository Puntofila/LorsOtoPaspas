"use client";

import { usePathname } from "next/navigation";

/**
 * Lightweight page transition. Keying the wrapper by pathname makes React
 * remount it on navigation, replaying the CSS fade/slide animation. Pure CSS
 * (no animation library); `.page-enter` has a prefers-reduced-motion fallback
 * in globals.css so it degrades to a plain swap.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  );
}
