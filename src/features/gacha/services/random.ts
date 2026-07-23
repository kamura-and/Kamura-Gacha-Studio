export type RandomSource = () => number;

export const defaultRandomSource: RandomSource =
  () => Math.random();

export function normalizeRandomValue(
  value: number,
) {
  if (!Number.isFinite(value)) {
    throw new Error(
      "乱数は有限の数値である必要があります。",
    );
  }

  if (value < 0 || value >= 1) {
    throw new Error(
      "乱数は0以上1未満である必要があります。",
    );
  }

  return value;
}