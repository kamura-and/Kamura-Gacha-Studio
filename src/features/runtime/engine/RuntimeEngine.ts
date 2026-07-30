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

import {
  executePool,
} from "../executor/PoolExecutor";

import {
  resolveGachaItemExecution,
} from "../resolver/GachaItemExecutionResolver";

type RandomSource =
  () => number;

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
  actions:
    EffectDefinition["actions"],
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
  findPoolById:
    FindPoolById;

  findGachaItemById:
    FindGachaItemById;

  findEffectById:
    FindEffectById;

  buildEffectCommands:
    BuildEffectCommands;

  enqueueCommands:
    EnqueueCommands;

  random?:
    RandomSource;
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

/**
 * Triggerを1件実行する。
 *
 * 処理順：
 *
 * 1. Triggerに紐づくPoolを取得
 * 2. PoolからGachaItemを抽選
 * 3. GachaItemから実行コマンドを解決
 * 4. Command Queueへ登録
 */
export function executeTrigger(
  trigger: Trigger,
  dependencies:
    RuntimeEngineDependencies,
): RuntimeExecutionResult {
  const pool =
    dependencies.findPoolById(
      trigger.gachaPoolId,
    );

  if (!pool) {
    return {
      triggerId:
        trigger.id,

      poolId:
        trigger.gachaPoolId,

      commandCount:
        0,

      status:
        "pool-not-found",
    };
  }

  const item =
    executePool(
      pool,
      dependencies
        .findGachaItemById,
      dependencies.random,
    );

  if (!item) {
    return {
      triggerId:
        trigger.id,

      poolId:
        pool.id,

      commandCount:
        0,

      status:
        "item-not-selected",
    };
  }

  const resolved =
    resolveGachaItemExecution(
      item,
      dependencies.findEffectById,
      dependencies
        .buildEffectCommands,
    );

  if (!resolved) {
    return {
      triggerId:
        trigger.id,

      poolId:
        pool.id,

      gachaItemId:
        item.id,

      commandCount:
        0,

      status:
        "execution-not-resolved",
    };
  }

  dependencies.enqueueCommands({
    gachaItemId:
      item.id,

    gachaItemName:
      item.name,

    commands:
      resolved.commands,
  });

  const enabledCommandCount =
    resolved.commands.filter(
      (command) =>
        command.enabled !== false,
    ).length;

  return {
    triggerId:
      trigger.id,

    poolId:
      pool.id,

    gachaItemId:
      item.id,

    commandCount:
      enabledCommandCount,

    status:
      "queued",
  };
}