import type {
  ActionParameterValues,
  GeneratedActionCommand,
} from "@/core/actions";

export function buildLoseCommands(
  values: ActionParameterValues,
): GeneratedActionCommand[] {
  const count =
    typeof values.count === "number"
      ? values.count
      : 1;

  return [
    {
      type: "minecraft",
      value: `/bedrock lose ${count}`,
      enabled: true,
    },
  ];
}