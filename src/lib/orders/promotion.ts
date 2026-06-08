export type PromotionRule = {
  type: string;
  amount: number;
};

export type PromotionAvailability = {
  isActive: boolean;
  startsAt: Date | null;
  endsAt: Date | null;
  minSubtotal: number;
  maxUses: number | null;
  usedCount: number;
};

export function calculatePromotionDiscount(subtotal: number, promotion: PromotionRule) {
  const raw =
    promotion.type === "PERCENT"
      ? Math.round((subtotal * Math.min(100, Math.max(0, promotion.amount))) / 100)
      : Math.max(0, promotion.amount);
  return Math.min(subtotal, raw);
}

export function isPromotionUsable(
  promotion: PromotionAvailability,
  subtotal: number,
  now = new Date()
) {
  if (!promotion.isActive || subtotal < promotion.minSubtotal) return false;
  if (promotion.startsAt && promotion.startsAt > now) return false;
  if (promotion.endsAt && promotion.endsAt < now) return false;
  if (promotion.maxUses !== null && promotion.usedCount >= promotion.maxUses) return false;
  return true;
}

