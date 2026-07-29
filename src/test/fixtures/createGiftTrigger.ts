import type {
  Trigger,
  TriggerActivationPolicy,
  TriggerAggregationScope,
} from "@/features/triggers/types/Trigger";

type CreateGiftTriggerInput = {
  id?: string;

  giftId?: string;
  repeatCount?: number;

  enabled?: boolean;
  gachaPoolId?: string;

  conditions?:
    Trigger["conditions"];

  activationPolicy?:
    TriggerActivationPolicy;

  aggregationScope?:
    TriggerAggregationScope;

  threshold?: number;
  countField?: string;
  userIdField?: string;
};

export function createGiftTrigger(
  input: CreateGiftTriggerInput = {},
): Trigger {
  const now =
    Date.now();

  return {
    id:
      input.id ??
      crypto.randomUUID(),

    name:
      "Gift Trigger",

    description:
      "",

    enabled:
      input.enabled ??
      true,

    pluginId:
      "tiktok-live",

    eventCategory:
      "gift",

    eventType:
      "gift",

    conditions:
      input.conditions ?? [
        {
          id:
            crypto.randomUUID(),

          field:
            "giftId",

          operator:
            "equals",

          value:
            input.giftId ??
            "rose",
        },

        {
          id:
            crypto.randomUUID(),

          field:
            "repeatCount",

          operator:
            "greaterThanOrEqual",

          value:
            input.repeatCount ??
            1,
        },
      ],

    matchMode:
      "all",

    activationPolicy:
      input.activationPolicy,

    aggregationScope:
      input.aggregationScope,

    threshold:
      input.threshold,

    countField:
      input.countField,

    userIdField:
      input.userIdField,

    gachaPoolId:
      input.gachaPoolId ??
      "pool-1",

    createdAt:
      now,

    updatedAt:
      now,
  };
}