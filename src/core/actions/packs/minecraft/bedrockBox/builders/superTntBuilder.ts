import type {
  ActionParameterValues,
  GeneratedActionCommand,
} from "@/core/actions";

import { clamp } from "@/core/actions/utils/clamp";
import { getNumberValue } from "@/core/actions/utils/parameterValue";

export function buildSuperTntCommands(
  values: ActionParameterValues,
): GeneratedActionCommand[] {
  const count = Math.floor(
    clamp(
      getNumberValue(values, "count", 1),
      1,
      30,
    ),
  );

  const power = Math.floor(
    clamp(
      getNumberValue(values, "power", 1),
      1,
      10,
    ),
  );

  return [
    {
      type: "minecraft",
      value:
        `/bedrock supertnt ${count} ${power} {nickname}`,
      enabled: true,
    },
  ];
}