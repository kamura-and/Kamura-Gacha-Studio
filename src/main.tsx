import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import "./index.css";

import {
  startPresentationOverlayBridge,
} from "@/features/presentation/runtime/PresentationOverlayBridge";

import {
  PluginHostService,
} from "./features/runtime/plugin-host";

const pluginHost =
  new PluginHostService();

let pluginListRequested =
  false;

pluginHost.onMessage(
  (message) => {
    if (
      message.type ===
      "plugin-host.ready"
      && !pluginListRequested
    ) {
      pluginListRequested =
        true;

      (async () => {
        try {
          await pluginHost.sendCommand({
            requestId:
              `plugin-list-${Date.now()}`,

            type:
              "plugin.list",

            payload: {},
          });

          await pluginHost.sendCommand({
            requestId:
              `tiktok-connect-${Date.now()}`,

            type:
              "tiktok.connect",

            payload: {
              // あなたのTikTokユーザー名（@は不要）
              uniqueId:
                "kamura_kaguragi",
            },
          });
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

    // TikTok接続イベント
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

    // TikTokイベント
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

void pluginHost
  .start()
  .catch(
    (error: unknown) => {
      console.error(
        "[PluginHostService] Failed to start Plugin Host.",
        error,
      );
    },
  );

startPresentationOverlayBridge();

createRoot(
  document.getElementById("root")!,
).render(
  <StrictMode>
    <App />
  </StrictMode>,
);