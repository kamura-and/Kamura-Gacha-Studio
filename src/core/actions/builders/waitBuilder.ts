import type {
  ActionParameterValues,
  GeneratedActionCommand,
} from "@/core/actions";

import { clamp } from "../utils/clamp";
import { getNumberValue } from "../utils/parameterValue";

export function buildWaitCommands(
  values: ActionParameterValues,
): GeneratedActionCommand[] {
  const duration = Math.floor(
    clamp(
      getNumberValue(values, "duration", 1000),
      100,
      10000,
    ),
  );

  return [
    {
      type: "wait",
      value: `待機 ${duration}ms`,
      delay: duration,
      enabled: true,
    },
  ];
}