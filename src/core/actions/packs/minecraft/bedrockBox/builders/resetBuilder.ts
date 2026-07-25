import type {
  ActionParameterValues,
  GeneratedActionCommand,
} from "@/core/actions";

export function buildResetCommands(
  _values: ActionParameterValues,
): GeneratedActionCommand[] {
  return [
    {
      type: "minecraft",
      value: "/bedrock reset 1",
      enabled: true,
    },
  ];
}