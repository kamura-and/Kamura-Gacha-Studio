import type {
  GeneratedActionCommand,
} from "@/core/actions";

import {
  buildEffectCommands,
} from "@/features/effect-builder/services/effectExecutor";

import {
  effectRepository,
} from "@/features/effects/repository/EffectRepository";

import type {
  GachaCommand,
  GachaItem,
} from "@/features/gacha/types/gacha";

export type BuildGachaCommandsOptions = {
  includeDisabled?: boolean;
};

export function buildGachaCommands(
  item: GachaItem,
  options: BuildGachaCommandsOptions = {},
): GeneratedActionCommand[] {
  const normalizedEffectId =
    item.effectId?.trim();

  if (normalizedEffectId) {
    return buildCommandsFromEffect(
      normalizedEffectId,
      item.name,
      options,
    );
  }

  return buildCommandsFromLegacyCommands(
    item.commands,
    options,
  );
}

function buildCommandsFromEffect(
  effectId: string,
  gachaItemName: string,
  options: BuildGachaCommandsOptions,
): GeneratedActionCommand[] {
  const effect =
    effectRepository.load(effectId);

  if (!effect) {
    throw new Error(
      [
        "ガチャに設定されたエフェクトが見つかりません。",
        `gachaItem="${gachaItemName}"`,
        `effectId="${effectId}"`,
      ].join(" "),
    );
  }

  const commands =
    buildEffectCommands(
      effect.actions,
    );

  return filterCommands(
    commands,
    options,
  );
}

function buildCommandsFromLegacyCommands(
  commands: GachaCommand[],
  options: BuildGachaCommandsOptions,
): GeneratedActionCommand[] {
  return filterCommands(
    commands.map(
      convertGachaCommand,
    ),
    options,
  );
}

function filterCommands(
  commands: GeneratedActionCommand[],
  options: BuildGachaCommandsOptions,
): GeneratedActionCommand[] {
  const {
    includeDisabled = false,
  } = options;

  if (includeDisabled) {
    return commands;
  }

  return commands.filter(
    (command) =>
      command.enabled !== false,
  );
}

function convertGachaCommand(
  command: GachaCommand,
): GeneratedActionCommand {
  return {
    type: command.type,
    value:
      command.type === "wait"
        ? ""
        : command.value,
    delay: normalizeDelay(
      command.delay,
    ),
    enabled: command.enabled,
  };
}

function normalizeDelay(
  delay: number,
): number {
  if (
    !Number.isFinite(delay) ||
    delay < 0
  ) {
    return 0;
  }

  return delay;
}