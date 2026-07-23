import type {
  CSSProperties,
  KeyboardEvent,
  MouseEvent,
} from "react";

import {
  Copy,
  GripVertical,
  Trash2,
} from "lucide-react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { ActionInstance } from "@/core/actions";

import { getParameterDisplayItems } from "./parameterDisplay";

type TimelineItemProps = {
  index: number;
  instance: ActionInstance;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
};

export function TimelineItem({
  index,
  instance,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
}: TimelineItemProps) {
  const action = instance.definition;

  const parameterItems =
    getParameterDisplayItems(
      instance.definition,
      instance.values,
    );

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: instance.id,
  });

  const style: CSSProperties = {
    transform:
      CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  };

  const handleDuplicate = (
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();
    onDuplicate();
  };

  const handleDelete = (
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();
    onDelete();
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
  ) => {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      className={[
        "flex cursor-pointer items-center gap-3 rounded-xl border p-4 shadow-sm transition-colors",
        isDragging
          ? "border-violet-400 bg-white opacity-80 shadow-lg"
          : "",
        isSelected && !isDragging
          ? "border-violet-400 bg-violet-50 ring-2 ring-violet-100"
          : "",
        !isSelected && !isDragging
          ? "border-slate-200 bg-white hover:border-violet-200 hover:bg-violet-50/40"
          : "",
      ].join(" ")}
    >
      <button
        ref={setActivatorNodeRef}
        type="button"
        aria-label={`${action.name}を並び替える`}
        title="ドラッグして並び替え"
        onClick={(event) =>
          event.stopPropagation()
        }
        className={[
          "flex h-9 w-8 shrink-0 touch-none items-center justify-center rounded-lg text-slate-400 transition",
          isDragging
            ? "cursor-grabbing bg-violet-100 text-violet-600"
            : "cursor-grab hover:bg-slate-100 hover:text-slate-600 active:cursor-grabbing",
        ].join(" ")}
        {...attributes}
        {...listeners}
      >
        <GripVertical size={18} />
      </button>

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

        {parameterItems.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {parameterItems.map(
              (parameter) => (
                <span
                  key={parameter.key}
                  className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600"
                >
                  {parameter.label}：
                  {parameter.formattedValue}
                </span>
              ),
            )}
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={handleDuplicate}
          aria-label={`${action.name}を複製`}
          title="複製"
          className="rounded-lg p-2 text-slate-400 transition hover:bg-violet-100 hover:text-violet-600"
        >
          <Copy size={18} />
        </button>

        <button
          type="button"
          onClick={handleDelete}
          aria-label={`${action.name}を削除`}
          title="削除"
          className="rounded-lg p-2 text-rose-500 transition hover:bg-rose-100"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}