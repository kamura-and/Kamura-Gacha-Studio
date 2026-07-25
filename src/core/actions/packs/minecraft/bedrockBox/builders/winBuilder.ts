import type {
  ActionParameterValues,
  GeneratedActionCommand,
} from "@/core/actions";

export function buildWinCommands(
  values: ActionParameterValues,
): GeneratedActionCommand[] {
  const count =
    typeof values.count === "number"
      ? values.count
      : 1;

  return [
    {
      type: "minecraft",
      value: `/bedrock win ${count}`,
      enabled: true,
    },
  ];
}