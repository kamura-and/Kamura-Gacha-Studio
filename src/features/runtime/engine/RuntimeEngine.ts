import type {
  GeneratedActionCommand,
} from "@/core/actions";

import type {
  EffectDefinition,
} from "@/features/effects/types/effectDefinition";

import type {
  GachaPool,
} from "@/features/pools/types/pool";

import type {
  Trigger,
} from "@/features/triggers/types/Trigger";

import {
  selectWeightedEntry,
} from "../selector/WeightedRandom";


type RandomSource =
  () => number;


type FindPoolById = (
  id: string,
) => GachaPool | undefined;


type FindEffectById = (
  id: string,
) => EffectDefinition | undefined;


type BuildEffectCommands = (
  actions:
    EffectDefinition["actions"],
) => GeneratedActionCommand[];


export type RuntimeQueueInput = {
  /**
   * Queue側はまだ
   * gachaItemIdという名称を
   * 使用しているため、
   * Effect.idを渡します。
   */
  gachaItemId: string;

  /**
   * Queue側はまだ
   * gachaItemNameという名称を
   * 使用しているため、
   * Effect.nameを渡します。
   */
  gachaItemName: string;

  commands:
    GeneratedActionCommand[];
};


type EnqueueCommands = (
  input: RuntimeQueueInput,
) => void;


export type RuntimeEngineDependencies = {
  findPoolById:
    FindPoolById;

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

  /**
   * 移行期間中は名称を維持し、
   * Effect.idを格納します。
   */
  gachaItemId?: string;

  commandCount: number;

  status:
    RuntimeExecutionStatus;
};


/**
 * Triggerを1件実行する。
 *
 * 処理順：
 *
 * 1. Triggerに紐づくPoolを取得
 * 2. Poolから有効なEffect Entryを抽選
 * 3. Effectから実行コマンドを生成
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


  if (!pool.enabled) {
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


  /**
   * 正の重みを持ち、
   * 参照先Effectが存在していて、
   * 有効なEntryだけを抽選候補にします。
   */
  const drawableEntries =
    pool.entries.filter(
      (entry) => {
        if (
          !Number.isFinite(
            entry.weight,
          ) ||
          entry.weight <= 0
        ) {
          return false;
        }


        const effectId =
          entry.effectId.trim();


        if (!effectId) {
          return false;
        }


        const effect =
          dependencies.findEffectById(
            effectId,
          );


        return Boolean(
          effect &&
          effect.isEnabled !==
            false,
        );
      },
    );


  if (
    drawableEntries.length ===
    0
  ) {
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


  const selectedEntry =
    selectWeightedEntry(
      drawableEntries,
      dependencies.random,
    );


  if (!selectedEntry) {
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


  const effectId =
    selectedEntry.effectId.trim();


  const effect =
    dependencies.findEffectById(
      effectId,
    );


  /**
   * drawableEntries作成時点でも
   * 確認していますが、
   * 実行直前にも防御的に確認します。
   */
  if (
    !effect ||
    effect.isEnabled === false
  ) {
    return {
      triggerId:
        trigger.id,

      poolId:
        pool.id,

      gachaItemId:
        effectId,

      commandCount:
        0,

      status:
        "execution-not-resolved",
    };
  }


  const commands =
    dependencies.buildEffectCommands(
      effect.actions,
    );


  dependencies.enqueueCommands({
    gachaItemId:
      effect.id,

    gachaItemName:
      effect.name,

    commands,
  });


  const enabledCommandCount =
    commands.filter(
      (command) =>
        command.enabled !== false,
    ).length;


  return {
    triggerId:
      trigger.id,

    poolId:
      pool.id,

    gachaItemId:
      effect.id,

    commandCount:
      enabledCommandCount,

    status:
      "queued",
  };
}