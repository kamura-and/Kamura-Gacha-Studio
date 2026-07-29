import { describe, expect, it } from "vitest";

import { resolveGachaItemExecution } from "./GachaItemExecutionResolver";

import type { EffectDefinition } from "@/features/effects/types/effectDefinition";
import type { GeneratedActionCommand } from "@/core/actions";

import { createGachaItem } from "@/test/fixtures/createGachaItem";

const generatedCommands: GeneratedActionCommand[] = [
  {
    type: "minecraft",
    value: "say hello",
    delay: 0,
    enabled: true,
  },
];

const effect: EffectDefinition = {
  id: "effect-1",
  name: "Test Effect",
  description: "",
  actions: [],
  tags: [],
  favorite: false,
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

describe("GachaItemExecutionResolver", () => {
  it("resolves commands from an effect", () => {
    const item = createGachaItem({
      effectId: effect.id,
    });

    const result = resolveGachaItemExecution(
      item,
      (id) => (id === effect.id ? effect : undefined),
      () => generatedCommands,
    );

    expect(result).not.toBeNull();
    expect(result?.source).toBe("effect");
    expect(result?.effect).toBe(effect);
    expect(result?.commands).toEqual(generatedCommands);
  });

  it("resolves legacy commands", () => {
    const item = createGachaItem({
      commands: [
        {
          id: "legacy-1",
          type: "minecraft",
          value: "say legacy",
          delay: 0,
          enabled: true,
        },
      ],
    });

    const result = resolveGachaItemExecution(
      item,
      () => undefined,
      () => [],
    );

    expect(result).not.toBeNull();
    expect(result?.source).toBe("legacy");
    expect(result?.commands).toHaveLength(1);
    expect(result?.commands[0].value).toBe("say legacy");
  });

  it("returns null when effect is missing", () => {
    const item = createGachaItem({
      effectId: "missing-effect",
    });

    const result = resolveGachaItemExecution(
      item,
      () => undefined,
      () => generatedCommands,
    );

    expect(result).toBeNull();
  });

  it("returns null when effect has no enabled commands", () => {
    const item = createGachaItem({
      effectId: effect.id,
    });

    const result = resolveGachaItemExecution(
      item,
      () => effect,
      () => [
        {
          type: "minecraft",
          value: "say disabled",
          delay: 0,
          enabled: false,
        },
      ],
    );

    expect(result).toBeNull();
  });

  it("returns null when legacy commands are all disabled", () => {
    const item = createGachaItem({
      commands: [
        {
          id: "legacy-1",
          type: "minecraft",
          value: "say disabled",
          delay: 0,
          enabled: false,
        },
      ],
    });

    const result = resolveGachaItemExecution(
      item,
      () => undefined,
      () => [],
    );

    expect(result).toBeNull();
  });
});