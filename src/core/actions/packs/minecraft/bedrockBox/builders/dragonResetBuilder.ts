import type {
  ActionParameterValues,
  GeneratedActionCommand,
} from "@/core/actions";

export function buildDragonResetCommands(
  _values: ActionParameterValues,
): GeneratedActionCommand[] {
  return [
    {
      type: "minecraft",
      value: "/bedrock reset 2",
      enabled: true,
    },
  ];
}