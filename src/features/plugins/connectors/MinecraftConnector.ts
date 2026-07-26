import type {
  PluginConfig,
} from "../types/plugin";

import {
  SimulatedPluginConnector,
} from "./SimulatedPluginConnector";

export class MinecraftConnector extends SimulatedPluginConnector {
  public readonly pluginId =
    "minecraft" as const;

  protected validateConfig(
    config: PluginConfig,
  ): void {
    const host =
      config.settings.host;

    const port =
      config.settings.port;

    if (
      typeof host !== "string" ||
      host.trim().length === 0
    ) {
      throw new Error(
        "Minecraftのホストが設定されていません",
      );
    }

    if (
      typeof port !== "number" ||
      !Number.isInteger(port) ||
      port < 1 ||
      port > 65535
    ) {
      throw new Error(
        "Minecraftのポート番号が正しくありません",
      );
    }
  }

  protected createConnectedDetail(
    config: PluginConfig,
  ): string {
    const host =
      config.settings.host;

    const port =
      config.settings.port;

    if (
      typeof host === "string" &&
      typeof port === "number"
    ) {
      return `${host.trim()}:${port} へ接続しました`;
    }

    return "Minecraftへ接続しました";
  }
}