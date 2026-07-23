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
   * 元になったアクション定義
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
    definition,
    values: createDefaultParameterValues(definition),
  };
}