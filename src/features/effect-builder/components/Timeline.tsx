import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import type { ActionInstance } from "@/core/actions";

import { TimelineItem } from "./TimelineItem";

type TimelineProps = {
  items: ActionInstance[];
  selectedId: string | null;

  onSelect: (
    instanceId: string,
  ) => void;

  onDelete: (
    instanceId: string,
  ) => void;

  onDuplicate: (
    instanceId: string,
  ) => void;

  onReorder: (
    items: ActionInstance[],
  ) => void;
};

export function Timeline({
  items,
  selectedId,
  onSelect,
  onDelete,
  onDuplicate,
  onReorder,
}: TimelineProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter:
        sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (
    event: DragEndEvent,
  ) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = items.findIndex(
      (item) => item.id === active.id,
    );

    const newIndex = items.findIndex(
      (item) => item.id === over.id,
    );

    if (
      oldIndex === -1 ||
      newIndex === -1
    ) {
      return;
    }

    onReorder(
      arrayMove(items, oldIndex, newIndex),
    );
  };

  if (items.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-slate-300 py-20 text-center text-slate-400">
        アクションがありません
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {items.map((item, index) => (
            <TimelineItem
              key={item.id}
              instance={item}
              index={index}
              isSelected={
                item.id === selectedId
              }
              onSelect={() =>
                onSelect(item.id)
              }
              onDelete={() =>
                onDelete(item.id)
              }
              onDuplicate={() =>
                onDuplicate(item.id)
              }
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}