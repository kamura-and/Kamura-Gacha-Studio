import {
  create,
} from "zustand";

import type {
  RuntimeEvent,
} from "./RuntimeEvent";

const DEFAULT_EVENT_LIMIT = 100;

type RuntimeEventStoreState = {
  events: RuntimeEvent[];
  eventLimit: number;

  append: (
    event: RuntimeEvent,
  ) => void;

  clear: () => void;

  setEventLimit: (
    eventLimit: number,
  ) => void;
};

export const useRuntimeEventStore =
  create<RuntimeEventStoreState>(
    (set) => ({
      events: [],
      eventLimit:
        DEFAULT_EVENT_LIMIT,

      append: (event) =>
        set((state) => ({
          events: [
            event,
            ...state.events,
          ].slice(
            0,
            state.eventLimit,
          ),
        })),

      clear: () =>
        set({
          events: [],
        }),

      setEventLimit: (
        eventLimit,
      ) => {
        const normalizedLimit =
          normalizeEventLimit(
            eventLimit,
          );

        set((state) => ({
          eventLimit:
            normalizedLimit,

          events:
            state.events.slice(
              0,
              normalizedLimit,
            ),
        }));
      },
    }),
  );

function normalizeEventLimit(
  eventLimit: number,
): number {
  if (
    !Number.isFinite(eventLimit)
  ) {
    return DEFAULT_EVENT_LIMIT;
  }

  return Math.max(
    1,
    Math.floor(eventLimit),
  );
}