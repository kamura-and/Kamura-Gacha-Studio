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
                    "[TikFinityPlugin]",
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
                    "[TikFinityPlugin]",
                    "WebSocket error",
                    event,
                );
            },
        );


        socket.addEventListener(
            "close",
            () => {
                console.info(
                    "[TikFinityPlugin]",
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
     */
    private handleMessage(
        rawData: unknown,
        publish: PublishRuntimeEvent,
    ): void {
        console.info(
            "[TikFinityPlugin]",
            "Raw WebSocket message",
            rawData,
        );

        const message =
            parseTikFinityMessage(
                rawData,
            );

        if (!message) {
            return;
        }


        console.info(
            "[TikFinityPlugin]",
            "Message received",
            message,
        );


        const runtimeEvent =
            mapTikFinityMessage(
                message,
            );

        if (!runtimeEvent) {
            return;
        }


        console.info(
            "[TikFinityPlugin]",
            "RuntimeEvent published",
            {
                eventId:
                    runtimeEvent.id,

                category:
                    runtimeEvent.category,

                type:
                    runtimeEvent.type,
            },
        );


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
            "[TikFinityPlugin]",
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
            "[TikFinityPlugin]",
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
            "[TikFinityPlugin]",
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


export const tikFinityPlugin =
    new TikFinityPlugin();