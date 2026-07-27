import { create } from "zustand";

import { poolRepository } from "../repositories/poolRepository";

import type {
  GachaPool
} from "../types/pool";

type PoolStore = {
  pools: GachaPool[];

  loadPools: () => void;

  addPool: (
    pool: GachaPool,
  ) => void;

  updatePool: (
    pool: GachaPool,
  ) => void;

  deletePool: (
    id: string,
  ) => void;
};

export const usePoolStore =
  create<PoolStore>(
    (set, get) => ({
      pools: [],

      loadPools() {
        set({
          pools:
            poolRepository.loadAll(),
        });
      },

      addPool(pool) {
        const pools = [
          ...get().pools,
          pool,
        ];

        poolRepository.saveAll(
          pools,
        );

        set({
          pools,
        });
      },

      updatePool(pool) {
        const pools =
          get().pools.map(
            (current) =>
              current.id === pool.id
                ? pool
                : current,
          );

        poolRepository.saveAll(
          pools,
        );

        set({
          pools,
        });
      },

      deletePool(id) {
        const pools =
          get().pools.filter(
            (pool) =>
              pool.id !== id,
          );

        poolRepository.saveAll(
          pools,
        );

        set({
          pools,
        });
      },
    }),
  );