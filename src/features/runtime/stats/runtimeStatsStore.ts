import { create } from "zustand";

import {
  createJSONStorage,
  persist,
} from "zustand/middleware";

import {
  runtimeEventBus,
} from "@/features/runtime/eventBus/RuntimeEventBus";

type GiftStatEvent = {
  occurredAt: number;
  repeatCount: number;
  diamondCount: number;
};

type RuntimeStatsState = {
  giftEvents: GiftStatEvent[];

  recordGift: (
    giftEvent: GiftStatEvent,
  ) => void;
};

function isSameDay(
  leftTimestamp: number,
  rightTimestamp: number,
): boolean {
  const left =
    new Date(leftTimestamp);

  const right =
    new Date(rightTimestamp);

  return (
    left.getFullYear() ===
      right.getFullYear()
    && left.getMonth() ===
      right.getMonth()
    && left.getDate() ===
      right.getDate()
  );
}

function getTodayGiftEvents(
  giftEvents: GiftStatEvent[],
  now = Date.now(),
): GiftStatEvent[] {
  return giftEvents.filter(
    (giftEvent) =>
      isSameDay(
        giftEvent.occurredAt,
        now,
      ),
  );
}

function normalizePersistedGiftEvents(
  value: unknown,
): GiftStatEvent[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(
      (
        item,
      ): GiftStatEvent | null => {
        /*
         * 旧形式:
         * giftEvents: number[]
         */
        if (
          typeof item ===
            "number"
          && Number.isFinite(
            item,
          )
        ) {
          return {
            occurredAt:
              item,

            repeatCount:
              1,

            diamondCount:
              0,
          };
        }

        /*
         * 新形式:
         * giftEvents: GiftStatEvent[]
         */
        if (
          !isRecord(
            item,
          )
        ) {
          return null;
        }

        const occurredAt =
          toFiniteNumber(
            item.occurredAt,
          );

        if (
          occurredAt ===
          null
        ) {
          return null;
        }

        return {
          occurredAt,

          repeatCount:
            toPositiveInteger(
              item.repeatCount,
              1,
            ),

          diamondCount:
            toNonNegativeNumber(
              item.diamondCount,
              0,
            ),
        };
      },
    )
    .filter(
      (
        item,
      ): item is GiftStatEvent =>
        item !== null,
    );
}

function isRecord(
  value: unknown,
): value is Record<
  string,
  unknown
> {
  return (
    typeof value ===
      "object"
    && value !==
      null
    && !Array.isArray(
      value,
    )
  );
}

function toFiniteNumber(
  value: unknown,
): number | null {
  if (
    typeof value !==
      "number"
    || !Number.isFinite(
      value,
    )
  ) {
    return null;
  }

  return value;
}

function toPositiveInteger(
  value: unknown,
  fallback: number,
): number {
  if (
    typeof value !==
      "number"
    || !Number.isFinite(
      value,
    )
  ) {
    return fallback;
  }

  return Math.max(
    1,
    Math.floor(
      value,
    ),
  );
}

function toNonNegativeNumber(
  value: unknown,
  fallback: number,
): number {
  if (
    typeof value !==
      "number"
    || !Number.isFinite(
      value,
    )
  ) {
    return fallback;
  }

  return Math.max(
    0,
    value,
  );
}

export const useRuntimeStatsStore =
  create<RuntimeStatsState>()(
    persist(
      (set) => ({
        giftEvents: [],

        recordGift: (
          giftEvent,
        ) => {
          set(
            (state) => ({
              /*
               * 当日分だけを残し、
               * 新しいギフト統計を追加する。
               */
              giftEvents: [
                ...getTodayGiftEvents(
                  state.giftEvents,
                  giftEvent.occurredAt,
                ),
                giftEvent,
              ],
            }),
          );
        },
      }),
      {
        name:
          "kamura-runtime-stats",

        storage:
          createJSONStorage(
            () =>
              localStorage,
          ),

        partialize: (
          state,
        ) => ({
          giftEvents:
            getTodayGiftEvents(
              state.giftEvents,
            ),
        }),

        merge: (
          persistedState,
          currentState,
        ) => {
          const persisted =
            persistedState as
              | {
                  giftEvents?: unknown;
                }
              | undefined;

          const giftEvents =
            normalizePersistedGiftEvents(
              persisted
                ?.giftEvents,
            );

          return {
            ...currentState,

            /*
             * 旧number[]形式もここで新形式へ変換する。
             * 前日以前のデータは復元しない。
             */
            giftEvents:
              getTodayGiftEvents(
                giftEvents,
              ),
          };
        },
      },
    ),
  );

runtimeEventBus.subscribe(
  (event) => {
    if (
      event.category !==
      "gift"
    ) {
      return;
    }

    if (
      !isRecord(
        event.payload,
      )
    ) {
      return;
    }

    useRuntimeStatsStore
      .getState()
      .recordGift({
        occurredAt:
          event.occurredAt,

        repeatCount:
          toPositiveInteger(
            event.payload
              .repeatCount,
            1,
          ),

        diamondCount:
          toNonNegativeNumber(
            event.payload
              .diamondCount,
            0,
          ),
      });
  },
);