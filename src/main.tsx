import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import "./index.css";

import { PluginHostService } from "./features/runtime/plugin-host";

const pluginHost = new PluginHostService();

void pluginHost.start().catch((error: unknown) => {
  console.error(
    "[PluginHostService] Failed to start Plugin Host.",
    error,
  );
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);