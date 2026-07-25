export type PluginId =
  | "tiktok-live"
  | "minecraft"
  | "overlay";

export type PluginType =
  | "tiktok"
  | "minecraft"
  | "overlay";

export type PluginConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "error";

export type PluginDefinition = {
  /**
   * Pluginを識別する固定ID
   */
  id: PluginId;

  /**
   * 画面上に表示する名称
   */
  name: string;

  /**
   * Pluginの種類
   */
  type: PluginType;

  /**
   * Plugin機能が有効か
   */
  enabled: boolean;

  /**
   * 現在の接続状態
   */
  connectionStatus: PluginConnectionStatus;

  /**
   * 接続状態に関する補足情報
   *
   * 実際のConnectorから情報を取得できた場合のみ設定する。
   */
  connectionDetail?: string;

  /**
   * 接続エラー
   */
  errorMessage?: string;

  /**
   * 最後に接続した日時
   */
  lastConnectedAt?: number;

  /**
   * 最後に生存確認できた日時
   */
  lastHeartbeatAt?: number;

  /**
   * データの最終更新日時
   */
  updatedAt: number;
};

export type PluginConnectionUpdate = {
  connectionStatus: PluginConnectionStatus;
  connectionDetail?: string;
  errorMessage?: string;
  lastConnectedAt?: number;
  lastHeartbeatAt?: number;
};