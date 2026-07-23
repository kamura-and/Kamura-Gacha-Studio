import type { ActionInstance } from "@/core/actions";

import { TimelineItem } from "./TimelineItem";

type TimelineProps = {
  items: ActionInstance[];

  onDelete: (
    instanceId: string,
  ) => void;
};

export function Timeline({
  items,
  onDelete,
}: TimelineProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-slate-300 py-20 text-center text-slate-400">
        アクションがありません
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <TimelineItem
          key={item.id}
          instance={item}
          index={index}
          onDelete={() => onDelete(item.id)}
        />
      ))}
    </div>
  );
}