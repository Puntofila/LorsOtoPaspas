"use client";

import { useState } from "react";

type Datum = { label: string; value: number; color?: string; description?: string };

export function BarChart({ data, height = 180, emptyLabel = "Hover over the chart", emptyDescription = "Details appear here." }: { data: Datum[]; height?: number; emptyLabel?: string; emptyDescription?: string }) {
  const [active, setActive] = useState<Datum | null>(null);
  const max = Math.max(1, ...data.map((datum) => datum.value));
  const barW = Math.min(18, 100 / (data.length * 1.6));
  const gap = Math.min(8, barW * 0.6);
  const totalWidth = data.length * barW + Math.max(0, data.length - 1) * gap;
  const start = (100 - totalWidth) / 2;
  return (
    <div>
      <ChartHint active={active} emptyLabel={emptyLabel} emptyDescription={emptyDescription} />
      <svg viewBox={`0 0 100 ${height / 3}`} preserveAspectRatio="none" className="mt-3 w-full" style={{ height }}>
        {data.map((datum, index) => {
          const barHeight = (datum.value / max) * (height / 3 - 8);
          return <rect key={datum.label} x={start + index * (barW + gap)} y={height / 3 - barHeight} width={barW} height={barHeight} rx="1.2" fill={datum.color ?? "rgb(var(--accent))"} opacity={active && active.label !== datum.label ? 0.35 : 1} className="cursor-help transition-opacity" onMouseEnter={() => setActive(datum)} onMouseLeave={() => setActive(null)} />;
        })}
      </svg>
      <div className="mt-2 flex justify-between gap-1 text-[10px] text-fg-mute">{data.map((datum) => <span key={datum.label} className="flex-1 truncate text-center">{datum.label}</span>)}</div>
    </div>
  );
}

export function Donut({ segments, size = 160, emptyLabel = "Hover over the chart", emptyDescription = "Details appear here." }: { segments: (Required<Pick<Datum, "label" | "value" | "color">> & { description?: string })[]; size?: number; emptyLabel?: string; emptyDescription?: string }) {
  const [active, setActive] = useState<Datum | null>(null);
  const total = Math.max(1, segments.reduce((sum, segment) => sum + segment.value, 0));
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  return (
    <div>
      <ChartHint active={active} emptyLabel={emptyLabel} emptyDescription={emptyDescription} />
      <div className="mt-3 flex items-center gap-6">
        <svg viewBox="0 0 40 40" style={{ width: size, height: size }} className="-rotate-90">
          <circle cx="20" cy="20" r={radius} fill="none" stroke="rgb(var(--line))" strokeWidth="6" />
          {segments.map((segment) => {
            const length = (segment.value / total) * circumference;
            const element = <circle key={segment.label} cx="20" cy="20" r={radius} fill="none" stroke={segment.color} strokeWidth={active?.label === segment.label ? "7" : "6"} strokeDasharray={`${length} ${circumference - length}`} strokeDashoffset={-offset} className="cursor-help transition-all" onMouseEnter={() => setActive(segment)} onMouseLeave={() => setActive(null)} />;
            offset += length;
            return element;
          })}
        </svg>
        <ul className="flex-1 space-y-1.5 text-sm">{segments.map((segment) => <li key={segment.label} onMouseEnter={() => setActive(segment)} onMouseLeave={() => setActive(null)} className="flex cursor-help items-center gap-2 rounded-lg px-2 py-1 hover:bg-bg-muted"><span className="h-2.5 w-2.5 rounded-full" style={{ background: segment.color }} /><span className="text-fg-soft">{segment.label}</span><span className="ms-auto font-semibold">{segment.value}</span></li>)}</ul>
      </div>
    </div>
  );
}

export function Sparkline({ points, labels = [], height = 64, dayDescription = "Orders created on this day", emptyLabel = "Hover over the chart", emptyDescription = "Details appear here." }: { points: number[]; labels?: string[]; height?: number; dayDescription?: string; emptyLabel?: string; emptyDescription?: string }) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(1, ...points);
  const step = points.length > 1 ? 100 / (points.length - 1) : 100;
  const coords = points.map((point, index) => [index * step, 30 - (point / max) * 26]);
  const line = coords.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return (
    <div>
      <ChartHint active={active === null ? null : { label: labels[active] ?? String(active + 1), value: points[active], description: dayDescription }} emptyLabel={emptyLabel} emptyDescription={emptyDescription} />
      <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="mt-3 w-full" style={{ height }}>
        <path d={`${line} L100 30 L0 30 Z`} fill="rgb(var(--accent) / 0.12)" />
        <path d={line} fill="none" stroke="rgb(var(--accent))" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        {coords.map(([x, y], index) => <circle key={index} cx={x} cy={y} r={active === index ? 1.7 : 1.05} fill="rgb(var(--accent-2))" className="cursor-help" onMouseEnter={() => setActive(index)} onMouseLeave={() => setActive(null)} />)}
      </svg>
    </div>
  );
}

function ChartHint({ active, emptyLabel, emptyDescription }: { active: Datum | null; emptyLabel: string; emptyDescription: string }) {
  return <div className="min-h-[42px] rounded-xl border border-line bg-bg-subtle px-3 py-2 text-xs"><strong>{active ? `${active.label}: ${active.value}` : emptyLabel}</strong><div className="mt-0.5 text-fg-mute">{active?.description ?? emptyDescription}</div></div>;
}
