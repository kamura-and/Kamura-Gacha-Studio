import type { GachaCommand } from "@/features/gacha/types/gacha";

import { useCommandQueueStore } from "../store/commandQueueStore";
import type { EnqueueCommandsInput } from "../types/commandQueue";
import { executeGachaCommand } from "./actionExecutors";
import { sleep } from "./sleep";

let enginePromise: Promise<void> | null = null;
let stopRequested = false;

function normalizeDelay(delay: number): number {
  if (!Number.isFinite(delay)) {
    return 0;
  }

  return Math.max(0, delay);
}

function getNextPendingItem() {
  return useCommandQueueStore
    .getState()
    .items.find((item) => item.status === "pending");
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "コマンドの実行中に不明なエラーが発生しました。";
}

async function processQueue(): Promise<void> {
  const store = useCommandQueueStore.getState();

  store.setProcessing(true);

  try {
    while (!stopRequested) {
      const nextItem = getNextPendingItem();

      if (!nextItem) {
        break;
      }

      const currentStore = useCommandQueueStore.getState();

      currentStore.setCurrentItem(nextItem.id);
      currentStore.updateItemStatus(nextItem.id, "running");

      try {
        const delay = normalizeDelay(nextItem.command.delay);

        if (delay > 0) {
          await sleep(delay);
        }

        if (stopRequested) {
          useCommandQueueStore
            .getState()
            .updateItemStatus(nextItem.id, "cancelled");

          break;
        }

        await executeGachaCommand(nextItem.command, {
          queueItemId: nextItem.id,
          gachaItemId: nextItem.gachaItemId,
          gachaItemName: nextItem.gachaItemName,
        });

        useCommandQueueStore
          .getState()
          .updateItemStatus(nextItem.id, "completed");
      } catch (error) {
        useCommandQueueStore
          .getState()
          .updateItemStatus(nextItem.id, "failed", {
            error: getErrorMessage(error),
          });

        console.error("[Command Queue Engine]", error);
      } finally {
        useCommandQueueStore.getState().setCurrentItem(null);
      }
    }
  } finally {
    const finalStore = useCommandQueueStore.getState();

    finalStore.setCurrentItem(null);
    finalStore.setProcessing(false);

    enginePromise = null;
    stopRequested = false;

    /**
     * 処理終了直前に新しいコマンドが追加された場合に備えて再確認します。
     */
    const hasPendingItems = finalStore.items.some(
      (item) => item.status === "pending",
    );

    if (hasPendingItems) {
      startCommandQueueEngine();
    }
  }
}

export function startCommandQueueEngine(): Promise<void> {
  if (enginePromise) {
    return enginePromise;
  }

  stopRequested = false;
  enginePromise = processQueue();

  return enginePromise;
}

export function requestCommandQueueStop(): void {
  stopRequested = true;

  useCommandQueueStore.getState().cancelPendingItems();
}

export function enqueueCommandsAndStart(
  input: EnqueueCommandsInput,
): void {
  const queueItems = useCommandQueueStore
    .getState()
    .enqueueCommands(input);

  if (queueItems.length === 0) {
    console.warn(
      "[Command Queue Engine] 有効なコマンドがありません。",
      input,
    );

    return;
  }

  void startCommandQueueEngine();
}

export function enqueueSingleCommandAndStart(input: {
  gachaItemId: string;
  gachaItemName: string;
  command: GachaCommand;
}): void {
  enqueueCommandsAndStart({
    gachaItemId: input.gachaItemId,
    gachaItemName: input.gachaItemName,
    commands: [input.command],
  });
}