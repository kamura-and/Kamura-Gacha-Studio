import {
  executionHistoryRepository,
} from "../repository/ExecutionHistoryRepository";

import type {
  ExecutionHistoryEntry,
  ExecutionHistoryMode,
} from "../types/ExecutionHistory";

export const EXECUTION_HISTORY_UPDATED_EVENT =
  "kamura:execution-history-updated";

export type RecordExecutionSuccessInput = {
  eventId?: string;

  triggerId?: string;
  triggerName?: string;

  gachaPoolId: string;
  poolEntryId: string;

  gachaItemId: string;
  gachaItemName: string;

  effectId?: string | null;

  mode: ExecutionHistoryMode;

  commandCount: number;

  drawnAt: number;
};

function createHistoryId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return [
    "execution",
    Date.now(),
    Math.random()
      .toString(36)
      .slice(2),
  ].join("-");
}

function normalizeCommandCount(
  commandCount: number,
): number {
  if (
    !Number.isFinite(commandCount) ||
    commandCount < 0
  ) {
    return 0;
  }

  return Math.floor(commandCount);
}

function notifyHistoryUpdated(): void {
  if (
    typeof window === "undefined"
  ) {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(
      EXECUTION_HISTORY_UPDATED_EVENT,
    ),
  );
}

export class ExecutionHistoryRuntime {
  public recordSuccess(
    input: RecordExecutionSuccessInput,
  ): ExecutionHistoryEntry {
    const entry: ExecutionHistoryEntry = {
      id: createHistoryId(),

      eventId:
        input.eventId,

      triggerId:
        input.triggerId,

      triggerName:
        input.triggerName,

      gachaPoolId:
        input.gachaPoolId,

      poolEntryId:
        input.poolEntryId,

      gachaItemId:
        input.gachaItemId,

      gachaItemName:
        input.gachaItemName,

      effectId:
        input.effectId,

      mode:
        input.mode,

      commandCount:
        normalizeCommandCount(
          input.commandCount,
        ),

      drawnAt:
        input.drawnAt,

      executedAt:
        Date.now(),

      status:
        "success",
    };

    executionHistoryRepository.add(
      entry,
    );

    notifyHistoryUpdated();

    console.info(
      "[ExecutionHistoryRuntime]",
      "Execution history recorded",
      {
        historyId:
          entry.id,

        eventId:
          entry.eventId,

        triggerId:
          entry.triggerId,

        gachaPoolId:
          entry.gachaPoolId,

        gachaItemId:
          entry.gachaItemId,

        mode:
          entry.mode,

        commandCount:
          entry.commandCount,
      },
    );

    return entry;
  }
}

export const executionHistoryRuntime =
  new ExecutionHistoryRuntime();