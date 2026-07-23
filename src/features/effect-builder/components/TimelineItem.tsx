import {
  GripVertical,
  Trash2,
} from "lucide-react";

import type { ActionInstance } from "@/core/actions";

type TimelineItemProps = {
  index: number;
  instance: ActionInstance;
  onDelete: () => void;
};

export function TimelineItem({
  index,
  instance,
  onDelete,
}: TimelineItemProps) {
  const action = instance.definition;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <GripVertical
        size={18}
        className="shrink-0 text-slate-400"
      />

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-xl">
        {action.icon ?? "⚡"}
      </div>

      <div className="min-w-0 flex-1">
        <div className="font-semibold text-slate-900">
          {index + 1}. {action.name}
        </div>

        <div className="mt-0.5 truncate text-sm text-slate-500">
          {action.description}
        </div>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {Object.entries(instance.values).map(
            ([key, value]) => (
              <span
                key={key}
                className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600"
              >
                {key}: {String(value)}
              </span>
            ),
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onDelete}
        aria-label={`${action.name}を削除`}
        className="shrink-0 rounded-lg p-2 transition hover:bg-rose-100"
      >
        <Trash2
          size={18}
          className="text-rose-500"
        />
      </button>
    </div>
  );
}