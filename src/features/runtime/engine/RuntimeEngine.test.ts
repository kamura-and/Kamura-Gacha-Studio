import { describe, expect, it, vi } from "vitest";

import { processRuntimeEvent } from "./RuntimeEngine";

import { createGiftEvent } from "@/test/fixtures/createGiftEvent";
import { createGiftTrigger } from "@/test/fixtures/createGiftTrigger";
import { createGachaItem } from "@/test/fixtures/createGachaItem";
import { createGachaPool } from "@/test/fixtures/createGachaPool";

describe("RuntimeEngine", () => {
  it("queues commands for a matching trigger", () => {
    const pool = createGachaPool({
      entries: [
        {
          id: "entry-1",
          gachaItemId: "item-1",
          weight: 100,
        },
      ],
    });

    const trigger = createGiftTrigger({
      gachaPoolId: pool.id,
    });

    const item = createGachaItem({
      id: "item-1",
      commands: [
        {
          id: "command-1",
          type: "minecraft",
          value: "say hello",
          delay: 0,
          enabled: true,
        },
      ],
    });

    const enqueueCommands = vi.fn();

    const result = processRuntimeEvent(
      createGiftEvent(),
      {
        findEnabledTriggers: () => [trigger],

        findPoolById: (id) =>
          id === pool.id
            ? pool
            : undefined,

        findGachaItemById: (id) =>
          id === item.id
            ? item
            : undefined,

        findEffectById: () => undefined,

        buildEffectCommands: () => [],

        enqueueCommands,

        random: () => 0,
      },
    );

    expect(
      result.matchedTriggerCount,
    ).toBe(1);

    expect(
      result.executions,
    ).toHaveLength(1);

    expect(
      result.executions[0].status,
    ).toBe("queued");

    expect(
      enqueueCommands,
    ).toHaveBeenCalledTimes(1);

    expect(
      enqueueCommands,
    ).toHaveBeenCalledWith({
      gachaItemId: "item-1",
      gachaItemName: item.name,
      commands: [
        expect.objectContaining({
          type: "minecraft",
          value: "say hello",
          enabled: true,
        }),
      ],
    });
  });
});