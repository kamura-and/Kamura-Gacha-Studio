import type {
  TriggerConditionOperator,
  TriggerConditionValue,
} from "../types/TriggerCondition";

export function compare(
  actual: unknown,
  operator: TriggerConditionOperator,
  expected?: TriggerConditionValue,
): boolean {
  switch (operator) {
    case "equals":
      return actual === expected;

    case "notEquals":
      return actual !== expected;

    case "greaterThan":
      return (
        typeof actual === "number" &&
        typeof expected === "number" &&
        actual > expected
      );

    case "greaterThanOrEqual":
      return (
        typeof actual === "number" &&
        typeof expected === "number" &&
        actual >= expected
      );

    case "lessThan":
      return (
        typeof actual === "number" &&
        typeof expected === "number" &&
        actual < expected
      );

    case "lessThanOrEqual":
      return (
        typeof actual === "number" &&
        typeof expected === "number" &&
        actual <= expected
      );

    case "contains":
      if (typeof actual === "string") {
        return actual.includes(String(expected));
      }

      if (Array.isArray(actual)) {
        return actual.includes(expected);
      }

      return false;

    case "notContains":
      if (typeof actual === "string") {
        return !actual.includes(String(expected));
      }

      if (Array.isArray(actual)) {
        return !actual.includes(expected);
      }

      return false;

    case "startsWith":
      return (
        typeof actual === "string" &&
        actual.startsWith(String(expected))
      );

    case "endsWith":
      return (
        typeof actual === "string" &&
        actual.endsWith(String(expected))
      );

    case "in":
      return (
        Array.isArray(expected) &&
        expected.includes(actual as never)
      );

    case "notIn":
      return (
        Array.isArray(expected) &&
        !expected.includes(actual as never)
      );

    case "exists":
      return actual !== undefined;

    case "notExists":
      return actual === undefined;

    default:
      return false;
  }
}