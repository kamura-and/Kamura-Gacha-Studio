import {
  connectorManager,
  registerDefaultConnectors,
} from "@/features/plugins/connectors";

import { usePluginRuntimeStore } from "@/features/plugins/store/pluginRuntimeStore";

import type {
  ConnectorEvent,
  ConnectorStatus,
} from "@/features/plugins/connectors";

import type {
  PluginId,
} from "@/features/plugins";

type UpdateRuntime = ReturnType<
  typeof usePluginRuntimeStore.getState
>["update"];

export class RuntimeBootstrap {
  private unsubscribeConnectorEvents:
    | (() => void)
    | undefined;

  private started = false;

  public start(): void {
    if (this.started) {
      return;
    }

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

    this.started = true;
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

    this.unsubscribeConnectorEvents?.();

    this.unsubscribeConnectorEvents =
      undefined;

    await connectorManager.disconnectAll(
      "Runtimeを終了しました",
    );
  }

  public isStarted(): boolean {
    return this.started;
  }
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