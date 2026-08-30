import type {
  RuntimeEvent,
} from "../../types/RuntimeEvent";


/**
 * TikFinity Event APIから受信する
 * WebSocketメッセージの基本形式。
 */
export type TikFinityMessage = {
  event: string;
  data: unknown;
};


/**
 * giftイベントで利用する最低限のデータ。
 *
 * 実際のTikFinity payloadには
 * これ以外のフィールドが含まれる可能性がある。
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
   * TikFinity payloadに存在する場合のみ利用する。
   *
   * 未確認のためoptional。
   */
  combo?: boolean;

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


  const repeatEnd =
    normalizeRepeatEnd(
      data.repeatEnd,
    );


  /**
   * コンボ可能ギフトで、
   * まだ連打途中の場合はRuntimeEventへ流さない。
   *
   * TikFinity payloadにcomboが存在しない場合は
   * 従来どおり処理する。
   */
  if (
    data.combo === true &&
    repeatEnd === false
  ) {
    return null;
  }


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

      repeatCount:
        toPositiveInteger(
          data.repeatCount,
          1,
        ),

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
 * unknownが通常のobjectか確認する。
 */
function isRecord(
  value: unknown,
): value is Record<string, unknown> {
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
 *   → true
 *
 * false / 0
 *   → false
 *
 * undefinedや想定外の値
 *   → true
 *
 * 従来のTikFinityイベントとの互換性を優先し、
 * 値が無い場合は「確定済み」として扱う。
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
      .slice(2, 8),
  ].join(
    "-",
  );
}