import type {
  GachaPool,
  PoolEntry,
} from "../types/pool";

export type RandomSource = () => number;

/**
 * 乱数を0以上1未満へ正規化します。
 */
function normalizeRandomValue(
  value: number,
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  if (value <= 0) {
    return 0;
  }

  if (value >= 1) {
    return 1 - Number.EPSILON;
  }

  return value;
}

/**
 * 抽選対象として有効なEntryだけを返します。
 */
export function getDrawablePoolEntries(
  pool: GachaPool,
): PoolEntry[] {
  return pool.entries.filter(
    (entry) =>
      Number.isFinite(entry.weight) &&
      entry.weight > 0,
  );
}

/**
 * 抽選可能なEntryの合計重みを返します。
 */
export function getPoolTotalWeight(
  pool: GachaPool,
): number {
  return getDrawablePoolEntries(
    pool,
  ).reduce(
    (total, entry) =>
      total + entry.weight,
    0,
  );
}

/**
 * Pool内のweightに基づいて、
 * 1件のEntryを抽選します。
 */
export function drawPool(
  pool: GachaPool,
  randomSource: RandomSource =
    Math.random,
): PoolEntry | null {
  if (!pool.enabled) {
    return null;
  }

  const entries =
    getDrawablePoolEntries(pool);

  if (entries.length === 0) {
    return null;
  }

  const totalWeight = entries.reduce(
    (total, entry) =>
      total + entry.weight,
    0,
  );

  if (
    !Number.isFinite(totalWeight) ||
    totalWeight <= 0
  ) {
    return null;
  }

  const randomValue =
    normalizeRandomValue(
      randomSource(),
    );

  const target =
    randomValue * totalWeight;

  let cumulativeWeight = 0;

  for (const entry of entries) {
    cumulativeWeight += entry.weight;

    if (target < cumulativeWeight) {
      return entry;
    }
  }

  return entries.at(-1) ?? null;
}