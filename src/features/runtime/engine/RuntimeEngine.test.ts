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
  createGachaPool,
} from "@/test/fixtures/createGachaPool";

import type {
  EffectDefinition,
} from "@/features/effects/types/effectDefinition";

function createEffect(
  overrides: Partial<EffectDefinition> = {},
): EffectDefinition {
  const now =
    Date.now();

  return {
    id:
      "effect-1",

    name:
      "Test Effect",

    description:
      "Test Effect Description",

    actions:
      [],

    tags:
      [],

    favorite:
      false,

    rarity:
      "common",

    imageDataUrl:
      null,

    soundId:
      null,

    isEnabled:
      true,

    createdAt:
      now,

    updatedAt:
      now,

    ...overrides,
  };
}

describe(
  "RuntimeEngine",
  () => {
    it(
      "queues commands for an effect prize",
      () => {
        const effect =
          createEffect({
            id:
              "effect-1",
          });

        const pool =
          createGachaPool({
            entries: [
              {
                id:
                  "entry-1",

                effectId:
                  effect.id,

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

              findEffectById:
                (id) =>
                  id === effect.id
                    ? effect
                    : undefined,

              buildEffectCommands:
                () => [
                  {
                    type:
                      "minecraft",

                    value:
                      "say hello",

                    enabled:
                      true,
                  },
                ],

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
          effect.id,
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
            effect.id,

          gachaItemName:
            effect.name,

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
      "returns item-not-selected when the pool has no entries",
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
      "returns execution-not-resolved when the effect does not exist",
      () => {
        const pool =
          createGachaPool({
            entries: [
              {
                id:
                  "entry-1",

                effectId:
                  "missing-effect",

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

        const enqueueCommands =
          vi.fn();

        const result =
          executeTrigger(
            trigger,
            {
              findPoolById:
                () =>
                  pool,

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
          "missing-effect",
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
        const effect =
          createEffect();

        const pool =
          createGachaPool({
            entries: [
              {
                id:
                  "entry-1",

                effectId:
                  effect.id,

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

        const enqueueCommands =
          vi.fn();

        const result =
          executeTrigger(
            trigger,
            {
              findPoolById:
                () =>
                  pool,

              findEffectById:
                () =>
                  effect,

              buildEffectCommands:
                () => [
                  {
                    type:
                      "minecraft",

                    value:
                      "say enabled",

                    enabled:
                      true,
                  },

                  {
                    type:
                      "minecraft",

                    value:
                      "say disabled",

                    enabled:
                      false,
                  },
                ],

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