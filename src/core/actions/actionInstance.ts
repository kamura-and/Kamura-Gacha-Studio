import { createDefaultParameterValues } from "./actionUtils";

import type {
  ActionDefinition,
  ActionParameterValues,
} from "./types";

export type ActionInstance = {
  /**
   * タイムライン上で各アクションを識別するためのID
   */
  id: string;

  /**
   * 元になったActionDefinitionのID
   *
   * localStorageへ保存するときは、
   * definition全体ではなく、このIDを使用する。
   */
  actionId: string;

  /**
   * 元になったアクション定義
   *
   * 保存方式の移行中なので一時的に保持する。
   * 最終的にはActionRegistryから取得する形へ変更する。
   */
  definition: ActionDefinition;

  /**
   * このインスタンス固有のパラメーター値
   */
  values: ActionParameterValues;
};

/**
 * ActionDefinitionからタイムライン用のインスタンスを生成する
 */
export function createActionInstance(
  definition: ActionDefinition,
): ActionInstance {
  return {
    id: crypto.randomUUID(),
    actionId: definition.id,
    definition,
    values:
      createDefaultParameterValues(
        definition,
      ),
  };
}