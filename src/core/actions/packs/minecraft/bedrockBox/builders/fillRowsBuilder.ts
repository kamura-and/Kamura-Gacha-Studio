import type {
  ActionParameterValues,
  GeneratedActionCommand,
} from "@/core/actions";

import { getNumberValue } from "@/core/actions/utils/parameterValue";

export function buildFillRowsCommands(
  values: ActionParameterValues,
): GeneratedActionCommand[] {
  const rows = Math.max(
    1,
    Math.trunc(
      getNumberValue(values, "rows", 1),
    ),
  );

  return [
    {
      type: "minecraft",
      value: `/bedrock fill ${rows}`,
      enabled: true,
    },
  ];
}