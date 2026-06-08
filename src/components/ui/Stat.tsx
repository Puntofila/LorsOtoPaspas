type Props = {
  value: string;
  label: string;
  sub?: string;
  className?: string;
};

export default function Stat({ value, label, sub, className = "" }: Props) {
  return (
    <div className={className}>
      <div className="font-display text-4xl font-bold leading-none tracking-tight md:text-5xl">
        {value}
      </div>
      <div className="mt-2 text-sm font-medium">{label}</div>
      {sub && <div className="mt-0.5 text-xs text-fg-mute">{sub}</div>}
    </div>
  );
}
