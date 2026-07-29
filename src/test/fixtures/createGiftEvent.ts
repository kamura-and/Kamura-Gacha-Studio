import type {
  RuntimeEvent,
} from "@/features/runtime/types";

import type {
  PluginId,
} from "@/features/plugins/types/plugin";

type GiftPayload = {
  giftId: string;
  repeatCount: number;
  userId?: string;
};

type CreateGiftEventInput = {
  giftId?: string;
  repeatCount?: number;
  pluginId?: PluginId;
  userId?: string;
};

export function createGiftEvent(
  input: CreateGiftEventInput = {},
): RuntimeEvent<GiftPayload> {
  return {
    id:
      crypto.randomUUID(),

    category:
      "gift",

    type:
      "gift",

    source: {
      kind:
        "plugin",

      pluginId:
        input.pluginId ??
        "tiktok-live",
    },

    payload: {
      giftId:
        input.giftId ??
        "rose",

      repeatCount:
        input.repeatCount ??
        1,

      userId:
        input.userId,
    },

    occurredAt:
      Date.now(),

    metadata: {},
  };
}