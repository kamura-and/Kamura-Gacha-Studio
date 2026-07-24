import type {
  GeneratedActionCommand,
} from "@/core/actions";

import { useCommandQueueStore } from "../store/commandQueueStore";
import type {
  EnqueueCommandsInput,
} from "../types/commandQueue";
import { executeGachaCommand } from "./actionExecutors";
import { sleep } from "./sleep";

let enginePromise: Promise<void> | null = null;
let stopRequested = false;

/**
 * delayが未設定・不正値の場合は0msとして扱う。
 */
function normalizeDelay(
  delay: number | undefined,
): number {
  if (
    delay === undefined ||
    !Number.isFinite(delay)
  ) {
    return 0;
  }

  return Math.max(0, delay);
}

/**
 * 次に実行する待機中のキュー項目を取得する。
 */
function getNextPendingItem() {
  return useCommandQueueStore
    .getState()
    .items.find(
      (item) => item.status === "pending",
    );
}

/**
 * unknown型のエラーを画面表示可能な文字列へ変換する。
 */
function getErrorMessage(
  error: unknown,
): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "コマンドの実行中に不明なエラーが発生しました。";
}

/**
 * キュー内のコマンドを先頭から順番に実行する。
 */
async function processQueue(): Promise<void> {
  useCommandQueueStore
    .getState()
    .setProcessing(true);

  try {
    while (!stopRequested) {
      const nextItem = getNextPendingItem();

      if (!nextItem) {
        break;
      }

      const currentStore =
        useCommandQueueStore.getState();

      currentStore.setCurrentItem(nextItem.id);

      currentStore.updateItemStatus(
        nextItem.id,
        "running",
      );

      try {
        const delay = normalizeDelay(
          nextItem.command.delay,
        );

        if (delay > 0) {
          await sleep(delay);
        }

        if (stopRequested) {
          useCommandQueueStore
            .getState()
            .updateItemStatus(
              nextItem.id,
              "cancelled",
            );

          break;
        }

        await executeGachaCommand(
          nextItem.command,
          {
            queueItemId: nextItem.id,
            gachaItemId:
              nextItem.gachaItemId,
            gachaItemName:
              nextItem.gachaItemName,
          },
        );

        useCommandQueueStore
          .getState()
          .updateItemStatus(
            nextItem.id,
            "completed",
          );
      } catch (error) {
        useCommandQueueStore
          .getState()
          .updateItemStatus(
            nextItem.id,
            "failed",
            {
              error:
                getErrorMessage(error),
            },
          );

        console.error(
          "[Command Queue Engine]",
          error,
        );
      } finally {
        useCommandQueueStore
          .getState()
          .setCurrentItem(null);
      }
    }
  } finally {
    const finalStore =
      useCommandQueueStore.getState();

    finalStore.setCurrentItem(null);
    finalStore.setProcessing(false);

    enginePromise = null;
    stopRequested = false;

    /**
     * エンジンの終了直前に新しいコマンドが
     * 追加された場合に備えて再確認する。
     */
    const hasPendingItems =
      useCommandQueueStore
        .getState()
        .items.some(
          (item) =>
            item.status === "pending",
        );

    if (hasPendingItems) {
      void startCommandQueueEngine();
    }
  }
}

/**
 * キューエンジンを開始する。
 *
 * すでに実行中の場合は既存のPromiseを返す。
 */
export function startCommandQueueEngine(): Promise<void> {
  if (enginePromise) {
    return enginePromise;
  }

  stopRequested = false;
  enginePromise = processQueue();

  return enginePromise;
}

/**
 * 実行中のキューへ停止を要求する。
 *
 * 現在実行中のコマンドは即時中断せず、
 * 待機中のコマンドをキャンセルする。
 */
export function requestCommandQueueStop(): void {
  stopRequested = true;

  useCommandQueueStore
    .getState()
    .cancelPendingItems();
}

/**
 * 複数コマンドをキューへ追加し、
 * キューエンジンを開始する。
 */
export function enqueueCommandsAndStart(
  input: EnqueueCommandsInput,
): void {
  const queueItems =
    useCommandQueueStore
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

/**
 * 単一コマンドをキューへ追加し、
 * キューエンジンを開始する。
 */
export function enqueueSingleCommandAndStart(
  input: {
    gachaItemId: string;
    gachaItemName: string;
    command: GeneratedActionCommand;
  },
): void {
  enqueueCommandsAndStart({
    gachaItemId: input.gachaItemId,
    gachaItemName:
      input.gachaItemName,
    commands: [input.command],
  });
}