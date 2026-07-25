import type {
  PluginId,
} from "./PluginDefinition";

export type PluginSettingValue =
  | string
  | number
  | boolean
  | null;

export type PluginSettings =
  Record<
    string,
    PluginSettingValue
  >;

export type PluginConfig = {
  /**
   * 対応するPluginの固定ID。
   */
  id: PluginId;

  /**
   * ユーザーがPluginを有効にしているか。
   *
   * この値は永続化対象。
   */
  enabled: boolean;

  /**
   * Plugin固有のユーザー設定。
   *
   * 例：
   * - Minecraftのホスト
   * - ポート番号
   * - TikTokのユーザー名
   */
  settings: PluginSettings;

  /**
   * 設定の最終更新日時。
   */
  updatedAt: number;
};