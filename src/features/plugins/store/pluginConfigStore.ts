import { create } from "zustand";

import type {
  PluginConfig,
  PluginId,
  PluginSettings,
} from "../types/plugin";

type PluginConfigState = {
  configs: Record<PluginId, PluginConfig>;

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

function createConfig(
  id: PluginId,
): PluginConfig {
  return {
    id,
    enabled: true,
    settings: {},
    updatedAt: Date.now(),
  };
}

const initialConfigs: Record<
  PluginId,
  PluginConfig
> = {
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

export const usePluginConfigStore =
  create<PluginConfigState>(
    (set) => ({
      configs: initialConfigs,

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
            structuredClone(
              initialConfigs,
            ),
        }),
    }),
  );