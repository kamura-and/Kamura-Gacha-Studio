export type PluginId =
  | "tiktok-live"
  | "minecraft"
  | "overlay";

export type PluginType =
  | "tiktok"
  | "minecraft"
  | "overlay";

export type PluginCapability =
  | "trigger-source"
  | "command-executor"
  | "overlay-output";

export type PluginDefinition = {
  /**
   * Pluginを一意に識別する固定ID。
   *
   * 保存データ、Runtime、Connectorの関連付けに使用する。
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
   * Pluginのバージョン。
   */
  version: string;

  /**
   * Pluginの提供元または作者。
   */
  author: string;

  /**
   * Pluginの説明。
   */
  description: string;

  /**
   * Pluginが提供する機能。
   */
  capabilities: PluginCapability[];
};