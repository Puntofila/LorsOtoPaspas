"use client";

type Props = {
  color: string;
  piping: string;
  logo?: string;
  brandName?: string;
  className?: string;
};

export default function MatPreview({ color, piping, logo, brandName, className }: Props) {
  // unique ids so multiple previews on one page don't share gradient defs
  const uid = `${color}-${piping}`.replace(/[^a-z0-9]/gi, "");

  return (
    <div className={`group relative overflow-hidden rounded-xl border border-line bg-bg-subtle shadow-[0_18px_42px_-34px_rgb(var(--fg))] ${className ?? ""}`}>
      {/* accent rim-light on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-accent/0 transition duration-300 group-hover:ring-accent/30" aria-hidden />
      <svg viewBox="0 0 200 250" className="absolute inset-0 h-full w-full">
        <defs>
          <radialGradient id={`floor-${uid}`} cx="50%" cy="0%" r="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`sheen-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <pattern id={`texture-${uid}`} patternUnits="userSpaceOnUse" width="6" height="6">
            <rect width="6" height="6" fill={color} />
            <circle cx="3" cy="3" r="0.6" fill="#ffffff" fillOpacity="0.07" />
          </pattern>
        </defs>
        <rect width="200" height="250" fill={`url(#floor-${uid})`} />
        <path
          d="M30 30 L170 30 Q185 30 185 50 L185 200 Q185 220 165 220 L55 220 Q35 220 30 200 L20 110 Q15 80 30 60 Z"
          fill={`url(#texture-${uid})`}
          stroke={piping}
          strokeWidth="4"
        />
        <path
          d="M30 30 L170 30 Q185 30 185 50 L185 200 Q185 220 165 220 L55 220 Q35 220 30 200 L20 110 Q15 80 30 60 Z"
          fill={`url(#sheen-${uid})`}
        />
        <ellipse cx="100" cy="170" rx="35" ry="22" fill="#000" fillOpacity="0.18" />
        <path
          d="M35 36 L168 36 Q179 36 179 52 L179 198 Q179 214 163 214 L57 214 Q41 214 36 198 L26 110 Q22 84 36 64 Z"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.25"
          strokeWidth="0.7"
          strokeDasharray="2 2"
        />
        {brandName && (
          <text x="100" y="118" textAnchor="middle" fontFamily="serif" fontWeight="700" fontSize="20" fill="#ffffff" fillOpacity="0.6">
            {brandName}
          </text>
        )}
        {!brandName && logo === "brand" && (
          <text x="100" y="118" textAnchor="middle" fontFamily="serif" fontWeight="700" fontSize="22" fill="#ffffff" fillOpacity="0.55">
            LOGO
          </text>
        )}
      </svg>
    </div>
  );
}
