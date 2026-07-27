import {
  gachaRepository,
} from "../repository/GachaRepository";

import type {
  GachaItem,
} from "../types/gacha";

import {
  poolRepository,
} from "@/features/pools/repositories/poolRepository";

import {
  drawPool,
} from "@/features/pools/services/drawPool";

import type {
  GachaPool,
  PoolEntry,
} from "@/features/pools/types/pool";

export type GachaSpinOptions = {
  randomSource?: () => number;
};

export type GachaSpinResult = {
  gachaPoolId: string;

  poolEntry: PoolEntry;

  item: GachaItem;

  drawnAt: number;
};

export class GachaRuntime {
  public spin(
    gachaPoolId: string,
    options: GachaSpinOptions = {},
  ): GachaSpinResult {
    const normalizedPoolId =
      gachaPoolId.trim();

    if (!normalizedPoolId) {
      throw new Error(
        "ガチャプールIDは必須です。",
      );
    }

    const pool =
      poolRepository.findById(
        normalizedPoolId,
      );

    if (!pool) {
      throw new Error(
        [
          "指定されたガチャ箱が見つかりません。",
          `gachaPoolId=${normalizedPoolId}`,
        ].join(" "),
      );
    }

    if (!pool.enabled) {
      throw new Error(
        [
          "指定されたガチャ箱は無効です。",
          `gachaPoolId=${normalizedPoolId}`,
        ].join(" "),
      );
    }

    const drawablePool =
      this.createDrawablePool(pool);

    if (
      drawablePool.entries.length === 0
    ) {
      throw new Error(
        [
          "抽選可能な景品がありません。",
          "有効な景品と正の重みが設定されているか確認してください。",
          `gachaPoolId=${normalizedPoolId}`,
        ].join(" "),
      );
    }

    const selectedEntry =
      drawPool(
        drawablePool,
        options.randomSource,
      );

    if (!selectedEntry) {
      throw new Error(
        [
          "ガチャ箱から景品を抽選できませんでした。",
          "重みの設定を確認してください。",
          `gachaPoolId=${normalizedPoolId}`,
        ].join(" "),
      );
    }

    const selectedItem =
      gachaRepository.findById(
        selectedEntry.gachaItemId,
      );

    if (!selectedItem) {
      throw new Error(
        [
          "抽選された景品が見つかりません。",
          `gachaItemId=${selectedEntry.gachaItemId}`,
          `gachaPoolId=${normalizedPoolId}`,
        ].join(" "),
      );
    }

    if (!selectedItem.isEnabled) {
      throw new Error(
        [
          "抽選された景品は無効です。",
          `gachaItemId=${selectedItem.id}`,
          `gachaPoolId=${normalizedPoolId}`,
        ].join(" "),
      );
    }

    return {
      gachaPoolId:
        normalizedPoolId,

      poolEntry:
        clonePoolEntry(
          selectedEntry,
        ),

      item:
        cloneGachaItem(
          selectedItem,
        ),

      drawnAt: Date.now(),
    };
  }

  /**
   * 存在していて有効な景品だけを
   * 抽選対象として残します。
   */
  private createDrawablePool(
    pool: GachaPool,
  ): GachaPool {
    const entries =
      pool.entries.filter(
        (entry) => {
          if (
            !Number.isFinite(
              entry.weight,
            ) ||
            entry.weight <= 0
          ) {
            return false;
          }

          const item =
            gachaRepository.findById(
              entry.gachaItemId,
            );

          return Boolean(
            item?.isEnabled,
          );
        },
      );

    return {
      ...pool,

      entries: entries.map(
        clonePoolEntry,
      ),
    };
  }
}

export const gachaRuntime =
  new GachaRuntime();

function clonePoolEntry(
  entry: PoolEntry,
): PoolEntry {
  return {
    ...entry,
  };
}

function cloneGachaItem(
  item: GachaItem,
): GachaItem {
  return {
    ...item,

    commands:
      item.commands.map(
        (command) => ({
          ...command,
        }),
      ),
  };
}