import type { GachaItem } from "@/features/gacha/types/gacha";

export const DEFAULT_PROBABILITY_TOLERANCE =
  0.001;

export function getEnabledGachaItems(
  items: GachaItem[],
) {
  return items.filter(
    (item) =>
      item.isEnabled &&
      Number.isFinite(item.probability) &&
      item.probability > 0,
  );
}

export function calculateTotalProbability(
  items: GachaItem[],
) {
  return getEnabledGachaItems(items).reduce(
    (total, item) =>
      total + item.probability,
    0,
  );
}

export function isProbabilityTotalValid(
  items: GachaItem[],
  expectedTotal = 100,
  tolerance = DEFAULT_PROBABILITY_TOLERANCE,
) {
  const total =
    calculateTotalProbability(items);

  return (
    Math.abs(total - expectedTotal) <=
    tolerance
  );
}