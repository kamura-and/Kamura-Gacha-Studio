import type {
  PluginConfig,
  PluginId,
} from "../types/plugin";

import {
  BasePluginConnector,
} from "./PluginConnector";

import type {
  ConnectorConnectContext,
  ConnectorDisconnectContext,
} from "./PluginConnector";

const DEFAULT_CONNECT_DELAY_MS = 800;
const DEFAULT_DISCONNECT_DELAY_MS = 200;

export abstract class SimulatedPluginConnector extends BasePluginConnector {
  public abstract readonly pluginId: PluginId;

  private operationVersion = 0;

  protected abstract createConnectedDetail(
    config: PluginConfig,
  ): string;

  protected validateConfig(
    _config: PluginConfig,
  ): void {
    // Plugin固有の検証が必要な場合は、
    // 各Connector側でオーバーライドします。
  }

  public async connect(
    context: ConnectorConnectContext,
  ): Promise<void> {
    const {
      config,
      signal,
    } = context;

    if (this.getStatus() === "connected") {
      return;
    }

    if (this.getStatus() === "connecting") {
      return;
    }

    const operationVersion =
      ++this.operationVersion;

    try {
      this.assertConfig(config);
      this.validateConfig(config);

      this.setStatus(
        "connecting",
        "接続処理を実行しています",
      );

      await wait(
        DEFAULT_CONNECT_DELAY_MS,
        signal,
      );

      if (
        operationVersion !==
        this.operationVersion
      ) {
        return;
      }

      this.emitConnected(
        this.createConnectedDetail(
          config,
        ),
      );
    } catch (error) {
      if (
        operationVersion !==
        this.operationVersion
      ) {
        return;
      }

      if (isAbortError(error)) {
        this.emitDisconnected(
          "接続処理がキャンセルされました",
        );

        return;
      }

      const message =
        error instanceof Error
          ? error.message
          : "Connectorの接続に失敗しました";

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
      return;
    }

    const operationVersion =
      ++this.operationVersion;

    this.setStatus(
      "disconnecting",
      "切断処理を実行しています",
    );

    await wait(
      DEFAULT_DISCONNECT_DELAY_MS,
    );

    if (
      operationVersion !==
      this.operationVersion
    ) {
      return;
    }

    this.emitDisconnected(
      context?.reason ??
        "Connectorを切断しました",
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
      config.id !== this.pluginId
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
}

function wait(
  milliseconds: number,
  signal?: AbortSignal,
): Promise<void> {
  return new Promise(
    (resolve, reject) => {
      if (signal?.aborted) {
        reject(createAbortError());

        return;
      }

      const timer = setTimeout(
        () => {
          signal?.removeEventListener(
            "abort",
            handleAbort,
          );

          resolve();
        },
        milliseconds,
      );

      function handleAbort() {
        clearTimeout(timer);

        signal?.removeEventListener(
          "abort",
          handleAbort,
        );

        reject(createAbortError());
      }

      signal?.addEventListener(
        "abort",
        handleAbort,
        {
          once: true,
        },
      );
    },
  );
}

function createAbortError(): Error {
  const error = new Error(
    "接続処理がキャンセルされました",
  );

  error.name = "AbortError";

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