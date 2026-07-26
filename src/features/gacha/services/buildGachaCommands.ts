import type {
  GeneratedActionCommand,
} from "@/core/actions";

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
  const {
    includeDisabled = false,
  } = options;

  return item.commands
    .filter((command) =>
      includeDisabled
        ? true
        : command.enabled,
    )
    .map(convertGachaCommand);
}

function convertGachaCommand(
  command: GachaCommand,
): GeneratedActionCommand {
  return {
    type: command.type,
    value: command.value,
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