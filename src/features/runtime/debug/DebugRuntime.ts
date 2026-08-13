import {
  actionRuntime,
} from "@/features/actions/runtime/ActionRuntime";

import {
  buildEffectCommands,
} from "@/features/effect-builder/services/effectExecutor";

import {
  effectRepository,
} from "@/features/effects/repository/EffectRepository";

import {
  poolRepository,
} from "@/features/pools/repositories/poolRepository";

import {
  triggerRepository,
} from "@/features/triggers/repository/TriggerRepository";

import {
  runtimeEventBus,
} from "../eventBus/RuntimeEventBus";

import {
  PluginRuntime,
} from "../pluginRuntime/PluginRuntime";

import {
  FakePlugin,
} from "../plugins/fake/FakePlugin";

import {
  RuntimeService,
} from "../service/RuntimeService";

import type {
  RuntimeEventProcessingResult,
} from "../service/RuntimeService";

import type {
  RuntimeEvent,
} from "../types/RuntimeEvent";


/**
 * Debug専用Runtime。
 *
 * FakePluginが発行したRuntimeEventを、
 * Trigger判定からCommand Queueまで
 * 一連のRuntime処理へ接続する。
 *
 * また、デバッグ画面で確認するための
 * RuntimeEvent履歴をメモリ上に保持する。
 */
class DebugRuntime {
  private static readonly MAX_EVENT_HISTORY =
    100;

  public readonly eventBus =
    runtimeEventBus;

  public readonly pluginRuntime:
    PluginRuntime;

  public readonly fakePlugin:
    FakePlugin;

  public readonly runtimeService:
    RuntimeService;

  private readonly eventHistory:
    RuntimeEvent[] = [];

  private lastProcessingResult:
    RuntimeEventProcessingResult | null =
      null;


  public constructor() {
    this.runtimeService =
      new RuntimeService({
        findEnabledTriggers: () =>
          triggerRepository.findEnabled(),

        findPoolById: (id) =>
          poolRepository.findById(id),

        findEffectById: (id) =>
          effectRepository.load(id),

        buildEffectCommands: (
          actions,
        ) =>
          buildEffectCommands(
            actions,
          ),

        enqueueCommands: (
          input,
        ) => {
          actionRuntime.execute(
            input,
          );
        },
      });

    this.eventBus.subscribe(
      (event) => {
        this.processRuntimeEvent(
          event,
        );
      },
    );

    this.pluginRuntime =
      new PluginRuntime(
        this.eventBus,
      );

    this.fakePlugin =
      new FakePlugin();

    this.pluginRuntime.register(
      this.fakePlugin,
    );

    this.pluginRuntime.start(
      this.fakePlugin.id,
    );
  }


  /**
   * 保持しているRuntimeEvent履歴を取得する。
   *
   * 外部から配列を書き換えられないよう、
   * 新しい配列として返す。
   */
  public getEventHistory():
    RuntimeEvent[] {
    return [
      ...this.eventHistory,
    ];
  }


  /**
   * 保持しているRuntimeEvent履歴を削除する。
   */
  public clearEventHistory(): void {
    this.eventHistory.length =
      0;
  }


  /**
   * 最後に処理したRuntimeEventの
   * 実行結果を取得する。
   */
  public getLastProcessingResult():
    RuntimeEventProcessingResult | null {
    return this.lastProcessingResult;
  }


  /**
   * Triggerの累積状態と
   * デバッグ用の処理結果を初期化する。
   *
   * イベント履歴は削除しない。
   */
  public resetRuntime(): void {
    this.runtimeService.reset();

    this.lastProcessingResult =
      null;
  }


  /**
   * RuntimeEventを履歴へ追加する。
   *
   * 最新のイベントを先頭に保存し、
   * 最大件数を超えた古いイベントは削除する。
   */
  private addEventToHistory(
    event: RuntimeEvent,
  ): void {
    this.eventHistory.unshift(
      event,
    );

    if (
      this.eventHistory.length >
      DebugRuntime.MAX_EVENT_HISTORY
    ) {
      this.eventHistory.pop();
    }
  }


  private processRuntimeEvent(
    event: RuntimeEvent,
  ): void {
    this.addEventToHistory(
      event,
    );

    try {
      const result =
        this.runtimeService
          .processRuntimeEvent(
            event,
          );

      this.lastProcessingResult =
        result;

      console.info(
        "[DebugRuntime]",
        "RuntimeEventを処理しました。",
        {
          eventId:
            result.eventId,

          matchedTriggerCount:
            result
              .matchedTriggerCount,

          executions:
            result.executions,
        },
      );
    } catch (error: unknown) {
      console.error(
        "[DebugRuntime]",
        "RuntimeEventの処理に失敗しました。",
        {
          eventId:
            event.id,

          eventCategory:
            event.category,

          eventType:
            event.type,

          error,
        },
      );
    }
  }
}


/**
 * Debug Runtimeのシングルトン。
 */
export const debugRuntime =
  new DebugRuntime();