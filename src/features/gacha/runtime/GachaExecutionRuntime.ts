import {
  effectRuntime,
} from "@/features/effects/runtime/EffectRuntime";

import type {
  ExecuteEffectResult,
} from "@/features/effects/runtime/EffectRuntime";

import {
  gachaRuntime,
} from "./GachaRuntime";

import type {
  GachaSpinOptions,
  GachaSpinResult,
} from "./GachaRuntime";


export type ExecuteGachaInput = {
  gachaPoolId: string;

  options?: GachaSpinOptions;
};


export type GachaExecutionMode =
  | "effect";


export type ExecuteGachaResult = {
  spin: GachaSpinResult;

  mode: GachaExecutionMode;

  effect: ExecuteEffectResult;

  legacyCommandCount: 0;
};


export class GachaExecutionRuntime {
  public execute(
    input: ExecuteGachaInput,
  ): ExecuteGachaResult {
    const spinResult =
      gachaRuntime.spin(
        input.gachaPoolId,
        input.options,
      );

    const effect =
      spinResult.effect;

    const effectResult =
      effectRuntime.execute({
        effectId:
          effect.id,

        /**
         * Queue / Overlay側は
         * まだgachaItem系の名称を
         * 使用しているため、
         * 現時点ではEffect情報を
         * そのまま渡します。
         */
        gachaItemId:
          effect.id,

        gachaItemName:
          effect.name,

        gachaItemDescription:
          effect.description,

        gachaItemRarity:
          effect.rarity,

        gachaItemImageDataUrl:
          effect.imageDataUrl,
      });

    console.info(
      "[GachaExecutionRuntime]",
      "Effect Prize Executed",
      {
        gachaPoolId:
          spinResult.gachaPoolId,

        poolEntryId:
          spinResult.poolEntry.id,

        effectId:
          effect.id,

        effectName:
          effect.name,

        commandCount:
          effectResult.commandCount,
      },
    );

    return {
      spin:
        spinResult,

      mode:
        "effect",

      effect:
        effectResult,

      legacyCommandCount:
        0,
    };
  }
}


export const gachaExecutionRuntime =
  new GachaExecutionRuntime();