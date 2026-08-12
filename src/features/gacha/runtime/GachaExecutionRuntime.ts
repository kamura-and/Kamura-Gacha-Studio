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
  | "legacy-effect"
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

    /**
     * 新方式
     *
     * PoolEntry.effectId
     * ↓
     * EffectDefinition
     * ↓
     * EffectRuntime
     */
    if (
      spinResult.source ===
      "effect"
    ) {
      const effect =
        spinResult.effect;

      const effectResult =
        effectRuntime.execute({
          effectId:
            effect.id,

          /**
           * Queue / Overlay側は
           * まだgachaItemという名称を
           * 使用しているため、
           * 移行期間中はEffect情報を
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

    /**
     * ここから旧GachaItem方式。
     */
    const item =
      spinResult.item;

    /**
     * 旧GachaItemにeffectIdが
     * 設定されている場合。
     */
    const legacyEffectId =
      item.effectId?.trim();

    if (legacyEffectId) {
      const effectResult =
        effectRuntime.execute({
          effectId:
            legacyEffectId,

          gachaItemId:
            item.id,

          gachaItemName:
            item.name,

          gachaItemDescription:
            item.description,

          gachaItemRarity:
            item.rarity,

          gachaItemImageDataUrl:
            item.imageDataUrl,
        });

      console.info(
        "[GachaExecutionRuntime]",
        "Legacy Gacha Effect Executed",
        {
          gachaPoolId:
            spinResult.gachaPoolId,

          poolEntryId:
            spinResult.poolEntry.id,

          gachaItemId:
            item.id,

          gachaItemName:
            item.name,

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
          "legacy-effect",

        effect:
          effectResult,

        legacyCommandCount:
          0,
      };
    }

    /**
     * Effectも持っていない
     * さらに古いcommands形式。
     */
    const legacyCommands =
      this.convertLegacyCommands(
        item.commands,
      );

    if (
      legacyCommands.length >
      0
    ) {
      actionRuntime.execute({
        gachaItemId:
          item.id,

        gachaItemName:
          item.name,

        gachaItemDescription:
          item.description,

        gachaItemRarity:
          item.rarity,

        gachaItemImageDataUrl:
          item.imageDataUrl,

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
            item.id,

          gachaItemName:
            item.name,

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
          item.id,

        gachaItemName:
          item.name,
      },
    );

    return {
      spin:
        spinResult,

      mode:
        "none",

      legacyCommandCount:
        0,
    };
  }

  private convertLegacyCommands(
    commands: {
      type:
        GeneratedActionCommand["type"];

      value: string;

      delay?: number;

      enabled?: boolean;
    }[],
  ): GeneratedActionCommand[] {
    return commands.map(
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