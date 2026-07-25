import { create } from "zustand";

import type {
  PluginConnectionStatus,
  PluginId,
  PluginRuntime,
} from "../types/plugin";

type PluginRuntimeState = {
  runtimes: Record<
    PluginId,
    PluginRuntime
  >;

  setConnectionStatus: (
    id: PluginId,
    status: PluginConnectionStatus,
  ) => void;

  update: (
    id: PluginId,
    update: Partial<PluginRuntime>,
  ) => void;

  reset: () => void;
};

function createRuntime(): PluginRuntime {
  return {
    id: "minecraft" as PluginId,
    connectionStatus:
      "disconnected",
    updatedAt: Date.now(),
  };
}

const initialState: Record<
  PluginId,
  PluginRuntime
> = {
  "tiktok-live": {
    ...createRuntime(),
    id: "tiktok-live",
  },

  minecraft: {
    ...createRuntime(),
    id: "minecraft",
  },

  overlay: {
    ...createRuntime(),
    id: "overlay",
  },
};

export const usePluginRuntimeStore =
  create<PluginRuntimeState>(
    (set) => ({
      runtimes: initialState,

      setConnectionStatus: (
        id,
        connectionStatus,
      ) =>
        set((state) => ({
          runtimes: {
            ...state.runtimes,

            [id]: {
              ...state.runtimes[id],

              connectionStatus,

              updatedAt:
                Date.now(),
            },
          },
        })),

      update: (
        id,
        update,
      ) =>
        set((state) => ({
          runtimes: {
            ...state.runtimes,

            [id]: {
              ...state.runtimes[id],

              ...update,

              updatedAt:
                Date.now(),
            },
          },
        })),

      reset: () =>
        set({
          runtimes:
            structuredClone(
              initialState,
            ),
        }),
    }),
  );