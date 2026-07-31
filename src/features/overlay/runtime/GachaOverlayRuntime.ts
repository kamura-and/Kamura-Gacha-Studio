import {
    isTauri,
} from "@tauri-apps/api/core";

import {
    emitTo,
} from "@tauri-apps/api/event";

import {
    getCurrentWindow,
} from "@tauri-apps/api/window";

import {
    GACHA_OVERLAY_EVENT_NAME,
    GACHA_OVERLAY_WINDOW_LABEL,
} from "../types/GachaOverlayEvent";

import type {
    GachaOverlayEvent,
    GachaOverlayRarity,
} from "../types/GachaOverlayEvent";

export type GachaOverlayListener = (
    event: GachaOverlayEvent,
) => void;

export type ShowGachaOverlayResultInput = {
    itemId: string;

    itemName: string;

    description?: string;

    rarity: GachaOverlayRarity;

    imageDataUrl?: string | null;
};

export class GachaOverlayRuntime {
    private readonly listeners =
        new Set<GachaOverlayListener>();

    public subscribe(
        listener: GachaOverlayListener,
    ): () => void {
        this.listeners.add(listener);

        return () => {
            this.listeners.delete(listener);
        };
    }

    public showDrawing(
        poolName: string,
    ): void {
        this.publish({
            type: "drawing",

            poolName,
        });
    }

    public showResult(
        input: ShowGachaOverlayResultInput,
    ): void {
        this.publish({
            type: "result",

            itemId:
                input.itemId,

            itemName:
                input.itemName,

            description:
                input.description?.trim() ?? "",

            rarity:
                input.rarity,

            imageDataUrl:
                input.imageDataUrl ?? null,
        });
    }

    public showError(
        message: string,
    ): void {
        this.publish({
            type: "error",

            message,
        });
    }

    public hide(): void {
        this.publish({
            type: "hide",
        });
    }

    /**
     * OverlayウィンドウがTauriイベントを受信した際に使用します。
     *
     * ここでは別ウィンドウへ再送信せず、
     * 現在のウィンドウ内の購読者だけに通知します。
     */
    public receive(
        event: GachaOverlayEvent,
    ): void {
        this.notifyListeners(event);
    }

    private publish(
        event: GachaOverlayEvent,
    ): void {
        this.notifyListeners(event);

        if (!isTauri()) {
            return;
        }

        const currentWindowLabel =
            getCurrentWindow().label;

        if (
            currentWindowLabel ===
            GACHA_OVERLAY_WINDOW_LABEL
        ) {
            return;
        }

        void emitTo<GachaOverlayEvent>(
            GACHA_OVERLAY_WINDOW_LABEL,
            GACHA_OVERLAY_EVENT_NAME,
            event,
        ).catch((error: unknown) => {
            console.error(
                "[GachaOverlayRuntime]",
                "Overlayウィンドウへのイベント送信に失敗しました。",
                error,
            );
        });
    }

    private notifyListeners(
        event: GachaOverlayEvent,
    ): void {
        for (
            const listener of
            this.listeners
        ) {
            try {
                listener(event);
            } catch (error) {
                console.error(
                    "[GachaOverlayRuntime]",
                    "オーバーレイイベントの処理に失敗しました。",
                    error,
                );
            }
        }
    }
}

export const gachaOverlayRuntime =
    new GachaOverlayRuntime();