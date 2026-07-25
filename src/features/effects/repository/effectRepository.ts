import { actionRegistry } from "@/core/actions/packs";

import type {
  ActionInstance,
  ActionParameterValues,
} from "@/core/actions";

import type { EffectDefinition } from "../types/effectDefinition";
import type {
  PersistedActionInstance,
  PersistedEffectDefinition,
} from "../types/persistedEffectDefinition";

const STORAGE_KEY = "kamura.effects";

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null
  );
}

function isStringArray(
  value: unknown,
): value is string[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === "string",
    )
  );
}

function getActionId(
  value: unknown,
): string | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  if (
    typeof value.actionId === "string"
  ) {
    return value.actionId;
  }

  const definition = value.definition;

  if (
    isRecord(definition) &&
    typeof definition.id === "string"
  ) {
    return definition.id;
  }

  return undefined;
}

/**
 * メモリ上のActionInstanceを
 * localStorage保存用データへ変換する。
 */
function serializeActionInstance(
  action: ActionInstance,
): PersistedActionInstance {
  return {
    id: action.id,
    actionId: action.actionId,
    values: action.values,
  };
}

/**
 * localStorageから読み込んだデータを
 * 実行可能なActionInstanceへ復元する。
 */
function deserializeActionInstance(
  value: unknown,
): ActionInstance | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const actionId = getActionId(value);

  if (!actionId) {
    return undefined;
  }

  const definition =
    actionRegistry.getById(actionId);

  if (!definition) {
    console.warn(
      `Action "${actionId}" がActionRegistryに登録されていないため、読み込みをスキップしました。`,
    );

    return undefined;
  }

  const id =
    typeof value.id === "string"
      ? value.id
      : crypto.randomUUID();

  const values: ActionParameterValues =
    isRecord(value.values)
      ? (value.values as ActionParameterValues)
      : {};

  return {
    id,
    actionId,
    definition,
    values,
  };
}

/**
 * メモリ上のEffectDefinitionを
 * localStorage保存用データへ変換する。
 */
function serializeEffect(
  effect: EffectDefinition,
): PersistedEffectDefinition {
  return {
    id: effect.id,
    name: effect.name,
    description: effect.description,
    actions: effect.actions.map(
      serializeActionInstance,
    ),
    tags: effect.tags,
    favorite: effect.favorite,
    createdAt: effect.createdAt,
    updatedAt: effect.updatedAt,
  };
}

/**
 * localStorageから読み込んだデータを
 * 実行可能なEffectDefinitionへ復元する。
 */
function deserializeEffect(
  value: unknown,
): EffectDefinition | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  if (
    typeof value.id !== "string" ||
    typeof value.name !== "string"
  ) {
    return undefined;
  }

  const rawActions = Array.isArray(
    value.actions,
  )
    ? value.actions
    : [];

  const actions = rawActions
    .map(deserializeActionInstance)
    .filter(
      (
        action,
      ): action is ActionInstance =>
        action !== undefined,
    );

  return {
    id: value.id,
    name: value.name,
    description:
      typeof value.description ===
        "string"
        ? value.description
        : "",
    actions,
    tags: isStringArray(value.tags)
      ? value.tags
      : [],
    favorite:
      typeof value.favorite ===
        "boolean"
        ? value.favorite
        : false,
    createdAt:
      typeof value.createdAt ===
        "number"
        ? value.createdAt
        : Date.now(),
    updatedAt:
      typeof value.updatedAt ===
        "number"
        ? value.updatedAt
        : Date.now(),
  };
}

export class EffectRepository {
  loadAll(): EffectDefinition[] {
    const raw =
      localStorage.getItem(
        STORAGE_KEY,
      );

    if (!raw) {
      return [];
    }

    try {
      const parsed: unknown =
        JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed
        .map(deserializeEffect)
        .filter(
          (
            effect,
          ): effect is EffectDefinition =>
            effect !== undefined,
        );
    } catch {
      return [];
    }
  }

  load(
    id: string,
  ): EffectDefinition | undefined {
    return this.loadAll().find(
      (effect) => effect.id === id,
    );
  }

  saveAll(
    effects: EffectDefinition[],
  ): void {
    const persistedEffects =
      effects.map(serializeEffect);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        persistedEffects,
      ),
    );
  }

  save(
    effect: EffectDefinition,
  ): void {
    const effects = this.loadAll();

    effects.push(effect);

    this.saveAll(effects);
  }

  update(
    effect: EffectDefinition,
  ): void {
    const effects = this.loadAll();

    const index =
      effects.findIndex(
        (item) =>
          item.id === effect.id,
      );

    if (index === -1) {
      return;
    }

    effects[index] = effect;

    this.saveAll(effects);
  }

  delete(id: string): void {
    this.saveAll(
      this.loadAll().filter(
        (item) =>
          item.id !== id,
      ),
    );
  }
}

export const effectRepository =
  new EffectRepository();