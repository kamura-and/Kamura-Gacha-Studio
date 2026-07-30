import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  executeTrigger,
} from "./RuntimeEngine";

import {
  createGiftTrigger,
} from "@/test/fixtures/createGiftTrigger";

import {
  createGachaItem,
} from "@/test/fixtures/createGachaItem";

import {
  createGachaPool,
} from "@/test/fixtures/createGachaPool";

describe(
  "RuntimeEngine",
  () => {
    it(
      "queues commands for a trigger",
      () => {
        const pool =
          createGachaPool({
            entries: [
              {
                id:
                  "entry-1",

                gachaItemId:
                  "item-1",

                weight:
                  100,
              },
            ],
          });

        const trigger =
          createGiftTrigger({
            gachaPoolId:
              pool.id,
          });

        const item =
          createGachaItem({
            id:
              "item-1",

            commands: [
              {
                id:
                  "command-1",

                type:
                  "minecraft",

                value:
                  "say hello",

                delay:
                  0,

                enabled:
                  true,
              },
            ],
          });

        const enqueueCommands =
          vi.fn();

        const result =
          executeTrigger(
            trigger,
            {
              findPoolById:
                (id) =>
                  id === pool.id
                    ? pool
                    : undefined,

              findGachaItemById:
                (id) =>
                  id === item.id
                    ? item
                    : undefined,

              findEffectById:
                () =>
                  undefined,

              buildEffectCommands:
                () =>
                  [],

              enqueueCommands,

              random:
                () =>
                  0,
            },
          );

        expect(
          result.status,
        ).toBe(
          "queued",
        );

        expect(
          result.triggerId,
        ).toBe(
          trigger.id,
        );

        expect(
          result.poolId,
        ).toBe(
          pool.id,
        );

        expect(
          result.gachaItemId,
        ).toBe(
          item.id,
        );

        expect(
          result.commandCount,
        ).toBe(
          1,
        );

        expect(
          enqueueCommands,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          enqueueCommands,
        ).toHaveBeenCalledWith({
          gachaItemId:
            "item-1",

          gachaItemName:
            item.name,

          commands: [
            expect.objectContaining({
              type:
                "minecraft",

              value:
                "say hello",

              enabled:
                true,
            }),
          ],
        });
      },
    );

    it(
      "returns pool-not-found when the pool does not exist",
      () => {
        const trigger =
          createGiftTrigger({
            gachaPoolId:
              "missing-pool",
          });

        const enqueueCommands =
          vi.fn();

        const result =
          executeTrigger(
            trigger,
            {
              findPoolById:
                () =>
                  undefined,

              findGachaItemById:
                () =>
                  undefined,

              findEffectById:
                () =>
                  undefined,

              buildEffectCommands:
                () =>
                  [],

              enqueueCommands,
            },
          );

        expect(
          result,
        ).toEqual({
          triggerId:
            trigger.id,

          poolId:
            "missing-pool",

          commandCount:
            0,

          status:
            "pool-not-found",
        });

        expect(
          enqueueCommands,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "returns item-not-selected when the pool cannot select an item",
      () => {
        const pool =
          createGachaPool({
            entries:
              [],
          });

        const trigger =
          createGiftTrigger({
            gachaPoolId:
              pool.id,
          });

        const enqueueCommands =
          vi.fn();

        const result =
          executeTrigger(
            trigger,
            {
              findPoolById:
                (id) =>
                  id === pool.id
                    ? pool
                    : undefined,

              findGachaItemById:
                () =>
                  undefined,

              findEffectById:
                () =>
                  undefined,

              buildEffectCommands:
                () =>
                  [],

              enqueueCommands,
            },
          );

        expect(
          result.status,
        ).toBe(
          "item-not-selected",
        );

        expect(
          result.commandCount,
        ).toBe(
          0,
        );

        expect(
          enqueueCommands,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "returns execution-not-resolved when item execution cannot be resolved",
      () => {
        const pool =
          createGachaPool({
            entries: [
              {
                id:
                  "entry-1",

                gachaItemId:
                  "item-1",

                weight:
                  100,
              },
            ],
          });

        const trigger =
          createGiftTrigger({
            gachaPoolId:
              pool.id,
          });

        const item =
          createGachaItem({
            id:
              "item-1",

            commands:
              [],
          });

        const enqueueCommands =
          vi.fn();

        const result =
          executeTrigger(
            trigger,
            {
              findPoolById:
                (id) =>
                  id === pool.id
                    ? pool
                    : undefined,

              findGachaItemById:
                (id) =>
                  id === item.id
                    ? item
                    : undefined,

              findEffectById:
                () =>
                  undefined,

              buildEffectCommands:
                () =>
                  [],

              enqueueCommands,

              random:
                () =>
                  0,
            },
          );

        expect(
          result.status,
        ).toBe(
          "execution-not-resolved",
        );

        expect(
          result.gachaItemId,
        ).toBe(
          item.id,
        );

        expect(
          result.commandCount,
        ).toBe(
          0,
        );

        expect(
          enqueueCommands,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "counts only enabled commands",
      () => {
        const pool =
          createGachaPool({
            entries: [
              {
                id:
                  "entry-1",

                gachaItemId:
                  "item-1",

                weight:
                  100,
              },
            ],
          });

        const trigger =
          createGiftTrigger({
            gachaPoolId:
              pool.id,
          });

        const item =
          createGachaItem({
            id:
              "item-1",

            commands: [
              {
                id:
                  "command-1",

                type:
                  "minecraft",

                value:
                  "say enabled",

                delay:
                  0,

                enabled:
                  true,
              },

              {
                id:
                  "command-2",

                type:
                  "minecraft",

                value:
                  "say disabled",

                delay:
                  0,

                enabled:
                  false,
              },
            ],
          });

        const enqueueCommands =
          vi.fn();

        const result =
          executeTrigger(
            trigger,
            {
              findPoolById:
                () =>
                  pool,

              findGachaItemById:
                () =>
                  item,

              findEffectById:
                () =>
                  undefined,

              buildEffectCommands:
                () =>
                  [],

              enqueueCommands,

              random:
                () =>
                  0,
            },
          );

        expect(
          result.status,
        ).toBe(
          "queued",
        );

        expect(
          result.commandCount,
        ).toBe(
          1,
        );

        expect(
          enqueueCommands,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );
  },
);