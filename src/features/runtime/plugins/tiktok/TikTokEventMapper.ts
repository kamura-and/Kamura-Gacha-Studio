import type {
    PluginId,
} from "@/features/plugins/types/plugin";

import type {
    RuntimeEvent,
} from "../../types/RuntimeEvent";

import type {
    TikTokGiftEvent,
} from "./types";

/**
 * TikTokイベントを
 * RuntimeEventへ変換する。
 */
export class TikTokEventMapper {

    private readonly pluginId:
        PluginId;

    public constructor(
        pluginId: PluginId =
            "tiktok-live",
    ) {
        this.pluginId =
            pluginId;
    }

    /**
     * Giftイベントを
     * RuntimeEventへ変換する。
     */
    public mapGift(
        gift: TikTokGiftEvent,
    ): RuntimeEvent {

        return {
            id:
                this.createEventId(),

            category:
                "gift",

            type:
                "gift.received",

            source: {
                kind:
                    "plugin",

                pluginId:
                    this.pluginId,
            },

            payload: {
                giftId:
                    gift.giftId,

                giftName:
                    gift.giftName,

                userId:
                    gift.userId,

                userName:
                    gift.userName,

                repeatCount:
                    gift.repeatCount,

                diamondCount:
                    gift.diamondCount,
            },

            occurredAt:
                gift.occurredAt,

            metadata: {
                tags: [
                    "tiktok",
                ],
            },
        };
    }

    private createEventId():
        string {

        return [
            this.pluginId,
            Date.now(),
            crypto.randomUUID(),
        ].join(
            "-",
        );
    }
}