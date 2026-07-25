import type {
  ActionParameterValues,
  GeneratedActionCommand,
} from "@/core/actions";

export function buildClearCommands(
  _values: ActionParameterValues,
): GeneratedActionCommand[] {
  return [
    {
      type: "minecraft",
      value: "/bedrock clear",
      enabled: true,
    },
  ];
}