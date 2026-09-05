import {
  isTauri,
} from "@tauri-apps/api/core";

import {
  getCurrentWindow,
} from "@tauri-apps/api/window";

import {
  StrictMode,
} from "react";

import {
  createRoot,
} from "react-dom/client";

import App from "./App";
import "./index.css";

import {
  startPresentationOverlayBridge,
} from "@/features/presentation/runtime/PresentationOverlayBridge";

import {
  pluginHostService,
} from "./features/runtime/plugin-host/PluginHostService";


function getCurrentWindowLabel():
string {
  if (!isTauri()) {
    return "main";
  }

  return getCurrentWindow().label;
}


const currentWindowLabel =
  getCurrentWindowLabel();

const isMainWindow =
  currentWindowLabel ===
  "main";


if (isMainWindow) {
  let pluginListRequested =
    false;


  pluginHostService.onMessage(
    (
      message,
    ) => {
      if (
        message.type ===
          "plugin-host.ready" &&
        !pluginListRequested
      ) {
        pluginListRequested =
          true;

        void (async () => {
          try {
            await pluginHostService
              .sendCommand({
                requestId:
                  `plugin-list-${Date.now()}`,

                type:
                  "plugin.list",

                payload: {},
              });

            /*
             * TikTokへの接続は
             * LIVE開始時に必要な場合だけ行う。
             *
             * アプリ起動時には
             * 自動接続しない。
             */
          } catch (
            error: unknown
          ) {
            console.error(
              "[PluginHostService] Failed to initialize Plugin Host.",
              error,
            );
          }
        })();
      }


      if (
        message.type ===
        "command.succeeded"
      ) {
        console.log(
          "[PluginHostService] Command succeeded.",
          message.payload,
        );
      }


      if (
        message.type ===
        "command.failed"
      ) {
        console.error(
          "[PluginHostService] Command failed:",
          JSON.stringify(
            message.payload,
            null,
            2,
          ),
        );
      }


      if (
        message.type ===
        "tiktok.connecting"
      ) {
        console.log(
          "🟡 TikTok Connecting",
          message.payload,
        );
      }


      if (
        message.type ===
        "tiktok.connected"
      ) {
        console.log(
          "🟢 TikTok Connected",
          message.payload,
        );
      }


      if (
        message.type ===
        "tiktok.disconnected"
      ) {
        console.log(
          "⚪ TikTok Disconnected",
          message.payload,
        );
      }


      if (
        message.type ===
        "tiktok.error"
      ) {
        console.error(
          "🔴 TikTok Error",
          message.payload,
        );
      }


      if (
        message.type ===
        "tiktok.gift"
      ) {
        console.log(
          "🎁 Gift",
          message.payload,
        );
      }


      if (
        message.type ===
        "tiktok.like"
      ) {
        console.log(
          "👍 Like",
          message.payload,
        );
      }


      if (
        message.type ===
        "tiktok.follow"
      ) {
        console.log(
          "➕ Follow",
          message.payload,
        );
      }


      if (
        message.type ===
        "tiktok.share"
      ) {
        console.log(
          "📤 Share",
          message.payload,
        );
      }
    },
  );


  void pluginHostService
    .start()
    .catch(
      (
        error: unknown,
      ) => {
        console.error(
          "[PluginHostService] Failed to start Plugin Host.",
          error,
        );
      },
    );


  /*
   * PresentationからOverlayへの送信処理は
   * メインウィンドウだけで起動する。
   */
  startPresentationOverlayBridge();
}


createRoot(
  document.getElementById(
    "root",
  )!,
).render(
  <StrictMode>
    <App />
  </StrictMode>,
);