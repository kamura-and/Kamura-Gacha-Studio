import type {
  TikTokFollowEvent,
  TikTokGiftEvent,
  TikTokLikeEvent,
  TikTokShareEvent,
  TikTokUser,
} from "./types.js";

type UnknownRecord =
  Record<string, unknown>;

function isRecord(
  value: unknown,
): value is UnknownRecord {
  return (
    typeof value === "object"
    && value !== null
    && !Array.isArray(value)
  );
}

function readRecord(
  value: unknown,
): UnknownRecord | null {
  return isRecord(value)
    ? value
    : null;
}

function readString(
  value: unknown,
): string | null {
  if (typeof value === "string") {
    return value;
  }

  if (
    typeof value === "number"
    && Number.isFinite(value)
  ) {
    return String(value);
  }

  return null;
}

function readNumber(
  value: unknown,
): number | null {
  if (
    typeof value === "number"
    && Number.isFinite(value)
  ) {
    return value;
  }

  if (
    typeof value === "string"
    && value.trim().length > 0
  ) {
    const parsed =
      Number(value);

    return Number.isFinite(parsed)
      ? parsed
      : null;
  }

  return null;
}

function readBoolean(
  value: unknown,
): boolean {
  return value === true;
}

function readFirstString(
  ...values: unknown[]
): string | null {
  for (const value of values) {
    const stringValue =
      readString(value);

    if (
      stringValue !== null
      && stringValue.length > 0
    ) {
      return stringValue;
    }
  }

  return null;
}

function mapUser(
  source: UnknownRecord,
): TikTokUser {
  const user =
    readRecord(source.user)
    ?? {};

  const profilePicture =
    readRecord(
      user.profilePicture,
    );

  const profilePictureUrls =
    profilePicture?.urlList;

  const firstProfilePictureUrl =
    Array.isArray(profilePictureUrls)
      ? readString(
          profilePictureUrls[0],
        )
      : null;

  return {
    userId:
      readFirstString(
        user.userId,
        user.userIdStr,
        user.id,
      ),

    uniqueId:
      readString(
        user.uniqueId,
      ),

    nickname:
      readString(
        user.nickname,
      ),

    profilePictureUrl:
      readFirstString(
        user.profilePictureUrl,
        user.avatarThumb,
        firstProfilePictureUrl,
      ),
  };
}

export function mapTikTokGiftEvent(
  data: unknown,
): TikTokGiftEvent {
  const source =
    readRecord(data)
    ?? {};

  const giftDetails =
    readRecord(
      source.giftDetails,
    )
    ?? {};

  const extendedGiftInfo =
    readRecord(
      source.extendedGiftInfo,
    )
    ?? {};

  return {
    kind:
      "gift",

    user:
      mapUser(source),

    giftId:
      readFirstString(
        source.giftId,
        giftDetails.giftId,
        extendedGiftInfo.id,
      ),

    giftName:
      readFirstString(
        giftDetails.giftName,
        extendedGiftInfo.name,
        source.giftName,
      ),

    giftType:
      readNumber(
        giftDetails.giftType
        ?? source.giftType,
      ),

    diamondCount:
      readNumber(
        giftDetails.diamondCount
        ?? extendedGiftInfo.diamondCount
        ?? source.diamondCount,
      ),

    repeatCount:
      readNumber(
        source.repeatCount,
      )
      ?? 1,

    repeatEnd:
      readBoolean(
        source.repeatEnd,
      ),
  };
}

export function mapTikTokLikeEvent(
  data: unknown,
): TikTokLikeEvent {
  const source =
    readRecord(data)
    ?? {};

  return {
    kind:
      "like",

    user:
      mapUser(source),

    likeCount:
      readNumber(
        source.likeCount,
      )
      ?? 1,

    totalLikeCount:
      readNumber(
        source.totalLikeCount,
      ),
  };
}

export function mapTikTokFollowEvent(
  data: unknown,
): TikTokFollowEvent {
  const source =
    readRecord(data)
    ?? {};

  return {
    kind:
      "follow",

    user:
      mapUser(source),
  };
}

export function mapTikTokShareEvent(
  data: unknown,
): TikTokShareEvent {
  const source =
    readRecord(data)
    ?? {};

  return {
    kind:
      "share",

    user:
      mapUser(source),
  };
}