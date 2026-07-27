import type { GachaPool } from "../types/pool";

const STORAGE_KEY = "kamura-gacha-pools";

export class PoolRepository {
  loadAll(): GachaPool[] {
    try {
      const raw = localStorage.getItem(
        STORAGE_KEY,
      );

      if (!raw) {
        return [];
      }

      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  saveAll(
    pools: GachaPool[],
  ) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(pools),
    );
  }
}

export const poolRepository =
  new PoolRepository();