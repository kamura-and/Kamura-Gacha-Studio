import type {
  GachaPool,
  PoolEntry,
} from "../types/pool";

export function drawPool(
  pool: GachaPool,
): PoolEntry | null {
  if (
    pool.entries.length === 0
  ) {
    return null;
  }

  const totalWeight =
    pool.entries.reduce(
      (sum, entry) =>
        sum + entry.weight,
      0,
    );

  if (totalWeight <= 0) {
    return null;
  }

  let random =
    Math.random() *
    totalWeight;

  for (const entry of pool.entries) {
    random -= entry.weight;

    if (random <= 0) {
      return entry;
    }
  }

  return (
    pool.entries[
      pool.entries.length - 1
    ] ?? null
  );
}