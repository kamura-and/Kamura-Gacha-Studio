import {
  useMemo,
  useState,
} from "react";

import {
  Code2,
  ListPlus,
  PanelRight,
  Play,
} from "lucide-react";

import {
  createActionInstance,
  type ActionDefinition,
  type ActionInstance,
  type ActionParameterValue,
  type ActionRegistry,
} from "@/core/actions";

import { useCommandQueueStore } from "@/features/queue/store/commandQueueStore";

import { executeEffect } from "../services/effectExecutor";

import { ActionLibrary } from "./ActionLibrary";
import { CommandPreview } from "./CommandPreview";
import { ParameterRenderer } from "./ParameterRenderer";
import { Timeline } from "./Timeline";

type EffectBuilderProps = {
  registry: ActionRegistry;
};

export function EffectBuilder({
  registry,
}: EffectBuilderProps) {
  const [timelineItems, setTimelineItems] =
    useState<ActionInstance[]>([]);

  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  const [
    executionMessage,
    setExecutionMessage,
  ] = useState<string | null>(null);

  const [
    executionError,
    setExecutionError,
  ] = useState<string | null>(null);

  const isProcessing =
    useCommandQueueStore(
      (state) => state.isProcessing,
    );

  const selectedInstance = useMemo(
    () =>
      timelineItems.find(
        (item) => item.id === selectedId,
      ) ?? null,
    [timelineItems, selectedId],
  );

  /**
   * アクション一覧から新しいアクションを追加する。
   */
  const handleAddAction = (
    action: ActionDefinition,
  ) => {
    const newInstance =
      createActionInstance(action);

    setTimelineItems((currentItems) => [
      ...currentItems,
      newInstance,
    ]);

    setSelectedId(newInstance.id);
    setExecutionMessage(null);
    setExecutionError(null);
  };

  /**
   * タイムライン上のアクションを選択する。
   */
  const handleSelectAction = (
    instanceId: string,
  ) => {
    setSelectedId(instanceId);
  };

  /**
   * ドラッグ＆ドロップ後の並び順を保存する。
   */
  const handleReorderActions = (
    reorderedItems: ActionInstance[],
  ) => {
    setTimelineItems(reorderedItems);
    setExecutionMessage(null);
    setExecutionError(null);
  };

  /**
   * アクションを複製する。
   *
   * 元のアクションの直後へ追加し、
   * パラメーター設定も引き継ぐ。
   */
  const handleDuplicateAction = (
    instanceId: string,
  ) => {
    let duplicatedId: string | null = null;

    setTimelineItems((currentItems) => {
      const sourceIndex =
        currentItems.findIndex(
          (item) => item.id === instanceId,
        );

      if (sourceIndex === -1) {
        return currentItems;
      }

      const sourceItem =
        currentItems[sourceIndex];

      const duplicatedItem = {
        ...createActionInstance(
          sourceItem.definition,
        ),
        values: {
          ...sourceItem.values,
        },
      };

      duplicatedId = duplicatedItem.id;

      return [
        ...currentItems.slice(
          0,
          sourceIndex + 1,
        ),
        duplicatedItem,
        ...currentItems.slice(
          sourceIndex + 1,
        ),
      ];
    });

    if (duplicatedId) {
      setSelectedId(duplicatedId);
    }

    setExecutionMessage(null);
    setExecutionError(null);
  };

  /**
   * 選択中のアクションのパラメーターを更新する。
   */
  const handleParameterChange = (
    key: string,
    value: ActionParameterValue,
  ) => {
    if (!selectedId) {
      return;
    }

    setTimelineItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== selectedId) {
          return item;
        }

        return {
          ...item,
          values: {
            ...item.values,
            [key]: value,
          },
        };
      }),
    );

    setExecutionMessage(null);
    setExecutionError(null);
  };

  /**
   * タイムラインからアクションを削除する。
   */
  const handleDeleteAction = (
    instanceId: string,
  ) => {
    setTimelineItems((currentItems) =>
      currentItems.filter(
        (item) => item.id !== instanceId,
      ),
    );

    setSelectedId((currentSelectedId) =>
      currentSelectedId === instanceId
        ? null
        : currentSelectedId,
    );

    setExecutionMessage(null);
    setExecutionError(null);
  };

  /**
   * タイムラインをすべて削除する。
   */
  const handleClearTimeline = () => {
    if (timelineItems.length === 0) {
      return;
    }

    const shouldClear = window.confirm(
      "タイムライン内のアクションをすべて削除しますか？",
    );

    if (!shouldClear) {
      return;
    }

    setTimelineItems([]);
    setSelectedId(null);
    setExecutionMessage(null);
    setExecutionError(null);
  };

  /**
   * タイムライン内のアクションから
   * コマンドを生成し、Queueへ登録する。
   */
  const handleExecute = () => {
    setExecutionMessage(null);
    setExecutionError(null);

    try {
      const result =
        executeEffect(timelineItems);

      setExecutionMessage(
        `${result.commandCount}件のコマンドをキューへ追加しました。`,
      );
    } catch (error) {
      setExecutionError(
        error instanceof Error
          ? error.message
          : "エフェクトを実行できませんでした。",
      );
    }
  };

  return (
    <section className="min-h-0">
      <div className="grid min-h-[720px] grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm lg:grid-cols-[340px_minmax(0,1fr)_380px]">
        {/* アクション一覧 */}
        <aside className="border-b border-slate-200 bg-white lg:border-r lg:border-b-0">
          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                <ListPlus size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  アクション一覧
                </h2>

                <p className="text-xs text-slate-500">
                  クリックしてタイムラインへ追加
                </p>
              </div>
            </div>
          </div>

          <div className="max-h-[780px] overflow-y-auto p-5">
            <ActionLibrary
              registry={registry}
              onSelect={handleAddAction}
            />
          </div>
        </aside>

        {/* タイムライン */}
        <main className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4">
            <div>
              <h2 className="font-semibold text-slate-900">
                タイムライン
              </h2>

              <p className="text-xs text-slate-500">
                左側のハンドルをドラッグして並び替え
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                {timelineItems.length}件
              </span>

              <button
                type="button"
                onClick={handleClearTimeline}
                disabled={
                  timelineItems.length === 0
                }
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                すべて削除
              </button>
            </div>
          </div>

          <div className="max-h-[780px] overflow-y-auto p-5">
            <Timeline
              items={timelineItems}
              selectedId={selectedId}
              onSelect={handleSelectAction}
              onDelete={handleDeleteAction}
              onDuplicate={
                handleDuplicateAction
              }
              onReorder={
                handleReorderActions
              }
            />
          </div>
        </main>

        {/* 右側パネル */}
        <aside className="border-t border-slate-200 bg-white lg:border-t-0 lg:border-l">
          {/* 設定 */}
          <section className="border-b border-slate-200">
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                  <PanelRight size={20} />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    設定
                  </h2>

                  <p className="text-xs text-slate-500">
                    選択したアクションの設定
                  </p>
                </div>
              </div>
            </div>

            <div className="max-h-[350px] overflow-y-auto p-5">
              {selectedInstance ? (
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-xl">
                        {selectedInstance.definition
                          .icon ?? "⚡"}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-slate-900">
                          {
                            selectedInstance
                              .definition.name
                          }
                        </h3>

                        <p className="text-xs text-slate-500">
                          {
                            selectedInstance
                              .definition.category
                          }
                        </p>
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {
                        selectedInstance.definition
                          .description
                      }
                    </p>
                  </div>

                  <div className="border-t border-slate-200 pt-4">
                    <h4 className="mb-4 text-xs font-semibold tracking-wide text-slate-500">
                      パラメーター
                    </h4>

                    <ParameterRenderer
                      action={
                        selectedInstance.definition
                      }
                      values={
                        selectedInstance.values
                      }
                      onChange={
                        handleParameterChange
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border-2 border-dashed border-slate-200 px-4 py-10 text-center">
                  <PanelRight
                    size={28}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-3 text-sm font-medium text-slate-500">
                    アクションを選択してください
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    タイムライン上の項目を
                    クリックすると、ここで設定を
                    編集できます。
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* 実行コマンド */}
          <section>
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <Code2 size={20} />
                  </div>

                  <div className="min-w-0">
                    <h2 className="font-semibold text-slate-900">
                      実行コマンド
                    </h2>

                    <p className="text-xs text-slate-500">
                      タイムラインから自動生成
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleExecute}
                  disabled={
                    timelineItems.length === 0
                  }
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Play size={14} />

                  {isProcessing
                    ? "キューに追加"
                    : "実行"}
                </button>
              </div>

              {executionMessage && (
                <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                  {executionMessage}
                </p>
              )}

              {executionError && (
                <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium leading-5 text-rose-700">
                  {executionError}
                </p>
              )}
            </div>

            <div className="max-h-[430px] overflow-y-auto p-5">
              <CommandPreview
                items={timelineItems}
              />
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}