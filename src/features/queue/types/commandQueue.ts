import type {
  GeneratedActionCommand,
} from "@/core/actions";

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
   * コマンドの登録元ID
   *
   * 現在はガチャアイテムIDや
   * エフェクトビルダーの実行IDが入る。
   */
  gachaItemId: string;

  /**
   * 画面表示やログに使用する登録元の名前
   */
  gachaItemName: string;

  /**
   * 実行するコマンド本体
   */
  command: GeneratedActionCommand;

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
  commands: GeneratedActionCommand[];
};

export type CommandQueueSnapshot = {
  items: CommandQueueItem[];
  isProcessing: boolean;
  currentItemId: string | null;
};