import type { ActionParameterValues } from "@/core/actions";

/**
 * パラメーターを文字列として取得する。
 */
export function getStringValue(
  values: ActionParameterValues,
  key: string,
  fallback: string,
): string {
  const value = values[key];

  if (typeof value === "string") {
    return value;
  }

  return fallback;
}

/**
 * パラメーターを数値として取得する。
 */
export function getNumberValue(
  values: ActionParameterValues,
  key: string,
  fallback: number,
): number {
  const value = values[key];

  if (typeof value === "number") {
    return Number.isFinite(value)
      ? value
      : fallback;
  }

  if (typeof value === "string") {
    const parsedValue = Number(value);

    return Number.isFinite(parsedValue)
      ? parsedValue
      : fallback;
  }

  return fallback;
}

/**
 * パラメーターを真偽値として取得する。
 */
export function getBooleanValue(
  values: ActionParameterValues,
  key: string,
  fallback: boolean,
): boolean {
  const value = values[key];

  if (typeof value === "boolean") {
    return value;
  }

  return fallback;
}