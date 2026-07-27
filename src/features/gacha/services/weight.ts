export type WeightTableEntry<T> = {
  item: T;
  weight: number;
  start: number;
  end: number;
};

/**
 * 任意のデータと重みから抽選テーブルを作成します。
 *
 * 景品自身から確率を取得せず、
 * 呼び出し側がweightの取得方法を指定します。
 */
export function createWeightTable<T>(
  items: T[],
  getWeight: (item: T) => number,
): WeightTableEntry<T>[] {
  let cursor = 0;

  return items
    .map((item) => ({
      item,
      weight: getWeight(item),
    }))
    .filter(
      (entry) =>
        Number.isFinite(entry.weight) &&
        entry.weight > 0,
    )
    .map((entry) => {
      const start = cursor;
      const end =
        start + entry.weight;

      cursor = end;

      return {
        ...entry,
        start,
        end,
      };
    });
}

export function getWeightTotal<T>(
  table: WeightTableEntry<T>[],
): number {
  return table.reduce(
    (total, entry) =>
      total + entry.weight,
    0,
  );
}