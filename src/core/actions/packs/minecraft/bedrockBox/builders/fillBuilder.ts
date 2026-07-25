import type {
  ActionParameterValues,
  GeneratedActionCommand,
} from "@/core/actions";

export function buildFillCommands(
  _values: ActionParameterValues,
): GeneratedActionCommand[] {
  return [
    {
      type: "minecraft",
      value: "/bedrock fill",
      enabled: true,
    },
  ];
}