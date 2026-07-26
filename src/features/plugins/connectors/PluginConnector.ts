import type {
  PluginConfig,
  PluginId,
} from "../types/plugin";

export type ConnectorStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "disconnecting"
  | "error";

export type ConnectorEventType =
  | "status-changed"
  | "connected"
  | "disconnected"
  | "error"
  | "message";

export type ConnectorStatusChangedEvent = {
  type: "status-changed";
  pluginId: PluginId;
  status: ConnectorStatus;
  detail?: string;
  occurredAt: number;
};

export type ConnectorConnectedEvent = {
  type: "connected";
  pluginId: PluginId;
  detail?: string;
  occurredAt: number;
};

export type ConnectorDisconnectedEvent = {
  type: "disconnected";
  pluginId: PluginId;
  detail?: string;
  occurredAt: number;
};

export type ConnectorErrorEvent = {
  type: "error";
  pluginId: PluginId;
  message: string;
  error?: unknown;
  occurredAt: number;
};

export type ConnectorMessageEvent = {
  type: "message";
  pluginId: PluginId;
  messageType: string;
  payload: unknown;
  occurredAt: number;
};

export type ConnectorEvent =
  | ConnectorStatusChangedEvent
  | ConnectorConnectedEvent
  | ConnectorDisconnectedEvent
  | ConnectorErrorEvent
  | ConnectorMessageEvent;

export type ConnectorEventListener = (
  event: ConnectorEvent,
) => void;

export type ConnectorConnectContext = {
  config: PluginConfig;
  signal?: AbortSignal;
};

export type ConnectorDisconnectContext = {
  reason?: string;
};

export interface PluginConnector {
  readonly pluginId: PluginId;

  getStatus(): ConnectorStatus;

  isConnected(): boolean;

  connect(
    context: ConnectorConnectContext,
  ): Promise<void>;

  disconnect(
    context?: ConnectorDisconnectContext,
  ): Promise<void>;

  subscribe(
    listener: ConnectorEventListener,
  ): () => void;
}

export abstract class BasePluginConnector
  implements PluginConnector
{
  public abstract readonly pluginId: PluginId;

  private status: ConnectorStatus =
    "disconnected";

  private readonly listeners =
    new Set<ConnectorEventListener>();

  public getStatus(): ConnectorStatus {
    return this.status;
  }

  public isConnected(): boolean {
    return this.status === "connected";
  }

  public subscribe(
    listener: ConnectorEventListener,
  ): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  public abstract connect(
    context: ConnectorConnectContext,
  ): Promise<void>;

  public abstract disconnect(
    context?: ConnectorDisconnectContext,
  ): Promise<void>;

  protected setStatus(
    status: ConnectorStatus,
    detail?: string,
  ): void {
    this.status = status;

    this.emit({
      type: "status-changed",
      pluginId: this.pluginId,
      status,
      detail,
      occurredAt: Date.now(),
    });
  }

  protected emitConnected(
    detail?: string,
  ): void {
    this.status = "connected";

    const occurredAt = Date.now();

    this.emit({
      type: "status-changed",
      pluginId: this.pluginId,
      status: "connected",
      detail,
      occurredAt,
    });

    this.emit({
      type: "connected",
      pluginId: this.pluginId,
      detail,
      occurredAt,
    });
  }

  protected emitDisconnected(
    detail?: string,
  ): void {
    this.status = "disconnected";

    const occurredAt = Date.now();

    this.emit({
      type: "status-changed",
      pluginId: this.pluginId,
      status: "disconnected",
      detail,
      occurredAt,
    });

    this.emit({
      type: "disconnected",
      pluginId: this.pluginId,
      detail,
      occurredAt,
    });
  }

  protected emitError(
    message: string,
    error?: unknown,
  ): void {
    this.status = "error";

    const occurredAt = Date.now();

    this.emit({
      type: "status-changed",
      pluginId: this.pluginId,
      status: "error",
      detail: message,
      occurredAt,
    });

    this.emit({
      type: "error",
      pluginId: this.pluginId,
      message,
      error,
      occurredAt,
    });
  }

  protected emitMessage(
    messageType: string,
    payload: unknown,
  ): void {
    this.emit({
      type: "message",
      pluginId: this.pluginId,
      messageType,
      payload,
      occurredAt: Date.now(),
    });
  }

  protected emit(
    event: ConnectorEvent,
  ): void {
    this.listeners.forEach(
      (listener) => {
        try {
          listener(event);
        } catch (error) {
          console.error(
            `[Connector:${this.pluginId}] イベントリスナーでエラーが発生しました。`,
            error,
          );
        }
      },
    );
  }
}