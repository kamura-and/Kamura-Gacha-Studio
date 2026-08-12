export type ExecutionHistoryMode =
  | "effect"
  | "legacy-effect"
  | "legacy-commands"
  | "none";

export type ExecutionHistoryStatus =
  | "success"
  | "failed";

export type ExecutionHistoryEntry = {
  /**
   * 履歴レコード固有のID
   */
  id: string;

  /**
   * RuntimeEventのID
   *
   * 手動実行など、RuntimeEventを経由しない場合は未設定。
   */
  eventId?: string;

  /**
   * 実行元Triggerの情報
   *
   * 手動実行やテスト実行では未設定になる場合がある。
   */
  triggerId?: string;
  triggerName?: string;

  /**
   * 抽選に使用したPool
   */
  gachaPoolId: string;

  /**
   * 抽選されたPoolEntry
   */
  poolEntryId: string;

  /**
   * 抽選された景品
   *
   * 新Effect方式でも、
   * 移行期間中はEffectのID・名前を
   * このフィールドへ保存します。
   */
  gachaItemId: string;
  gachaItemName: string;

  /**
   * 実際に使用されたEffect
   */
  effectId?: string | null;

  /**
   * 実際に使用された実行方式
   */
  mode: ExecutionHistoryMode;

  /**
   * 実行対象となったコマンド数
   */
  commandCount: number;

  /**
   * 抽選日時
   */
  drawnAt: number;

  /**
   * 実行完了または失敗を記録した日時
   */
  executedAt: number;

  /**
   * 実行結果
   */
  status: ExecutionHistoryStatus;

  /**
   * 失敗時のエラーメッセージ
   */
  errorMessage?: string;
};