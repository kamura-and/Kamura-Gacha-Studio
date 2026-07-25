import type {
  ActionParameterValues,
  GeneratedActionCommand,
} from "@/core/actions";

import { getNumberValue } from "@/core/actions/utils/parameterValue";

export function buildBlackHoleCommands(
  values: ActionParameterValues,
): GeneratedActionCommand[] {
  const seconds = Math.trunc(
    getNumberValue(values, "seconds", 10),
  );

  return [
    {
      type: "minecraft",
      value: `/bedrock blackhole ${seconds}`,
      enabled: true,
    },
  ];
}