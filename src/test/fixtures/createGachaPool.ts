import type {
  GachaPool,
} from "@/features/pools/types/pool";

type CreatePoolInput = {
  id?: string;
  itemId?: string;
  enabled?: boolean;
  weight?: number;
  entries?: GachaPool["entries"];
};

export function createGachaPool(
  input: CreatePoolInput = {},
): GachaPool {
  const now = new Date().toISOString();

  return {
    id:
      input.id ??
      "pool-1",

    name: "Test Pool",

    description: "",

    enabled:
      input.enabled ?? true,

    createdAt: now,

    updatedAt: now,

    entries:
      input.entries ?? [
        {
          id: "entry-1",

          gachaItemId:
            input.itemId ??
            "item-1",

          weight:
            input.weight ??
            100,
        },
      ],
  };
}