"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** path under /public, e.g. "/banners/hero.jpg". If missing, a gold-black gradient shows. */
  src?: string;
  mobileSrc?: string;
  alt?: string;
  className?: string;
  imageClassName?: string;
  objectPosition?: string;
  mobileObjectPosition?: string;
  /** dark overlay strength 0..1 for readable text on top */
  overlay?: number;
  overlayPreset?: "none" | "left" | "hero" | "soft" | "full";
  children?: React.ReactNode;
  priority?: boolean;
  /** if true, children are hidden once the real image loads (used for fallback art) */
  childrenAsFallback?: boolean;
};

/**
 * Banner with graceful fallback. If the image at `src` loads, it's shown; if it
 * 404s (file not yet placed in /public), we keep the premium gold-black gradient
 * underneath so the layout never looks broken. Drop real art into /public to
 * upgrade automatically.
 */
export default function Banner({
  src,
  mobileSrc,
  alt = "",
  className = "",
  imageClassName = "",
  objectPosition = "center",
  mobileObjectPosition,
  overlay = 0.45,
  overlayPreset = "left",
  children,
  priority = false,
  childrenAsFallback = false,
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const showImage = src && !failed;
  const showChildren = children && (!childrenAsFallback || !loaded);

  useEffect(() => {
    const image = imageRef.current;
    if (!image?.complete) return;
    if (image.naturalWidth > 0) setLoaded(true);
    else setFailed(true);
  }, [src, mobileSrc]);

  return (
    <div className={`relative overflow-hidden bg-[rgb(var(--dark-panel))] ${className}`}>
      {/* gold-black gradient fallback (always rendered underneath) */}
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(120% 90% at 15% 10%, rgb(var(--gold)/0.22), transparent 55%), linear-gradient(135deg, #0c0b0a, #18140c 55%, #0c0b0a)",
        }}
      />
      {showImage && (
        <picture>
          {mobileSrc && <source srcSet={mobileSrc} media="(max-width: 767px)" />}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imageRef}
            src={src}
            alt={alt}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            loading={priority ? "eager" : "lazy"}
            className={`banner-image absolute inset-0 h-full w-full object-cover ${imageClassName}`}
            style={{
              ["--banner-object-position" as string]: objectPosition,
              ["--banner-mobile-object-position" as string]: mobileObjectPosition ?? objectPosition,
            }}
          />
        </picture>
      )}
      {/* readability overlay */}
      <div
        className="absolute inset-0"
        aria-hidden
        style={{ background: overlayBackground(overlayPreset, overlay) }}
      />
      {showChildren && <div className="relative z-10 h-full">{children}</div>}
    </div>
  );
}

function overlayBackground(preset: NonNullable<Props["overlayPreset"]>, overlay: number) {
  if (preset === "none") return "transparent";
  if (preset === "full") return `rgb(0 0 0 / ${overlay})`;
  if (preset === "soft") {
    return `linear-gradient(180deg, rgb(0 0 0 / ${overlay * 0.45}), rgb(0 0 0 / ${
      overlay * 0.12
    }) 45%, rgb(0 0 0 / ${overlay * 0.36}))`;
  }
  if (preset === "hero") {
    return [
      `linear-gradient(90deg, rgb(0 0 0 / ${overlay}), rgb(0 0 0 / ${Math.max(
        0,
        overlay - 0.2
      )}) 34%, rgb(0 0 0 / 0.06) 58%, transparent 78%)`,
      "linear-gradient(180deg, rgb(0 0 0 / 0.34), transparent 22%, transparent 72%, rgb(0 0 0 / 0.56))",
    ].join(",");
  }
  return `linear-gradient(90deg, rgb(0 0 0 / ${overlay}), rgb(0 0 0 / ${Math.max(
    0,
    overlay - 0.25
  )}) 60%, transparent)`;
}
