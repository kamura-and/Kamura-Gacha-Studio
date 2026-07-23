import type { GachaItem } from "@/features/gacha/types/gacha";

export type WeightedGachaEntry = {
  item: GachaItem;
  start: number;
  end: number;
};

export function createWeightTable(
  items: GachaItem[],
): WeightedGachaEntry[] {
  let cursor = 0;

  return items.map((item) => {
    const start = cursor;
    const end = start + item.probability;

    cursor = end;

    return {
      item,
      start,
      end,
    };
  });
}

export function getWeightTotal(
  table: WeightedGachaEntry[],
) {
  return table.at(-1)?.end ?? 0;
}