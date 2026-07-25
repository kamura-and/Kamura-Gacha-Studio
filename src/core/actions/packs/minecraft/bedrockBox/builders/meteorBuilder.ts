import type {
  ActionParameterValues,
  GeneratedActionCommand,
} from "@/core/actions";

export function buildMeteorCommands(
  _values: ActionParameterValues,
): GeneratedActionCommand[] {
  return [
    {
      type: "minecraft",
      value: "/bedrock meteor",
      enabled: true,
    },
  ];
}