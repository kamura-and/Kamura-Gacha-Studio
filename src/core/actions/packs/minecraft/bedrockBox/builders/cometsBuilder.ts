import type {
  ActionParameterValues,
  GeneratedActionCommand,
} from "@/core/actions";

import { getNumberValue } from "@/core/actions/utils/parameterValue";

export function buildCometsCommands(
  values: ActionParameterValues,
): GeneratedActionCommand[] {
  const duration = Math.trunc(
    getNumberValue(values, "duration", 10),
  );

  const interval = Math.trunc(
    getNumberValue(values, "interval", 5),
  );

  return [
    {
      type: "minecraft",
      value: `/bedrock comets ${duration} ${interval}`,
      enabled: true,
    },
  ];
}