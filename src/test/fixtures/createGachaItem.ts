import type {
  LegacyGachaItem,
} from "@/features/gacha/types/gacha";

type CreateGachaItemInput = {
  id?: string;
  enabled?: boolean;
  effectId?: string | null;
  commands?: LegacyGachaItem["commands"];
};

export function createGachaItem(
  input: CreateGachaItemInput = {},
): LegacyGachaItem {
  return {
    id: input.id ?? "item-1",

    name: "Test Item",

    description: "",

    effectId:
      input.effectId ?? null,

    commands:
      input.commands ?? [],

    rarity: "common",

    isEnabled:
      input.enabled ?? true,

    createdAt:
      new Date().toISOString(),
  };
}