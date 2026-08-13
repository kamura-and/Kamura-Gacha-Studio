import type {
  ActionOutputTarget,
  ActionParameterValues,
  GeneratedActionCommand,
} from "@/core/actions";

const outputTargets:
  ActionOutputTarget[] = [
    "minecraft",
    "overlay",
    "sound",
    "discord",
    "obs",
    "wait",
  ];

export function buildLegacyCommand(
  values:
    ActionParameterValues,
): GeneratedActionCommand[] {
  const type =
    getOutputTarget(
      values.type,
    );

  const value =
    typeof values.value ===
    "string"
      ? values.value
      : "";

  const delay =
    getDelay(
      values.delay,
    );

  const enabled =
    typeof values.enabled ===
    "boolean"
      ? values.enabled
      : true;

  return [
    {
      type,

      value:
        type === "wait"
          ? ""
          : value,

      delay,

      enabled,
    },
  ];
}

function getOutputTarget(
  value: unknown,
): ActionOutputTarget {
  if (
    typeof value ===
      "string" &&
    outputTargets.includes(
      value as
        ActionOutputTarget,
    )
  ) {
    return value as
      ActionOutputTarget;
  }

  return "minecraft";
}

function getDelay(
  value: unknown,
): number {
  if (
    typeof value !==
      "number" ||
    !Number.isFinite(value) ||
    value < 0
  ) {
    return 0;
  }

  return value;
}