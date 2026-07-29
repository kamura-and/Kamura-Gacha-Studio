import type {
  GachaItem,
} from "@/features/gacha/types/gacha";

import type {
  GachaPool,
} from "@/features/pools/types/pool";

import {
  selectWeightedEntry,
} from "../selector/WeightedRandom";

type RandomSource = () => number;

type GachaItemFinder = (
  id: string,
) => GachaItem | undefined;

/**
 * Poolから有効なGachaItemを1件抽選する。
 *
 * 次の場合はnullを返す。
 *
 * - Poolが無効
 * - 抽選可能なEntryが存在しない
 * - Entryに対応するGachaItemが存在しない
 * - GachaItemが無効
 */
export function executePool(
  pool: GachaPool,
  findGachaItemById: GachaItemFinder,
  random: RandomSource = Math.random,
): GachaItem | null {
  if (!pool.enabled) {
    return null;
  }

  const selectedEntry =
    selectWeightedEntry(
      pool.entries,
      random,
    );

  if (!selectedEntry) {
    return null;
  }

  const gachaItem =
    findGachaItemById(
      selectedEntry.gachaItemId,
    );

  if (!gachaItem) {
    return null;
  }

  if (!gachaItem.isEnabled) {
    return null;
  }

  return gachaItem;
}