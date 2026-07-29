import type {
  Trigger,
  TriggerActivationPolicy,
  TriggerAggregationScope,
} from "@/features/triggers/types/Trigger";

import type {
  RuntimeEvent,
} from "../types/RuntimeEvent";

import {
  matchTriggers,
} from "../matcher/TriggerMatcher";

import {
  cloneTriggerState,
  createTriggerCounterState,
} from "./TriggerState";

import type {
  TriggerCounterState,
  TriggerState,
} from "./TriggerState";

const GLOBAL_SCOPE_KEY =
  "__global__";

type RuntimePayload =
  Record<string, unknown>;

/**
 * RuntimeEventを受け取り、
 * 今回発動すべきTriggerを返す。
 *
 * 同じTriggerが複数の閾値を一度に超えた場合、
 * every-thresholdでは同じTriggerを
 * 複数回返す。
 */
export class TriggerAccumulator {
  private readonly states =
    new Map<string, TriggerState>();

  public evaluate(
    event: RuntimeEvent,
    triggers: Trigger[],
  ): Trigger[] {
    const matchedTriggers =
      matchTriggers(
        event,
        triggers,
      );

    return matchedTriggers.flatMap(
      (trigger) =>
        this.evaluateTrigger(
          event,
          trigger,
        ),
    );
  }

  /**
   * すべての配信中状態を初期化する。
   *
   * 配信開始時または配信終了時に呼ぶ。
   */
  public reset(): void {
    this.states.clear();
  }

  /**
   * 特定Triggerの状態だけを初期化する。
   */
  public resetTrigger(
    triggerId: string,
  ): void {
    this.states.delete(
      triggerId,
    );
  }

  /**
   * テスト・ログ・状態表示用。
   *
   * 内部状態を直接変更されないよう、
   * 複製を返す。
   */
  public getState(
    triggerId: string,
  ): TriggerState | undefined {
    const state =
      this.states.get(
        triggerId,
      );

    return state
      ? cloneTriggerState(state)
      : undefined;
  }

  private evaluateTrigger(
    event: RuntimeEvent,
    trigger: Trigger,
  ): Trigger[] {
    const policy =
      normalizeActivationPolicy(
        trigger.activationPolicy,
      );

    if (policy === "every-event") {
      return [trigger];
    }

    const scopeKey =
      resolveScopeKey(
        event,
        trigger,
      );

    if (!scopeKey) {
      return [];
    }

    const increment =
      resolveIncrement(
        event,
        trigger,
      );

    if (increment <= 0) {
      return [];
    }

    const threshold =
      normalizeThreshold(
        trigger.threshold,
      );

    const state =
      this.getOrCreateState(
        trigger.id,
      );

    const counter =
      this.getOrCreateCounter(
        state,
        scopeKey,
      );

    const previousCount =
      counter.totalCount;

    const nextCount =
      previousCount +
      increment;

    counter.totalCount =
      nextCount;

    if (
      policy ===
      "once-threshold"
    ) {
      return this.evaluateOnceThreshold(
        trigger,
        counter,
        previousCount,
        nextCount,
        threshold,
      );
    }

    return this.evaluateEveryThreshold(
      trigger,
      counter,
      previousCount,
      nextCount,
      threshold,
    );
  }

  private evaluateOnceThreshold(
    trigger: Trigger,
    counter: TriggerCounterState,
    previousCount: number,
    nextCount: number,
    threshold: number,
  ): Trigger[] {
    if (counter.activated) {
      return [];
    }

    const crossedThreshold =
      previousCount < threshold &&
      nextCount >= threshold;

    if (!crossedThreshold) {
      return [];
    }

    counter.activated = true;
    counter.activationCount += 1;

    return [trigger];
  }

  private evaluateEveryThreshold(
    trigger: Trigger,
    counter: TriggerCounterState,
    previousCount: number,
    nextCount: number,
    threshold: number,
  ): Trigger[] {
    const previousLevel =
      Math.floor(
        previousCount /
          threshold,
      );

    const nextLevel =
      Math.floor(
        nextCount /
          threshold,
      );

    const activationCount =
      nextLevel -
      previousLevel;

    if (activationCount <= 0) {
      return [];
    }

    counter.activationCount +=
      activationCount;

    return Array.from(
      {
        length:
          activationCount,
      },
      () => trigger,
    );
  }

  private getOrCreateState(
    triggerId: string,
  ): TriggerState {
    const existing =
      this.states.get(
        triggerId,
      );

    if (existing) {
      return existing;
    }

    const created: TriggerState = {
      triggerId,
      counters: {},
    };

    this.states.set(
      triggerId,
      created,
    );

    return created;
  }

  private getOrCreateCounter(
    state: TriggerState,
    scopeKey: string,
  ): TriggerCounterState {
    const existing =
      state.counters[
        scopeKey
      ];

    if (existing) {
      return existing;
    }

    const created =
      createTriggerCounterState();

    state.counters[
      scopeKey
    ] = created;

    return created;
  }
}

function normalizeActivationPolicy(
  value:
    | TriggerActivationPolicy
    | undefined,
): TriggerActivationPolicy {
  return value ??
    "every-event";
}

function normalizeAggregationScope(
  value:
    | TriggerAggregationScope
    | undefined,
): TriggerAggregationScope {
  return value ??
    "global";
}

function normalizeThreshold(
  value: number | undefined,
): number {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value <= 0
  ) {
    return 1;
  }

  return value;
}

function resolveScopeKey(
  event: RuntimeEvent,
  trigger: Trigger,
): string | null {
  const scope =
    normalizeAggregationScope(
      trigger.aggregationScope,
    );

  if (scope === "global") {
    return GLOBAL_SCOPE_KEY;
  }

  const payload =
    asPayloadRecord(
      event.payload,
    );

  const userIdField =
    trigger.userIdField ??
    "userId";

  const userId =
    payload[userIdField];

  if (
    typeof userId !== "string"
  ) {
    return null;
  }

  const normalized =
    userId.trim();

  return normalized || null;
}

function resolveIncrement(
  event: RuntimeEvent,
  trigger: Trigger,
): number {
  const payload =
    asPayloadRecord(
      event.payload,
    );

  const countField =
    trigger.countField ??
    getDefaultCountField(
      event.category,
    );

  if (!countField) {
    return 1;
  }

  const value =
    payload[countField];

  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return 1;
  }

  return Math.max(
    0,
    value,
  );
}

function getDefaultCountField(
  category: RuntimeEvent["category"],
): string | null {
  switch (category) {
    case "gift":
      return "repeatCount";

    case "like":
      return "likeCount";

    case "share":
      return "shareCount";

    default:
      return null;
  }
}

function asPayloadRecord(
  payload: unknown,
): RuntimePayload {
  if (
    typeof payload === "object" &&
    payload !== null &&
    !Array.isArray(payload)
  ) {
    return payload as RuntimePayload;
  }

  return {};
}