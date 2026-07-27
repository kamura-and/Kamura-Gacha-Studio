import {
  connectorManager,
  registerDefaultConnectors,
} from "@/features/plugins/connectors";

import { usePluginConfigStore } from "@/features/plugins/store/pluginConfigStore";
import { usePluginRuntimeStore } from "@/features/plugins/store/pluginRuntimeStore";

import { triggerRuntime } from "@/features/triggers/runtime/TriggerRuntime";

import type {
  ConnectorEvent,
  ConnectorStatus,
} from "@/features/plugins/connectors";

import type {
  PluginConfig,
  PluginId,
  PluginSettings,
} from "@/features/plugins";

type UpdateRuntime = ReturnType<
  typeof usePluginRuntimeStore.getState
>["update"];

export class RuntimeBootstrap {
  private unsubscribeConnectorEvents:
    | (() => void)
    | undefined;

  private startupAbortController:
    | AbortController
    | undefined;

  private started = false;

  public start(): void {
    if (this.started) {
      return;
    }

    /*
     * 非同期の自動接続処理より先に起動済みへ変更します。
     *
     * React StrictModeによる短時間の
     * mount → cleanup → mountでも、
     * 各起動処理の状態を正しく判定できます。
     */
    this.started = true;

    this.startupAbortController =
      new AbortController();

    registerDefaultConnectors();

    this.unsubscribeConnectorEvents =
      connectorManager.subscribe(
        (event) => {
          applyConnectorEventToRuntime(
            event,
            usePluginRuntimeStore
              .getState()
              .update,
          );
        },
      );

    triggerRuntime.start();

    void this.connectAutoConnectPlugins(
      this.startupAbortController.signal,
    );

    console.info(
      "[RuntimeBootstrap] Runtimeを開始しました。",
    );
  }

  public async stop(): Promise<void> {
    if (!this.started) {
      return;
    }

    /*
     * 非同期の切断処理より先に停止状態へ変更します。
     *
     * React StrictModeでは開発中に
     * mount → cleanup → mount が短時間で実行されます。
     * 先にfalseへ戻すことで、次のstart()を妨げません。
     */
    this.started = false;

    /*
     * 設定復元待ち、または自動接続中の処理を中断します。
     */
    this.startupAbortController?.abort();

    this.startupAbortController =
      undefined;

    triggerRuntime.stop();

    this.unsubscribeConnectorEvents?.();

    this.unsubscribeConnectorEvents =
      undefined;

    await connectorManager.disconnectAll(
      "Runtimeを終了しました",
    );

    console.info(
      "[RuntimeBootstrap] Runtimeを終了しました。",
    );
  }

  public isStarted(): boolean {
    return this.started;
  }

  private async connectAutoConnectPlugins(
    signal: AbortSignal,
  ): Promise<void> {
    try {
      await waitForPluginConfigHydration(
        signal,
      );

      if (
        signal.aborted ||
        !this.started
      ) {
        return;
      }

      const configs =
        usePluginConfigStore
          .getState()
          .configs;

      const autoConnectConfigs =
        Object.values(configs).filter(
          shouldAutoConnect,
        );

      if (
        autoConnectConfigs.length === 0
      ) {
        console.info(
          "[RuntimeBootstrap] 自動接続対象のPluginはありません。",
        );

        return;
      }

      const connectionTasks =
        autoConnectConfigs.map(
          async (config) => {
            if (
              signal.aborted ||
              !this.started
            ) {
              return;
            }

            const connector =
              connectorManager.get(
                config.id,
              );

            if (!connector) {
              console.warn(
                `[RuntimeBootstrap] 自動接続対象のConnectorが登録されていません: ${config.id}`,
              );

              return;
            }

            const status =
              connector.getStatus();

            if (
              status === "connected" ||
              status === "connecting"
            ) {
              return;
            }

            try {
              await connectorManager.connect(
                config.id,
                config,
                signal,
              );

              console.info(
                `[RuntimeBootstrap] Pluginを自動接続しました: ${config.id}`,
              );
            } catch (error) {
              if (
                signal.aborted ||
                isAbortError(error)
              ) {
                return;
              }

              console.error(
                `[RuntimeBootstrap] Pluginの自動接続に失敗しました: ${config.id}`,
                error,
              );
            }
          },
        );

      await Promise.all(
        connectionTasks,
      );
    } catch (error) {
      if (
        signal.aborted ||
        isAbortError(error)
      ) {
        return;
      }

      console.error(
        "[RuntimeBootstrap] 自動接続処理に失敗しました。",
        error,
      );
    }
  }
}

function shouldAutoConnect(
  config: PluginConfig,
): boolean {
  if (!config.enabled) {
    return false;
  }

  return getBooleanSetting(
    config.settings,
    "autoConnect",
  );
}

function getBooleanSetting(
  settings: PluginSettings,
  key: string,
): boolean {
  const value =
    settings[key];

  return (
    typeof value === "boolean" &&
    value
  );
}

async function waitForPluginConfigHydration(
  signal: AbortSignal,
): Promise<void> {
  if (
    usePluginConfigStore.persist.hasHydrated()
  ) {
    return;
  }

  await new Promise<void>(
    (resolve, reject) => {
      const handleAbort = () => {
        unsubscribe();

        reject(
          new DOMException(
            "Plugin設定の復元待機が中断されました。",
            "AbortError",
          ),
        );
      };

      const unsubscribe =
        usePluginConfigStore.persist
          .onFinishHydration(
            () => {
              signal.removeEventListener(
                "abort",
                handleAbort,
              );

              unsubscribe();
              resolve();
            },
          );

      signal.addEventListener(
        "abort",
        handleAbort,
        {
          once: true,
        },
      );

      /*
       * Listener登録直前にhydrationが完了した場合の
       * 取りこぼしを防ぎます。
       */
      if (
        usePluginConfigStore.persist
          .hasHydrated()
      ) {
        signal.removeEventListener(
          "abort",
          handleAbort,
        );

        unsubscribe();
        resolve();
      }
    },
  );
}

function isAbortError(
  error: unknown,
): boolean {
  return (
    error instanceof DOMException &&
    error.name === "AbortError"
  );
}

function applyConnectorEventToRuntime(
  event: ConnectorEvent,
  updateRuntime: UpdateRuntime,
): void {
  switch (event.type) {
    case "status-changed":
      applyConnectorStatus(
        event.pluginId,
        event.status,
        event.detail,
        updateRuntime,
      );

      return;

    case "connected":
      updateRuntime(
        event.pluginId,
        {
          connectionStatus:
            "connected",

          connectionDetail:
            event.detail ??
            "サービスへ接続しました",

          lastConnectedAt:
            event.occurredAt,

          lastHeartbeatAt:
            event.occurredAt,

          errorMessage: undefined,
        },
      );

      return;

    case "disconnected":
      updateRuntime(
        event.pluginId,
        {
          connectionStatus:
            "disconnected",

          connectionDetail:
            event.detail ??
            "サービスから切断しました",

          errorMessage: undefined,
        },
      );

      return;

    case "error":
      updateRuntime(
        event.pluginId,
        {
          connectionStatus:
            "error",

          connectionDetail:
            event.message,

          errorMessage:
            event.message,
        },
      );

      return;

    case "message":
      updateRuntime(
        event.pluginId,
        {
          lastHeartbeatAt:
            event.occurredAt,
        },
      );
  }
}

function applyConnectorStatus(
  pluginId: PluginId,
  status: ConnectorStatus,
  detail: string | undefined,
  updateRuntime: UpdateRuntime,
): void {
  switch (status) {
    case "connecting":
      updateRuntime(
        pluginId,
        {
          connectionStatus:
            "connecting",

          connectionDetail:
            detail ??
            "接続処理を実行しています",

          errorMessage: undefined,
        },
      );

      return;

    case "connected":
      updateRuntime(
        pluginId,
        {
          connectionStatus:
            "connected",

          connectionDetail:
            detail ??
            "サービスへ接続しました",

          errorMessage: undefined,
        },
      );

      return;

    case "disconnecting":
      updateRuntime(
        pluginId,
        {
          connectionStatus:
            "connecting",

          connectionDetail:
            detail ??
            "切断処理を実行しています",

          errorMessage: undefined,
        },
      );

      return;

    case "disconnected":
      updateRuntime(
        pluginId,
        {
          connectionStatus:
            "disconnected",

          connectionDetail:
            detail ??
            "サービスへ接続されていません",

          errorMessage: undefined,
        },
      );

      return;

    case "error":
      updateRuntime(
        pluginId,
        {
          connectionStatus:
            "error",

          connectionDetail:
            detail ??
            "接続中にエラーが発生しました",

          errorMessage:
            detail ??
            "接続中にエラーが発生しました",
        },
      );
  }
}

export const runtimeBootstrap =
  new RuntimeBootstrap();