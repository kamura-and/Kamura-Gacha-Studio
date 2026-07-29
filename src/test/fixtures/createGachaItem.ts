import type {
  GachaItem,
} from "@/features/gacha/types/gacha";

type CreateGachaItemInput = {
  id?: string;
  enabled?: boolean;
  effectId?: string | null;
  commands?: GachaItem["commands"];
};

export function createGachaItem(
  input: CreateGachaItemInput = {},
): GachaItem {
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