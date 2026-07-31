import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import "./index.css";

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
      message.type
        === "plugin-host.ready"
      && !pluginListRequested
    ) {
      pluginListRequested =
        true;

      void pluginHost
        .sendCommand({
          requestId:
            `plugin-list-${Date.now()}`,

          type:
            "plugin.list",

          payload: {},
        })
        .catch(
          (error: unknown) => {
            console.error(
              "[PluginHostService] Failed to request plugin list.",
              error,
            );
          },
        );
    }

    if (
      message.type
      === "command.succeeded"
    ) {
      console.log(
        "[PluginHostService] Command succeeded.",
        message.payload,
      );
    }

    if (
      message.type
      === "command.failed"
    ) {
      console.error(
        "[PluginHostService] Command failed.",
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

createRoot(
  document.getElementById("root")!,
).render(
  <StrictMode>
    <App />
  </StrictMode>,
);