import type {
  ActionParameterValues,
  GeneratedActionCommand,
} from "@/core/actions";

import { getNumberValue } from "@/core/actions/utils/parameterValue";

export function buildHeightDownCommands(
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
      value: `/bedrock heightdown ${count}`,
      enabled: true,
    },
  ];
}