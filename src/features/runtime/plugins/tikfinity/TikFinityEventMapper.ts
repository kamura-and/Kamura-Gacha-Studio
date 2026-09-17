import type {
    RuntimeEvent,
} from "../../types/RuntimeEvent";

import {
    tikFinityGiftComboTracker,
} from "./TikFinityGiftComboTracker";


/**
 * TikFinity Event APIから受信する
 * WebSocketメッセージの基本形式。
 */
export type TikFinityMessage = {
    event: string;
    data: unknown;
};


/**
 * giftイベントで利用するデータ。
 *
 * 実際のTikFinity payloadには
 * これ以外のフィールドも含まれる。
 */
export type TikFinityGiftData = {
    giftId?: string | number;
    giftName?: string;

    repeatCount?: number;

    /**
     * TikFinity側でbooleanの可能性があるほか、
     * TikTok LIVE由来では0 / 1で届くケースもあるため
     * 両方を許容する。
     */
    repeatEnd?:
        | boolean
        | number;

    diamondCount?: number;

    /**
     * payloadに存在する場合のみ利用する。
     *
     * 実payloadではcomboが存在しない場合でも
     * repeatCount / repeatEndによって
     * コンボ状態を判定できる。
     */
    combo?: boolean;

    /**
     * 同一コンボを識別するために利用する。
     *
     * 実payloadではコンボ中、
     * 同じgroupIdが維持される。
     */
    groupId?:
        | string
        | number;

    userId?: string;
    uniqueId?: string;
    nickname?: string;

    user?: {
        userId?: string;
        id?: string;
        uniqueId?: string;
        nickname?: string;
    };
};


/**
 * TikFinityのWebSocketメッセージを
 * Kamura Gacha StudioのRuntimeEventへ変換する。
 *
 * 現段階ではgiftイベントのみ対応する。
 */
export function mapTikFinityMessage(
    message: TikFinityMessage,
): RuntimeEvent | null {
    if (
        message.event !==
        "gift"
    ) {
        return null;
    }


    return mapGiftEvent(
        message.data,
    );
}


/**
 * TikFinity gift payloadを
 * RuntimeEventへ変換する。
 */
function mapGiftEvent(
    rawData: unknown,
): RuntimeEvent | null {
    if (!isRecord(rawData)) {
        return null;
    }


    const data =
        rawData as TikFinityGiftData;


    const giftId =
        toOptionalString(
            data.giftId,
        );


    if (!giftId) {
        console.warn(
            "[TikFinityEventMapper]",
            "giftIdが存在しないgiftイベントを無視しました。",
            rawData,
        );

        return null;
    }


    const repeatCount =
        toPositiveInteger(
            data.repeatCount,
            1,
        );


    const repeatEnd =
        normalizeRepeatEnd(
            data.repeatEnd,
        );


    const user =
        data.user;


    const userId =
        firstNonEmptyString(
            data.userId,
            user?.userId,
            user?.id,
            data.uniqueId,
            user?.uniqueId,
            "unknown",
        );


    const userName =
        firstNonEmptyString(
            data.nickname,
            user?.nickname,
            data.uniqueId,
            user?.uniqueId,
            userId,
        );


    const comboKey =
        createComboKey(
            data,
            giftId,
            userId,
        );


    /*
     * TikFinityのrepeatCountは
     * コンボ中の累積値。
     *
     * 例:
     *
     * 1 → 2 → 3 → 3(repeatEnd:true)
     *
     * この場合、
     *
     * 1回 → 1回 → 1回 → 0回
     *
     * としてRuntimeへ流す。
     */
    const triggerCount =
        tikFinityGiftComboTracker.consume(
            comboKey,
            repeatCount,
            repeatEnd,
        );


    /*
     * repeatEnd:trueの終了通知など、
     * 新しいギフトが増えていないイベントは
     * RuntimeEventを発行しない。
     */
    if (
        triggerCount <=
        0
    ) {
        console.info(
            "[TikFinityEventMapper]",
            "追加ギフト数が0のためイベントを無視しました。",
            {
                giftId,
                userId,
                comboKey,
                repeatCount,
                repeatEnd,
            },
        );

        return null;
    }


    console.info(
        "[TikFinityEventMapper]",
        "ギフト発動数を計算しました。",
        {
            giftId,
            userId,
            comboKey,
            repeatCount,
            repeatEnd,
            triggerCount,
        },
    );


    return {
        id:
            createEventId(
                giftId,
            ),

        category:
            "gift",

        type:
            "gift",

        source: {
            kind:
                "plugin",

            pluginId:
                "tiktok-live",
        },

        payload: {
            giftId,

            giftName:
                firstNonEmptyString(
                    data.giftName,
                    giftId,
                ),

            userId,

            userName,

            /*
             * Runtimeへ渡すrepeatCountは
             * TikFinityの累積値ではなく、
             * 今回新しく追加されたギフト数。
             */
            repeatCount:
                triggerCount,

            diamondCount:
                toNonNegativeNumber(
                    data.diamondCount,
                    0,
                ),

            repeatEnd,
        },

        occurredAt:
            Date.now(),

        metadata: {
            tags: [
                "tikfinity",
                "tiktok-live",
            ],
        },
    };
}


/**
 * 同一コンボを識別するキーを作る。
 *
 * groupIdが存在する場合は最優先で利用する。
 *
 * groupIdが無いpayloadとの互換性のため、
 * userId + giftIdへフォールバックする。
 */
function createComboKey(
    data: TikFinityGiftData,
    giftId: string,
    userId: string,
): string {
    const groupId =
        toOptionalString(
            data.groupId,
        );


    if (groupId) {
        return [
            "group",
            groupId,
        ].join(
            ":",
        );
    }


    return [
        "user",
        userId,
        "gift",
        giftId,
    ].join(
        ":",
    );
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


/**
 * string / numberを文字列へ変換する。
 */
function toOptionalString(
    value:
        | string
        | number
        | undefined,
): string | undefined {
    if (
        typeof value ===
        "string"
    ) {
        const trimmed =
            value.trim();


        return (
            trimmed ||
            undefined
        );
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


    return undefined;
}


/**
 * 最初に見つかった空でない文字列を返す。
 */
function firstNonEmptyString(
    ...values:
        Array<
            string | undefined
        >
): string {
    for (
        const value of values
    ) {
        if (
            typeof value !==
            "string"
        ) {
            continue;
        }


        const trimmed =
            value.trim();


        if (trimmed) {
            return trimmed;
        }
    }


    return "unknown";
}


/**
 * 1以上の整数へ正規化する。
 */
function toPositiveInteger(
    value: unknown,
    fallback: number,
): number {
    if (
        typeof value !==
            "number" ||
        !Number.isFinite(
            value,
        )
    ) {
        return fallback;
    }


    return Math.max(
        1,
        Math.floor(
            value,
        ),
    );
}


/**
 * 0以上の数値へ正規化する。
 */
function toNonNegativeNumber(
    value: unknown,
    fallback: number,
): number {
    if (
        typeof value !==
            "number" ||
        !Number.isFinite(
            value,
        )
    ) {
        return fallback;
    }


    return Math.max(
        0,
        value,
    );
}


/**
 * repeatEndをbooleanへ正規化する。
 *
 * true / 1
 * → true
 *
 * false / 0
 * → false
 *
 * undefinedや想定外の値
 * → true
 *
 * repeatEndが存在しない通常ギフトは
 * 1イベントで完結したものとして扱う。
 */
function normalizeRepeatEnd(
    value:
        | boolean
        | number
        | undefined,
): boolean {
    if (
        value === true ||
        value === 1
    ) {
        return true;
    }


    if (
        value === false ||
        value === 0
    ) {
        return false;
    }


    return true;
}


function createEventId(
    giftId: string,
): string {
    return [
        "tiktok-live",
        "gift",
        giftId,
        Date.now(),
        Math.random()
            .toString(36)
            .slice(
                2,
                8,
            ),
    ].join(
        "-",
    );
}