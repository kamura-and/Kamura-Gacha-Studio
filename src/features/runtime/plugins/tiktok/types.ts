/**
 * TikTok LIVEから受信する
 * Giftイベントの共通モデル。
 *
 * 実際のライブラリの型とは分離し、
 * Runtime側ではこの型のみ扱う。
 */
export type TikTokGiftEvent = {
  giftId: string;

  giftName: string;

  userId: string;

  userName: string;

  repeatCount: number;

  diamondCount: number;

  occurredAt: number;
};