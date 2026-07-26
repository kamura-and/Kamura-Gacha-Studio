import type {
  PluginConfig,
  PluginId,
} from "../types/plugin";

import type {
  ConnectorEvent,
  ConnectorEventListener,
  ConnectorStatus,
  PluginConnector,
} from "./PluginConnector";

export type ConnectorManagerEventListener = (
  event: ConnectorEvent,
) => void;

export class ConnectorManager {
  private readonly connectors =
    new Map<PluginId, PluginConnector>();

  private readonly connectorUnsubscribers =
    new Map<PluginId, () => void>();

  private readonly listeners =
    new Set<ConnectorManagerEventListener>();

  public register(
    connector: PluginConnector,
  ): void {
    const pluginId = connector.pluginId;

    if (this.connectors.has(pluginId)) {
      throw new Error(
        `Connectorはすでに登録されています: ${pluginId}`,
      );
    }

    this.connectors.set(
      pluginId,
      connector,
    );

    const unsubscribe =
      connector.subscribe(
        (event) => {
          this.emit(event);
        },
      );

    this.connectorUnsubscribers.set(
      pluginId,
      unsubscribe,
    );
  }

  public unregister(
    pluginId: PluginId,
  ): void {
    const connector =
      this.connectors.get(pluginId);

    if (!connector) {
      return;
    }

    if (
      connector.getStatus() ===
        "connected" ||
      connector.getStatus() ===
        "connecting"
    ) {
      console.warn(
        `[ConnectorManager] 接続中のConnectorを登録解除しました: ${pluginId}`,
      );
    }

    const unsubscribe =
      this.connectorUnsubscribers.get(
        pluginId,
      );

    unsubscribe?.();

    this.connectorUnsubscribers.delete(
      pluginId,
    );

    this.connectors.delete(pluginId);
  }

  public has(
    pluginId: PluginId,
  ): boolean {
    return this.connectors.has(
      pluginId,
    );
  }

  public get(
    pluginId: PluginId,
  ): PluginConnector | undefined {
    return this.connectors.get(
      pluginId,
    );
  }

  public require(
    pluginId: PluginId,
  ): PluginConnector {
    const connector =
      this.connectors.get(pluginId);

    if (!connector) {
      throw new Error(
        `Connectorが登録されていません: ${pluginId}`,
      );
    }

    return connector;
  }

  public getAll(): PluginConnector[] {
    return Array.from(
      this.connectors.values(),
    );
  }

  public getStatus(
    pluginId: PluginId,
  ): ConnectorStatus {
    return this.require(
      pluginId,
    ).getStatus();
  }

  public isConnected(
    pluginId: PluginId,
  ): boolean {
    return this.require(
      pluginId,
    ).isConnected();
  }

  public async connect(
    pluginId: PluginId,
    config: PluginConfig,
    signal?: AbortSignal,
  ): Promise<void> {
    const connector =
      this.require(pluginId);

    const status =
      connector.getStatus();

    if (status === "connected") {
      return;
    }

    if (status === "connecting") {
      throw new Error(
        `Connectorはすでに接続処理中です: ${pluginId}`,
      );
    }

    if (!config.enabled) {
      throw new Error(
        `無効なPluginには接続できません: ${pluginId}`,
      );
    }

    if (config.id !== pluginId) {
      throw new Error(
        `PluginConfigのIDが一致しません。expected=${pluginId}, actual=${config.id}`,
      );
    }

    await connector.connect({
      config,
      signal,
    });
  }

  public async disconnect(
    pluginId: PluginId,
    reason?: string,
  ): Promise<void> {
    const connector =
      this.require(pluginId);

    const status =
      connector.getStatus();

    if (status === "disconnected") {
      return;
    }

    await connector.disconnect({
      reason,
    });
  }

  public async disconnectAll(
    reason = "すべてのConnectorを切断しました",
  ): Promise<void> {
    const disconnectTasks =
      this.getAll().map(
        async (connector) => {
          if (
            connector.getStatus() ===
            "disconnected"
          ) {
            return;
          }

          try {
            await connector.disconnect({
              reason,
            });
          } catch (error) {
            console.error(
              `[ConnectorManager] Connectorの切断に失敗しました: ${connector.pluginId}`,
              error,
            );
          }
        },
      );

    await Promise.all(
      disconnectTasks,
    );
  }

  public subscribe(
    listener: ConnectorEventListener,
  ): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  public clear(): void {
    this.connectorUnsubscribers.forEach(
      (unsubscribe) => {
        unsubscribe();
      },
    );

    this.connectorUnsubscribers.clear();
    this.connectors.clear();
    this.listeners.clear();
  }

  private emit(
    event: ConnectorEvent,
  ): void {
    this.listeners.forEach(
      (listener) => {
        try {
          listener(event);
        } catch (error) {
          console.error(
            "[ConnectorManager] イベントリスナーでエラーが発生しました。",
            error,
          );
        }
      },
    );
  }
}

export const connectorManager =
  new ConnectorManager();