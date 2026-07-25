import type {
  ActionParameterValues,
  GeneratedActionCommand,
} from "@/core/actions";

import {
  getNumberValue,
  getStringValue,
} from "@/core/actions/utils/parameterValue";

export function buildTntCommands(
  values: ActionParameterValues,
): GeneratedActionCommand[] {
  const count = Math.max(
    1,
    Math.trunc(
      getNumberValue(values, "count", 1),
    ),
  );

  const target = getStringValue(
    values,
    "target",
    "{nickname}",
  ).trim() || "{nickname}";

  return [
    {
      type: "minecraft",
      value: `/bedrock tnt ${count} ${target}`,
      enabled: true,
    },
  ];
}