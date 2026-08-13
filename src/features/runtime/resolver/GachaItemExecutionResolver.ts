import type {
  GeneratedActionCommand,
} from "@/core/actions";

import type {
  EffectDefinition,
} from "@/features/effects/types/effectDefinition";

import type {
  LegacyGachaItem,
} from "@/features/gacha/types/gacha";

type EffectFinder = (
  id: string,
) => EffectDefinition | undefined;

type EffectCommandBuilder = (
  actions: EffectDefinition["actions"],
) => GeneratedActionCommand[];

export type ResolvedGachaItemExecution = {
  source: "effect" | "legacy";
  effect?: EffectDefinition;
  commands: GeneratedActionCommand[];
};

/**
 * GachaItemから実行可能なコマンドを解決する。
 *
 * effectIdが指定されている場合は、
 * 保存済みEffectを取得してコマンドを生成する。
 *
 * effectIdが未指定の場合は、
 * 旧形式のcommandsをそのまま使用する。
 *
 * 次の場合はnullを返す。
 *
 * - effectIdに対応するEffectが存在しない
 * - 実行可能なコマンドが存在しない
 */
export function resolveGachaItemExecution(
  item: LegacyGachaItem,
  findEffectById: EffectFinder,
  buildEffectCommands: EffectCommandBuilder,
): ResolvedGachaItemExecution | null {
  if (item.effectId) {
    const effect =
      findEffectById(item.effectId);

    if (!effect) {
      return null;
    }

    const commands =
      buildEffectCommands(
        effect.actions,
      );

    const enabledCommands =
      commands.filter(
        (command) =>
          command.enabled !== false,
      );

    if (enabledCommands.length === 0) {
      return null;
    }

    return {
      source: "effect",
      effect,
      commands,
    };
  }

  const commands: GeneratedActionCommand[] =
    item.commands.map(
      (command) => ({
        type: command.type,
        value: command.value,
        delay: command.delay,
        enabled: command.enabled,
      }),
    );

  const enabledCommands =
    commands.filter(
      (command) =>
        command.enabled !== false,
    );

  if (enabledCommands.length === 0) {
    return null;
  }

  return {
    source: "legacy",
    commands,
  };
}