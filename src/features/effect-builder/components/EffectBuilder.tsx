import {
  useMemo,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

import {
  Code2,
  GripVertical,
  ListPlus,
  PanelRight,
  Play,
  Save,
  X,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
} from "motion/react";

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

const MIN_LIBRARY_WIDTH = 260;
const MAX_LIBRARY_WIDTH = 480;
const DEFAULT_LIBRARY_WIDTH = 330;

export function EffectBuilder({
  registry,
}: EffectBuilderProps) {
  const [timelineItems, setTimelineItems] =
    useState<ActionInstance[]>([]);

  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  const [
    isPropertiesOpen,
    setIsPropertiesOpen,
  ] = useState(false);

  const [
    libraryWidth,
    setLibraryWidth,
  ] = useState(DEFAULT_LIBRARY_WIDTH);

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

  const clearExecutionResult = () => {
    setExecutionMessage(null);
    setExecutionError(null);
  };

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
    setIsPropertiesOpen(true);
    clearExecutionResult();
  };

  const handleSelectAction = (
    instanceId: string,
  ) => {
    setSelectedId(instanceId);
    setIsPropertiesOpen(true);
  };

  const handleReorderActions = (
    reorderedItems: ActionInstance[],
  ) => {
    setTimelineItems(reorderedItems);
    clearExecutionResult();
  };

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
      setIsPropertiesOpen(true);
    }

    clearExecutionResult();
  };

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

    clearExecutionResult();
  };

  const handleDeleteAction = (
    instanceId: string,
  ) => {
    setTimelineItems((currentItems) =>
      currentItems.filter(
        (item) => item.id !== instanceId,
      ),
    );

    setSelectedId((currentSelectedId) => {
      if (currentSelectedId !== instanceId) {
        return currentSelectedId;
      }

      setIsPropertiesOpen(false);
      return null;
    });

    clearExecutionResult();
  };

  const handleClearTimeline = () => {
    if (timelineItems.length === 0) {
      return;
    }

    const shouldClear = window.confirm(
      "エフェクト内のアクションをすべて削除しますか？",
    );

    if (!shouldClear) {
      return;
    }

    setTimelineItems([]);
    setSelectedId(null);
    setIsPropertiesOpen(false);
    clearExecutionResult();
  };

  const handleExecute = () => {
    clearExecutionResult();

    try {
      const result =
        executeEffect(timelineItems);

      setExecutionMessage(
        `${result.commandCount}件のコマンドを実行キューへ追加しました。`,
      );
    } catch (error) {
      setExecutionError(
        error instanceof Error
          ? error.message
          : "エフェクトを実行できませんでした。",
      );
    }
  };

  const handleResizeStart = (
    event: ReactPointerEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();

    const startX = event.clientX;
    const startWidth = libraryWidth;

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const handlePointerMove = (
      pointerEvent: PointerEvent,
    ) => {
      const nextWidth =
        startWidth +
        pointerEvent.clientX -
        startX;

      setLibraryWidth(
        Math.min(
          MAX_LIBRARY_WIDTH,
          Math.max(
            MIN_LIBRARY_WIDTH,
            nextWidth,
          ),
        ),
      );
    };

    const handlePointerUp = () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";

      window.removeEventListener(
        "pointermove",
        handlePointerMove,
      );

      window.removeEventListener(
        "pointerup",
        handlePointerUp,
      );
    };

    window.addEventListener(
      "pointermove",
      handlePointerMove,
    );

    window.addEventListener(
      "pointerup",
      handlePointerUp,
    );
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-950">
            エフェクト編集
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            アクションを組み合わせて、実行内容を作成します。
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled
            title="保存機能は次の工程で追加します"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-400 opacity-70"
          >
            <Save size={16} />
            保存
          </button>

          <button
            type="button"
            onClick={handleExecute}
            disabled={
              timelineItems.length === 0
            }
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Play size={16} />

            {isProcessing
              ? "キューに追加"
              : "テスト実行"}
          </button>
        </div>
      </header>

      {(executionMessage ||
        executionError) && (
        <div className="border-b border-slate-200 px-5 py-3 lg:px-6">
          {executionMessage && (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700">
              {executionMessage}
            </p>
          )}

          {executionError && (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700">
              {executionError}
            </p>
          )}
        </div>
      )}

      <div className="relative min-h-[720px] overflow-hidden bg-slate-50">
        <div
          className="grid min-h-[720px]"
          style={{
            gridTemplateColumns:
              `${libraryWidth}px minmax(0, 1fr)`,
          }}
        >
          <aside className="relative min-w-0 border-r border-slate-200 bg-white">
            <PanelHeader
              icon={ListPlus}
              title="ライブラリ"
              description="クリックしてエフェクトへ追加"
            />

            <div className="h-[calc(100vh-260px)] min-h-[620px] overflow-y-auto p-5">
              <ActionLibrary
                registry={registry}
                onSelect={handleAddAction}
              />
            </div>

            <button
              type="button"
              aria-label="ライブラリの幅を変更"
              title="ドラッグして幅を変更"
              onPointerDown={handleResizeStart}
              className="group absolute inset-y-0 -right-1 z-10 flex w-2 cursor-col-resize items-center justify-center outline-none"
            >
              <span className="h-12 w-1 rounded-full bg-slate-200 transition group-hover:bg-violet-400 group-focus-visible:bg-violet-500" />
            </button>
          </aside>

          <main className="min-w-0 bg-slate-50">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4">
              <div>
                <div className="flex items-center gap-2">
                  <GripVertical
                    size={18}
                    className="text-slate-400"
                  />

                  <h2 className="font-bold text-slate-900">
                    エフェクト
                  </h2>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  ハンドルをドラッグして実行順を変更できます。
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                  {timelineItems.length}件
                </span>

                <button
                  type="button"
                  onClick={handleClearTimeline}
                  disabled={
                    timelineItems.length === 0
                  }
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  すべて削除
                </button>
              </div>
            </div>

            <div className="h-[calc(100vh-260px)] min-h-[620px] overflow-y-auto p-5 lg:p-6">
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
        </div>

        <AnimatePresence>
          {isPropertiesOpen &&
            selectedInstance && (
              <>
                <motion.button
                  type="button"
                  aria-label="プロパティを閉じる"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() =>
                    setIsPropertiesOpen(false)
                  }
                  className="absolute inset-0 z-20 bg-slate-950/10 backdrop-blur-[1px]"
                />

                <motion.aside
                  initial={{
                    x: "100%",
                  }}
                  animate={{
                    x: 0,
                  }}
                  exit={{
                    x: "100%",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 340,
                    damping: 34,
                  }}
                  className="absolute inset-y-0 right-0 z-30 flex w-full max-w-[420px] flex-col border-l border-slate-200 bg-white shadow-2xl"
                >
                  <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                        <PanelRight size={20} />
                      </div>

                      <div className="min-w-0">
                        <h2 className="font-bold text-slate-900">
                          プロパティ
                        </h2>

                        <p className="truncate text-xs text-slate-500">
                          選択したアクションの設定
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      aria-label="プロパティを閉じる"
                      onClick={() =>
                        setIsPropertiesOpen(
                          false,
                        )
                      }
                      className="flex size-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="min-h-0 flex-1 overflow-y-auto">
                    <section className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-xl">
                          {selectedInstance
                            .definition.icon ??
                            "⚡"}
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-900">
                            {
                              selectedInstance
                                .definition.name
                            }
                          </h3>

                          <p className="mt-0.5 text-xs font-semibold text-slate-400">
                            {
                              selectedInstance
                                .definition.category
                            }
                          </p>
                        </div>
                      </div>

                      <p className="mt-4 text-sm leading-6 text-slate-600">
                        {
                          selectedInstance
                            .definition
                            .description
                        }
                      </p>

                      <div className="mt-6 border-t border-slate-200 pt-5">
                        <h4 className="mb-4 text-xs font-black tracking-[0.12em] text-slate-400">
                          パラメーター
                        </h4>

                        <ParameterRenderer
                          action={
                            selectedInstance
                              .definition
                          }
                          values={
                            selectedInstance
                              .values
                          }
                          onChange={
                            handleParameterChange
                          }
                        />
                      </div>
                    </section>

                    <section className="border-t border-slate-200">
                      <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                          <Code2 size={17} />
                        </div>

                        <div>
                          <h3 className="text-sm font-bold text-slate-900">
                            実行コマンド
                          </h3>

                          <p className="text-xs text-slate-500">
                            エフェクトから自動生成
                          </p>
                        </div>
                      </div>

                      <div className="p-5">
                        <CommandPreview
                          items={timelineItems}
                        />
                      </div>
                    </section>
                  </div>
                </motion.aside>
              </>
            )}
        </AnimatePresence>
      </div>
    </section>
  );
}

type PanelHeaderProps = {
  icon: typeof ListPlus;
  title: string;
  description: string;
};

function PanelHeader({
  icon: Icon,
  title,
  description,
}: PanelHeaderProps) {
  return (
    <div className="border-b border-slate-200 px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
          <Icon size={20} />
        </div>

        <div className="min-w-0">
          <h2 className="font-bold text-slate-900">
            {title}
          </h2>

          <p className="truncate text-xs text-slate-500">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}