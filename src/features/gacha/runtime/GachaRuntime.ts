import {
  effectRepository,
} from "@/features/effects/repository/EffectRepository";

import type {
  EffectDefinition,
} from "@/features/effects/types/effectDefinition";

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

import {
  gachaRepository,
} from "../repository/GachaRepository";

import type {
  GachaItem,
} from "../types/gacha";

export type GachaSpinOptions = {
  randomSource?: () => number;
};

/**
 * 新方式：
 * PoolEntry.effectId
 * ↓
 * EffectDefinition
 */
export type EffectPrizeSpinResult = {
  source: "effect";

  gachaPoolId: string;

  poolEntry: PoolEntry;

  effect: EffectDefinition;

  drawnAt: number;
};

/**
 * 旧方式：
 * PoolEntry.gachaItemId
 * ↓
 * GachaItem
 *
 * 既存ガチャ箱互換用。
 */
export type LegacyGachaSpinResult = {
  source: "legacy-gacha-item";

  gachaPoolId: string;

  poolEntry: PoolEntry;

  item: GachaItem;

  drawnAt: number;
};

export type GachaSpinResult =
  | EffectPrizeSpinResult
  | LegacyGachaSpinResult;

export class GachaRuntime {
  public spin(
    gachaPoolId: string,
    options:
      GachaSpinOptions = {},
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
      this.createDrawablePool(
        pool,
      );

    if (
      drawablePool.entries
        .length === 0
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

    /**
     * 新方式を優先。
     */
    const effectId =
      selectedEntry.effectId?.trim();

    if (effectId) {
      const selectedEffect =
        effectRepository.load(
          effectId,
        );

      if (!selectedEffect) {
        throw new Error(
          [
            "抽選された景品Effectが見つかりません。",
            `effectId=${effectId}`,
            `gachaPoolId=${normalizedPoolId}`,
          ].join(" "),
        );
      }

      if (
        selectedEffect.isEnabled ===
        false
      ) {
        throw new Error(
          [
            "抽選された景品Effectは無効です。",
            `effectId=${selectedEffect.id}`,
            `gachaPoolId=${normalizedPoolId}`,
          ].join(" "),
        );
      }

      return {
        source:
          "effect",

        gachaPoolId:
          normalizedPoolId,

        poolEntry:
          clonePoolEntry(
            selectedEntry,
          ),

        effect:
          cloneEffectDefinition(
            selectedEffect,
          ),

        drawnAt:
          Date.now(),
      };
    }

    /**
     * ここから旧GachaItem互換処理。
     */
    const gachaItemId =
      selectedEntry
        .gachaItemId
        ?.trim();

    if (!gachaItemId) {
      throw new Error(
        [
          "抽選されたPoolEntryに景品参照がありません。",
          "effectIdまたはgachaItemIdを設定してください。",
          `poolEntryId=${selectedEntry.id}`,
          `gachaPoolId=${normalizedPoolId}`,
        ].join(" "),
      );
    }

    const selectedItem =
      gachaRepository.findById(
        gachaItemId,
      );

    if (!selectedItem) {
      throw new Error(
        [
          "抽選された旧形式の景品が見つかりません。",
          `gachaItemId=${gachaItemId}`,
          `gachaPoolId=${normalizedPoolId}`,
        ].join(" "),
      );
    }

    if (
      !selectedItem.isEnabled
    ) {
      throw new Error(
        [
          "抽選された旧形式の景品は無効です。",
          `gachaItemId=${selectedItem.id}`,
          `gachaPoolId=${normalizedPoolId}`,
        ].join(" "),
      );
    }

    return {
      source:
        "legacy-gacha-item",

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

      drawnAt:
        Date.now(),
    };
  }

  /**
   * 実在し、有効で、
   * 正の重みを持つ景品だけを
   * 抽選対象として残します。
   *
   * 新Effect方式を優先し、
   * effectIdがない場合だけ
   * 旧GachaItemを確認します。
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

          const effectId =
            entry.effectId?.trim();

          if (effectId) {
            const effect =
              effectRepository.load(
                effectId,
              );

            return Boolean(
              effect &&
              effect.isEnabled !==
              false,
            );
          }

          const gachaItemId =
            entry.gachaItemId
              ?.trim();

          if (!gachaItemId) {
            return false;
          }

          const item =
            gachaRepository.findById(
              gachaItemId,
            );

          return Boolean(
            item?.isEnabled,
          );
        },
      );

    return {
      ...pool,

      entries:
        entries.map(
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

function cloneEffectDefinition(
  effect: EffectDefinition,
): EffectDefinition {
  return {
    ...effect,

    tags: [
      ...effect.tags,
    ],

    actions:
      effect.actions.map(
        (action) => ({
          ...action,

          values: {
            ...action.values,
          },
        }),
      ),
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