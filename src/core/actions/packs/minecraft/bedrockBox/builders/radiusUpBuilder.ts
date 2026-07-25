import type {
  ActionParameterValues,
  GeneratedActionCommand,
} from "@/core/actions";

import { getNumberValue } from "@/core/actions/utils/parameterValue";

export function buildRadiusUpCommands(
  values: ActionParameterValues,
): GeneratedActionCommand[] {
  const count = Math.max(
    1,
    Math.trunc(
      getNumberValue(values, "count", 1),
    ),
  );

  return [
    {
      type: "minecraft",
      value: `/bedrock radiusup ${count}`,
      enabled: true,
    },
  ];
}