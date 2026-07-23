import {
  GripVertical,
  Trash2,
} from "lucide-react";

import type {
  ActionDefinition,
} from "@/core/actions";

type Props = {
  index: number;

  action: ActionDefinition;

  onDelete(): void;
};

export function TimelineItem({
  index,
  action,
  onDelete,
}: Props) {
  return (
    <div
      className="
      flex
      items-center
      gap-3

      rounded-xl

      border
      border-slate-200

      bg-white

      p-4

      shadow-sm
    "
    >
      <GripVertical
        size={18}
        className="text-slate-400"
      />

      <div
        className="
        flex
        h-10
        w-10
        items-center
        justify-center

        rounded-lg

        bg-violet-100
      "
      >
        {action.icon ?? "⚡"}
      </div>

      <div className="flex-1">

        <div className="font-semibold">

          {index + 1}. {action.name}

        </div>

        <div className="text-sm text-slate-500">

          {action.description}

        </div>

      </div>

      <button
        onClick={onDelete}
        className="
          rounded-lg
          p-2

          hover:bg-rose-100
        "
      >
        <Trash2
          size={18}
          className="text-rose-500"
        />
      </button>
    </div>
  );
}