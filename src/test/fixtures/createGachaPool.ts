import type {
  GachaPool,
} from "@/features/pools/types/pool";

type CreatePoolInput = {
  id?: string;
  effectId?: string;
  enabled?: boolean;
  weight?: number;
  entries?: GachaPool["entries"];
};

export function createGachaPool(
  input: CreatePoolInput = {},
): GachaPool {
  const now =
    new Date().toISOString();

  return {
    id:
      input.id ??
      "pool-1",

    name:
      "Test Pool",

    description:
      "",

    enabled:
      input.enabled ??
      true,

    createdAt:
      now,

    updatedAt:
      now,

    entries:
      input.entries ?? [
        {
          id:
            "entry-1",

          effectId:
            input.effectId ??
            "effect-1",

          weight:
            input.weight ??
            100,
        },
      ],
  };
}