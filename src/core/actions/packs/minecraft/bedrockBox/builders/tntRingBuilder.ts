import type {
  ActionParameterValues,
  GeneratedActionCommand,
} from "@/core/actions";

export function buildTntRingCommands(
  _values: ActionParameterValues,
): GeneratedActionCommand[] {
  return [
    {
      type: "minecraft",
      value: "/bedrock tntring",
      enabled: true,
    },
  ];
}