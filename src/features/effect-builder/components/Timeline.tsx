import type {
  ActionDefinition,
} from "@/core/actions";

import { TimelineItem } from "./TimelineItem";

type Props = {

  actions: ActionDefinition[];

  onDelete(
    index: number,
  ): void;

};

export function Timeline({

  actions,

  onDelete,

}: Props) {

  if (actions.length === 0) {
    return (
      <div
        className="
        rounded-xl
        border-2
        border-dashed
        border-slate-300

        py-20

        text-center

        text-slate-400
      "
      >
        アクションがありません
      </div>
    );
  }

  return (
    <div className="space-y-3">

      {actions.map((action, index) => (

        <TimelineItem

          key={`${action.id}-${index}`}

          action={action}

          index={index}

          onDelete={() => onDelete(index)}

        />

      ))}

    </div>
  );
}