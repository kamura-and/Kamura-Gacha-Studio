import type { ActionDefinition } from "@/core/actions";

/**
 * ActionDefinitionを型安全に定義するためのヘルパー。
 *
 * 現時点では受け取ったActionDefinitionをそのまま返す。
 * 将来的には、共通のバリデーションやデフォルト値の補完を
 * この関数へ集約できる。
 */
export function defineAction(
  action: ActionDefinition,
): ActionDefinition {
  return action;
}