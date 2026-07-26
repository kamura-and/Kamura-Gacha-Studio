import type {
  RuntimeEvent,
} from "../../runtime/events";

import {
  runtimeEventDispatcher,
} from "../../runtime/events/RuntimeEventDispatcher";

import {
  triggerRepository,
} from "../repository/TriggerRepository";

import {
  triggerMatcher,
} from "../matcher/TriggerMatcher";

import type {
  Trigger,
} from "../types/Trigger";

export class TriggerRuntime {
  private unsubscribe?: () => void;

  public start(): void {
    if (this.unsubscribe) {
      return;
    }

    this.unsubscribe =
      runtimeEventDispatcher.subscribe(
        (event) =>
          this.handleEvent(event),
      );
  }

  public stop(): void {
    this.unsubscribe?.();
    this.unsubscribe = undefined;
  }

  private handleEvent(
    event: RuntimeEvent,
  ): void {
    const triggers =
      triggerRepository.findEnabled();

    const matched =
      triggerMatcher.matchAll(
        triggers,
        event,
      );

    this.log(
      event,
      matched,
    );

    if (matched.length === 0) {
      return;
    }

    matched.forEach(
      (trigger) =>
        this.executeTrigger(
          trigger,
          event,
        ),
    );
  }

  private executeTrigger(
    trigger: Trigger,
    event: RuntimeEvent,
  ): void {
    console.info(
      "[TriggerRuntime]",
      "Trigger Matched",
      {
        triggerId: trigger.id,
        triggerName: trigger.name,
        gachaPoolId:
          trigger.gachaPoolId,
        eventId: event.id,
      },
    );

    // TODO:
    // GachaRuntimeへ接続
  }

  private log(
    event: RuntimeEvent,
    matched: Trigger[],
  ): void {
    console.debug(
      "[TriggerRuntime]",
      {
        eventId: event.id,
        type: event.type,
        matched:
          matched.length,
      },
    );
  }
}

export const triggerRuntime =
  new TriggerRuntime();