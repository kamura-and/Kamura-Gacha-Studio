import type {
  GeneratedActionCommand,
} from "@/core/actions";

import {
  actionRuntime,
} from "@/features/actions/runtime/ActionRuntime";

import {
  effectRepository,
} from "../repository/EffectRepository";

import type {
  EffectDefinition,
} from "../types/effectDefinition";

export type ExecuteEffectInput = {
  effectId: string;

  gachaItemId: string;

  gachaItemName: string;
};

export type ExecuteEffectResult = {
  effectId: string;

  effectName: string;

  actionCount: number;

  commandCount: number;
};

export class EffectRuntime {
  public execute(
    input: ExecuteEffectInput,
  ): ExecuteEffectResult {
    const normalizedEffectId =
      input.effectId.trim();

    if (!normalizedEffectId) {
      throw new Error(
        "Effect IDは必須です。",
      );
    }

    const effect =
      effectRepository.load(
        normalizedEffectId,
      );

    if (!effect) {
      throw new Error(
        [
          "指定されたEffectが見つかりません。",
          `effectId=${normalizedEffectId}`,
        ].join(" "),
      );
    }

    const commands =
      this.buildCommands(effect);

    if (commands.length === 0) {
      console.warn(
        "[EffectRuntime]",
        "Effectから実行可能なコマンドが生成されませんでした。",
        {
          effectId:
            effect.id,
          effectName:
            effect.name,
          actionCount:
            effect.actions.length,
        },
      );

      return {
        effectId:
          effect.id,

        effectName:
          effect.name,

        actionCount:
          effect.actions.length,

        commandCount: 0,
      };
    }

    actionRuntime.execute({
      gachaItemId:
        input.gachaItemId,

      gachaItemName:
        input.gachaItemName,

      commands,
    });

    console.info(
      "[EffectRuntime]",
      "Effect Executed",
      {
        effectId:
          effect.id,
        effectName:
          effect.name,
        actionCount:
          effect.actions.length,
        commandCount:
          commands.length,
      },
    );

    return {
      effectId:
        effect.id,

      effectName:
        effect.name,

      actionCount:
        effect.actions.length,

      commandCount:
        commands.length,
    };
  }

  private buildCommands(
    effect: EffectDefinition,
  ): GeneratedActionCommand[] {
    return effect.actions.flatMap(
      (action) => {
        try {
          return action.definition
            .buildCommands(
              action.values,
            );
        } catch (error) {
          console.error(
            "[EffectRuntime]",
            "Actionのコマンド生成に失敗しました。",
            {
              effectId:
                effect.id,
              effectName:
                effect.name,
              actionInstanceId:
                action.id,
              actionId:
                action.actionId,
              error,
            },
          );

          return [];
        }
      },
    );
  }
}

export const effectRuntime =
  new EffectRuntime();