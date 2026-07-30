import type {
  Trigger,
} from "@/features/triggers/types/Trigger";

import {
  TriggerAccumulator,
} from "../accumulator/TriggerAccumulator";

import {
  executeTrigger,
} from "../engine/RuntimeEngine";

import type {
  RuntimeEngineDependencies,
  RuntimeExecutionResult,
} from "../engine/RuntimeEngine";

import type {
  RuntimeEvent,
} from "../types/RuntimeEvent";

type FindEnabledTriggers =
  () => Trigger[];

export type RuntimeServiceDependencies =
  RuntimeEngineDependencies & {
    findEnabledTriggers:
      FindEnabledTriggers;

    triggerAccumulator?:
      TriggerAccumulator;
  };

export type RuntimeEventProcessingResult = {
  eventId: string;

  /**
   * 今回実際に発動したTriggerの数。
   *
   * every-thresholdで同じTriggerが
   * 複数回発動した場合は、
   * その発動回数も含む。
   */
  matchedTriggerCount: number;

  executions:
    RuntimeExecutionResult[];
};

/**
 * RuntimeEventの処理全体を統括する。
 *
 * 責務：
 *
 * 1. 有効なTriggerを取得する
 * 2. TriggerAccumulatorで発動判定する
 * 3. 発動したTriggerをRuntimeEngineへ渡す
 * 4. 実行結果をまとめて返す
 *
 * Triggerの累積状態は
 * TriggerAccumulatorが保持する。
 */
export class RuntimeService {
  private readonly findEnabledTriggers:
    FindEnabledTriggers;

  private readonly triggerAccumulator:
    TriggerAccumulator;

  private readonly engineDependencies:
    RuntimeEngineDependencies;

  public constructor(
    dependencies:
      RuntimeServiceDependencies,
  ) {
    this.findEnabledTriggers =
      dependencies.findEnabledTriggers;

    this.triggerAccumulator =
      dependencies.triggerAccumulator ??
      new TriggerAccumulator();

    this.engineDependencies = {
      findPoolById:
        dependencies.findPoolById,

      findGachaItemById:
        dependencies.findGachaItemById,

      findEffectById:
        dependencies.findEffectById,

      buildEffectCommands:
        dependencies.buildEffectCommands,

      enqueueCommands:
        dependencies.enqueueCommands,

      random:
        dependencies.random,
    };
  }

  /**
   * RuntimeEventを1件処理する。
   */
  public processRuntimeEvent(
    event: RuntimeEvent,
  ): RuntimeEventProcessingResult {
    const enabledTriggers =
      this.findEnabledTriggers();

    const activatedTriggers =
      this.triggerAccumulator.evaluate(
        event,
        enabledTriggers,
      );

    const executions =
      activatedTriggers.map(
        (trigger) =>
          executeTrigger(
            trigger,
            this.engineDependencies,
          ),
      );

    return {
      eventId:
        event.id,

      matchedTriggerCount:
        activatedTriggers.length,

      executions,
    };
  }

  /**
   * すべてのTrigger累積状態を初期化する。
   */
  public reset(): void {
    this.triggerAccumulator.reset();
  }

  /**
   * 指定したTriggerの累積状態だけを
   * 初期化する。
   */
  public resetTrigger(
    triggerId: string,
  ): void {
    this.triggerAccumulator.resetTrigger(
      triggerId,
    );
  }
}