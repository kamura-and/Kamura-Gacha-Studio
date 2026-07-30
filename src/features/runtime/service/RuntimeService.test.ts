import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  RuntimeService,
} from "./RuntimeService";

import type {
  RuntimeEvent,
} from "../types/RuntimeEvent";

describe(
  "RuntimeService",
  () => {
    it(
      "returns no executions when there are no enabled triggers",
      () => {
        const enqueueCommands =
          vi.fn();

        const service =
          new RuntimeService({
            findEnabledTriggers:
              () => [],

            findPoolById:
              () => undefined,

            findGachaItemById:
              () => undefined,

            findEffectById:
              () => undefined,

            buildEffectCommands:
              () => [],

            enqueueCommands,
          });

        const event: RuntimeEvent = {
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
              "RuntimeService.test",
          },

          payload: {},

          occurredAt:
            1,

          metadata: {},
        };

        const result =
          service.processRuntimeEvent(
            event,
          );

        expect(result).toEqual({
          eventId:
            "event-1",

          matchedTriggerCount:
            0,

          executions: [],
        });

        expect(
          enqueueCommands,
        ).not.toHaveBeenCalled();
      },
    );
  },
);