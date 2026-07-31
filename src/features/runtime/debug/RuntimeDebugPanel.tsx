import {
    useState,
} from "react";

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

    return (
        <section className="space-y-6">
            <header>
                <h1 className="text-2xl font-black text-slate-950">
                    ランタイムデバッグ
                </h1>

                <p className="mt-1 text-sm font-medium text-slate-500">
                    Fake Pluginからイベントを送信し、
                    イベントバスの受信状況を確認します。
                </p>
            </header>

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-sm font-black text-slate-900">
                            Fake Plugin
                        </h2>

                        <p className="mt-1 text-sm font-medium text-slate-500">
                            状態：
                            <span className="ml-1 font-bold text-slate-900">
                                {isStarted()
                                    ? "起動中"
                                    : "停止中"}
                            </span>
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={
                            handleEmitGift
                        }
                        className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-black text-white transition hover:bg-violet-700"
                    >
                        バラを送信
                    </button>
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