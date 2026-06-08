"use client";

import { useState } from "react";

// Real automotive brand logos (colored PNGs on transparent background).
// Source: car-logos-dataset — slugs match our brand slugs directly, so no
// per-brand mapping table is needed. A handful of niche brands (aion, togg,
// yoyo, etc.) aren't in the set and fall back to the tinted initials tile.
const LOGO_BASE =
  "https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized";

// Brands known to be absent from the dataset — skip the network round-trip and
// render the initials fallback immediately.
const NO_LOGO = new Set([
  "aion",
  "dfsk",
  "jaecoo",
  "kgm",
  "khazar",
  "relive",
  "seres",
  "skywell",
  "swm",
  "togg",
  "yoyo",
]);

const ACCENT_TINT: Record<string, string> = {
  bmw: "#1c69d4",
  audi: "#bb0a30",
  "mercedes-benz": "#5b6770",
  porsche: "#c4a667",
  ferrari: "#e10600",
  lamborghini: "#a08b3f",
  bentley: "#103138",
  "rolls-royce": "#68242a",
  "alfa-romeo": "#a82d2d",
  jaguar: "#1a4732",
  "land-rover": "#005a2b",
  tesla: "#cc0000",
  toyota: "#e30613",
  honda: "#cc0000",
  hyundai: "#002c5f",
  kia: "#05141f",
  ford: "#003478",
  volkswagen: "#001e50",
  renault: "#ffcb05",
  peugeot: "#16365b",
  citroen: "#a8000c",
  opel: "#f7ce15",
  mazda: "#9b1024",
  nissan: "#c3002f",
  subaru: "#0041aa",
  suzuki: "#e30613",
  volvo: "#1a3a64",
  skoda: "#0e3a2a",
  seat: "#a8521b",
  cupra: "#a85a3a",
  dacia: "#646b52",
  fiat: "#c00d20",
  mini: "#000000",
  jeep: "#1a4731",
  dodge: "#a80000",
  cadillac: "#5b6770",
  chevrolet: "#c5a35d",
  chrysler: "#1a1a1a",
  maserati: "#1a2a4a",
  lexus: "#3a3a3a",
  infiniti: "#3a3a3a",
  byd: "#cc0000",
  togg: "#5b21b6",
  aion: "#0a7d6e",
};

function initials(name: string) {
  const cleaned = name.replace(/[^A-Za-zА-Яа-я ]/g, "").trim();
  const parts = cleaned.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function BrandLogo({
  slug,
  name,
  className = "h-14 w-14",
  variant = "auto",
}: {
  slug: string;
  name: string;
  className?: string;
  variant?: "auto" | "tile" | "plain";
}) {
  const [failed, setFailed] = useState(false);
  const tint = ACCENT_TINT[slug] ?? "#1c1c20";
  const src = NO_LOGO.has(slug) ? null : `${LOGO_BASE}/${slug}.png`;

  if (!src || failed) {
    return (
      <div
        className={`grid place-items-center rounded-lg font-display font-bold text-white shadow-card ${className}`}
        style={{ background: `linear-gradient(135deg, ${tint}, ${tint}cc)` }}
      >
        <span className="text-base tracking-wide">{initials(name)}</span>
      </div>
    );
  }

  if (variant === "plain") {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setFailed(true)}
        className={`object-contain ${className}`}
        loading="lazy"
      />
    );
  }

  return (
    <div
      className={`grid place-items-center rounded-lg border border-line bg-white shadow-[inset_0_1px_0_rgb(255_255_255/0.55)] dark:bg-bg-elevated dark:shadow-none ${className}`}
    >
      <img
        src={src}
        alt={name}
        onError={() => setFailed(true)}
        className="h-[64%] w-[64%] object-contain"
        loading="lazy"
      />
    </div>
  );
}
