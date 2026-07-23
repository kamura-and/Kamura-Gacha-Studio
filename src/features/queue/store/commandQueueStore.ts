import { create } from "zustand";

import type {
  CommandQueueItem,
  EnqueueCommandsInput,
  QueueItemStatus,
} from "../types/commandQueue";

type CommandQueueState = {
  items: CommandQueueItem[];
  isProcessing: boolean;
  currentItemId: string | null;

  enqueueCommands: (input: EnqueueCommandsInput) => CommandQueueItem[];

  setProcessing: (isProcessing: boolean) => void;

  setCurrentItem: (itemId: string | null) => void;

  updateItemStatus: (
    itemId: string,
    status: QueueItemStatus,
    options?: {
      error?: string;
    },
  ) => void;

  cancelPendingItems: () => void;

  clearFinishedItems: () => void;

  clearAllItems: () => void;
};

function createQueueItemId(): string {
  if (
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.randomUUID === "function"
  ) {
    return globalThis.crypto.randomUUID();
  }

  return `queue-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const useCommandQueueStore = create<CommandQueueState>((set) => ({
  items: [],
  isProcessing: false,
  currentItemId: null,

  enqueueCommands: ({ gachaItemId, gachaItemName, commands }) => {
    const createdAt = Date.now();

    const queueItems: CommandQueueItem[] = commands
      .filter((command) => command.enabled)
      .map((command, index) => ({
        id: createQueueItemId(),
        gachaItemId,
        gachaItemName,
        command: {
          ...command,
        },
        status: "pending",
        createdAt: createdAt + index,
      }));

    set((state) => ({
      items: [...state.items, ...queueItems],
    }));

    return queueItems;
  },

  setProcessing: (isProcessing) => {
    set({ isProcessing });
  },

  setCurrentItem: (currentItemId) => {
    set({ currentItemId });
  },

  updateItemStatus: (itemId, status, options) => {
    const now = Date.now();

    set((state) => ({
      items: state.items.map((item) => {
        if (item.id !== itemId) {
          return item;
        }

        const nextItem: CommandQueueItem = {
          ...item,
          status,
        };

        if (status === "running") {
          nextItem.startedAt = now;
          nextItem.finishedAt = undefined;
          nextItem.error = undefined;
        }

        if (
          status === "completed" ||
          status === "failed" ||
          status === "cancelled"
        ) {
          nextItem.finishedAt = now;
        }

        if (status === "failed") {
          nextItem.error = options?.error ?? "不明なエラーが発生しました。";
        }

        if (status !== "failed") {
          nextItem.error = undefined;
        }

        return nextItem;
      }),
    }));
  },

  cancelPendingItems: () => {
    const now = Date.now();

    set((state) => ({
      items: state.items.map((item) => {
        if (item.status !== "pending") {
          return item;
        }

        return {
          ...item,
          status: "cancelled",
          finishedAt: now,
          error: undefined,
        };
      }),
    }));
  },

  clearFinishedItems: () => {
    set((state) => ({
      items: state.items.filter(
        (item) =>
          item.status === "pending" || item.status === "running",
      ),
    }));
  },

  clearAllItems: () => {
    set((state) => {
      const runningItems = state.items.filter(
        (item) => item.status === "running",
      );

      return {
        items: runningItems,
      };
    });
  },
}));