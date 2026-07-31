import {
  ControlEvent,
  TikTokLiveConnection,
  WebcastEvent,
} from "tiktok-live-connector";

import {
  mapTikTokFollowEvent,
  mapTikTokGiftEvent,
  mapTikTokLikeEvent,
  mapTikTokShareEvent,
} from "./TikTokEventMapper.js";

import type {
  TikTokConnectedListener,
  TikTokConnectionState,
  TikTokDisconnectedListener,
  TikTokErrorListener,
  TikTokRuntimeEventListener,
} from "./types.js";

export interface TikTokClientOptions {
  onEvent:
    TikTokRuntimeEventListener;

  onConnected?:
    TikTokConnectedListener;

  onDisconnected?:
    TikTokDisconnectedListener;

  onError?:
    TikTokErrorListener;
}

/**
 * The runtime TikTokLiveConnection object exposes on(),
 * but some versions of the package type definitions do not
 * expose it correctly.
 *
 * Keep the type workaround limited to event subscription.
 */
interface TikTokEventSource {
  on(
    eventName: string,
    listener: (
      payload: unknown,
    ) => void,
  ): unknown;
}

export class TikTokClient {
  private connection:
    TikTokLiveConnection | null =
    null;

  private state:
    TikTokConnectionState =
    "disconnected";

  private uniqueId:
    string | null =
    null;

  /**
   * ControlEvent.ERROR and connect() rejection can report
   * the same connection error multiple times.
   *
   * This flag prevents duplicate error notifications while
   * a single connection attempt is in progress.
   */
  private connectionAttemptErrorReported =
    false;

  private readonly options:
    TikTokClientOptions;

  constructor(
    options: TikTokClientOptions,
  ) {
    this.options =
      options;
  }

  getState():
  TikTokConnectionState {
    return this.state;
  }

  getUniqueId():
  string | null {
    return this.uniqueId;
  }

  isConnected(): boolean {
    return (
      this.state === "connected"
      && this.connection !== null
    );
  }

  async connect(
    uniqueId: string,
  ): Promise<void> {
    const normalizedUniqueId =
      this.normalizeUniqueId(
        uniqueId,
      );

    if (
      this.state !== "disconnected"
    ) {
      throw new Error(
        `TikTok client cannot connect while state is "${this.state}".`,
      );
    }

    this.state =
      "connecting";

    this.uniqueId =
      normalizedUniqueId;

    this.connectionAttemptErrorReported =
      false;

    const connection =
      new TikTokLiveConnection(
        normalizedUniqueId,
        {
          enableExtendedGiftInfo:
            true,
        },
      );

    this.connection =
      connection;

    this.registerEventListeners(
      connection,
    );

    try {
      const connectionState =
        await connection.connect();

      if (
        this.connection
        !== connection
      ) {
        await this.safeDisconnect(
          connection,
        );

        return;
      }

      this.state =
        "connected";

      this.connectionAttemptErrorReported =
        false;

      this.options.onConnected?.({
        uniqueId:
          normalizedUniqueId,

        roomId:
          String(
            connectionState.roomId,
          ),
      });
    } catch (error: unknown) {
      const normalizedError =
        this.toError(
          error,
        );

      if (
        this.connection
        === connection
      ) {
        this.connection =
          null;

        this.uniqueId =
          null;

        this.state =
          "disconnected";
      }

      this.reportConnectionErrorOnce(
        normalizedError,
      );

      throw normalizedError;
    }
  }

  async disconnect():
  Promise<void> {
    if (
      this.state === "disconnected"
    ) {
      return;
    }

    const connection =
      this.connection;

    this.state =
      "disconnecting";

    try {
      if (
        connection !== null
      ) {
        await this.safeDisconnect(
          connection,
        );
      }
    } finally {
      this.connection =
        null;

      this.uniqueId =
        null;

      this.state =
        "disconnected";

      this.connectionAttemptErrorReported =
        false;
    }
  }

  private registerEventListeners(
    connection:
      TikTokLiveConnection,
  ): void {
    const eventSource =
      connection as unknown as TikTokEventSource;

    eventSource.on(
      WebcastEvent.GIFT,
      (data: unknown) => {
        if (
          !this.isCurrentConnection(
            connection,
          )
        ) {
          return;
        }

        this.options.onEvent(
          mapTikTokGiftEvent(
            data,
          ),
        );
      },
    );

    eventSource.on(
      WebcastEvent.LIKE,
      (data: unknown) => {
        if (
          !this.isCurrentConnection(
            connection,
          )
        ) {
          return;
        }

        this.options.onEvent(
          mapTikTokLikeEvent(
            data,
          ),
        );
      },
    );

    eventSource.on(
      WebcastEvent.FOLLOW,
      (data: unknown) => {
        if (
          !this.isCurrentConnection(
            connection,
          )
        ) {
          return;
        }

        this.options.onEvent(
          mapTikTokFollowEvent(
            data,
          ),
        );
      },
    );

    eventSource.on(
      WebcastEvent.SHARE,
      (data: unknown) => {
        if (
          !this.isCurrentConnection(
            connection,
          )
        ) {
          return;
        }

        this.options.onEvent(
          mapTikTokShareEvent(
            data,
          ),
        );
      },
    );

    eventSource.on(
      ControlEvent.DISCONNECTED,
      (_data: unknown) => {
        if (
          !this.isCurrentConnection(
            connection,
          )
        ) {
          return;
        }

        this.connection =
          null;

        this.uniqueId =
          null;

        this.state =
          "disconnected";

        this.connectionAttemptErrorReported =
          false;

        this.options
          .onDisconnected?.();
      },
    );

    eventSource.on(
      ControlEvent.ERROR,
      (error: unknown) => {
        if (
          !this.isCurrentConnection(
            connection,
          )
        ) {
          return;
        }

        const normalizedError =
          this.toError(
            error,
          );

        if (
          this.state === "connecting"
        ) {
          this.reportConnectionErrorOnce(
            normalizedError,
          );

          return;
        }

        this.options.onError?.(
          normalizedError,
        );
      },
    );
  }

  private isCurrentConnection(
    connection:
      TikTokLiveConnection,
  ): boolean {
    return (
      this.connection
      === connection
    );
  }

  private reportConnectionErrorOnce(
    error: Error,
  ): void {
    if (
      this.connectionAttemptErrorReported
    ) {
      return;
    }

    this.connectionAttemptErrorReported =
      true;

    this.options.onError?.(
      error,
    );
  }

  private async safeDisconnect(
    connection:
      TikTokLiveConnection,
  ): Promise<void> {
    try {
      await connection.disconnect();
    } catch (error: unknown) {
      console.warn(
        "[TikTokClient] Failed to disconnect TikTok connection cleanly.",
        this.toError(
          error,
        ),
      );
    }
  }

  private normalizeUniqueId(
    uniqueId: string,
  ): string {
    const normalized =
      uniqueId
        .trim()
        .replace(/^@/, "");

    if (
      normalized.length === 0
    ) {
      throw new Error(
        "TikTok uniqueId must not be empty.",
      );
    }

    return normalized;
  }

  private toError(
    error: unknown,
  ): Error {
    if (
      error instanceof Error
    ) {
      return error;
    }

    if (
      typeof error === "object"
      && error !== null
      && "exception" in error
    ) {
      const exception =
        error.exception;

      if (
        exception instanceof Error
      ) {
        return exception;
      }
    }

    if (
      typeof error === "object"
      && error !== null
      && "info" in error
      && typeof error.info
        === "string"
    ) {
      return new Error(
        error.info,
      );
    }

    if (
      typeof error === "object"
      && error !== null
    ) {
      try {
        return new Error(
          JSON.stringify(
            error,
          ),
        );
      } catch {
        return new Error(
          String(
            error,
          ),
        );
      }
    }

    return new Error(
      String(
        error,
      ),
    );
  }
}