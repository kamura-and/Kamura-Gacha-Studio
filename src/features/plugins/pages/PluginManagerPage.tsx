import {
  useEffect,
  useState,
} from "react";

import {
  Blocks,
  Cable,
  Unplug,
} from "lucide-react";

import {
  connectorManager,
  registerDefaultConnectors,
} from "../connectors";

import { PluginCard } from "../components/PluginCard";
import { PluginSettingsDialog } from "../components/PluginSettingsDialog";
import { PluginSummary } from "../components/PluginSummary";
import { pluginDefinitions } from "../definitions/pluginDefinitions";
import { usePluginConfigStore } from "../store/pluginConfigStore";
import { usePluginRuntimeStore } from "../store/pluginRuntimeStore";

import type {
  ConnectorEvent,
  ConnectorStatus,
} from "../connectors";

import type {
  PluginId,
  PluginSettings,
} from "../types/plugin";

registerDefaultConnectors();

export function PluginManagerPage() {
  const [
    selectedPluginId,
    setSelectedPluginId,
  ] = useState<PluginId | null>(
    null,
  );

  const configs =
    usePluginConfigStore(
      (state) => state.configs,
    );

  const setEnabled =
    usePluginConfigStore(
      (state) => state.setEnabled,
    );

  const updateSettings =
    usePluginConfigStore(
      (state) => state.updateSettings,
    );

  const runtimes =
    usePluginRuntimeStore(
      (state) => state.runtimes,
    );

  const updateRuntime =
    usePluginRuntimeStore(
      (state) => state.update,
    );

  useEffect(() => {
    return connectorManager.subscribe(
      (event) => {
        applyConnectorEventToRuntime(
          event,
          updateRuntime,
        );
      },
    );
  }, [updateRuntime]);

  useEffect(() => {
    return () => {
      void connectorManager.disconnectAll(
        "Plugin管理画面を終了しました",
      );
    };
  }, []);

  const handleEnabledChange = (
    id: PluginId,
    enabled: boolean,
  ) => {
    setEnabled(id, enabled);

    if (enabled) {
      updateRuntime(id, {
        connectionStatus:
          "disconnected",
        connectionDetail:
          "Pluginが有効化されました",
        errorMessage: undefined,
      });

      return;
    }

    void connectorManager
      .disconnect(
        id,
        "Pluginが無効化されました",
      )
      .catch((error: unknown) => {
        updateRuntime(id, {
          connectionStatus: "error",
          connectionDetail:
            "Pluginの切断に失敗しました",
          errorMessage:
            getErrorMessage(error),
        });
      });

    updateRuntime(id, {
      connectionStatus:
        "disconnected",
      connectionDetail:
        "Pluginが無効化されました",
      errorMessage: undefined,
    });
  };

  const handleConnectionToggle = (
    id: PluginId,
  ) => {
    const config = configs[id];
    const connector =
      connectorManager.require(id);

    if (!config.enabled) {
      return;
    }

    if (
      connector.getStatus() ===
        "connected" ||
      connector.getStatus() ===
        "connecting"
    ) {
      void connectorManager
        .disconnect(
          id,
          "手動で切断されました",
        )
        .catch((error: unknown) => {
          updateRuntime(id, {
            connectionStatus:
              "error",
            connectionDetail:
              "切断処理に失敗しました",
            errorMessage:
              getErrorMessage(error),
          });
        });

      return;
    }

    void connectorManager
      .connect(
        id,
        config,
      )
      .catch((error: unknown) => {
        updateRuntime(id, {
          connectionStatus: "error",
          connectionDetail:
            "接続処理に失敗しました",
          errorMessage:
            getErrorMessage(error),
        });
      });
  };

  const handleSettingsOpen = (
    id: PluginId,
  ) => {
    setSelectedPluginId(id);
  };

  const handleSettingsClose = () => {
    setSelectedPluginId(null);
  };

  const handleSettingsSave = (
    settings: PluginSettings,
  ) => {
    if (
      selectedPluginId === null
    ) {
      return;
    }

    updateSettings(
      selectedPluginId,
      settings,
    );

    const connector =
      connectorManager.get(
        selectedPluginId,
      );

    if (
      connector?.isConnected()
    ) {
      updateRuntime(
        selectedPluginId,
        {
          connectionDetail:
            "設定が変更されました。再接続すると反映されます",
        },
      );
    }
  };

  const selectedDefinition =
    selectedPluginId === null
      ? undefined
      : pluginDefinitions.find(
          (definition) =>
            definition.id ===
            selectedPluginId,
        );

  const selectedConfig =
    selectedPluginId === null
      ? undefined
      : configs[selectedPluginId];

  const pluginIds =
    pluginDefinitions.map(
      (definition) =>
        definition.id,
    );

  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        <div className="space-y-12">
          <header className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-6 px-7 py-7 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 text-white shadow-lg shadow-violet-600/20">
                  <Blocks
                    aria-hidden="true"
                    size={22}
                  />
                </div>

                <div>
                  <h1 className="text-2xl font-black tracking-tight text-slate-950">
                    プラグイン
                  </h1>

                  <p className="mt-1.5 text-sm leading-6 text-slate-500">
                    外部サービスとの接続状態とPluginの稼働設定を管理します。
                  </p>
                </div>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-violet-50 px-3.5 py-2 text-xs font-black text-violet-700 ring-1 ring-inset ring-violet-600/15">
                <Cable
                  aria-hidden="true"
                  size={14}
                />

                {
                  pluginDefinitions.length
                }{" "}
                Plugins
              </div>
            </div>
          </header>

          <PluginSummary
            pluginIds={pluginIds}
            configs={configs}
            runtimes={runtimes}
          />

          <section
            aria-labelledby="plugin-list-title"
            className="space-y-6"
          >
            <div>
              <h2
                id="plugin-list-title"
                className="text-xl font-black tracking-tight text-slate-950"
              >
                Plugin一覧
              </h2>

              <p className="mt-1.5 text-sm leading-6 text-slate-500">
                各Pluginの接続状態と利用状況を確認できます。
              </p>
            </div>

            {pluginDefinitions.length >
            0 ? (
              <div className="grid gap-6">
                {pluginDefinitions.map(
                  (definition) => {
                    const config =
                      configs[
                        definition.id
                      ];

                    const runtime =
                      runtimes[
                        definition.id
                      ];

                    return (
                      <PluginCard
                        key={
                          definition.id
                        }
                        definition={
                          definition
                        }
                        config={config}
                        runtime={runtime}
                        onEnabledChange={(
                          enabled,
                        ) =>
                          handleEnabledChange(
                            definition.id,
                            enabled,
                          )
                        }
                        onConnectionToggle={() =>
                          handleConnectionToggle(
                            definition.id,
                          )
                        }
                        onSettingsOpen={() =>
                          handleSettingsOpen(
                            definition.id,
                          )
                        }
                      />
                    );
                  },
                )}
              </div>
            ) : (
              <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white px-6 text-center">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <Unplug
                    aria-hidden="true"
                    size={23}
                  />
                </div>

                <h3 className="mt-4 text-base font-black text-slate-950">
                  Pluginがありません
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  Pluginを登録すると、この画面から接続状態や設定を管理できます。
                </p>
              </div>
            )}
          </section>
        </div>
      </div>

      {selectedDefinition &&
        selectedConfig && (
          <PluginSettingsDialog
            open={
              selectedPluginId !==
              null
            }
            definition={
              selectedDefinition
            }
            initialSettings={
              selectedConfig.settings
            }
            onClose={
              handleSettingsClose
            }
            onSave={
              handleSettingsSave
            }
          />
        )}
    </>
  );
}

type UpdateRuntime = ReturnType<
  typeof usePluginRuntimeStore.getState
>["update"];

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
      updateRuntime(pluginId, {
        connectionStatus:
          "connecting",
        connectionDetail:
          detail ??
          "接続処理を実行しています",
        errorMessage: undefined,
      });

      return;

    case "connected":
      updateRuntime(pluginId, {
        connectionStatus:
          "connected",
        connectionDetail:
          detail ??
          "サービスへ接続しました",
        errorMessage: undefined,
      });

      return;

    case "disconnected":
      updateRuntime(pluginId, {
        connectionStatus:
          "disconnected",
        connectionDetail:
          detail ??
          "サービスへ接続されていません",
        errorMessage: undefined,
      });

      return;

    case "error":
      updateRuntime(pluginId, {
        connectionStatus: "error",
        connectionDetail:
          detail ??
          "接続処理でエラーが発生しました",
        errorMessage:
          detail ??
          "接続処理でエラーが発生しました",
      });

      return;

    case "disconnecting":
      updateRuntime(pluginId, {
        connectionDetail:
          detail ??
          "切断処理を実行しています",
      });
  }
}

function getErrorMessage(
  error: unknown,
): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "不明なエラーが発生しました";
}