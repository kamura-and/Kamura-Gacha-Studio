import type {
  PluginId,
} from "../../../plugins/types/plugin";

import type {
  PublishRuntimeEvent,
  RuntimePlugin,
} from "../../pluginRuntime/RuntimePlugin";


const TIKFINITY_WEBSOCKET_URL =
  "ws://localhost:21213/";


/**
 * TikFinity Desktop Appと接続するRuntimePlugin。
 *
 * TikFinity Event API:
 * ws://localhost:21213/
 *
 * 現段階ではWebSocket接続の確立のみを担当する。
 * イベント → RuntimeEvent変換は次の段階で追加する。
 */
export class TikFinityPlugin
  implements RuntimePlugin {
  public readonly id:
    PluginId =
    "tiktok-live";

  private socket:
    WebSocket | undefined;


  /**
   * TikFinityへの接続を開始する。
   *
   * 現段階ではRuntimeEventをまだ発行しないため、
   * publishは未使用。
   */
  public start(
    _publish: PublishRuntimeEvent,
  ): void {
    if (this.socket) {
      return;
    }

    const socket =
      new WebSocket(
        TIKFINITY_WEBSOCKET_URL,
      );

    this.socket =
      socket;


    socket.addEventListener(
      "open",
      () => {
        console.info(
          "[TikFinityPlugin]",
          "Connected",
          TIKFINITY_WEBSOCKET_URL,
        );
      },
    );


    socket.addEventListener(
      "message",
      (event) => {
        console.debug(
          "[TikFinityPlugin]",
          "Message received",
          event.data,
        );
      },
    );


    socket.addEventListener(
      "error",
      (event) => {
        console.error(
          "[TikFinityPlugin]",
          "WebSocket error",
          event,
        );
      },
    );


    socket.addEventListener(
      "close",
      () => {
        console.info(
          "[TikFinityPlugin]",
          "Disconnected",
        );

        if (
          this.socket ===
          socket
        ) {
          this.socket =
            undefined;
        }
      },
    );
  }


  /**
   * TikFinityとの接続を終了する。
   */
  public stop(): void {
    const socket =
      this.socket;

    this.socket =
      undefined;

    if (!socket) {
      return;
    }

    socket.close();
  }


  /**
   * WebSocket接続済みか返す。
   */
  public isConnected():
    boolean {
    return (
      this.socket?.readyState ===
      WebSocket.OPEN
    );
  }


  /**
   * Pluginが接続処理中、
   * または接続済みか返す。
   */
  public isStarted():
    boolean {
    return (
      this.socket !==
      undefined
    );
  }
}


export const tikFinityPlugin =
  new TikFinityPlugin();