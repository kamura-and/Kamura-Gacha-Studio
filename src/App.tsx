import {
  isTauri,
} from "@tauri-apps/api/core";

import {
  getCurrentWindow,
} from "@tauri-apps/api/window";

import {
  RouterProvider,
} from "react-router-dom";

import {
  AppProviders,
} from "@/app/AppProviders";

import {
  router,
} from "@/app/router/router";

import {
  OverlayWindowPage,
} from "@/features/overlay/pages/OverlayWindowPage";

function getCurrentWindowLabel(): string {
  if (!isTauri()) {
    return "main";
  }

  return getCurrentWindow().label;
}

const currentWindowLabel =
  getCurrentWindowLabel();

function prepareOverlayDocument(): void {
  if (
    currentWindowLabel !== "overlay"
  ) {
    return;
  }

  document.documentElement.style.background =
    "transparent";

  document.documentElement.style.overflow =
    "hidden";

  document.body.style.background =
    "transparent";

  document.body.style.margin = "0";

  document.body.style.overflow =
    "hidden";

  const rootElement =
    document.getElementById("root");

  if (rootElement) {
    rootElement.style.background =
      "transparent";

    rootElement.style.width =
      "100vw";

    rootElement.style.height =
      "100vh";
  }
}

prepareOverlayDocument();

function App() {
  if (
    currentWindowLabel === "overlay"
  ) {
    return <OverlayWindowPage />;
  }

  return (
    <AppProviders>
      <RouterProvider
        router={router}
      />
    </AppProviders>
  );
}

export default App;