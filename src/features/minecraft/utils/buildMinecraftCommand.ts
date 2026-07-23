import type {
  MinecraftCommandDefinition,
  MinecraftCommandParameterValues,
} from "@/features/minecraft/types/commandLibrary";

export function getDefaultCommandParameterValues(
  definition: MinecraftCommandDefinition,
): MinecraftCommandParameterValues {
  return Object.fromEntries(
    definition.parameters.map((parameter) => [
      parameter.key,
      parameter.defaultValue,
    ]),
  );
}

export function buildMinecraftCommand(
  definition: MinecraftCommandDefinition,
  values: MinecraftCommandParameterValues,
): string {
  let command = definition.template;

  for (const parameter of definition.parameters) {
    const value =
      values[parameter.key]?.trim() ||
      parameter.defaultValue;

    command = command.replaceAll(
      `{${parameter.key}}`,
      value,
    );
  }

  return command.trim();
}

export function hasUnresolvedCommandParameters(
  command: string,
): boolean {
  return /\{[^{}]+\}/.test(command);
}