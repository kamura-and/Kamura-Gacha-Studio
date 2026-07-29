import type {
  PoolEntry,
} from "@/features/pools/types/pool";

type RandomSource = () => number;

/**
 * PoolEntryのweightを基準に、1件を抽選する。
 *
 * 次のEntryは抽選対象から除外する。
 *
 * - weightが0以下
 * - weightがNaN
 * - weightがInfinity
 *
 * 抽選可能なEntryが存在しない場合はnullを返す。
 */
export function selectWeightedEntry(
  entries: PoolEntry[],
  random: RandomSource = Math.random,
): PoolEntry | null {
  const selectableEntries = entries.filter(
    (entry) =>
      Number.isFinite(entry.weight) &&
      entry.weight > 0,
  );

  if (selectableEntries.length === 0) {
    return null;
  }

  const totalWeight = selectableEntries.reduce(
    (total, entry) =>
      total + entry.weight,
    0,
  );

  const randomValue = random();

  const normalizedRandomValue =
    Number.isFinite(randomValue)
      ? Math.min(
          Math.max(randomValue, 0),
          1,
        )
      : 0;

  const targetWeight =
    normalizedRandomValue * totalWeight;

  let accumulatedWeight = 0;

  for (const entry of selectableEntries) {
    accumulatedWeight += entry.weight;

    if (targetWeight < accumulatedWeight) {
      return entry;
    }
  }

  /*
   * randomが1を返した場合や、
   * 浮動小数点の計算誤差が発生した場合のフォールバック。
   */
  return selectableEntries.at(-1) ?? null;
}