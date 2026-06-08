"use client";

import { useState } from "react";

const SIMPLEICON_SLUG: Record<string, string> = {
  audi: "audi",
  bmw: "bmw",
  "mercedes-benz": "mercedes",
  volkswagen: "volkswagen",
  toyota: "toyota",
  ford: "ford",
  honda: "honda",
  hyundai: "hyundai",
  kia: "kia",
  fiat: "fiat",
  renault: "renault",
  peugeot: "peugeot",
  citroen: "citroen",
  porsche: "porsche",
  ferrari: "ferrari",
  jaguar: "jaguar",
  "land-rover": "landrover",
  lexus: "lexus",
  mazda: "mazda",
  nissan: "nissan",
  opel: "opel",
  seat: "seatti",
  skoda: "skoda",
  subaru: "subaru",
  suzuki: "suzuki",
  tesla: "tesla",
  volvo: "volvo",
  mini: "mini",
  mitsubishi: "mitsubishi",
  cadillac: "cadillac",
  chevrolet: "chevrolet",
  chrysler: "chrysler",
  dodge: "dodge",
  jeep: "jeep",
  maserati: "maserati",
  bentley: "bentley",
  "rolls-royce": "rollsroyce",
  "alfa-romeo": "alfaromeo",
  dacia: "dacia",
  cupra: "cupra",
  "aston-martin": "astonmartin",
  bugatti: "bugatti",
  lamborghini: "lamborghini",
  mclaren: "mclaren",
  infiniti: "infiniti",
  acura: "acura",
  buick: "buick",
  gmc: "gmc",
  lincoln: "lincoln",
  daihatsu: "daihatsu",
  byd: "byd",
};

const ACCENT_TINT: Record<string, string> = {
  bmw: "#1c69d4",
  audi: "#bb0a30",
  "mercedes-benz": "#5b6770",
  porsche: "#c4a667",
  ferrari: "#e10600",
  lamborghini: "#a08b3f",
  bentley: "#103138",
  "rolls-royce": "#68242a",
  bugatti: "#0d2c54",
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
  buick: "#a01010",
  gmc: "#c8102e",
  byd: "#cc0000",
  togg: "#5b21b6",
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
  const iconSlug = SIMPLEICON_SLUG[slug];
  const tint = ACCENT_TINT[slug] ?? "#1c1c20";
  const src = iconSlug ? `https://cdn.simpleicons.org/${iconSlug}/111111` : null;

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
        className={`object-contain dark:invert ${className}`}
      />
    );
  }

  return (
    <div className={`grid place-items-center rounded-lg border border-line bg-bg-elevated shadow-[inset_0_1px_0_rgb(255_255_255/0.55)] dark:shadow-none ${className}`}>
      <img
        src={src}
        alt={name}
        onError={() => setFailed(true)}
        className="h-[60%] w-[60%] object-contain dark:invert"
        loading="lazy"
      />
    </div>
  );
}
