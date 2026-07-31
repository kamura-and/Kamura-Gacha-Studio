import { create } from "zustand";

import {
  createJSONStorage,
  persist,
} from "zustand/middleware";

import type {
  GachaCommand,
  GachaItem,
  GachaRarity,
} from "@/features/gacha/types/gacha";

type GachaStore = {
  items: GachaItem[];

  addItem: (item: GachaItem) => void;

  updateItem: (
    item: GachaItem,
  ) => void;

  upsertItem: (
    item: GachaItem,
  ) => void;

  deleteItem: (
    id: string,
  ) => void;

  toggleItemEnabled: (
    id: string,
  ) => void;

  replaceItems: (
    items: GachaItem[],
  ) => void;

  resetItems: () => void;
};

type LegacyGachaItem = {
  id: string;
  name: string;
  description: string;

  imageDataUrl?:
    | string
    | null;

  command?: string;

  commands?: GachaCommand[];

  effectId?:
    | string
    | null;

  rarity: GachaRarity;

  probability?: number;

  isEnabled: boolean;

  createdAt: string;
};

type PersistedGachaState = {
  items?: LegacyGachaItem[];
};

function createCommandId(): string {
  return `command-${crypto.randomUUID()}`;
}

function normalizeImageDataUrl(
  value: unknown,
): string | null {
  if (
    typeof value !== "string"
  ) {
    return null;
  }

  const trimmedValue =
    value.trim();

  if (!trimmedValue) {
    return null;
  }

  if (
    !trimmedValue.startsWith(
      "data:image/",
    )
  ) {
    return null;
  }

  return trimmedValue;
}

function migrateItem(
  item: LegacyGachaItem,
): GachaItem {
  const normalizedImageDataUrl =
    normalizeImageDataUrl(
      item.imageDataUrl,
    );

  if (
    Array.isArray(item.commands)
  ) {
    return {
      id: item.id,

      name: item.name,

      description:
        item.description,

      imageDataUrl:
        normalizedImageDataUrl,

      effectId:
        item.effectId ?? null,

      commands:
        item.commands.map(
          (command) => ({
            ...command,
          }),
        ),

      rarity:
        item.rarity,

      isEnabled:
        item.isEnabled,

      createdAt:
        item.createdAt,
    };
  }

  return {
    id: item.id,

    name: item.name,

    description:
      item.description,

    imageDataUrl:
      normalizedImageDataUrl,

    effectId:
      item.effectId ?? null,

    commands: item.command
      ? [
          {
            id:
              createCommandId(),

            type:
              "minecraft",

            value:
              item.command,

            delay:
              0,

            enabled:
              true,
          },
        ]
      : [],

    rarity:
      item.rarity,

    isEnabled:
      item.isEnabled,

    createdAt:
      item.createdAt,
  };
}

export const useGachaStore =
  create<GachaStore>()(
    persist(
      (set) => ({
        items: [],

        addItem: (
          item,
        ) => {
          set((state) => ({
            items: [
              item,
              ...state.items,
            ],
          }));
        },

        updateItem: (
          updatedItem,
        ) => {
          set((state) => ({
            items:
              state.items.map(
                (item) =>
                  item.id ===
                  updatedItem.id
                    ? updatedItem
                    : item,
              ),
          }));
        },

        upsertItem: (
          submittedItem,
        ) => {
          set((state) => {
            const itemExists =
              state.items.some(
                (item) =>
                  item.id ===
                  submittedItem.id,
              );

            if (!itemExists) {
              return {
                items: [
                  submittedItem,
                  ...state.items,
                ],
              };
            }

            return {
              items:
                state.items.map(
                  (item) =>
                    item.id ===
                    submittedItem.id
                      ? submittedItem
                      : item,
                ),
            };
          });
        },

        deleteItem: (
          id,
        ) => {
          set((state) => ({
            items:
              state.items.filter(
                (item) =>
                  item.id !== id,
              ),
          }));
        },

        toggleItemEnabled: (
          id,
        ) => {
          set((state) => ({
            items:
              state.items.map(
                (item) =>
                  item.id === id
                    ? {
                        ...item,

                        isEnabled:
                          !item.isEnabled,
                      }
                    : item,
              ),
          }));
        },

        replaceItems: (
          items,
        ) => {
          set({
            items,
          });
        },

        resetItems: () => {
          set({
            items: [],
          });
        },
      }),
      {
        name:
          "kamura-gacha-items",

        version:
          4,

        storage:
          createJSONStorage(
            () =>
              localStorage,
          ),

        partialize: (
          state,
        ) => ({
          items:
            state.items,
        }),

        migrate: (
          persistedState,
        ) => {
          const state =
            persistedState as PersistedGachaState;

          if (
            !Array.isArray(
              state.items,
            )
          ) {
            return {
              items: [],
            };
          }

          return {
            items:
              state.items.map(
                migrateItem,
              ),
          };
        },
      },
    ),
  );