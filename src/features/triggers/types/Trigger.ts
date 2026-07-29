import type {
  PluginId,
} from "../../plugins/types/plugin";

import type {
  RuntimeEventCategory,
} from "../../runtime/types";

import type {
  TriggerCondition,
  TriggerConditionInput,
} from "./TriggerCondition";

import type {
  TriggerMatchMode,
} from "./TriggerMatchMode";

export type TriggerId = string;

/**
 * Triggerの発動方式。
 *
 * every-event:
 * 条件に一致したイベントごとに発動する。
 *
 * once-threshold:
 * 累計値が指定数へ到達したとき、
 * スコープ内で1回だけ発動する。
 *
 * every-threshold:
 * 指定数へ到達するたびに繰り返し発動する。
 */
export type TriggerActivationPolicy =
  | "every-event"
  | "once-threshold"
  | "every-threshold";

/**
 * 累計値を共有する範囲。
 *
 * global:
 * 配信全体で共有する。
 *
 * per-user:
 * 視聴者ごとに個別集計する。
 */
export type TriggerAggregationScope =
  | "global"
  | "per-user";

export type Trigger = {
  id: TriggerId;
  name: string;
  description?: string;

  enabled: boolean;

  pluginId?: PluginId;
  eventCategory?: RuntimeEventCategory;
  eventType?: string;

  conditions: TriggerCondition[];
  matchMode: TriggerMatchMode;

  /**
   * 未指定の既存Triggerは
   * every-eventとして扱う。
   */
  activationPolicy?:
    TriggerActivationPolicy;

  /**
   * 未指定の場合はglobalとして扱う。
   */
  aggregationScope?:
    TriggerAggregationScope;

  /**
   * once-thresholdまたは
   * every-thresholdで使用する。
   *
   * 未指定または不正値の場合は1。
   */
  threshold?: number;

  /**
   * RuntimeEvent.payload内で、
   * 今回加算する数値を持つフィールド。
   *
   * 未指定の場合はイベントカテゴリーから
   * 標準フィールドを推測する。
   */
  countField?: string;

  /**
   * per-user集計で使用する
   * RuntimeEvent.payload内のユーザーIDフィールド。
   *
   * 未指定の場合はuserId。
   */
  userIdField?: string;

  gachaPoolId: string;

  createdAt: number;
  updatedAt: number;
};

export type CreateTriggerInput = {
  id?: TriggerId;
  name: string;
  description?: string;

  enabled?: boolean;

  pluginId?: PluginId;
  eventCategory?: RuntimeEventCategory;
  eventType?: string;

  conditions?: TriggerConditionInput[];
  matchMode?: TriggerMatchMode;

  activationPolicy?:
    TriggerActivationPolicy;

  aggregationScope?:
    TriggerAggregationScope;

  threshold?: number;
  countField?: string;
  userIdField?: string;

  gachaPoolId: string;

  createdAt?: number;
  updatedAt?: number;
};

export type UpdateTriggerInput = {
  name?: string;
  description?: string;

  enabled?: boolean;

  pluginId?: PluginId | null;

  eventCategory?:
    | RuntimeEventCategory
    | null;

  eventType?: string | null;

  conditions?: TriggerConditionInput[];
  matchMode?: TriggerMatchMode;

  activationPolicy?:
    | TriggerActivationPolicy
    | null;

  aggregationScope?:
    | TriggerAggregationScope
    | null;

  threshold?: number | null;
  countField?: string | null;
  userIdField?: string | null;

  gachaPoolId?: string;
};