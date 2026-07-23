import type { GachaCommand } from "@/features/gacha/types/gacha";

export type QueueItemStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export type CommandQueueItem = {
  /**
   * キュー内で使用する一意なID
   */
  id: string;

  /**
   * 元になったガチャアイテムのID
   */
  gachaItemId: string;

  /**
   * 画面表示やログ用のガチャアイテム名
   */
  gachaItemName: string;

  /**
   * 実行するコマンド本体
   */
  command: GachaCommand;

  /**
   * キュー上の実行状態
   */
  status: QueueItemStatus;

  /**
   * キューへ追加された日時
   */
  createdAt: number;

  /**
   * 実行を開始した日時
   */
  startedAt?: number;

  /**
   * 実行が終了した日時
   */
  finishedAt?: number;

  /**
   * 失敗時のエラーメッセージ
   */
  error?: string;
};

export type EnqueueCommandsInput = {
  gachaItemId: string;
  gachaItemName: string;
  commands: GachaCommand[];
};

export type CommandQueueSnapshot = {
  items: CommandQueueItem[];
  isProcessing: boolean;
  currentItemId: string | null;
};