import type {
  PluginConfig,
} from "../types/plugin";

import {
  SimulatedPluginConnector,
} from "./SimulatedPluginConnector";

export class OverlayConnector extends SimulatedPluginConnector {
  public readonly pluginId =
    "overlay" as const;

  protected validateConfig(
    config: PluginConfig,
  ): void {
    const width =
      config.settings.width;

    const height =
      config.settings.height;

    const url =
      config.settings.url;

    if (
      typeof width !== "number" ||
      !Number.isInteger(width) ||
      width < 1
    ) {
      throw new Error(
        "オーバーレイの横幅が正しくありません",
      );
    }

    if (
      typeof height !== "number" ||
      !Number.isInteger(height) ||
      height < 1
    ) {
      throw new Error(
        "オーバーレイの高さが正しくありません",
      );
    }

    if (
      typeof url !== "string" ||
      url.trim().length === 0
    ) {
      throw new Error(
        "Browser Source URLが設定されていません",
      );
    }
  }

  protected createConnectedDetail(
    config: PluginConfig,
  ): string {
    const width =
      config.settings.width;

    const height =
      config.settings.height;

    if (
      typeof width === "number" &&
      typeof height === "number"
    ) {
      return `オーバーレイ ${width}×${height} を起動しました`;
    }

    return "オーバーレイを起動しました";
  }
}