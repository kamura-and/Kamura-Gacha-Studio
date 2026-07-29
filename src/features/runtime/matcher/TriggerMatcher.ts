import type { RuntimeEvent } from "@/features/runtime/types/RuntimeEvent";
import type { Trigger } from "@/features/triggers/types/Trigger";

import { matchesCondition } from "./ConditionMatcher";

export function matchTriggers(
  event: RuntimeEvent,
  triggers: readonly Trigger[],
): Trigger[] {
  return triggers.filter((trigger) =>
    matchesTrigger(
      event,
      trigger,
    ),
  );
}

function matchesTrigger(
  event: RuntimeEvent,
  trigger: Trigger,
): boolean {
  if (!trigger.enabled) {
    return false;
  }

  if (event.source.kind !== "plugin") {
    return false;
  }

  if (
    trigger.pluginId !==
    event.source.pluginId
  ) {
    return false;
  }

  if (
    trigger.eventCategory !==
    event.category
  ) {
    return false;
  }

  if (
    trigger.eventType &&
    trigger.eventType !==
      event.type
  ) {
    return false;
  }

  const conditions =
    trigger.conditions;

  if (conditions.length === 0) {
    return true;
  }

  if (
    trigger.matchMode === "all"
  ) {
    return conditions.every(
      (condition) =>
        matchesCondition(
          event,
          condition,
        ),
    );
  }

  return conditions.some(
    (condition) =>
      matchesCondition(
        event,
        condition,
      ),
  );
}