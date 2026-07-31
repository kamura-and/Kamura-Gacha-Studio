import type {
  TikTokGiftEvent,
} from "./types";

/**
 * TikTokギフトイベントを受け取るListener。
 */
export type TikTokGiftListener =
  (
    event: TikTokGiftEvent,
  ) => void;

/**
 * TikTok LIVEとの通信を抽象化するClient。
 *
 * RuntimePluginは具体的な通信ライブラリへ
 * 直接依存せず、このInterfaceのみ使用する。
 */
export interface TikTokClient {
  /**
   * TikTok LIVEへ接続する。
   */
  connect(): Promise<void>;

  /**
   * TikTok LIVEとの接続を切断する。
   */
  disconnect(): Promise<void>;

  /**
   * ギフトイベントのListenerを登録する。
   *
   * 登録解除用の関数を返す。
   */
  onGift(
    listener: TikTokGiftListener,
  ): () => void;

  /**
   * 現在接続中か返す。
   */
  isConnected(): boolean;
}