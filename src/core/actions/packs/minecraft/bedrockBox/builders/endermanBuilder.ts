import type {
  ActionParameterValues,
  GeneratedActionCommand,
} from "@/core/actions";

import {
  getNumberValue,
  getStringValue,
} from "@/core/actions/utils/parameterValue";

export function buildEndermanCommands(
  values: ActionParameterValues,
): GeneratedActionCommand[] {
  const count = Math.max(
    1,
    Math.trunc(
      getNumberValue(values, "count", 5),
    ),
  );

  const target = getStringValue(
    values,
    "target",
    "{nickname}",
  ).trim();

  const command = target
    ? `/bedrock enderman ${count} ${target}`
    : `/bedrock enderman ${count}`;

  return [
    {
      type: "minecraft",
      value: command,
      enabled: true,
    },
  ];
}