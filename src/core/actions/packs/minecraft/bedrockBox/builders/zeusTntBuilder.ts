import type {
  ActionParameterValues,
  GeneratedActionCommand,
} from "@/core/actions";

export function buildZeusTntCommands(
  _values: ActionParameterValues,
): GeneratedActionCommand[] {
  return [
    {
      type: "minecraft",
      value: "/bedrock zeustnt",
      enabled: true,
    },
  ];
}