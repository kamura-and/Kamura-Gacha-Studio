import type { RuntimeEvent } from "@/features/runtime/types/RuntimeEvent";
import type { TriggerCondition } from "@/features/triggers/types/TriggerCondition";

import { matchOperator } from "./MatchOperator";

export function matchesCondition(
  event: RuntimeEvent,
  condition: TriggerCondition,
): boolean {
  const payload = toPayloadRecord(
    event.payload,
  );

  if (payload === null) {
    return false;
  }

  const actualValue =
    payload[condition.field];

  return matchOperator(
    actualValue,
    condition.operator,
    condition.value,
  );
}

function toPayloadRecord(
  payload: unknown,
): Record<string, unknown> | null {
  if (
    typeof payload !== "object" ||
    payload === null ||
    Array.isArray(payload)
  ) {
    return null;
  }

  return payload as Record<
    string,
    unknown
  >;
}