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


export type GachaSpinOptions = {
  randomSource?: () => number;
};


export type GachaSpinResult = {
  source: "effect";

  gachaPoolId: string;

  poolEntry: PoolEntry;

  effect: EffectDefinition;

  drawnAt: number;
};


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
          "有効なEffectと正の重みが設定されているか確認してください。",
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

    const effectId =
      selectedEntry.effectId.trim();

    if (!effectId) {
      throw new Error(
        [
          "抽選されたPoolEntryにeffectIdが設定されていません。",
          `poolEntryId=${selectedEntry.id}`,
          `gachaPoolId=${normalizedPoolId}`,
        ].join(" "),
      );
    }

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
   * 実在し、有効で、
   * 正の重みを持つEffectだけを
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

          const effectId =
            entry.effectId.trim();

          if (!effectId) {
            return false;
          }

          const effect =
            effectRepository.load(
              effectId,
            );

          return Boolean(
            effect &&
            effect.isEnabled !==
              false,
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