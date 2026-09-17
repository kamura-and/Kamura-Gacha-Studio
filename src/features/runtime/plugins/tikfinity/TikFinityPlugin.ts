import type {
    PluginId,
} from "../../../plugins/types/plugin";

import type {
    PublishRuntimeEvent,
    RuntimePlugin,
} from "../../pluginRuntime/RuntimePlugin";

import {
    mapTikFinityMessage,
} from "./TikFinityEventMapper";

import type {
    TikFinityMessage,
} from "./TikFinityEventMapper";

import {
    tikFinityLiveSessionService,
} from "./TikFinityLiveSessionService";


const TIKFINITY_WEBSOCKET_URL =
    "ws://localhost:21213/";


/**
 * TikFinity Desktop Appと接続するRuntimePlugin。
 *
 * TikFinity Event API:
 * ws://localhost:21213/
 *
 * WebSocketから受信したイベントを
 * RuntimeEventへ変換してRuntimeへ発行する。
 */
export class TikFinityPlugin
    implements RuntimePlugin {
    public readonly id:
        PluginId =
        "tiktok-live";

    private socket:
        WebSocket | undefined;


    /**
     * TikFinityへの接続を開始する。
     */
    public start(
        publish: PublishRuntimeEvent,
    ): void {
        if (this.socket) {
            return;
        }


        const socket =
            new WebSocket(
                TIKFINITY_WEBSOCKET_URL,
            );


        this.socket =
            socket;


        socket.addEventListener(
            "open",
            () => {
                console.info(
                    "[TikFinity]",
                    "Connected",
                    TIKFINITY_WEBSOCKET_URL,
                );
            },
        );


        socket.addEventListener(
            "message",
            (
                event,
            ) => {
                this.handleMessage(
                    event.data,
                    publish,
                );
            },
        );


        socket.addEventListener(
            "error",
            (
                event,
            ) => {
                console.error(
                    "[TikFinity]",
                    "WebSocket error",
                    event,
                );
            },
        );


        socket.addEventListener(
            "close",
            () => {
                console.info(
                    "[TikFinity]",
                    "Disconnected",
                );


                if (
                    this.socket ===
                    socket
                ) {
                    this.socket =
                        undefined;
                }
            },
        );
    }


    /**
     * TikFinityとの接続を終了する。
     */
    public stop(): void {
        const socket =
            this.socket;


        this.socket =
            undefined;


        if (!socket) {
            return;
        }


        socket.close();
    }


    /**
     * WebSocket接続済みか返す。
     */
    public isConnected():
    boolean {
        return (
            this.socket?.readyState ===
            WebSocket.OPEN
        );
    }


    /**
     * Pluginが接続処理中、
     * または接続済みか返す。
     */
    public isStarted():
    boolean {
        return (
            this.socket !==
            undefined
        );
    }


    /**
     * TikFinity WebSocketから受信した
     * メッセージを処理する。
     *
     * 通常イベントでは巨大なraw payloadを
     * Consoleへ出さない。
     *
     * 必要な情報だけをイベント種別ごとに
     * 短い診断ログとして残す。
     */
    private handleMessage(
        rawData: unknown,
        publish: PublishRuntimeEvent,
    ): void {
        const message =
            parseTikFinityMessage(
                rawData,
            );


        if (!message) {
            return;
        }


        /*
         * LIVE開始 / 終了イベントだけを
         * LiveSessionServiceへ通知する。
         *
         * Room ID取得やGift Catalog同期は
         * TikFinityPlugin自身では行わない。
         */
        if (
            message.event ===
            "liveStatusChange"
        ) {
            const isLive =
                readLiveStatus(
                    message.data,
                );


            if (
                isLive !==
                undefined
            ) {
                console.info(
                    "[LIVE]",
                    isLive
                        ? "Started"
                        : "Ended",
                );


                tikFinityLiveSessionService
                    .handleLiveStatusChange(
                        isLive,
                    );
            }
        }


        /*
         * TikFinity payload内にRoom ID候補が
         * 含まれていた場合のみ記録する。
         *
         * 通常イベントでは何も出さない。
         */
        const roomId =
            findRoomIdCandidate(
                message.data,
            );


        if (roomId) {
            console.info(
                "[TikFinity]",
                "Room ID candidate",
                {
                    event:
                        message.event,

                    roomId,
                },
            );
        }


        /*
         * gift等のRuntimeEvent変換は
         * Mapperへ任せる。
         *
         * Giftの詳細診断ログも
         * Mapper側で出す。
         */
        const runtimeEvent =
            mapTikFinityMessage(
                message,
            );


        if (!runtimeEvent) {
            return;
        }


        /*
         * GiftについてはMapper側で
         * 詳細な[GIFT]ログを出すため、
         * ここでは重複ログを出さない。
         *
         * 将来gift以外のRuntimeEventが
         * 追加された場合のみpublishを記録する。
         */
        if (
            runtimeEvent.category !==
            "gift"
        ) {
            console.info(
                "[EVENT]",
                {
                    eventId:
                        runtimeEvent.id,

                    category:
                        runtimeEvent.category,

                    type:
                        runtimeEvent.type,
                },
            );
        }


        publish(
            runtimeEvent,
        );
    }
}


/**
 * WebSocket MessageEvent.dataを
 * TikFinityMessageへ変換する。
 *
 * TikFinityは通常JSON文字列を送信する。
 * 不正なデータはRuntimeへ流さず無視する。
 */
function parseTikFinityMessage(
    rawData: unknown,
): TikFinityMessage | null {
    if (
        typeof rawData !==
        "string"
    ) {
        console.warn(
            "[TikFinity]",
            "文字列ではないWebSocketメッセージを無視しました。",
            rawData,
        );

        return null;
    }


    let parsed:
        unknown;


    try {
        parsed =
            JSON.parse(
                rawData,
            );
    } catch (
        error
    ) {
        console.warn(
            "[TikFinity]",
            "WebSocketメッセージのJSON解析に失敗しました。",
            {
                rawData,
                error,
            },
        );

        return null;
    }


    if (
        !isTikFinityMessage(
            parsed,
        )
    ) {
        console.warn(
            "[TikFinity]",
            "TikFinityメッセージ形式ではないデータを無視しました。",
            parsed,
        );

        return null;
    }


    return parsed;
}


/**
 * unknownがTikFinity Event APIの
 * 基本メッセージ形式か確認する。
 */
function isTikFinityMessage(
    value: unknown,
): value is TikFinityMessage {
    if (
        typeof value !==
            "object" ||
        value ===
            null ||
        Array.isArray(
            value,
        )
    ) {
        return false;
    }


    const record =
        value as Record<
            string,
            unknown
        >;


    return (
        typeof record.event ===
            "string" &&
        "data" in record
    );
}


/**
 * liveStatusChange.dataから
 * LIVE状態を安全に取得する。
 */
function readLiveStatus(
    value: unknown,
): boolean | undefined {
    if (
        !isRecord(
            value,
        )
    ) {
        console.warn(
            "[TikFinity]",
            "liveStatusChangeのdataがobjectではありません。",
            value,
        );

        return undefined;
    }


    if (
        typeof value.isLive !==
        "boolean"
    ) {
        console.warn(
            "[TikFinity]",
            "liveStatusChangeにisLiveがありません。",
            value,
        );

        return undefined;
    }


    return value.isLive;
}


/**
 * TikFinity payload内から
 * Room IDらしい値を探す。
 *
 * 現段階では調査用。
 * ここで見つかった値を正式なRoom IDとして
 * 保存・利用する処理は行わない。
 */
function findRoomIdCandidate(
    value: unknown,
): string | undefined {
    if (
        !isRecord(
            value,
        )
    ) {
        return undefined;
    }


    const directRoomId =
        firstIdValue(
            value.roomId,
            value.roomID,
            value.room_id,
            value.roomid,
        );


    if (directRoomId) {
        return directRoomId;
    }


    const roomInfo =
        value.roomInfo;


    if (
        isRecord(
            roomInfo,
        )
    ) {
        const roomInfoId =
            firstIdValue(
                roomInfo.roomId,
                roomInfo.roomID,
                roomInfo.room_id,
                roomInfo.roomid,
                roomInfo.id,
            );


        if (roomInfoId) {
            return roomInfoId;
        }
    }


    const room =
        value.room;


    if (
        isRecord(
            room,
        )
    ) {
        const roomId =
            firstIdValue(
                room.roomId,
                room.roomID,
                room.room_id,
                room.roomid,
                room.id,
            );


        if (roomId) {
            return roomId;
        }
    }


    return undefined;
}


/**
 * string / numberの候補から
 * 最初の有効なIDを文字列として返す。
 */
function firstIdValue(
    ...values: unknown[]
): string | undefined {
    for (
        const value of values
    ) {
        if (
            typeof value ===
            "string"
        ) {
            const trimmed =
                value.trim();


            if (trimmed) {
                return trimmed;
            }
        }


        if (
            typeof value ===
                "number" &&
            Number.isFinite(
                value,
            )
        ) {
            return String(
                value,
            );
        }
    }


    return undefined;
}


/**
 * unknownが通常のobjectか確認する。
 */
function isRecord(
    value: unknown,
): value is Record<
    string,
    unknown
> {
    return (
        typeof value ===
            "object" &&
        value !==
            null &&
        !Array.isArray(
            value,
        )
    );
}


export const tikFinityPlugin =
    new TikFinityPlugin();