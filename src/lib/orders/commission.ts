export function calculateCommission(total: number, rate: number) {
  const safeTotal = Number.isFinite(total) ? Math.max(0, total) : 0;
  const safeRate = Number.isFinite(rate) ? Math.min(100, Math.max(0, rate)) : 0;
  return Math.round((safeTotal * safeRate) / 100);
}
