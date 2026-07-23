import type {
  ActionDefinition,
  ActionParameterDefinition,
  ActionParameterValues,
} from "./types";

export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase("ja-JP");
}

export function tokenizeSearchQuery(query: string): string[] {
  return normalizeSearchText(query)
    .split(/\s+/)
    .filter(Boolean);
}

export function createDefaultParameterValues(
  action: ActionDefinition,
): ActionParameterValues {
  const values: ActionParameterValues = {};

  for (const parameter of action.parameters ?? []) {
    values[parameter.key] = parameter.defaultValue;
  }

  return values;
}

export function getActionSearchText(
  action: ActionDefinition,
): string {
  const parameterText = (action.parameters ?? [])
    .flatMap((parameter) => [
      parameter.key,
      parameter.label,
      parameter.description ?? "",
      ...getParameterOptionSearchText(parameter),
    ])
    .join(" ");

  return normalizeSearchText(
    [
      action.id,
      action.pluginId,
      action.name,
      action.description,
      action.intent,
      action.category,
      action.tags?.join(" ") ?? "",
      action.capabilities?.join(" ") ?? "",
      action.outputTargets?.join(" ") ?? "",
      parameterText,
    ].join(" "),
  );
}

export function actionMatchesSearchQuery(
  action: ActionDefinition,
  query: string,
): boolean {
  const tokens = tokenizeSearchQuery(query);

  if (tokens.length === 0) {
    return true;
  }

  const searchableText = getActionSearchText(action);

  return tokens.every((token) =>
    searchableText.includes(token),
  );
}

export function validateActionDefinition(
  action: ActionDefinition,
): string[] {
  const errors: string[] = [];

  if (!action.id.trim()) {
    errors.push("Action IDは必須です。");
  }

  if (!action.pluginId.trim()) {
    errors.push(
      `Action「${action.id || "名称未設定"}」のpluginIdは必須です。`,
    );
  }

  if (!action.name.trim()) {
    errors.push(
      `Action「${action.id || "ID未設定"}」のnameは必須です。`,
    );
  }

  if (!action.description.trim()) {
    errors.push(
      `Action「${action.id || "ID未設定"}」のdescriptionは必須です。`,
    );
  }

  if (!action.category.trim()) {
    errors.push(
      `Action「${action.id || "ID未設定"}」のcategoryは必須です。`,
    );
  }

  if (
    !Number.isFinite(action.impact ?? 0) ||
    (action.impact ?? 0) < 0 ||
    (action.impact ?? 0) > 5
  ) {
    errors.push(
      `Action「${action.id}」のimpactは0〜5で指定してください。`,
    );
  }

  if (typeof action.buildCommands !== "function") {
    errors.push(
      `Action「${action.id}」のbuildCommandsが定義されていません。`,
    );
  }

  const parameterKeys = new Set<string>();

  for (const parameter of action.parameters ?? []) {
    if (!parameter.key.trim()) {
      errors.push(
        `Action「${action.id}」にkey未設定のパラメーターがあります。`,
      );
      continue;
    }

    if (parameterKeys.has(parameter.key)) {
      errors.push(
        `Action「${action.id}」でパラメーターキー「${parameter.key}」が重複しています。`,
      );
    }

    parameterKeys.add(parameter.key);

    errors.push(
      ...validateParameterDefinition(action.id, parameter),
    );
  }

  return errors;
}

function validateParameterDefinition(
  actionId: string,
  parameter: ActionParameterDefinition,
): string[] {
  const errors: string[] = [];
  const displayName = parameter.label || parameter.key;

  if (!parameter.label.trim()) {
    errors.push(
      `Action「${actionId}」のパラメーター「${parameter.key}」はlabelが必須です。`,
    );
  }

  switch (parameter.type) {
    case "number": {
      if (!Number.isFinite(parameter.defaultValue)) {
        errors.push(
          `Action「${actionId}」の数値パラメーター「${displayName}」の初期値が不正です。`,
        );
      }

      if (
        parameter.min !== undefined &&
        parameter.max !== undefined &&
        parameter.min > parameter.max
      ) {
        errors.push(
          `Action「${actionId}」の数値パラメーター「${displayName}」はminがmaxを超えています。`,
        );
      }

      if (
        parameter.min !== undefined &&
        parameter.defaultValue < parameter.min
      ) {
        errors.push(
          `Action「${actionId}」の数値パラメーター「${displayName}」の初期値がmin未満です。`,
        );
      }

      if (
        parameter.max !== undefined &&
        parameter.defaultValue > parameter.max
      ) {
        errors.push(
          `Action「${actionId}」の数値パラメーター「${displayName}」の初期値がmaxを超えています。`,
        );
      }

      if (
        parameter.step !== undefined &&
        parameter.step <= 0
      ) {
        errors.push(
          `Action「${actionId}」の数値パラメーター「${displayName}」のstepは0より大きくしてください。`,
        );
      }

      break;
    }

    case "select": {
      if (parameter.options.length === 0) {
        errors.push(
          `Action「${actionId}」の選択パラメーター「${displayName}」には選択肢が必要です。`,
        );
        break;
      }

      const optionValues = new Set(
        parameter.options.map((option) =>
          String(option.value),
        ),
      );

      if (
        !optionValues.has(String(parameter.defaultValue))
      ) {
        errors.push(
          `Action「${actionId}」の選択パラメーター「${displayName}」の初期値が選択肢にありません。`,
        );
      }

      break;
    }

    case "string":
    case "boolean":
      break;

    default: {
      const unreachable: never = parameter;
      return unreachable;
    }
  }

  return errors;
}

function getParameterOptionSearchText(
  parameter: ActionParameterDefinition,
): string[] {
  if (parameter.type !== "select") {
    return [];
  }

  return parameter.options.flatMap((option) => [
    option.label,
    String(option.value),
  ]);
}