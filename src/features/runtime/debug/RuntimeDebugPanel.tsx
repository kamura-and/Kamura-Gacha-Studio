import {
    useState,
} from "react";

import {
    fetchTikFinityGiftCatalog,
} from "@/features/triggers/gifts/TikFinityGiftCatalogClient";

import {
    applyGiftCatalogSync,
} from "@/features/triggers/gifts/GiftCatalogSyncService";

import {
    mapTikFinityMessage,
} from "../plugins/tikfinity/TikFinityEventMapper";

import {
    runtimeEventBus,
} from "../eventBus/RuntimeEventBus";

import {
    useRuntimeDebug,
} from "./useRuntimeDebug";

import {
    useRuntimeEvents,
} from "./useRuntimeEvents";

import type {
    RuntimeEvent,
} from "../types/RuntimeEvent";


/**
 * Runtimeへ疑似イベントを送信し、
 * RuntimeEventBusを流れたイベントを確認する
 * 開発用デバッグパネル。
 */
export function RuntimeDebugPanel() {
    const {
        emitGift,
        isStarted,
    } = useRuntimeDebug();

    const {
        events,
        clearEvents,
    } = useRuntimeEvents();

    const [
        lastEvent,
        setLastEvent,
    ] = useState<
        RuntimeEvent | undefined
    >();

    const [
        errorMessage,
        setErrorMessage,
    ] = useState<
        string | undefined
    >();

    const [
        giftCatalogRoomId,
        setGiftCatalogRoomId,
    ] = useState("");

    const [
        giftCatalogSyncMessage,
        setGiftCatalogSyncMessage,
    ] = useState<
        string | undefined
    >();


    /**
     * 既存FakePluginから
     * バラのRuntimeEventを送信する。
     */
    const handleEmitGift =
        () => {
            try {
                const event =
                    emitGift({
                        giftId:
                            "rose",

                        giftName:
                            "バラ",

                        userId:
                            "debug-user",

                        userName:
                            "デバッグユーザー",

                        repeatCount:
                            1,

                        diamondCount:
                            1,

                        sourcePluginId:
                            "tiktok-live",
                    });

                setLastEvent(
                    event,
                );

                setErrorMessage(
                    undefined,
                );
            } catch (
                error
            ) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "不明なエラーが発生しました。";

                setErrorMessage(
                    message,
                );
            }
        };


    /**
     * TikFinityから届く想定の
     * 疑似gift JSONをMapperへ渡し、
     * RuntimeEventBusへ送信する。
     */
    const handleEmitTikFinityGift =
        () => {
            try {
                const event =
                    mapTikFinityMessage({
                        event:
                            "gift",

                        data: {
                            giftId:
                                "rose",

                            giftName:
                                "バラ",

                            repeatCount:
                                1,

                            repeatEnd:
                                true,

                            diamondCount:
                                1,

                            user: {
                                id:
                                    "debug-user",

                                uniqueId:
                                    "debug_user",

                                nickname:
                                    "デバッグユーザー",
                            },
                        },
                    });

                if (!event) {
                    throw new Error(
                        "TikFinityイベントをRuntimeEventへ変換できませんでした。",
                    );
                }

                runtimeEventBus.publish(
                    event,
                );

                setLastEvent(
                    event,
                );

                setErrorMessage(
                    undefined,
                );
            } catch (
                error
            ) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "不明なエラーが発生しました。";

                setErrorMessage(
                    message,
                );
            }
        };


    /**
     * Gift Catalog同期処理を
     * LIVEなしで確認する。
     */
    const handleGiftCatalogSyncTest =
        () => {
            try {
                applyGiftCatalogSync([
                    {
                        id:
                            "5655",

                        name:
                            "バラ",

                        coinValue:
                            1,

                        source:
                            "tikfinity",

                        status:
                            "active",
                    },
                ]);

                console.log(
                    "[RuntimeDebugPanel] Gift Catalog sync test completed.",
                    {
                        giftId:
                            "5655",

                        giftName:
                            "バラ",
                    },
                );

                setGiftCatalogSyncMessage(
                    "テスト用Gift Catalogを同期しました。",
                );

                setErrorMessage(
                    undefined,
                );
            } catch (
                error
            ) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Gift Catalog同期テストに失敗しました。";

                setGiftCatalogSyncMessage(
                    undefined,
                );

                setErrorMessage(
                    message,
                );
            }
        };


    /**
     * 指定したRoom IDを使って
     * TikFinity Gift Catalog APIから
     * 実際のGift Catalogを取得する。
     */
    const handleFetchGiftCatalog =
        async () => {
            const roomId =
                giftCatalogRoomId.trim();

            if (
                roomId.length ===
                0
            ) {
                setErrorMessage(
                    "TikFinity Room IDを入力してください。",
                );

                return;
            }

            try {
                setGiftCatalogSyncMessage(
                    "TikFinity Gift Catalogを取得しています...",
                );

                setErrorMessage(
                    undefined,
                );

                const gifts =
                    await fetchTikFinityGiftCatalog({
                        roomId,
                    });

                applyGiftCatalogSync(
                    gifts,
                );

                console.log(
                    "[RuntimeDebugPanel] TikFinity Gift Catalog synced.",
                    {
                        roomId,

                        giftCount:
                            gifts.length,
                    },
                );

                setGiftCatalogSyncMessage(
                    `${gifts.length}件のGift Catalogを同期しました。`,
                );

                setErrorMessage(
                    undefined,
                );
            } catch (
                error
            ) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "TikFinity Gift Catalogの取得に失敗しました。";

                setGiftCatalogSyncMessage(
                    undefined,
                );

                setErrorMessage(
                    message,
                );
            }
        };


    return (
        <section className="space-y-6">
            <header>
                <h1 className="text-2xl font-black text-slate-950">
                    ランタイムデバッグ
                </h1>

                <p className="mt-1 text-sm font-medium text-slate-500">
                    疑似イベントを送信し、
                    RuntimeEventBusの受信状況を確認します。
                </p>
            </header>


            <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-sm font-black text-slate-900">
                            Runtime Event Test
                        </h2>

                        <p className="mt-1 text-sm font-medium text-slate-500">
                            Fake Plugin状態：
                            <span className="ml-1 font-bold text-slate-900">
                                {isStarted()
                                    ? "起動中"
                                    : "停止中"}
                            </span>
                        </p>
                    </div>


                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={
                                handleEmitGift
                            }
                            className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-black text-white transition hover:bg-violet-700"
                        >
                            Fake バラ
                        </button>

                        <button
                            type="button"
                            onClick={
                                handleEmitTikFinityGift
                            }
                            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-black text-white transition hover:bg-slate-800"
                        >
                            TikFinity バラ
                        </button>

                        <button
                            type="button"
                            onClick={
                                handleGiftCatalogSyncTest
                            }
                            className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700 transition hover:bg-emerald-100"
                        >
                            Gift Catalog同期テスト
                        </button>
                    </div>
                </div>


                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div>
                        <h3 className="text-sm font-black text-slate-900">
                            TikFinity Gift Catalog
                        </h3>

                        <p className="mt-1 text-xs font-medium text-slate-500">
                            Room IDを指定して、
                            TikFinityから実際のギフト一覧を取得します。
                        </p>
                    </div>


                    <div className="mt-4 flex flex-wrap items-end gap-2">
                        <label className="min-w-64 flex-1">
                            <span className="mb-1 block text-xs font-black text-slate-500">
                                TikFinity Room ID
                            </span>

                            <input
                                type="text"
                                value={
                                    giftCatalogRoomId
                                }
                                onChange={
                                    (
                                        event,
                                    ) => {
                                        setGiftCatalogRoomId(
                                            event.target.value,
                                        );
                                    }
                                }
                                placeholder="例: 7680129533424503553"
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-900 outline-none transition focus:border-violet-400"
                            />
                        </label>

                        <button
                            type="button"
                            onClick={
                                handleFetchGiftCatalog
                            }
                            disabled={
                                giftCatalogRoomId.trim().length ===
                                0
                            }
                            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            TikFinity Gift Catalog取得
                        </button>
                    </div>


                    {giftCatalogSyncMessage !==
                        undefined && (
                        <p className="mt-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                            {giftCatalogSyncMessage}
                        </p>
                    )}
                </div>


                {errorMessage !==
                    undefined && (
                    <p
                        role="alert"
                        className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700"
                    >
                        {errorMessage}
                    </p>
                )}


                {lastEvent !==
                    undefined && (
                    <div className="mt-5 rounded-xl bg-slate-50 p-4">
                        <h3 className="text-xs font-black tracking-wide text-slate-500">
                            最後に送信したイベント
                        </h3>

                        <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
                            <EventDetail
                                label="Event ID"
                                value={
                                    lastEvent.id
                                }
                            />

                            <EventDetail
                                label="Category"
                                value={
                                    lastEvent.category
                                }
                            />

                            <EventDetail
                                label="Type"
                                value={
                                    lastEvent.type
                                }
                            />
                        </dl>
                    </div>
                )}
            </section>


            <section className="rounded-2xl border border-slate-200 bg-white">
                <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                    <div>
                        <h2 className="text-sm font-black text-slate-900">
                            イベント受信履歴
                        </h2>

                        <p className="mt-1 text-xs font-medium text-slate-500">
                            受信件数：
                            {events.length}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={
                            clearEvents
                        }
                        disabled={
                            events.length ===
                            0
                        }
                        className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        履歴をクリア
                    </button>
                </header>


                {events.length ===
                    0 ? (
                    <div className="px-5 py-10 text-center">
                        <p className="text-sm font-bold text-slate-500">
                            まだイベントを受信していません。
                        </p>
                    </div>
                ) : (
                    <ul className="divide-y divide-slate-100">
                        {events.map(
                            (
                                event,
                            ) => (
                                <RuntimeEventItem
                                    key={
                                        event.id
                                    }
                                    event={
                                        event
                                    }
                                />
                            ),
                        )}
                    </ul>
                )}
            </section>
        </section>
    );
}


type EventDetailProps = {
    label: string;
    value: string;
};


function EventDetail({
    label,
    value,
}: EventDetailProps) {
    return (
        <div>
            <dt className="text-xs font-black text-slate-400">
                {label}
            </dt>

            <dd className="mt-1 break-all font-bold text-slate-800">
                {value}
            </dd>
        </div>
    );
}


type RuntimeEventItemProps = {
    event: RuntimeEvent;
};


function RuntimeEventItem({
    event,
}: RuntimeEventItemProps) {
    return (
        <li className="px-5 py-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="font-black text-slate-900">
                        {event.type}
                    </p>

                    <p className="mt-1 break-all text-xs font-medium text-slate-400">
                        {event.id}
                    </p>
                </div>

                <time
                    dateTime={
                        new Date(
                            event.occurredAt,
                        ).toISOString()
                    }
                    className="shrink-0 text-xs font-bold text-slate-400"
                >
                    {formatOccurredAt(
                        event.occurredAt,
                    )}
                </time>
            </div>


            <div className="mt-3 flex flex-wrap gap-2">
                <EventBadge
                    value={
                        event.category
                    }
                />

                <EventBadge
                    value={
                        getEventSourceLabel(
                            event,
                        )
                    }
                />
            </div>


            <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">
                {JSON.stringify(
                    event.payload,
                    null,
                    2,
                )}
            </pre>
        </li>
    );
}


type EventBadgeProps = {
    value: string;
};


function EventBadge({
    value,
}: EventBadgeProps) {
    return (
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-black text-slate-600">
            {value}
        </span>
    );
}


function getEventSourceLabel(
    event: RuntimeEvent,
): string {
    if (
        event.source.kind ===
        "plugin"
    ) {
        return `plugin:${event.source.pluginId}`;
    }

    return `runtime:${event.source.module}`;
}


function formatOccurredAt(
    occurredAt: number,
): string {
    return new Intl.DateTimeFormat(
        "ja-JP",
        {
            hour:
                "2-digit",

            minute:
                "2-digit",

            second:
                "2-digit",
        },
    ).format(
        new Date(
            occurredAt,
        ),
    );
}