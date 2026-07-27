import { create } from "zustand";

import {
  createJSONStorage,
  persist,
} from "zustand/middleware";

import type {
  PluginConfig,
  PluginId,
  PluginSettings,
} from "../types/plugin";

type PluginConfigState = {
  configs: Record<
    PluginId,
    PluginConfig
  >;

  setEnabled: (
    id: PluginId,
    enabled: boolean,
  ) => void;

  updateSettings: (
    id: PluginId,
    settings: PluginSettings,
  ) => void;

  reset: () => void;
};

function createInitialSettings(
  id: PluginId,
): PluginSettings {
  switch (id) {
    case "tiktok-live":
      return {
        username: "",
        autoConnect: false,
        receiveGift: true,
        receiveComment: true,
      };

    case "minecraft":
      return {
        host: "127.0.0.1",
        port: 19132,
        password: "",
        autoConnect: false,
      };

    case "overlay":
      return {
        width: 1920,
        height: 1080,
        url:
          "http://localhost:5173/overlay",
        autoShow: false,
      };

    default:
      return {};
  }
}

function createConfig(
  id: PluginId,
): PluginConfig {
  return {
    id,
    enabled: true,
    settings:
      createInitialSettings(id),
    updatedAt: Date.now(),
  };
}

function createInitialConfigs(): Record<
  PluginId,
  PluginConfig
> {
  return {
    "tiktok-live": createConfig(
      "tiktok-live",
    ),

    minecraft: createConfig(
      "minecraft",
    ),

    overlay: createConfig(
      "overlay",
    ),
  };
}

export const usePluginConfigStore =
  create<PluginConfigState>()(
    persist(
      (set) => ({
        configs:
          createInitialConfigs(),

        setEnabled: (
          id,
          enabled,
        ) =>
          set((state) => ({
            configs: {
              ...state.configs,

              [id]: {
                ...state.configs[id],
                enabled,
                updatedAt:
                  Date.now(),
              },
            },
          })),

        updateSettings: (
          id,
          settings,
        ) =>
          set((state) => ({
            configs: {
              ...state.configs,

              [id]: {
                ...state.configs[id],

                settings: {
                  ...state
                    .configs[id]
                    .settings,

                  ...settings,
                },

                updatedAt:
                  Date.now(),
              },
            },
          })),

        reset: () =>
          set({
            configs:
              createInitialConfigs(),
          }),
      }),
      {
        name:
          "kamura-plugin-configs",

        storage:
          createJSONStorage(
            () =>
              localStorage,
          ),

        partialize: (
          state,
        ) => ({
          configs:
            state.configs,
        }),
      },
    ),
  );