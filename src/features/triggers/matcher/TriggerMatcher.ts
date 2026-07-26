import type {
  RuntimeEvent,
} from "../../runtime/events";

import type {
  Trigger,
} from "../types/Trigger";

import type {
  TriggerCondition,
} from "../types/TriggerCondition";

import {
  compare,
} from "../utils/compare";

import {
  getValueByPath,
} from "../utils/getValueByPath";

export class TriggerMatcher {
  public matches(
    trigger: Trigger,
    event: RuntimeEvent,
  ): boolean {
    if (!trigger.enabled) {
      return false;
    }

    if (
      !this.matchesPlugin(
        trigger,
        event,
      )
    ) {
      return false;
    }

    if (
      !this.matchesEventCategory(
        trigger,
        event,
      )
    ) {
      return false;
    }

    if (
      !this.matchesEventType(
        trigger,
        event,
      )
    ) {
      return false;
    }

    return this.matchesConditions(
      trigger,
      event,
    );
  }

  public matchAll(
    triggers: readonly Trigger[],
    event: RuntimeEvent,
  ): Trigger[] {
    return triggers.filter(
      (trigger) =>
        this.matches(
          trigger,
          event,
        ),
    );
  }

  private matchesPlugin(
    trigger: Trigger,
    event: RuntimeEvent,
  ): boolean {
    if (
      trigger.pluginId ===
      undefined
    ) {
      return true;
    }

    if (
      event.source.kind !==
      "plugin"
    ) {
      return false;
    }

    return (
      event.source.pluginId ===
      trigger.pluginId
    );
  }

  private matchesEventCategory(
    trigger: Trigger,
    event: RuntimeEvent,
  ): boolean {
    if (
      trigger.eventCategory ===
      undefined
    ) {
      return true;
    }

    return (
      event.category ===
      trigger.eventCategory
    );
  }

  private matchesEventType(
    trigger: Trigger,
    event: RuntimeEvent,
  ): boolean {
    if (
      trigger.eventType ===
      undefined
    ) {
      return true;
    }

    return (
      event.type ===
      trigger.eventType
    );
  }

  private matchesConditions(
    trigger: Trigger,
    event: RuntimeEvent,
  ): boolean {
    if (
      trigger.conditions.length === 0
    ) {
      return true;
    }

    if (
      trigger.matchMode === "any"
    ) {
      return trigger.conditions.some(
        (condition) =>
          this.matchesCondition(
            condition,
            event,
          ),
      );
    }

    return trigger.conditions.every(
      (condition) =>
        this.matchesCondition(
          condition,
          event,
        ),
    );
  }

  private matchesCondition(
    condition: TriggerCondition,
    event: RuntimeEvent,
  ): boolean {
    const actual =
      getValueByPath(
        event,
        condition.field,
      );

    return compare(
      actual,
      condition.operator,
      condition.value,
    );
  }
}

export const triggerMatcher =
  new TriggerMatcher();