import type {
  RuntimeEvent,
} from "../../runtime/events";

import {
  runtimeEventDispatcher,
} from "../../runtime/events/RuntimeEventDispatcher";

import {
  actionRuntime,
} from "../../actions/runtime/ActionRuntime";

import {
  gachaRuntime,
} from "../../gacha/runtime/GachaRuntime";

import {
  buildGachaCommands,
} from "../../gacha/services/buildGachaCommands";

import {
  triggerMatcher,
} from "../matcher/TriggerMatcher";

import {
  triggerRepository,
} from "../repository/TriggerRepository";

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
        (event) => {
          this.handleEvent(event);
        },
      );

    console.info(
      "[TriggerRuntime]",
      "Started",
    );
  }

  public stop(): void {
    if (!this.unsubscribe) {
      return;
    }

    this.unsubscribe();
    this.unsubscribe = undefined;

    console.info(
      "[TriggerRuntime]",
      "Stopped",
    );
  }

  public isRunning(): boolean {
    return this.unsubscribe !== undefined;
  }

  private handleEvent(
    event: RuntimeEvent,
  ): void {
    const enabledTriggers =
      triggerRepository.findEnabled();

    const matchedTriggers =
      triggerMatcher.matchAll(
        enabledTriggers,
        event,
      );

    this.logMatchResult(
      event,
      enabledTriggers.length,
      matchedTriggers,
    );

    for (
      const trigger of matchedTriggers
    ) {
      this.executeTrigger(
        trigger,
        event,
      );
    }
  }

  private executeTrigger(
    trigger: Trigger,
    event: RuntimeEvent,
  ): void {
    try {
      const spinResult =
        gachaRuntime.spin(
          trigger.gachaPoolId,
        );

      const commands =
        buildGachaCommands(
          spinResult.item,
        );

      actionRuntime.execute({
        gachaItemId:
          spinResult.item.id,
        gachaItemName:
          spinResult.item.name,
        commands,
      });

      console.info(
        "[TriggerRuntime]",
        "Trigger executed",
        {
          eventId:
            event.id,
          triggerId:
            trigger.id,
          triggerName:
            trigger.name,
          gachaPoolId:
            spinResult.gachaPoolId,
          gachaItemId:
            spinResult.item.id,
          gachaItemName:
            spinResult.item.name,
          commandCount:
            commands.length,
          drawnAt:
            spinResult.drawnAt,
        },
      );
    } catch (error) {
      console.error(
        "[TriggerRuntime]",
        "Trigger execution failed",
        {
          eventId:
            event.id,
          triggerId:
            trigger.id,
          triggerName:
            trigger.name,
          gachaPoolId:
            trigger.gachaPoolId,
        },
        error,
      );
    }
  }

  private logMatchResult(
    event: RuntimeEvent,
    candidateCount: number,
    matchedTriggers: Trigger[],
  ): void {
    if (
      matchedTriggers.length === 0
    ) {
      console.debug(
        "[TriggerRuntime]",
        "No trigger matched",
        {
          eventId:
            event.id,
          category:
            event.category,
          type:
            event.type,
          candidateCount,
        },
      );

      return;
    }

    console.debug(
      "[TriggerRuntime]",
      "Triggers matched",
      {
        eventId:
          event.id,
        category:
          event.category,
        type:
          event.type,
        candidateCount,
        matchedCount:
          matchedTriggers.length,
        triggerIds:
          matchedTriggers.map(
            (trigger) =>
              trigger.id,
          ),
      },
    );
  }
}

export const triggerRuntime =
  new TriggerRuntime();