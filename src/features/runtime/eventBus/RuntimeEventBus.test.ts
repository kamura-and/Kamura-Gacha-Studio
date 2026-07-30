import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  RuntimeEventBus,
} from "./RuntimeEventBus";

import type {
  RuntimeEvent,
} from "../types/RuntimeEvent";

describe(
  "RuntimeEventBus",
  () => {
    it(
      "publishes an event to a subscribed listener",
      () => {
        const bus =
          new RuntimeEventBus();

        const listener =
          vi.fn();

        const event =
          createRuntimeEvent();

        bus.subscribe(
          listener,
        );

        bus.publish(
          event,
        );

        expect(
          listener,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          listener,
        ).toHaveBeenCalledWith(
          event,
        );
      },
    );

    it(
      "reports the number of subscribed listeners",
      () => {
        const bus =
          new RuntimeEventBus();

        expect(
          bus.listenerCount(),
        ).toBe(
          0,
        );

        bus.subscribe(
          vi.fn(),
        );

        expect(
          bus.listenerCount(),
        ).toBe(
          1,
        );

        bus.subscribe(
          vi.fn(),
        );

        expect(
          bus.listenerCount(),
        ).toBe(
          2,
        );
      },
    );

    it(
      "does not publish to an unsubscribed listener",
      () => {
        const bus =
          new RuntimeEventBus();

        const listener =
          vi.fn();

        const unsubscribe =
          bus.subscribe(
            listener,
          );

        unsubscribe();

        bus.publish(
          createRuntimeEvent(),
        );

        expect(
          listener,
        ).not.toHaveBeenCalled();

        expect(
          bus.listenerCount(),
        ).toBe(
          0,
        );
      },
    );

    it(
      "clears all subscribed listeners",
      () => {
        const bus =
          new RuntimeEventBus();

        const firstListener =
          vi.fn();

        const secondListener =
          vi.fn();

        bus.subscribe(
          firstListener,
        );

        bus.subscribe(
          secondListener,
        );

        expect(
          bus.listenerCount(),
        ).toBe(
          2,
        );

        bus.clear();

        expect(
          bus.listenerCount(),
        ).toBe(
          0,
        );

        bus.publish(
          createRuntimeEvent(),
        );

        expect(
          firstListener,
        ).not.toHaveBeenCalled();

        expect(
          secondListener,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "does not register the same listener more than once",
      () => {
        const bus =
          new RuntimeEventBus();

        const listener =
          vi.fn();

        bus.subscribe(
          listener,
        );

        bus.subscribe(
          listener,
        );

        expect(
          bus.listenerCount(),
        ).toBe(
          1,
        );

        bus.publish(
          createRuntimeEvent(),
        );

        expect(
          listener,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );

    it(
      "keeps the current publish stable when a listener unsubscribes during notification",
      () => {
        const bus =
          new RuntimeEventBus();

        const secondListener =
          vi.fn();

        const unsubscribeSecond =
          bus.subscribe(
            secondListener,
          );

        const firstListener =
          vi.fn(
            () => {
              unsubscribeSecond();
            },
          );

        bus.clear();

        bus.subscribe(
          firstListener,
        );

        bus.subscribe(
          secondListener,
        );

        bus.publish(
          createRuntimeEvent(),
        );

        expect(
          firstListener,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          secondListener,
        ).toHaveBeenCalledTimes(
          1,
        );

        bus.publish(
          createRuntimeEvent({
            id:
              "event-2",
          }),
        );

        expect(
          firstListener,
        ).toHaveBeenCalledTimes(
          2,
        );

        expect(
          secondListener,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );
  },
);

function createRuntimeEvent(
  overrides:
    Partial<RuntimeEvent> = {},
): RuntimeEvent {
  return {
    id:
      "event-1",

    category:
      "system",

    type:
      "system.test",

    source: {
      kind:
        "runtime",

      module:
        "RuntimeEventBus.test",
    },

    payload: {},

    occurredAt:
      1,

    metadata: {},

    ...overrides,
  };
}