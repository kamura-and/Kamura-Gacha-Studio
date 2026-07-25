import {
  actionMatchesSearchQuery,
  validateActionDefinition,
} from "./actionUtils";

import type {
  ActionDefinition,
  ActionFacetItem,
  ActionSearchFacets,
  ActionSearchQuery,
  ActionSearchResult,
} from "./types";

export class ActionRegistry {
  private readonly actions = new Map<
    string,
    ActionDefinition
  >();

  /**
   * Action定義を1件登録する。
   */
  register(action: ActionDefinition): void {
    const errors =
      validateActionDefinition(action);

    if (errors.length > 0) {
      throw new Error(errors.join("\n"));
    }

    if (this.actions.has(action.id)) {
      throw new Error(
        `Action "${action.id}" は既に登録されています。`,
      );
    }

    this.actions.set(action.id, action);
  }

  /**
   * 複数のAction定義をまとめて登録する。
   */
  registerMany(
    actions: ActionDefinition[],
  ): void {
    for (const action of actions) {
      this.register(action);
    }
  }

  /**
   * IDからAction定義を取得する。
   *
   * 既存コードとの互換性を保つために残している。
   */
  get(
    id: string,
  ): ActionDefinition | undefined {
    return this.getById(id);
  }

  /**
   * IDからAction定義を取得する。
   *
   * 保存されたactionIdからAction定義を
   * 復元するときに使用する。
   */
  getById(
    id: string,
  ): ActionDefinition | undefined {
    return this.actions.get(id);
  }

  /**
   * 指定したIDのActionが登録されているか確認する。
   */
  has(id: string): boolean {
    return this.actions.has(id);
  }

  /**
   * 登録されているすべてのAction定義を取得する。
   */
  getAll(): ActionDefinition[] {
    return [...this.actions.values()];
  }

  /**
   * 登録されているAction定義をすべて削除する。
   */
  clear(): void {
    this.actions.clear();
  }

  /**
   * 条件に一致するActionを検索する。
   */
  search(
    query: ActionSearchQuery = {},
  ): ActionSearchResult {
    let result = this.getAll();

    if (query.query?.trim()) {
      result = result.filter((action) =>
        actionMatchesSearchQuery(
          action,
          query.query!,
        ),
      );
    }

    if (query.pluginIds?.length) {
      result = result.filter((action) =>
        query.pluginIds!.includes(
          action.pluginId,
        ),
      );
    }

    if (query.intents?.length) {
      result = result.filter((action) =>
        query.intents!.includes(
          action.intent,
        ),
      );
    }

    if (query.categories?.length) {
      result = result.filter((action) =>
        query.categories!.includes(
          action.category,
        ),
      );
    }

    if (query.tags?.length) {
      result = result.filter((action) =>
        query.tags!.every((tag) =>
          action.tags?.includes(tag),
        ),
      );
    }

    if (query.capabilities?.length) {
      result = result.filter((action) =>
        query.capabilities!.every(
          (capability) =>
            action.capabilities?.includes(
              capability,
            ),
        ),
      );
    }

    if (query.outputTargets?.length) {
      result = result.filter((action) =>
        query.outputTargets!.every(
          (target) =>
            action.outputTargets?.includes(
              target,
            ),
        ),
      );
    }

    switch (query.sort) {
      case "name-desc":
        result.sort((a, b) =>
          b.name.localeCompare(a.name),
        );
        break;

      case "impact-desc":
        result.sort(
          (a, b) =>
            (b.impact ?? 0) -
            (a.impact ?? 0),
        );
        break;

      case "impact-asc":
        result.sort(
          (a, b) =>
            (a.impact ?? 0) -
            (b.impact ?? 0),
        );
        break;

      case "name-asc":
      default:
        result.sort((a, b) =>
          a.name.localeCompare(b.name),
        );
    }

    return {
      actions: result,
      total: result.length,
      facets: this.buildFacets(result),
    };
  }

  private buildFacets(
    actions: ActionDefinition[],
  ): ActionSearchFacets {
    return {
      pluginIds: this.count(
        actions,
        (action) => action.pluginId,
      ),

      intents: this.count(
        actions,
        (action) => action.intent,
      ),

      categories: this.count(
        actions,
        (action) => action.category,
      ),

      capabilities: this.countMany(
        actions,
        (action) =>
          action.capabilities ?? [],
      ),

      tags: this.countMany(
        actions,
        (action) => action.tags ?? [],
      ),

      outputTargets: this.countMany(
        actions,
        (action) =>
          action.outputTargets ?? [],
      ),
    };
  }

  private count(
    actions: ActionDefinition[],
    selector: (
      action: ActionDefinition,
    ) => string,
  ): ActionFacetItem[] {
    const map = new Map<string, number>();

    for (const action of actions) {
      const value = selector(action);

      map.set(
        value,
        (map.get(value) ?? 0) + 1,
      );
    }

    return [...map.entries()]
      .map(([value, count]) => ({
        value,
        count,
      }))
      .sort((a, b) =>
        a.value.localeCompare(b.value),
      );
  }

  private countMany(
    actions: ActionDefinition[],
    selector: (
      action: ActionDefinition,
    ) => string[],
  ): ActionFacetItem[] {
    const map = new Map<string, number>();

    for (const action of actions) {
      for (const value of selector(action)) {
        map.set(
          value,
          (map.get(value) ?? 0) + 1,
        );
      }
    }

    return [...map.entries()]
      .map(([value, count]) => ({
        value,
        count,
      }))
      .sort((a, b) =>
        a.value.localeCompare(b.value),
      );
  }
}