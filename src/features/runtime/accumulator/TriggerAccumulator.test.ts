import {
  describe,
  expect,
  it,
} from "vitest";

import {
  TriggerAccumulator,
} from "./TriggerAccumulator";

import {
  createGiftEvent,
} from "@/test/fixtures/createGiftEvent";

import {
  createGiftTrigger,
} from "@/test/fixtures/createGiftTrigger";

function createGiftOnlyConditions() {
  return [
    {
      id:
        crypto.randomUUID(),

      field:
        "giftId",

      operator:
        "equals" as const,

      value:
        "rose",
    },
  ];
}

describe(
  "TriggerAccumulator",
  () => {
    it(
      "activates every matching event",
      () => {
        const accumulator =
          new TriggerAccumulator();

        const trigger =
          createGiftTrigger({
            activationPolicy:
              "every-event",
          });

        const first =
          accumulator.evaluate(
            createGiftEvent(),
            [trigger],
          );

        const second =
          accumulator.evaluate(
            createGiftEvent(),
            [trigger],
          );

        expect(first).toEqual([
          trigger,
        ]);

        expect(second).toEqual([
          trigger,
        ]);
      },
    );

    it(
      "activates once when the threshold is reached",
      () => {
        const accumulator =
          new TriggerAccumulator();

        const trigger =
          createGiftTrigger({
            activationPolicy:
              "once-threshold",

            aggregationScope:
              "global",

            threshold:
              2,

            conditions:
              createGiftOnlyConditions(),
          });

        const first =
          accumulator.evaluate(
            createGiftEvent({
              repeatCount: 1,
            }),
            [trigger],
          );

        const second =
          accumulator.evaluate(
            createGiftEvent({
              repeatCount: 1,
            }),
            [trigger],
          );

        const third =
          accumulator.evaluate(
            createGiftEvent({
              repeatCount: 10,
            }),
            [trigger],
          );

        expect(first).toEqual([]);
        expect(second).toEqual([
          trigger,
        ]);
        expect(third).toEqual([]);
      },
    );

    it(
      "activates every time another threshold is crossed",
      () => {
        const accumulator =
          new TriggerAccumulator();

        const trigger =
          createGiftTrigger({
            activationPolicy:
              "every-threshold",

            aggregationScope:
              "global",

            threshold:
              2,

            conditions:
              createGiftOnlyConditions(),
          });

        const first =
          accumulator.evaluate(
            createGiftEvent({
              repeatCount: 1,
            }),
            [trigger],
          );

        const second =
          accumulator.evaluate(
            createGiftEvent({
              repeatCount: 1,
            }),
            [trigger],
          );

        const third =
          accumulator.evaluate(
            createGiftEvent({
              repeatCount: 4,
            }),
            [trigger],
          );

        expect(first).toEqual([]);

        expect(second).toEqual([
          trigger,
        ]);

        expect(third).toEqual([
          trigger,
          trigger,
        ]);
      },
    );

    it(
      "shares global accumulation between users",
      () => {
        const accumulator =
          new TriggerAccumulator();

        const trigger =
          createGiftTrigger({
            activationPolicy:
              "once-threshold",

            aggregationScope:
              "global",

            threshold:
              2,

            conditions:
              createGiftOnlyConditions(),
          });

        const first =
          accumulator.evaluate(
            createGiftEvent({
              userId:
                "user-1",
            }),
            [trigger],
          );

        const second =
          accumulator.evaluate(
            createGiftEvent({
              userId:
                "user-2",
            }),
            [trigger],
          );

        expect(first).toEqual([]);

        expect(second).toEqual([
          trigger,
        ]);
      },
    );

    it(
      "accumulates separately for each user",
      () => {
        const accumulator =
          new TriggerAccumulator();

        const trigger =
          createGiftTrigger({
            activationPolicy:
              "once-threshold",

            aggregationScope:
              "per-user",

            threshold:
              2,

            conditions:
              createGiftOnlyConditions(),
          });

        const user1First =
          accumulator.evaluate(
            createGiftEvent({
              userId:
                "user-1",
            }),
            [trigger],
          );

        const user2First =
          accumulator.evaluate(
            createGiftEvent({
              userId:
                "user-2",
            }),
            [trigger],
          );

        const user1Second =
          accumulator.evaluate(
            createGiftEvent({
              userId:
                "user-1",
            }),
            [trigger],
          );

        const user2Second =
          accumulator.evaluate(
            createGiftEvent({
              userId:
                "user-2",
            }),
            [trigger],
          );

        expect(
          user1First,
        ).toEqual([]);

        expect(
          user2First,
        ).toEqual([]);

        expect(
          user1Second,
        ).toEqual([
          trigger,
        ]);

        expect(
          user2Second,
        ).toEqual([
          trigger,
        ]);
      },
    );

    it(
      "clears accumulated state on reset",
      () => {
        const accumulator =
          new TriggerAccumulator();

        const trigger =
          createGiftTrigger({
            activationPolicy:
              "once-threshold",

            threshold:
              2,

            conditions:
              createGiftOnlyConditions(),
          });

        accumulator.evaluate(
          createGiftEvent(),
          [trigger],
        );

        accumulator.reset();

        const result =
          accumulator.evaluate(
            createGiftEvent(),
            [trigger],
          );

        expect(result).toEqual([]);
      },
    );
  },
);