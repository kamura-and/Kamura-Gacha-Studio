import type {
  ActionParameterValues,
  GeneratedActionCommand,
} from "@/core/actions";

import { clamp } from "@/core/actions/utils/clamp";
import {
  getBooleanValue,
  getNumberValue,
  getStringValue,
} from "@/core/actions/utils/parameterValue";

export function buildGlassPrisonCommands(
  values: ActionParameterValues,
): GeneratedActionCommand[] {
  const target = getStringValue(
    values,
    "target",
    "@p",
  );

  const size = Math.floor(
    clamp(
      getNumberValue(values, "size", 3),
      3,
      9,
    ),
  );

  const includeRoof = getBooleanValue(
    values,
    "includeRoof",
    true,
  );

  const radius = Math.floor(size / 2);
  const height = 3;

  const commands: GeneratedActionCommand[] = [
    {
      type: "minecraft",
      value:
        `execute as ${target} at @s run fill ` +
        `~-${radius} ~ ~-${radius} ` +
        `~-${radius} ~${height} ~${radius} minecraft:glass`,
      enabled: true,
    },
    {
      type: "minecraft",
      value:
        `execute as ${target} at @s run fill ` +
        `~${radius} ~ ~-${radius} ` +
        `~${radius} ~${height} ~${radius} minecraft:glass`,
      enabled: true,
    },
    {
      type: "minecraft",
      value:
        `execute as ${target} at @s run fill ` +
        `~-${radius} ~ ~-${radius} ` +
        `~${radius} ~${height} ~-${radius} minecraft:glass`,
      enabled: true,
    },
    {
      type: "minecraft",
      value:
        `execute as ${target} at @s run fill ` +
        `~-${radius} ~ ~${radius} ` +
        `~${radius} ~${height} ~${radius} minecraft:glass`,
      enabled: true,
    },
  ];

  if (includeRoof) {
    commands.push({
      type: "minecraft",
      value:
        `execute as ${target} at @s run fill ` +
        `~-${radius} ~${height} ~-${radius} ` +
        `~${radius} ~${height} ~${radius} minecraft:glass`,
      enabled: true,
    });
  }

  return commands;
}