import {
  useMemo,
  useState,
} from "react";

import {
  ListPlus,
  PanelRight,
} from "lucide-react";

import {
  createActionInstance,
  type ActionDefinition,
  type ActionInstance,
  type ActionParameterValue,
  type ActionRegistry,
} from "@/core/actions";

import { ActionLibrary } from "./ActionLibrary";
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

  const selectedInstance = useMemo(
    () =>
      timelineItems.find(
        (item) => item.id === selectedId,
      ) ?? null,
    [timelineItems, selectedId],
  );

  /**
   * Action Libraryから新しいActionを追加する
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
  };

  /**
   * タイムライン上のActionを選択する
   */
  const handleSelectAction = (
    instanceId: string,
  ) => {
    setSelectedId(instanceId);
  };

  /**
   * ドラッグ＆ドロップ後の並び順を保存する
   */
  const handleReorderActions = (
    reorderedItems: ActionInstance[],
  ) => {
    setTimelineItems(reorderedItems);
  };

  /**
   * Actionを複製する
   *
   * 元のActionの直後へ追加し、
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
  };

  /**
   * 選択中のActionのパラメーターを更新する
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
  };

  /**
   * タイムラインからActionを削除する
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
  };

  /**
   * タイムラインをすべて削除する
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
  };

  return (
    <section className="min-h-0">
      <div className="grid min-h-[640px] grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm lg:grid-cols-[340px_minmax(0,1fr)_340px]">
        {/* Action Library */}
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

          <div className="max-h-[720px] overflow-y-auto p-5">
            <ActionLibrary
              registry={registry}
              onSelect={handleAddAction}
            />
          </div>
        </aside>

        {/* Timeline */}
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

          <div className="max-h-[720px] overflow-y-auto p-5">
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

        {/* Inspector */}
        <aside className="border-t border-slate-200 bg-white lg:border-t-0 lg:border-l">
          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                <PanelRight size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  インスペクター
                </h2>

                <p className="text-xs text-slate-500">
                  選択したアクションの設定
                </p>
              </div>
            </div>
          </div>

          <div className="max-h-[720px] overflow-y-auto p-5">
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
              <div className="rounded-xl border-2 border-dashed border-slate-200 px-4 py-12 text-center">
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
        </aside>
      </div>
    </section>
  );
}