import {
  presentationRuntime,
} from "@/features/presentation/runtime/PresentationRuntime";

import {
  executionHistoryRuntime,
} from "../../history/runtime/ExecutionHistoryRuntime";

import type {
  RuntimeEvent,
} from "../../runtime/types";

import {
  runtimeEventDispatcher,
} from "../../runtime/types/RuntimeEventDispatcher";

import {
  gachaExecutionRuntime,
} from "../../gacha/runtime/GachaExecutionRuntime";

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
  private unsubscribe?:
    () => void;


  public start(): void {
    if (this.unsubscribe) {
      return;
    }

    this.unsubscribe =
      runtimeEventDispatcher.subscribe(
        (event) => {
          this.handleEvent(
            event,
          );
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

    this.unsubscribe =
      undefined;

    console.info(
      "[TriggerRuntime]",
      "Stopped",
    );
  }


  public isRunning(): boolean {
    return (
      this.unsubscribe !==
      undefined
    );
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
      const trigger of
      matchedTriggers
    ) {
      void this.executeTrigger(
        trigger,
        event,
      );
    }
  }


  private async executeTrigger(
    trigger: Trigger,
    event: RuntimeEvent,
  ): Promise<void> {
    try {
      const result =
        gachaExecutionRuntime.execute({
          gachaPoolId:
            trigger.gachaPoolId,
        });

      const effect =
        result.spin.effect;

      await presentationRuntime.play({
        presetId:
          "chest",

        item: {
          id:
            effect.id,

          name:
            effect.name,

          description:
            effect.description,

          rarity:
            effect.rarity ??
            "common",

          imageDataUrl:
            effect.imageDataUrl ??
            null,
        },
      });

      executionHistoryRuntime.recordSuccess({
        eventId:
          event.id,

        triggerId:
          trigger.id,

        triggerName:
          trigger.name,

        gachaPoolId:
          result.spin.gachaPoolId,

        poolEntryId:
          result.spin.poolEntry.id,

        gachaItemId:
          effect.id,

        gachaItemName:
          effect.name,

        effectId:
          effect.id,

        mode:
          result.mode,

        commandCount:
          result.effect.commandCount,

        drawnAt:
          result.spin.drawnAt,
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
            result.spin.gachaPoolId,

          effectId:
            effect.id,

          effectName:
            effect.name,

          executionMode:
            result.mode,

          commandCount:
            result.effect.commandCount,

          drawnAt:
            result.spin.drawnAt,
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
    matchedTriggers:
      Trigger[],
  ): void {
    if (
      matchedTriggers.length ===
      0
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