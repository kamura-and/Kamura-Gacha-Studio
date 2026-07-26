import {
  connectorManager,
} from "./ConnectorManager";

import {
  MinecraftConnector,
} from "./MinecraftConnector";

import {
  OverlayConnector,
} from "./OverlayConnector";

import {
  TikTokConnector,
} from "./TikTokConnector";

export function registerDefaultConnectors(): void {
  if (
    !connectorManager.has(
      "tiktok-live",
    )
  ) {
    connectorManager.register(
      new TikTokConnector(),
    );
  }

  if (
    !connectorManager.has(
      "minecraft",
    )
  ) {
    connectorManager.register(
      new MinecraftConnector(),
    );
  }

  if (
    !connectorManager.has(
      "overlay",
    )
  ) {
    connectorManager.register(
      new OverlayConnector(),
    );
  }
}