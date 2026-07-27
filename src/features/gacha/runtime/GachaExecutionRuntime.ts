import type {
  GeneratedActionCommand,
} from "@/core/actions";

import {
  actionRuntime,
} from "@/features/actions/runtime/ActionRuntime";

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
  | "effect"
  | "legacy-commands"
  | "none";

export type ExecuteGachaResult = {
  spin: GachaSpinResult;

  mode: GachaExecutionMode;

  effect?: ExecuteEffectResult;

  legacyCommandCount: number;
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

    const effectId =
      spinResult.item.effectId?.trim();

    if (effectId) {
      const effectResult =
        effectRuntime.execute({
          effectId,

          gachaItemId:
            spinResult.item.id,

          gachaItemName:
            spinResult.item.name,
        });

      console.info(
        "[GachaExecutionRuntime]",
        "Gacha Effect Executed",
        {
          gachaPoolId:
            spinResult.gachaPoolId,

          poolEntryId:
            spinResult.poolEntry.id,

          gachaItemId:
            spinResult.item.id,

          gachaItemName:
            spinResult.item.name,

          effectId:
            effectResult.effectId,

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

        legacyCommandCount: 0,
      };
    }

    const legacyCommands =
      this.convertLegacyCommands(
        spinResult,
      );

    if (legacyCommands.length > 0) {
      actionRuntime.execute({
        gachaItemId:
          spinResult.item.id,

        gachaItemName:
          spinResult.item.name,

        commands:
          legacyCommands,
      });

      console.info(
        "[GachaExecutionRuntime]",
        "Legacy Commands Executed",
        {
          gachaPoolId:
            spinResult.gachaPoolId,

          poolEntryId:
            spinResult.poolEntry.id,

          gachaItemId:
            spinResult.item.id,

          gachaItemName:
            spinResult.item.name,

          commandCount:
            legacyCommands.length,
        },
      );

      return {
        spin:
          spinResult,

        mode:
          "legacy-commands",

        legacyCommandCount:
          legacyCommands.length,
      };
    }

    console.warn(
      "[GachaExecutionRuntime]",
      "Effectまたは実行可能な旧形式コマンドが設定されていません。",
      {
        gachaPoolId:
          spinResult.gachaPoolId,

        gachaItemId:
          spinResult.item.id,

        gachaItemName:
          spinResult.item.name,
      },
    );

    return {
      spin:
        spinResult,

      mode:
        "none",

      legacyCommandCount: 0,
    };
  }

  private convertLegacyCommands(
    spinResult: GachaSpinResult,
  ): GeneratedActionCommand[] {
    return spinResult.item.commands.map(
      (command) => ({
        type:
          command.type,

        value:
          command.value,

        delay:
          command.delay,

        enabled:
          command.enabled,
      }),
    );
  }
}

export const gachaExecutionRuntime =
  new GachaExecutionRuntime();