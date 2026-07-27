import type {
  GachaPool,
} from "../types/pool";

const STORAGE_KEY =
  "kamura-gacha-pools";

export class PoolRepository {
  /**
   * 保存されているPoolをすべて取得します。
   */
  public loadAll(): GachaPool[] {
    try {
      const raw =
        localStorage.getItem(
          STORAGE_KEY,
        );

      if (!raw) {
        return [];
      }

      const parsed: unknown =
        JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed as GachaPool[];
    } catch {
      return [];
    }
  }

  /**
   * IDに一致するPoolを取得します。
   */
  public findById(
    id: string,
  ): GachaPool | undefined {
    return this.loadAll().find(
      (pool) => pool.id === id,
    );
  }

  /**
   * Poolをすべて保存します。
   */
  public saveAll(
    pools: GachaPool[],
  ): void {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(pools),
    );
  }
}

export const poolRepository =
  new PoolRepository();