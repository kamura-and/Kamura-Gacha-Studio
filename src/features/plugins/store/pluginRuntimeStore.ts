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

function createRuntime(
  id: PluginId,
): PluginRuntime {
  return {
    id,
    connectionStatus:
      "disconnected",
    updatedAt: Date.now(),
  };
}

function createInitialState(): Record<
  PluginId,
  PluginRuntime
> {
  return {
    "tiktok-live": createRuntime(
      "tiktok-live",
    ),

    minecraft: createRuntime(
      "minecraft",
    ),

    overlay: createRuntime(
      "overlay",
    ),

    fake: createRuntime(
      "fake",
    ),
  };
}

export const usePluginRuntimeStore =
  create<PluginRuntimeState>(
    (set) => ({
      runtimes:
        createInitialState(),

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

              id,

              updatedAt:
                Date.now(),
            },
          },
        })),

      reset: () =>
        set({
          runtimes:
            createInitialState(),
        }),
    }),
  );