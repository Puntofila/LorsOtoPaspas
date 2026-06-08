import type { ReactNode } from "react";
import Reveal from "./Reveal";

type Props = {
  eyebrow?: string;
  title?: ReactNode;
  subtitle?: string;
  align?: "start" | "center";
  className?: string;
  headerClassName?: string;
  children?: ReactNode;
  /** wrap the section in a reveal animation (default true) */
  reveal?: boolean;
};

/**
 * Standard section shell with an optional eyebrow / title / subtitle header.
 * Receives already-translated strings — the caller owns `useT`.
 */
export default function Section({
  eyebrow,
  title,
  subtitle,
  align = "start",
  className = "",
  headerClassName = "",
  children,
  reveal = true,
}: Props) {
  const centered = align === "center";
  const header =
    eyebrow || title || subtitle ? (
      <div
        className={`${centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${headerClassName}`.trim()}
      >
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        {title && <h2 className="section-title mt-3">{title}</h2>}
        {subtitle && <p className="mt-3 text-base text-fg-soft md:text-lg">{subtitle}</p>}
      </div>
    ) : null;

  return (
    <section className={`container-app py-20 md:py-28 ${className}`.trim()}>
      {header && (reveal ? <Reveal>{header}</Reveal> : header)}
      {children}
    </section>
  );
}
