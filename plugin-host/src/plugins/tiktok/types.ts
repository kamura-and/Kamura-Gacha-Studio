export type TikTokConnectionState =
  | "disconnected"
  | "connecting"
  | "connected"
  | "disconnecting";

export interface TikTokUser {
  userId: string | null;
  uniqueId: string | null;
  nickname: string | null;
  profilePictureUrl: string | null;
}

export interface TikTokGiftEvent {
  kind: "gift";
  user: TikTokUser;
  giftId: string | null;
  giftName: string | null;
  giftType: number | null;
  diamondCount: number | null;
  repeatCount: number;
  repeatEnd: boolean;
}

export interface TikTokLikeEvent {
  kind: "like";
  user: TikTokUser;
  likeCount: number;
  totalLikeCount: number | null;
}

export interface TikTokFollowEvent {
  kind: "follow";
  user: TikTokUser;
}

export interface TikTokShareEvent {
  kind: "share";
  user: TikTokUser;
}

export type TikTokRuntimeEvent =
  | TikTokGiftEvent
  | TikTokLikeEvent
  | TikTokFollowEvent
  | TikTokShareEvent;

export interface TikTokConnectedEvent {
  uniqueId: string;
  roomId: string;
}

export type TikTokRuntimeEventListener = (
  event: TikTokRuntimeEvent,
) => void;

export type TikTokConnectedListener = (
  event: TikTokConnectedEvent,
) => void;

export type TikTokDisconnectedListener =
  () => void;

export type TikTokErrorListener = (
  error: Error,
) => void;