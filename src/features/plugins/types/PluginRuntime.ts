import type {
  PluginId,
} from "./PluginDefinition";

export type PluginConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "error";

export type PluginRuntime = {
  /**
   * 対応するPluginの固定ID。
   */
  id: PluginId;

  /**
   * 現在の接続状態。
   *
   * Runtime上だけで管理し、永続化しない。
   */
  connectionStatus:
    PluginConnectionStatus;

  /**
   * 接続状態に関する補足情報。
   *
   * 例：
   * - 接続先サーバー名
   * - Room ID
   * - Bedrock Box接続済み
   */
  connectionDetail?: string;

  /**
   * 接続または実行時エラー。
   */
  errorMessage?: string;

  /**
   * 最後に接続が成功した日時。
   */
  lastConnectedAt?: number;

  /**
   * 最後に生存確認できた日時。
   */
  lastHeartbeatAt?: number;

  /**
   * Runtime状態の最終更新日時。
   */
  updatedAt: number;
};

export type PluginRuntimeUpdate =
  Partial<
    Omit<
      PluginRuntime,
      "id" | "updatedAt"
    >
  >;