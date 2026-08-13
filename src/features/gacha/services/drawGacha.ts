import type {
  LegacyGachaItem,
} from "@/features/gacha/types/gacha";

import {
  defaultRandomSource,
  normalizeRandomValue,
  type RandomSource,
} from "@/features/gacha/services/random";

import {
  getEnabledGachaItems,
} from "@/features/gacha/services/probability";

export type DrawGachaOptions = {
  random?: RandomSource;
};

/**
 * 旧形式との互換用抽選処理です。
 *
 * 景品単体は確率を持たないため、
 * 有効な景品から均等に抽選します。
 *
 * 実際のガチャ箱抽選では、
 * PoolEntryのweightを使用してください。
 */
export function drawGacha(
  items: LegacyGachaItem[],
  options: DrawGachaOptions = {},
): LegacyGachaItem {
  const {
    random = defaultRandomSource,
  } = options;

  const enabledItems =
    getEnabledGachaItems(items);

  if (enabledItems.length === 0) {
    throw new Error(
      "抽選可能なガチャ景品がありません。",
    );
  }

  const randomValue =
    normalizeRandomValue(random());

  const selectedIndex =
    Math.min(
      Math.floor(
        randomValue *
          enabledItems.length,
      ),
      enabledItems.length - 1,
    );

  const selectedItem =
    enabledItems[selectedIndex];

  if (!selectedItem) {
    throw new Error(
      "ガチャ景品の抽選結果を取得できませんでした。",
    );
  }

  return selectedItem;
}