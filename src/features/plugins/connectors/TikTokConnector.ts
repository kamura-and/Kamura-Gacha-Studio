import type {
  PluginConfig,
} from "../types/plugin";

import {
  SimulatedPluginConnector,
} from "./SimulatedPluginConnector";

export class TikTokConnector extends SimulatedPluginConnector {
  public readonly pluginId =
    "tiktok-live" as const;

  protected validateConfig(
    config: PluginConfig,
  ): void {
    const username =
      config.settings.username;

    if (
      typeof username !== "string" ||
      username.trim().length === 0
    ) {
      throw new Error(
        "TikTokユーザー名が設定されていません",
      );
    }

    if (
      username.trim().startsWith("@")
    ) {
      throw new Error(
        "TikTokユーザー名は「@」を付けずに設定してください",
      );
    }
  }

  protected createConnectedDetail(
    config: PluginConfig,
  ): string {
    const username =
      config.settings.username;

    return typeof username === "string"
      ? `TikTok LIVE「@${username.trim()}」へ接続しました`
      : "TikTok LIVEへ接続しました";
  }
}