import Image from "next/image";

export default function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5 text-fg" aria-label="LORS OTO PASPAS">
      <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-[0.6rem] border border-accent/40 shadow-glow-sm">
        <Image
          src="/banners/ava.png"
          alt="LORS OTO PASPAS"
          width={40}
          height={40}
          className="h-full w-full object-cover"
          priority
        />
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
