import type { GachaItem } from "@/features/gacha/types/gacha";
import {
  defaultRandomSource,
  normalizeRandomValue,
  type RandomSource,
} from "@/features/gacha/services/random";
import {
  getEnabledGachaItems,
  isProbabilityTotalValid,
} from "@/features/gacha/services/probability";
import {
  createWeightTable,
  getWeightTotal,
} from "@/features/gacha/services/weight";

export type DrawGachaOptions = {
  random?: RandomSource;
  requireTotal100?: boolean;
};

export function drawGacha(
  items: GachaItem[],
  options: DrawGachaOptions = {},
): GachaItem {
  const {
    random = defaultRandomSource,
    requireTotal100 = true,
  } = options;

  const enabledItems =
    getEnabledGachaItems(items);

  if (enabledItems.length === 0) {
    throw new Error(
      "抽選可能なガチャがありません。",
    );
  }

  if (
    requireTotal100 &&
    !isProbabilityTotalValid(enabledItems)
  ) {
    throw new Error(
      "有効なガチャの排出率合計が100%ではありません。",
    );
  }

  const table =
    createWeightTable(enabledItems);

  const totalWeight = getWeightTotal(table);

  if (totalWeight <= 0) {
    throw new Error(
      "抽選の合計ウェイトが0以下です。",
    );
  }

  const randomValue =
    normalizeRandomValue(random());

  const target =
    randomValue * totalWeight;

  const selectedEntry = table.find(
    (entry) =>
      target >= entry.start &&
      target < entry.end,
  );

  const fallbackEntry =
  table[table.length - 1];

  if (!selectedEntry && !fallbackEntry) {
    throw new Error(
      "ガチャの抽選結果を取得できませんでした。",
    );
  }

  return (
    selectedEntry ?? fallbackEntry
  ).item;
}