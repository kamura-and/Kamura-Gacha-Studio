import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import type {
  RuntimeEvent,
} from "../../types/RuntimeEvent";

import {
  FakePlugin,
} from "./FakePlugin";

describe(
  "FakePlugin",
  () => {
    it(
      "starts with a publish function",
      () => {
        const plugin =
          new FakePlugin();

        const publish =
          vi.fn();

        expect(
          plugin.isStarted(),
        ).toBe(
          false,
        );

        plugin.start(
          publish,
        );

        expect(
          plugin.isStarted(),
        ).toBe(
          true,
        );
      },
    );

    it(
      "publishes an arbitrary RuntimeEvent",
      () => {
        const plugin =
          new FakePlugin();

        const publish =
          vi.fn();

        const event =
          createRuntimeEvent();

        plugin.start(
          publish,
        );

        plugin.emit(
          event,
        );

        expect(
          publish,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          publish,
        ).toHaveBeenCalledWith(
          event,
        );
      },
    );

    it(
      "publishes a simulated gift event",
      () => {
        const plugin =
          new FakePlugin();

        const publish =
          vi.fn();

        plugin.start(
          publish,
        );

        const event =
          plugin.emitGift({
            giftId:
              "rose",

            giftName:
              "Rose",

            userId:
              "user-1",

            userName:
              "Kamura",

            repeatCount:
              5,

            diamondCount:
              1,
          });

        expect(
          publish,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          publish,
        ).toHaveBeenCalledWith(
          event,
        );

        expect(
          event.category,
        ).toBe(
          "gift",
        );

        expect(
          event.type,
        ).toBe(
          "gift.received",
        );

        expect(
          event.source,
        ).toEqual({
          kind:
            "plugin",

          pluginId:
            "fake",
        });

        expect(
          event.payload,
        ).toEqual({
          giftId:
            "rose",

          giftName:
            "Rose",

          userId:
            "user-1",

          userName:
            "Kamura",

          repeatCount:
            5,

          diamondCount:
            1,
        });

        expect(
          event.metadata,
        ).toEqual({
          tags: [
            "simulated",
            "fake-plugin",
          ],
        });
      },
    );

    it(
      "uses default gift values",
      () => {
        const plugin =
          new FakePlugin();

        const publish =
          vi.fn();

        plugin.start(
          publish,
        );

        const event =
          plugin.emitGift({
            giftId:
              "rose",

            userId:
              "user-1",
          });

        expect(
          event.payload,
        ).toEqual({
          giftId:
            "rose",

          giftName:
            "rose",

          userId:
            "user-1",

          userName:
            "user-1",

          repeatCount:
            1,

          diamondCount:
            0,
        });
      },
    );

    it(
      "stops publishing after stop",
      () => {
        const plugin =
          new FakePlugin();

        const publish =
          vi.fn();

        plugin.start(
          publish,
        );

        plugin.stop();

        expect(
          plugin.isStarted(),
        ).toBe(
          false,
        );

        expect(
          () => {
            plugin.emit(
              createRuntimeEvent(),
            );
          },
        ).toThrow(
          'Plugin "fake-plugin" has not been started.',
        );

        expect(
          publish,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "throws when emitting before start",
      () => {
        const plugin =
          new FakePlugin();

        expect(
          () => {
            plugin.emitGift({
              giftId:
                "rose",

              userId:
                "user-1",
            });
          },
        ).toThrow(
          'Plugin "fake-plugin" has not been started.',
        );
      },
    );

    it(
      "creates a different id for each gift event",
      () => {
        const plugin =
          new FakePlugin();

        plugin.start(
          vi.fn(),
        );

        const firstEvent =
          plugin.emitGift({
            giftId:
              "rose",

            userId:
              "user-1",
          });

        const secondEvent =
          plugin.emitGift({
            giftId:
              "rose",

            userId:
              "user-1",
          });

        expect(
          firstEvent.id,
        ).not.toBe(
          secondEvent.id,
        );
      },
    );
  },
);

function createRuntimeEvent():
  RuntimeEvent {
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
        "FakePlugin.test",
    },

    payload: {},

    occurredAt:
      1,

    metadata: {},
  };
}