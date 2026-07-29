import type {
  Trigger,
} from "@/features/triggers/types/Trigger";

type CreateGiftTriggerInput = {
  id?: string;
  giftId?: string;
  repeatCount?: number;
  enabled?: boolean;
  gachaPoolId?: string;
};

export function createGiftTrigger(
  input: CreateGiftTriggerInput = {},
): Trigger {
  const now = Date.now();

  return {
    id:
      input.id ??
      crypto.randomUUID(),

    name: "Gift Trigger",

    description: "",

    enabled:
      input.enabled ?? true,

    pluginId:
      "tiktok-live",

    eventCategory:
      "gift",

    eventType:
      "gift",

    conditions: [
      {
        id: crypto.randomUUID(),
        field: "giftId",
        operator: "equals",
        value:
          input.giftId ??
          "rose",
      },
      {
        id: crypto.randomUUID(),
        field: "repeatCount",
        operator:
          "greaterThanOrEqual",
        value:
          input.repeatCount ??
          1,
      },
    ],

    matchMode: "all",

    gachaPoolId:
      input.gachaPoolId ??
      "pool-1",

    createdAt: now,

    updatedAt: now,
  };
}