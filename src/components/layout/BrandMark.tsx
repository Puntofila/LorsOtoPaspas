export default function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5 text-fg" aria-label="LORS OTO PASPAS">
      <span className="relative grid h-10 w-10 place-items-center rounded-[0.6rem] border border-accent/80 bg-gradient-to-br from-accent/25 via-bg-elevated to-accent/10 shadow-glow-sm">
        <span className="absolute inset-[3px] rounded-[0.42rem] border border-accent/25" />
        <span className="relative font-display text-base font-bold text-accent">L</span>
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-lg font-bold tracking-[0.035em]">LORS OTO PASPAS</span>
          <span className="mt-1 text-[7px] font-semibold uppercase tracking-[0.28em] text-accent">
            Araç Paspası
          </span>
        </span>
      )}
    </span>
  );
}
