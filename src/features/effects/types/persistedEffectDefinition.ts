import type {
  ActionParameterValues,
} from "@/core/actions";

export type PersistedActionInstance = {
  /**
   * タイムライン上のアクションを識別するID
   */
  id: string;

  /**
   * ActionRegistryに登録されているActionDefinitionのID
   */
  actionId: string;

  /**
   * このアクションインスタンス固有のパラメーター値
   */
  values: ActionParameterValues;
};

export type PersistedEffectDefinition = {
  id: string;

  name: string;

  description: string;

  actions: PersistedActionInstance[];

  tags: string[];

  favorite: boolean;

  createdAt: number;

  updatedAt: number;
};