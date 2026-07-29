import type {
  CreateTriggerInput,
  Trigger,
  TriggerId,
  UpdateTriggerInput,
} from "../types/Trigger";

import type {
  TriggerCondition,
  TriggerConditionInput,
} from "../types/TriggerCondition";

const TRIGGER_STORAGE_KEY =
  "kamura.triggers";

export class TriggerRepository {
  private readonly triggers =
    new Map<TriggerId, Trigger>();

  public constructor() {
    this.loadFromStorage();
  }

  public add(
    input: CreateTriggerInput,
  ): Trigger {
    const trigger =
      createTrigger(input);

    if (
      this.triggers.has(
        trigger.id,
      )
    ) {
      throw new Error(
        [
          "Triggerの登録に失敗しました。",
          `同じIDがすでに存在します: ${trigger.id}`,
        ].join(" "),
      );
    }

    this.triggers.set(
      trigger.id,
      cloneTrigger(trigger),
    );

    this.saveToStorage();

    return cloneTrigger(trigger);
  }

  public update(
    id: TriggerId,
    input: UpdateTriggerInput,
  ): Trigger {
    const current =
      this.triggers.get(id);

    if (!current) {
      throw new Error(
        [
          "Triggerの更新に失敗しました。",
          `対象が見つかりません: ${id}`,
        ].join(" "),
      );
    }

    const next =
      updateTrigger(
        current,
        input,
      );

    this.triggers.set(
      id,
      cloneTrigger(next),
    );

    this.saveToStorage();

    return cloneTrigger(next);
  }

  public upsert(
    input: CreateTriggerInput,
  ): Trigger {
    const id =
      input.id ??
      createTriggerId();

    const existing =
      this.triggers.get(id);

    if (!existing) {
      return this.add({
        ...input,
        id,
      });
    }

    return this.update(
      id,
      createUpdateInput(
        input,
      ),
    );
  }

  public remove(
    id: TriggerId,
  ): boolean {
    const removed =
      this.triggers.delete(id);

    if (removed) {
      this.saveToStorage();
    }

    return removed;
  }

  public findById(
    id: TriggerId,
  ): Trigger | undefined {
    const trigger =
      this.triggers.get(id);

    return trigger
      ? cloneTrigger(trigger)
      : undefined;
  }

  public findAll(): Trigger[] {
    return Array.from(
      this.triggers.values(),
    )
      .map(cloneTrigger)
      .sort(sortByCreatedAt);
  }

  public findEnabled(): Trigger[] {
    return this.findAll().filter(
      (trigger) =>
        trigger.enabled,
    );
  }

  public findByGachaPoolId(
    gachaPoolId: string,
  ): Trigger[] {
    return this.findAll().filter(
      (trigger) =>
        trigger.gachaPoolId ===
        gachaPoolId,
    );
  }

  public setEnabled(
    id: TriggerId,
    enabled: boolean,
  ): Trigger {
    return this.update(id, {
      enabled,
    });
  }

  public has(
    id: TriggerId,
  ): boolean {
    return this.triggers.has(id);
  }

  public count(): number {
    return this.triggers.size;
  }

  public clear(): void {
    this.triggers.clear();
    this.saveToStorage();
  }

  public replaceAll(
    inputs: CreateTriggerInput[],
  ): Trigger[] {
    const nextTriggers =
      new Map<TriggerId, Trigger>();

    inputs.forEach((input) => {
      const trigger =
        createTrigger(input);

      if (nextTriggers.has(trigger.id)) {
        throw new Error(
          [
            "Triggerの一括更新に失敗しました。",
            `同じIDが重複しています: ${trigger.id}`,
          ].join(" "),
        );
      }

      nextTriggers.set(
        trigger.id,
        cloneTrigger(trigger),
      );
    });

    this.triggers.clear();

    nextTriggers.forEach(
      (trigger, id) => {
        this.triggers.set(
          id,
          cloneTrigger(trigger),
        );
      },
    );

    this.saveToStorage();

    return this.findAll();
  }

  private loadFromStorage(): void {
    const storage = getLocalStorage();

    if (!storage) {
      return;
    }

    const raw = storage.getItem(
      TRIGGER_STORAGE_KEY,
    );

    if (!raw) {
      return;
    }

    try {
      const parsed: unknown =
        JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        throw new Error(
          "保存データが配列ではありません。",
        );
      }

      const loadedTriggers =
        new Map<TriggerId, Trigger>();

      parsed.forEach((value) => {
        const trigger = createTrigger(
          value as CreateTriggerInput,
        );

        if (
          loadedTriggers.has(
            trigger.id,
          )
        ) {
          throw new Error(
            `同じIDが重複しています: ${trigger.id}`,
          );
        }

        loadedTriggers.set(
          trigger.id,
          cloneTrigger(trigger),
        );
      });

      this.triggers.clear();

      loadedTriggers.forEach(
        (trigger, id) => {
          this.triggers.set(
            id,
            cloneTrigger(trigger),
          );
        },
      );
    } catch (error) {
      console.error(
        "[TriggerRepository]",
        "保存済みTriggerの読み込みに失敗しました。",
        error,
      );
    }
  }

  private saveToStorage(): void {
    const storage = getLocalStorage();

    if (!storage) {
      return;
    }

    try {
      storage.setItem(
        TRIGGER_STORAGE_KEY,
        JSON.stringify(this.findAll()),
      );
    } catch (error) {
      console.error(
        "[TriggerRepository]",
        "Triggerの保存に失敗しました。",
        error,
      );
    }
  }
}

export const triggerRepository =
  new TriggerRepository();

function createTrigger(
  input: CreateTriggerInput,
): Trigger {
  const now = Date.now();

  const trigger: Trigger = {
    id:
      input.id ??
      createTriggerId(),

    name: normalizeRequiredText(
      input.name,
      "Trigger名",
    ),

    description:
      normalizeOptionalText(
        input.description,
      ),

    enabled:
      input.enabled ?? true,

    pluginId:
      input.pluginId,

    eventCategory:
      input.eventCategory,

    eventType:
      normalizeOptionalText(
        input.eventType,
      ),

    conditions: (
      input.conditions ?? []
    ).map(createCondition),

    matchMode:
      input.matchMode ?? "all",

    gachaPoolId:
      normalizeRequiredText(
        input.gachaPoolId,
        "ガチャプールID",
      ),

    createdAt:
      input.createdAt ?? now,

    updatedAt:
      input.updatedAt ??
      input.createdAt ??
      now,
  };

  validateTrigger(trigger);

  return trigger;
}

function updateTrigger(
  current: Trigger,
  input: UpdateTriggerInput,
): Trigger {
  const next: Trigger = {
    ...current,

    name:
      input.name !== undefined
        ? normalizeRequiredText(
            input.name,
            "Trigger名",
          )
        : current.name,

    description:
      input.description !==
      undefined
        ? normalizeOptionalText(
            input.description,
          )
        : current.description,

    enabled:
      input.enabled ??
      current.enabled,

    pluginId:
      input.pluginId === null
        ? undefined
        : input.pluginId ??
          current.pluginId,

    eventCategory:
      input.eventCategory === null
        ? undefined
        : input.eventCategory ??
          current.eventCategory,

    eventType:
      input.eventType === null
        ? undefined
        : input.eventType !==
            undefined
          ? normalizeOptionalText(
              input.eventType,
            )
          : current.eventType,

    conditions:
      input.conditions !==
      undefined
        ? input.conditions.map(
            createCondition,
          )
        : current.conditions.map(
            cloneCondition,
          ),

    matchMode:
      input.matchMode ??
      current.matchMode,

    gachaPoolId:
      input.gachaPoolId !==
      undefined
        ? normalizeRequiredText(
            input.gachaPoolId,
            "ガチャプールID",
          )
        : current.gachaPoolId,

    updatedAt: Date.now(),
  };

  validateTrigger(next);

  return next;
}

function createCondition(
  input: TriggerConditionInput,
): TriggerCondition {
  const condition: TriggerCondition = {
    id:
      input.id ??
      createTriggerConditionId(),

    field: normalizeRequiredText(
      input.field,
      "条件フィールド",
    ),

    operator:
      input.operator,

    value:
      cloneConditionValue(
        input.value,
      ),
  };

  validateCondition(condition);

  return condition;
}

function validateTrigger(
  trigger: Trigger,
): void {
  if (
    trigger.createdAt >
    trigger.updatedAt
  ) {
    throw new Error(
      "TriggerのupdatedAtはcreatedAt以降である必要があります。",
    );
  }

  const conditionIds =
    new Set<string>();

  trigger.conditions.forEach(
    (condition) => {
      if (
        conditionIds.has(
          condition.id,
        )
      ) {
        throw new Error(
          [
            "Trigger条件のIDが重複しています。",
            `conditionId=${condition.id}`,
          ].join(" "),
        );
      }

      conditionIds.add(
        condition.id,
      );
    },
  );
}

function validateCondition(
  condition: TriggerCondition,
): void {
  const requiresNoValue =
    condition.operator ===
      "exists" ||
    condition.operator ===
      "notExists";

  if (requiresNoValue) {
    return;
  }

  if (
    condition.value ===
    undefined
  ) {
    throw new Error(
      [
        "Trigger条件の値が指定されていません。",
        `field=${condition.field}`,
        `operator=${condition.operator}`,
      ].join(" "),
    );
  }

  const requiresArray =
    condition.operator === "in" ||
    condition.operator ===
      "notIn";

  if (
    requiresArray &&
    !Array.isArray(
      condition.value,
    )
  ) {
    throw new Error(
      [
        "inまたはnotIn演算子の値は配列である必要があります。",
        `field=${condition.field}`,
      ].join(" "),
    );
  }
}

function createUpdateInput(
  input: CreateTriggerInput,
): UpdateTriggerInput {
  return {
    name: input.name,
    description:
      input.description,
    enabled: input.enabled,
    pluginId:
      input.pluginId,
    eventCategory:
      input.eventCategory,
    eventType:
      input.eventType,
    conditions:
      input.conditions,
    matchMode:
      input.matchMode,
    gachaPoolId:
      input.gachaPoolId,
  };
}

function cloneTrigger(
  trigger: Trigger,
): Trigger {
  return {
    ...trigger,
    conditions:
      trigger.conditions.map(
        cloneCondition,
      ),
  };
}

function cloneCondition(
  condition: TriggerCondition,
): TriggerCondition {
  return {
    ...condition,
    value:
      cloneConditionValue(
        condition.value,
      ),
  };
}

function cloneConditionValue<
  TValue,
>(
  value: TValue,
): TValue {
  if (Array.isArray(value)) {
    return [...value] as TValue;
  }

  return value;
}

function normalizeRequiredText(
  value: string,
  label: string,
): string {
  const normalized =
    value.trim();

  if (!normalized) {
    throw new Error(
      `${label}は必須です。`,
    );
  }

  return normalized;
}

function normalizeOptionalText(
  value:
    | string
    | undefined,
): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  const normalized =
    value.trim();

  return normalized ||
    undefined;
}

function sortByCreatedAt(
  left: Trigger,
  right: Trigger,
): number {
  if (
    left.createdAt !==
    right.createdAt
  ) {
    return (
      left.createdAt -
      right.createdAt
    );
  }

  return left.id.localeCompare(
    right.id,
  );
}

function createTriggerId(): string {
  return createDomainId(
    "trigger",
  );
}

function createTriggerConditionId(): string {
  return createDomainId(
    "condition",
  );
}

function createDomainId(
  prefix: string,
): string {
  if (
    typeof crypto !==
      "undefined" &&
    typeof crypto.randomUUID ===
      "function"
  ) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  const timestamp =
    Date.now().toString(36);

  const random = Math.random()
    .toString(36)
    .slice(2, 10);

  return [
    prefix,
    timestamp,
    random,
  ].join("_");
}

function getLocalStorage(): Storage | null {
  if (
    typeof window === "undefined" ||
    !window.localStorage
  ) {
    return null;
  }

  return window.localStorage;
}