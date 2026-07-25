import type {
  PluginCapability,
  PluginDefinition as DomainPluginDefinition,
  PluginId,
  PluginType,
} from "./PluginDefinition";

import type {
  PluginConfig,
  PluginSettings,
  PluginSettingValue,
} from "./PluginConfig";

import type {
  PluginConnectionStatus,
  PluginRuntime,
  PluginRuntimeUpdate,
} from "./PluginRuntime";

export type {
  PluginCapability,
  PluginId,
  PluginType,
};

export type {
  PluginConfig,
  PluginSettings,
  PluginSettingValue,
};

export type {
  PluginConnectionStatus,
  PluginRuntime,
  PluginRuntimeUpdate,
};

/**
 * Pluginそのものの純粋な静的定義。
 *
 * 新しいコードでは、可能な限りこちらを使用する。
 */
export type PluginDomainDefinition =
  DomainPluginDefinition;

/**
 * 既存コードとの互換性を維持するための複合型。
 *
 * 現在のPluginRepository、PluginStore、Dashboardでは、
 * 静的定義・設定・Runtime状態を1オブジェクトとして扱っている。
 *
 * version、author、description、capabilitiesは、
 * 現在の既存データには含まれていないため一時的に任意項目とする。
 *
 * Sprint 9で各責務へ分離した後、この互換型は削除する。
 */
export type PluginDefinition = {
  /**
   * Pluginを一意に識別する固定ID。
   */
  id: PluginId;

  /**
   * 画面上に表示するPlugin名。
   */
  name: string;

  /**
   * Pluginの分類。
   */
  type: PluginType;

  /**
   * 新しいPlugin Domainで使用する静的メタデータ。
   *
   * 既存実装との互換性のため、移行完了までは任意項目。
   */
  version?: string;
  author?: string;
  description?: string;
  capabilities?: PluginCapability[];

  /**
   * ユーザーがPluginを有効にしているか。
   *
   * 将来的にはPluginConfigへ移行する。
   */
  enabled: boolean;

  /**
   * 現在の接続状態。
   *
   * 将来的にはPluginRuntimeへ移行する。
   */
  connectionStatus:
    PluginConnectionStatus;

  /**
   * 接続先などの補足情報。
   */
  connectionDetail?: string;

  /**
   * 接続または実行時のエラー。
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
   * 状態の最終更新日時。
   */
  updatedAt: number;
};

/**
 * 既存のPluginStoreが接続状態を更新する際に使用する型。
 *
 * 現在のupdateConnection()ではconnectionStatusを必須としているため、
 * PluginRuntimeUpdateをそのまま使用せず、必須項目として上書きする。
 *
 * Sprint 9完了後はPluginRuntimeStoreへ移行する。
 */
export type PluginConnectionUpdate =
  Omit<
    PluginRuntimeUpdate,
    "connectionStatus"
  > & {
    connectionStatus:
      PluginConnectionStatus;
  };