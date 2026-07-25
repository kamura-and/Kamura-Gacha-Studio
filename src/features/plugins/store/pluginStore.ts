import { create } from "zustand";

import { pluginRepository } from "../repository/PluginRepository";

import type {
  PluginConnectionUpdate,
  PluginDefinition,
  PluginId,
} from "../types/plugin";

type PluginState = {
  plugins: PluginDefinition[];

  initialize: () => void;

  setEnabled: (
    id: PluginId,
    enabled: boolean,
  ) => void;

  updateConnection: (
    id: PluginId,
    update: PluginConnectionUpdate,
  ) => void;

  disconnect: (
    id: PluginId,
  ) => void;

  resetConnections: () => void;
};

function createDefaultPlugins(): PluginDefinition[] {
  const now = Date.now();

  return [
    {
      id: "tiktok-live",
      name: "TikTok LIVE",
      type: "tiktok",
      enabled: true,
      connectionStatus:
        "disconnected",
      updatedAt: now,
    },
    {
      id: "minecraft",
      name: "Minecraft",
      type: "minecraft",
      enabled: true,
      connectionStatus:
        "disconnected",
      updatedAt: now,
    },
    {
      id: "overlay",
      name: "配信オーバーレイ",
      type: "overlay",
      enabled: true,
      connectionStatus:
        "disconnected",
      updatedAt: now,
    },
  ];
}

function mergeWithDefaults(
  savedPlugins: PluginDefinition[],
): PluginDefinition[] {
  const defaultPlugins =
    createDefaultPlugins();

  return defaultPlugins.map(
    (defaultPlugin) => {
      const savedPlugin =
        savedPlugins.find(
          (plugin) =>
            plugin.id ===
            defaultPlugin.id,
        );

      return (
        savedPlugin ??
        defaultPlugin
      );
    },
  );
}

function loadInitialPlugins(): PluginDefinition[] {
  return mergeWithDefaults(
    pluginRepository.loadAll(),
  );
}

function persistPlugins(
  plugins: PluginDefinition[],
): PluginDefinition[] {
  pluginRepository.saveAll(plugins);

  return plugins;
}

export const usePluginStore =
  create<PluginState>((set) => ({
    plugins: loadInitialPlugins(),

    initialize: () => {
      const plugins =
        loadInitialPlugins();

      pluginRepository.saveAll(
        plugins,
      );

      set({ plugins });
    },

    setEnabled: (
      id,
      enabled,
    ) => {
      set((state) => ({
        plugins: persistPlugins(
          state.plugins.map(
            (plugin) => {
              if (
                plugin.id !== id
              ) {
                return plugin;
              }

              return {
                ...plugin,
                enabled,
                connectionStatus:
                  enabled
                    ? plugin.connectionStatus
                    : "disconnected",
                connectionDetail:
                  enabled
                    ? plugin.connectionDetail
                    : undefined,
                errorMessage:
                  undefined,
                updatedAt:
                  Date.now(),
              };
            },
          ),
        ),
      }));
    },

    updateConnection: (
      id,
      update,
    ) => {
      const now = Date.now();

      set((state) => ({
        plugins: persistPlugins(
          state.plugins.map(
            (plugin) => {
              if (
                plugin.id !== id
              ) {
                return plugin;
              }

              return {
                ...plugin,
                connectionStatus:
                  update.connectionStatus,
                connectionDetail:
                  update.connectionDetail,
                errorMessage:
                  update.errorMessage,
                lastConnectedAt:
                  update.lastConnectedAt ??
                  (update.connectionStatus ===
                  "connected"
                    ? now
                    : plugin.lastConnectedAt),
                lastHeartbeatAt:
                  update.lastHeartbeatAt ??
                  plugin.lastHeartbeatAt,
                updatedAt: now,
              };
            },
          ),
        ),
      }));
    },

    disconnect: (id) => {
      set((state) => ({
        plugins: persistPlugins(
          state.plugins.map(
            (plugin) =>
              plugin.id === id
                ? {
                    ...plugin,
                    connectionStatus:
                      "disconnected",
                    connectionDetail:
                      undefined,
                    errorMessage:
                      undefined,
                    updatedAt:
                      Date.now(),
                  }
                : plugin,
          ),
        ),
      }));
    },

    resetConnections: () => {
      set((state) => ({
        plugins: persistPlugins(
          state.plugins.map(
            (plugin) => ({
              ...plugin,
              connectionStatus:
                "disconnected",
              connectionDetail:
                undefined,
              errorMessage:
                undefined,
              lastHeartbeatAt:
                undefined,
              updatedAt:
                Date.now(),
            }),
          ),
        ),
      }));
    },
  }));