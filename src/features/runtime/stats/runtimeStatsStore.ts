import { create } from "zustand";

import {
  runtimeEventBus,
} from "@/features/runtime/eventBus/RuntimeEventBus";

type RuntimeStatsState = {
  giftEvents: number[];

  recordGift:
    (occurredAt: number) => void;
};

export const useRuntimeStatsStore =
  create<RuntimeStatsState>(
    (set) => ({
      giftEvents: [],

      recordGift: (
        occurredAt,
      ) => {
        set(
          (state) => ({
            giftEvents: [
              ...state.giftEvents,
              occurredAt,
            ],
          }),
        );
      },
    }),
  );

runtimeEventBus.subscribe(
  (event) => {
    if (
      event.category !==
      "gift"
    ) {
      return;
    }

    useRuntimeStatsStore
      .getState()
      .recordGift(
        event.occurredAt,
      );
  },
);