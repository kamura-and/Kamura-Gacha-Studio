import type {
  GachaItem,
} from "@/features/gacha/types/gacha";

import type {
  GachaPool,
} from "@/features/pools/types/pool";

import {
  selectWeightedEntry,
} from "../selector/WeightedRandom";

type RandomSource =
  () => number;

type GachaItemFinder = (
  id: string,
) => GachaItem | undefined;

/**
 * 旧GachaItem方式のPoolから
 * 有効なGachaItemを1件抽選する。
 *
 * この関数は旧互換用です。
 *
 * 新しいEffect直結方式は
 * GachaRuntime.spin()を使用します。
 *
 * 次の場合はnullを返します。
 *
 * - Poolが無効
 * - 抽選可能なEntryが存在しない
 * - Entryが新Effect方式
 * - gachaItemIdが存在しない
 * - Entryに対応するGachaItemが存在しない
 * - GachaItemが無効
 */
export function executePool(
  pool: GachaPool,
  findGachaItemById:
    GachaItemFinder,
  random:
    RandomSource = Math.random,
): GachaItem | null {
  if (!pool.enabled) {
    return null;
  }

  /**
   * このExecutorは旧形式専用なので、
   * gachaItemIdを持つEntryだけを
   * 抽選候補にします。
   */
  const legacyEntries =
    pool.entries.filter(
      (entry) => {
        const gachaItemId =
          entry.gachaItemId
            ?.trim();

        return Boolean(
          gachaItemId,
        );
      },
    );

  if (
    legacyEntries.length ===
    0
  ) {
    return null;
  }

  const selectedEntry =
    selectWeightedEntry(
      legacyEntries,
      random,
    );

  if (!selectedEntry) {
    return null;
  }

  const gachaItemId =
    selectedEntry.gachaItemId
      ?.trim();

  if (!gachaItemId) {
    return null;
  }

  const gachaItem =
    findGachaItemById(
      gachaItemId,
    );

  if (!gachaItem) {
    return null;
  }

  if (
    !gachaItem.isEnabled
  ) {
    return null;
  }

  return gachaItem;
}