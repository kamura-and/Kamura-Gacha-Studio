import type {
  PluginConfig,
} from "../types/plugin";

import {
  BasePluginConnector,
} from "./PluginConnector";

import type {
  ConnectorConnectContext,
  ConnectorDisconnectContext,
} from "./PluginConnector";

import {
  clearActiveMinecraftConnection,
  setActiveMinecraftConnection,
  testMinecraftConnection,
} from "../../minecraft/services/minecraftConnector";

import type {
  MinecraftConnectionSettings,
} from "../../minecraft/services/minecraftConnector";

export class MinecraftConnector
  extends BasePluginConnector {
  public readonly pluginId =
    "minecraft" as const;

  private operationVersion = 0;

  public async connect(
    context: ConnectorConnectContext,
  ): Promise<void> {
    const {
      config,
      signal,
    } = context;

    if (
      this.getStatus() ===
      "connected"
    ) {
      return;
    }

    if (
      this.getStatus() ===
      "connecting"
    ) {
      return;
    }

    const operationVersion =
      ++this.operationVersion;

    try {
      this.assertConfig(
        config,
      );

      const settings =
        this.getConnectionSettings(
          config,
        );

      throwIfAborted(
        signal,
      );

      this.setStatus(
        "connecting",
        `${settings.host}:${settings.port} への接続を確認しています`,
      );

      const result =
        await testMinecraftConnection(
          settings,
        );

      if (
        operationVersion !==
        this.operationVersion
      ) {
        return;
      }

      throwIfAborted(
        signal,
      );

      setActiveMinecraftConnection(
        settings,
      );

      this.emitConnected(
        `${result.address} へ接続しました`,
      );
    } catch (error) {
      if (
        operationVersion !==
        this.operationVersion
      ) {
        return;
      }

      clearActiveMinecraftConnection();

      if (
        isAbortError(error)
      ) {
        this.emitDisconnected(
          "接続処理がキャンセルされました",
        );

        return;
      }

      const message =
        error instanceof Error
          ? error.message
          : "Minecraftへの接続に失敗しました";

      this.emitError(
        message,
        error,
      );

      throw error;
    }
  }

  public async disconnect(
    context?: ConnectorDisconnectContext,
  ): Promise<void> {
    if (
      this.getStatus() ===
      "disconnected"
    ) {
      clearActiveMinecraftConnection();

      return;
    }

    ++this.operationVersion;

    this.setStatus(
      "disconnecting",
      "Minecraft接続設定を解除しています",
    );

    clearActiveMinecraftConnection();

    this.emitDisconnected(
      context?.reason ??
        "Minecraftから切断しました",
    );
  }

  private assertConfig(
    config: PluginConfig,
  ): void {
    if (!config.enabled) {
      throw new Error(
        "無効なPluginには接続できません",
      );
    }

    if (
      config.id !==
      this.pluginId
    ) {
      throw new Error(
        [
          "PluginConfigのIDが一致しません。",
          `expected=${this.pluginId}`,
          `actual=${config.id}`,
        ].join(" "),
      );
    }
  }

  private getConnectionSettings(
    config: PluginConfig,
  ): MinecraftConnectionSettings {
    const host =
      config.settings.host;

    const port =
      config.settings.port;

    const password =
      config.settings.password;

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

    if (
      typeof password !==
        "string" ||
      password.trim().length === 0
    ) {
      throw new Error(
        "MinecraftのRCONパスワードが設定されていません",
      );
    }

    return {
      host: host.trim(),
      port,
      password,
    };
  }
}

function throwIfAborted(
  signal?: AbortSignal,
): void {
  if (!signal?.aborted) {
    return;
  }

  throw createAbortError();
}

function createAbortError():
  Error {
  const error =
    new Error(
      "接続処理がキャンセルされました",
    );

  error.name =
    "AbortError";

  return error;
}

function isAbortError(
  error: unknown,
): boolean {
  return (
    error instanceof Error &&
    error.name === "AbortError"
  );
}