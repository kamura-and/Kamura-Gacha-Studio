import {
    usePluginConfigStore,
} from "@/features/plugins/store/pluginConfigStore";

import {
    fetchTikFinityGiftCatalog,
} from "@/features/triggers/gifts/TikFinityGiftCatalogClient";

import {
    applyGiftCatalogSync,
} from "@/features/triggers/gifts/GiftCatalogSyncService";

import {
    pluginHostService,
} from "@/features/runtime/plugin-host/PluginHostService";

import type {
    PluginHostMessage,
    PluginHostUnsubscribe,
} from "@/features/runtime/plugin-host/types";

import {
    tikFinityGiftComboTracker,
} from "./TikFinityGiftComboTracker";


const ROOM_ID_RESOLVE_TIMEOUT_MS =
    15_000;


type TikTokConnectedPayload = {
    uniqueId: string;
    roomId: string;
};


export class TikFinityLiveSessionService {
    private isLive =
        false;

    private currentRoomId:
        string | undefined;

    private syncingPromise:
        Promise<number> | undefined;


    /**
     * TikFinityのLIVE状態変更を受け取る。
     *
     * LIVE開始時は現在のRoom IDを取得し、
     * Gift Catalogを自動同期する。
     *
     * LIVE終了時はセッション情報と
     * ギフトコンボ状態を破棄する。
     */
    public handleLiveStatusChange(
        isLive: boolean,
    ): void {
        if (!isLive) {
            this.resetSession();

            console.info(
                "[TikFinityLiveSessionService]",
                "LIVE終了を検知しました。",
            );

            return;
        }


        if (this.isLive) {
            return;
        }


        this.isLive =
            true;


        console.info(
            "[TikFinityLiveSessionService]",
            "LIVE開始を検知しました。",
        );


        void this.syncGiftCatalog()
            .catch(
                (
                    error: unknown,
                ) => {
                    console.error(
                        "[TikFinityLiveSessionService]",
                        "LIVE開始時のGift Catalog自動同期に失敗しました。",
                        error,
                    );
                },
            );
    }


    /**
     * 現在のLIVEからRoom IDを解決して
     * Gift Catalogを同期する。
     *
     * 手動の「ギフト一覧更新」からも
     * 将来的にこの処理を再利用する。
     */
    public async syncGiftCatalog():
    Promise<number> {
        if (this.syncingPromise) {
            return this.syncingPromise;
        }


        const task =
            this.performGiftCatalogSync();


        this.syncingPromise =
            task;


        try {
            return await task;
        } finally {
            if (
                this.syncingPromise ===
                task
            ) {
                this.syncingPromise =
                    undefined;
            }
        }
    }


    /**
     * 現在取得済みのRoom IDを返す。
     *
     * LIVE終了時にはundefinedへ戻る。
     */
    public getCurrentRoomId():
    string | undefined {
        return this.currentRoomId;
    }


    public isCurrentLive():
    boolean {
        return this.isLive;
    }


    private async performGiftCatalogSync():
    Promise<number> {
        const username =
            this.getConfiguredTikTokUsername();


        if (!username) {
            throw new Error(
                "TikTokユーザー名が設定されていません。",
            );
        }


        if (
            !pluginHostService.isRunning()
        ) {
            throw new Error(
                "Plugin Hostが起動していません。",
            );
        }


        /*
         * 同一LIVE内ですでにRoom IDを取得済みなら、
         * 再接続せずそのRoom IDを再利用する。
         *
         * 手動更新ボタンを押した場合も
         * 余計なTikTok接続を増やさない。
         */
        const roomId =
            this.currentRoomId ??
            await this.resolveRoomId(
                username,
            );


        this.currentRoomId =
            roomId;


        const gifts =
            await fetchTikFinityGiftCatalog({
                roomId,
            });


        /*
         * fetch成功後にのみCatalogへ反映する。
         *
         * APIエラー時は既存Catalogを保持する。
         */
        applyGiftCatalogSync(
            gifts,
        );


        console.info(
            "[TikFinityLiveSessionService]",
            "Gift Catalogを同期しました。",
            {
                username,
                roomId,
                giftCount:
                    gifts.length,
            },
        );


        return gifts.length;
    }


    /**
     * Plugin Hostの既存TikTokClientを
     * 一時的に接続してRoom IDを取得する。
     *
     * Room ID取得後はTikTok接続を切断する。
     * TikFinity側のLIVE接続はそのまま維持される。
     */
    private async resolveRoomId(
        username: string,
    ): Promise<string> {
        const connectedPromise =
            this.waitForTikTokConnected();


        try {
            await pluginHostService.sendCommand({
                requestId:
                    `tiktok-connect-room-id-${Date.now()}`,

                type:
                    "tiktok.connect",

                payload: {
                    uniqueId:
                        username,
                },
            });


            const connected =
                await connectedPromise;


            console.info(
                "[TikFinityLiveSessionService]",
                "Room IDを取得しました。",
                {
                    uniqueId:
                        connected.uniqueId,

                    roomId:
                        connected.roomId,
                },
            );


            return connected.roomId;
        } finally {
            /*
             * Room ID取得専用の補助接続なので、
             * 接続成功・失敗にかかわらず
             * TikTokClientを切断できる状態なら切断を試みる。
             */
            try {
                if (
                    pluginHostService.isRunning()
                ) {
                    await pluginHostService.sendCommand({
                        requestId:
                            `tiktok-disconnect-room-id-${Date.now()}`,

                        type:
                            "tiktok.disconnect",

                        payload: {},
                    });
                }
            } catch (
                error: unknown
            ) {
                console.warn(
                    "[TikFinityLiveSessionService]",
                    "Room ID取得後のTikTok補助接続の切断に失敗しました。",
                    error,
                );
            }
        }
    }


    /**
     * Plugin Hostから送られる
     * tiktok.connectedを1回だけ待つ。
     */
    private waitForTikTokConnected():
    Promise<TikTokConnectedPayload> {
        return new Promise(
            (
                resolve,
                reject,
            ) => {
                let unsubscribe:
                    PluginHostUnsubscribe | undefined;


                const timeoutId =
                    window.setTimeout(
                        () => {
                            unsubscribe?.();

                            reject(
                                new Error(
                                    "TikTok Room IDの取得がタイムアウトしました。",
                                ),
                            );
                        },
                        ROOM_ID_RESOLVE_TIMEOUT_MS,
                    );


                unsubscribe =
                    pluginHostService.onMessage(
                        (
                            message,
                        ) => {
                            if (
                                message.type ===
                                "tiktok.connected"
                            ) {
                                const payload =
                                    parseTikTokConnectedPayload(
                                        message,
                                    );


                                if (!payload) {
                                    return;
                                }


                                window.clearTimeout(
                                    timeoutId,
                                );

                                unsubscribe?.();

                                resolve(
                                    payload,
                                );

                                return;
                            }


                            if (
                                message.type ===
                                "tiktok.error"
                            ) {
                                window.clearTimeout(
                                    timeoutId,
                                );

                                unsubscribe?.();


                                const messageText =
                                    typeof message.payload.message ===
                                        "string"
                                        ? message.payload.message
                                        : "TikTok LIVEへの接続に失敗しました。";


                                reject(
                                    new Error(
                                        messageText,
                                    ),
                                );
                            }
                        },
                    );
            },
        );
    }


    private getConfiguredTikTokUsername():
    string {
        const settings =
            usePluginConfigStore
                .getState()
                .configs["tiktok-live"]
                .settings;


        const username =
            settings.username;


        if (
            typeof username !==
            "string"
        ) {
            return "";
        }


        return username
            .trim()
            .replace(
                /^@/,
                "",
            );
    }


    /**
     * LIVEセッション固有の状態を破棄する。
     *
     * Room IDだけでなく、
     * TikFinityのコンボ累積値もここで破棄する。
     *
     * これにより前回LIVEのrepeatCountが
     * 次回LIVEへ持ち越されない。
     */
    private resetSession():
    void {
        this.isLive =
            false;

        this.currentRoomId =
            undefined;

        this.syncingPromise =
            undefined;

        tikFinityGiftComboTracker
            .reset();


        console.info(
            "[TikFinityLiveSessionService]",
            "LIVEセッション状態をリセットしました。",
        );
    }
}


function parseTikTokConnectedPayload(
    message: PluginHostMessage,
): TikTokConnectedPayload | null {
    const uniqueId =
        message.payload.uniqueId;

    const roomId =
        message.payload.roomId;


    if (
        typeof uniqueId !==
            "string" ||
        uniqueId.trim().length ===
            0 ||
        (
            typeof roomId !==
                "string" &&
            typeof roomId !==
                "number"
        )
    ) {
        return null;
    }


    const normalizedRoomId =
        String(
            roomId,
        ).trim();


    if (!normalizedRoomId) {
        return null;
    }


    return {
        uniqueId:
            uniqueId.trim(),

        roomId:
            normalizedRoomId,
    };
}


export const tikFinityLiveSessionService =
    new TikFinityLiveSessionService();