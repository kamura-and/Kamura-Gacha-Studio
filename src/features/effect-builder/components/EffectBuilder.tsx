import { useState } from "react";
import { Layers3, ListPlus } from "lucide-react";

import type {
  ActionDefinition,
  ActionRegistry,
} from "@/core/actions";

import { ActionLibrary } from "./ActionLibrary";
import { Timeline } from "./Timeline";

type EffectBuilderProps = {
  registry: ActionRegistry;
};

export function EffectBuilder({
  registry,
}: EffectBuilderProps) {
  const [timelineActions, setTimelineActions] = useState<
    ActionDefinition[]
  >([]);

  const handleAddAction = (
    action: ActionDefinition,
  ) => {
    setTimelineActions((currentActions) => [
      ...currentActions,
      action,
    ]);
  };

  const handleDeleteAction = (index: number) => {
    setTimelineActions((currentActions) =>
      currentActions.filter(
        (_, actionIndex) => actionIndex !== index,
      ),
    );
  };

  const handleClearTimeline = () => {
    if (timelineActions.length === 0) {
      return;
    }

    const shouldClear = window.confirm(
      "タイムライン内のアクションをすべて削除しますか？",
    );

    if (!shouldClear) {
      return;
    }

    setTimelineActions([]);
  };

  return (
    <section className="min-h-0">
      <div className="grid min-h-[640px] grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm lg:grid-cols-[380px_minmax(0,1fr)]">
        <aside className="border-b border-slate-200 bg-white lg:border-b-0 lg:border-r">
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

        <main className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                <Layers3 size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  タイムライン
                </h2>

                <p className="text-xs text-slate-500">
                  上から順番に実行されます
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                {timelineActions.length}件
              </span>

              <button
                type="button"
                onClick={handleClearTimeline}
                disabled={timelineActions.length === 0}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                すべて削除
              </button>
            </div>
          </div>

          <div className="max-h-[720px] overflow-y-auto p-5">
            <Timeline
              actions={timelineActions}
              onDelete={handleDeleteAction}
            />
          </div>
        </main>
      </div>
    </section>
  );
}