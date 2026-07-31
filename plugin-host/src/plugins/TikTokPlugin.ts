import type {
  Plugin,
  PluginContext,
} from "../core/Plugin.js";

import {
  TikTokClient,
} from "./tiktok/TikTokClient.js";

import type {
  TikTokConnectionState,
  TikTokRuntimeEvent,
} from "./tiktok/types.js";

export type TikTokPluginStatus = {
  pluginId: string;
  started: boolean;
  connectionState:
    TikTokConnectionState;
  uniqueId: string | null;
  connected: boolean;
};

export class TikTokPlugin
implements Plugin {
  readonly id =
    "tiktok";

  private started =
    false;

  private context:
    PluginContext | undefined;

  private client:
    TikTokClient | undefined;

  private disconnectedEventEmitted =
    true;

  start(
    context: PluginContext,
  ): void {
    if (this.started) {
      return;
    }

    this.context =
      context;

    this.client =
      new TikTokClient({
        onEvent:
          (event) => {
            this.handleTikTokEvent(
              event,
            );
          },

        onConnected:
          (event) => {
            this.disconnectedEventEmitted =
              false;

            this.context?.log(
              `TikTok connected: @${event.uniqueId} (roomId: ${event.roomId}).`,
            );

            this.context?.emit(
              "tiktok.connected",
              {
                pluginId:
                  this.id,

                uniqueId:
                  event.uniqueId,

                roomId:
                  event.roomId,
              },
            );
          },

        onDisconnected:
          () => {
            this.emitDisconnected();
          },

        onError:
          (error) => {
            this.context?.log(
              `TikTok error: ${error.message}`,
            );

            this.context?.emit(
              "tiktok.error",
              {
                pluginId:
                  this.id,

                message:
                  error.message,
              },
            );
          },
      });

    this.started =
      true;

    context.log(
      `${this.id} plugin started.`,
    );

    context.emit(
      "plugin.started",
      {
        pluginId:
          this.id,
      },
    );
  }

  async stop():
  Promise<void> {
    if (!this.started) {
      return;
    }

    const client =
      this.client;

    if (
      client !== undefined
      && client.getState()
        !== "disconnected"
    ) {
      try {
        await client.disconnect();
      } catch (error: unknown) {
        this.context?.log(
          `Failed to disconnect TikTok while stopping: ${
            this.getErrorMessage(
              error,
            )
          }`,
        );
      }
    }

    this.emitDisconnected();

    this.context?.log(
      `${this.id} plugin stopped.`,
    );

    this.context?.emit(
      "plugin.stopped",
      {
        pluginId:
          this.id,
      },
    );

    this.client =
      undefined;

    this.context =
      undefined;

    this.started =
      false;
  }

  isStarted(): boolean {
    return this.started;
  }

  async connect(
    uniqueId: string,
  ): Promise<void> {
    const client =
      this.getClient();

    const currentState =
      client.getState();

    if (
      currentState
      !== "disconnected"
    ) {
      throw new Error(
        `TikTok is already "${currentState}".`,
      );
    }

    this.context?.log(
      `Connecting to TikTok LIVE: @${this.normalizeUniqueId(
        uniqueId,
      )}.`,
    );

    this.context?.emit(
      "tiktok.connecting",
      {
        pluginId:
          this.id,

        uniqueId:
          this.normalizeUniqueId(
            uniqueId,
          ),
      },
    );

    await client.connect(
      uniqueId,
    );
  }

  async disconnect():
  Promise<void> {
    const client =
      this.getClient();

    if (
      client.getState()
      === "disconnected"
    ) {
      this.emitDisconnected();

      return;
    }

    this.context?.log(
      "Disconnecting from TikTok LIVE.",
    );

    await client.disconnect();

    this.emitDisconnected();
  }

  getStatus():
  TikTokPluginStatus {
    const client =
      this.client;

    const connectionState =
      client?.getState()
      ?? "disconnected";

    return {
      pluginId:
        this.id,

      started:
        this.started,

      connectionState,

      uniqueId:
        client?.getUniqueId()
        ?? null,

      connected:
        client?.isConnected()
        ?? false,
    };
  }

  private handleTikTokEvent(
    event: TikTokRuntimeEvent,
  ): void {
    const eventType =
      `tiktok.${event.kind}`;

    this.context?.emit(
      eventType,
      {
        pluginId:
          this.id,

        ...event,
      },
    );
  }

  private emitDisconnected():
  void {
    if (
      this.disconnectedEventEmitted
    ) {
      return;
    }

    this.disconnectedEventEmitted =
      true;

    this.context?.log(
      "TikTok disconnected.",
    );

    this.context?.emit(
      "tiktok.disconnected",
      {
        pluginId:
          this.id,
      },
    );
  }

  private getClient():
  TikTokClient {
    if (!this.started) {
      throw new Error(
        "TikTok plugin is not started.",
      );
    }

    if (
      this.client === undefined
    ) {
      throw new Error(
        "TikTok client is not initialized.",
      );
    }

    return this.client;
  }

  private normalizeUniqueId(
    uniqueId: string,
  ): string {
    return uniqueId
      .trim()
      .replace(/^@/, "");
  }

  private getErrorMessage(
    error: unknown,
  ): string {
    return error instanceof Error
      ? error.message
      : String(error);
  }
}