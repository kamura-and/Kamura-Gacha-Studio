import type {
  GeneratedActionCommand,
} from "@/core/actions";

import type {
  EffectDefinition,
} from "@/features/effects/types/effectDefinition";

import type {
  GachaItem,
} from "@/features/gacha/types/gacha";

import type {
  GachaPool,
} from "@/features/pools/types/pool";

import type {
  Trigger,
} from "@/features/triggers/types/Trigger";

import type {
  RuntimeEvent,
} from "../types/RuntimeEvent";

import {
  executePool,
} from "../executor/PoolExecutor";

import {
  matchTriggers,
} from "../matcher/TriggerMatcher";

import {
  resolveGachaItemExecution,
} from "../resolver/GachaItemExecutionResolver";

type RandomSource = () => number;

type FindEnabledTriggers = () => Trigger[];

type FindPoolById = (
  id: string,
) => GachaPool | undefined;

type FindGachaItemById = (
  id: string,
) => GachaItem | undefined;

type FindEffectById = (
  id: string,
) => EffectDefinition | undefined;

type BuildEffectCommands = (
  actions: EffectDefinition["actions"],
) => GeneratedActionCommand[];

export type RuntimeQueueInput = {
  gachaItemId: string;
  gachaItemName: string;
  commands: GeneratedActionCommand[];
};

type EnqueueCommands = (
  input: RuntimeQueueInput,
) => void;

export type RuntimeEngineDependencies = {
  findEnabledTriggers: FindEnabledTriggers;
  findPoolById: FindPoolById;
  findGachaItemById: FindGachaItemById;
  findEffectById: FindEffectById;
  buildEffectCommands: BuildEffectCommands;
  enqueueCommands: EnqueueCommands;
  random?: RandomSource;
};

export type RuntimeExecutionStatus =
  | "queued"
  | "pool-not-found"
  | "item-not-selected"
  | "execution-not-resolved";

export type RuntimeExecutionResult = {
  triggerId: string;
  poolId: string;
  gachaItemId?: string;
  commandCount: number;
  status: RuntimeExecutionStatus;
};

export type RuntimeEventProcessingResult = {
  eventId: string;
  matchedTriggerCount: number;
  executions: RuntimeExecutionResult[];
};

/**
 * RuntimeEventを1件処理する。
 *
 * 処理順：
 *
 * 1. 有効なTriggerを取得
 * 2. Eventに一致するTriggerを抽出
 * 3. Triggerに紐づくPoolを取得
 * 4. PoolからGachaItemを抽選
 * 5. GachaItemから実行コマンドを解決
 * 6. Command Queueへ登録
 */
export function processRuntimeEvent(
  event: RuntimeEvent,
  dependencies: RuntimeEngineDependencies,
): RuntimeEventProcessingResult {
  const triggers =
    dependencies.findEnabledTriggers();

  const matchedTriggers =
    matchTriggers(
      event,
      triggers,
    );

  const executions =
    matchedTriggers.map(
      (trigger): RuntimeExecutionResult => {
        const pool =
          dependencies.findPoolById(
            trigger.gachaPoolId,
          );

        if (!pool) {
          return {
            triggerId: trigger.id,
            poolId: trigger.gachaPoolId,
            commandCount: 0,
            status: "pool-not-found",
          };
        }

        const item = executePool(
          pool,
          dependencies.findGachaItemById,
          dependencies.random,
        );

        if (!item) {
          return {
            triggerId: trigger.id,
            poolId: pool.id,
            commandCount: 0,
            status: "item-not-selected",
          };
        }

        const resolved =
          resolveGachaItemExecution(
            item,
            dependencies.findEffectById,
            dependencies.buildEffectCommands,
          );

        if (!resolved) {
          return {
            triggerId: trigger.id,
            poolId: pool.id,
            gachaItemId: item.id,
            commandCount: 0,
            status:
              "execution-not-resolved",
          };
        }

        dependencies.enqueueCommands({
          gachaItemId: item.id,
          gachaItemName: item.name,
          commands: resolved.commands,
        });

        return {
          triggerId: trigger.id,
          poolId: pool.id,
          gachaItemId: item.id,
          commandCount:
            resolved.commands.filter(
              (command) =>
                command.enabled !== false,
            ).length,
          status: "queued",
        };
      },
    );

  return {
    eventId: event.id,
    matchedTriggerCount:
      matchedTriggers.length,
    executions,
  };
}