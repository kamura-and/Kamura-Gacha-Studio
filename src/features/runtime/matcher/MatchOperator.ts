import type { TriggerCondition } from "@/features/triggers/types/TriggerCondition";

type TriggerConditionOperator =
  TriggerCondition["operator"];

export function matchOperator(
  actualValue: unknown,
  operator: TriggerConditionOperator,
  expectedValue: unknown,
): boolean {
  switch (operator) {
    case "equals":
      return isEqual(
        actualValue,
        expectedValue,
      );

    case "notEquals":
      return !isEqual(
        actualValue,
        expectedValue,
      );

    case "greaterThan":
      return compareNumbers(
        actualValue,
        expectedValue,
        (actual, expected) =>
          actual > expected,
      );

    case "greaterThanOrEqual":
      return compareNumbers(
        actualValue,
        expectedValue,
        (actual, expected) =>
          actual >= expected,
      );

    case "lessThan":
      return compareNumbers(
        actualValue,
        expectedValue,
        (actual, expected) =>
          actual < expected,
      );

    case "lessThanOrEqual":
      return compareNumbers(
        actualValue,
        expectedValue,
        (actual, expected) =>
          actual <= expected,
      );

    case "contains":
      return containsValue(
        actualValue,
        expectedValue,
      );

    case "notContains":
      return !containsValue(
        actualValue,
        expectedValue,
      );

    case "startsWith":
      return compareStrings(
        actualValue,
        expectedValue,
        (actual, expected) =>
          actual.startsWith(expected),
      );

    case "endsWith":
      return compareStrings(
        actualValue,
        expectedValue,
        (actual, expected) =>
          actual.endsWith(expected),
      );

    case "in":
      return isValueInCollection(
        actualValue,
        expectedValue,
      );

    case "notIn":
      return !isValueInCollection(
        actualValue,
        expectedValue,
      );

    case "exists":
      return valueExists(actualValue);

    case "notExists":
      return !valueExists(actualValue);

    default:
      return assertNever(operator);
  }
}

function isEqual(
  actualValue: unknown,
  expectedValue: unknown,
): boolean {
  if (
    typeof actualValue === "number" &&
    typeof expectedValue === "number"
  ) {
    return (
      Number.isFinite(actualValue) &&
      Number.isFinite(expectedValue) &&
      actualValue === expectedValue
    );
  }

  return actualValue === expectedValue;
}

function compareNumbers(
  actualValue: unknown,
  expectedValue: unknown,
  comparator: (
    actual: number,
    expected: number,
  ) => boolean,
): boolean {
  const actualNumber =
    toFiniteNumber(actualValue);

  const expectedNumber =
    toFiniteNumber(expectedValue);

  if (
    actualNumber === null ||
    expectedNumber === null
  ) {
    return false;
  }

  return comparator(
    actualNumber,
    expectedNumber,
  );
}

function compareStrings(
  actualValue: unknown,
  expectedValue: unknown,
  comparator: (
    actual: string,
    expected: string,
  ) => boolean,
): boolean {
  if (
    typeof actualValue !== "string" ||
    typeof expectedValue !== "string"
  ) {
    return false;
  }

  return comparator(
    actualValue,
    expectedValue,
  );
}

function containsValue(
  actualValue: unknown,
  expectedValue: unknown,
): boolean {
  if (typeof actualValue === "string") {
    return (
      typeof expectedValue === "string" &&
      actualValue.includes(expectedValue)
    );
  }

  if (Array.isArray(actualValue)) {
    return actualValue.some((value) =>
      isEqual(value, expectedValue),
    );
  }

  return false;
}

function isValueInCollection(
  actualValue: unknown,
  expectedValue: unknown,
): boolean {
  if (!Array.isArray(expectedValue)) {
    return false;
  }

  return expectedValue.some((value) =>
    isEqual(actualValue, value),
  );
}

function valueExists(
  value: unknown,
): boolean {
  return value !== null &&
    value !== undefined;
}

function toFiniteNumber(
  value: unknown,
): number | null {
  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return value;
  }

  return null;
}

function assertNever(
  value: never,
): never {
  throw new Error(
    `Unsupported trigger condition operator: ${String(
      value,
    )}`,
  );
}