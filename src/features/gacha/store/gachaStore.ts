import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { sampleGachaItems } from "@/features/gacha/data/sampleGachaItems";
import type {
  GachaCommand,
  GachaItem,
  GachaRarity,
} from "@/features/gacha/types/gacha";

type GachaStore = {
  items: GachaItem[];

  addItem: (item: GachaItem) => void;
  updateItem: (item: GachaItem) => void;
  upsertItem: (item: GachaItem) => void;
  deleteItem: (id: string) => void;
  toggleItemEnabled: (id: string) => void;
  replaceItems: (items: GachaItem[]) => void;
  resetItems: () => void;
};

type LegacyGachaItem = {
  id: string;
  name: string;
  description: string;
  command?: string;
  commands?: GachaCommand[];
  rarity: GachaRarity;
  probability: number;
  isEnabled: boolean;
  createdAt: string;
};

type PersistedGachaState = {
  items?: LegacyGachaItem[];
};

function createCommandId() {
  return `command-${crypto.randomUUID()}`;
}

function cloneSampleItems(): GachaItem[] {
  return sampleGachaItems.map((item) => ({
    ...item,
    commands: item.commands.map((command) => ({
      ...command,
    })),
  }));
}

function migrateItem(item: LegacyGachaItem): GachaItem {
  if (Array.isArray(item.commands)) {
    return {
      ...item,
      commands: item.commands,
    };
  }

  return {
    id: item.id,
    name: item.name,
    description: item.description,
    commands: item.command
      ? [
          {
            id: createCommandId(),
            type: "minecraft",
            value: item.command,
            delay: 0,
            enabled: true,
          },
        ]
      : [],
    rarity: item.rarity,
    probability: item.probability,
    isEnabled: item.isEnabled,
    createdAt: item.createdAt,
  };
}

export const useGachaStore = create<GachaStore>()(
  persist(
    (set) => ({
      items: cloneSampleItems(),

      addItem: (item) => {
        set((state) => ({
          items: [item, ...state.items],
        }));
      },

      updateItem: (updatedItem) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === updatedItem.id
              ? updatedItem
              : item,
          ),
        }));
      },

      upsertItem: (submittedItem) => {
        set((state) => {
          const itemExists = state.items.some(
            (item) => item.id === submittedItem.id,
          );

          if (!itemExists) {
            return {
              items: [submittedItem, ...state.items],
            };
          }

          return {
            items: state.items.map((item) =>
              item.id === submittedItem.id
                ? submittedItem
                : item,
            ),
          };
        });
      },

      deleteItem: (id) => {
        set((state) => ({
          items: state.items.filter(
            (item) => item.id !== id,
          ),
        }));
      },

      toggleItemEnabled: (id) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  isEnabled: !item.isEnabled,
                }
              : item,
          ),
        }));
      },

      replaceItems: (items) => {
        set({ items });
      },

      resetItems: () => {
        set({
          items: cloneSampleItems(),
        });
      },
    }),
    {
      name: "kamura-gacha-items",
      version: 2,
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        items: state.items,
      }),

      migrate: (persistedState) => {
        const state =
          persistedState as PersistedGachaState;

        if (!Array.isArray(state.items)) {
          return {
            items: cloneSampleItems(),
          };
        }

        return {
          items: state.items.map(migrateItem),
        };
      },
    },
  ),
);