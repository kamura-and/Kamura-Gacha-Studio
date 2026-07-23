import type { ActionDefinition } from "@/core/actions";

type ActionCardProps = {
  action: ActionDefinition;
  onClick?: () => void;
};

export function ActionCard({
  action,
  onClick,
}: ActionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full
        rounded-xl
        border
        border-slate-200
        bg-white
        p-4
        text-left
        transition

        hover:border-violet-400
        hover:shadow-md
      "
    >
      <div className="flex items-center gap-3">

        <div className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-lg
          bg-violet-100
          text-xl
        ">
          {action.icon ?? "⚡"}
        </div>

        <div className="flex-1">

          <h3 className="font-semibold">
            {action.name}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {action.description}
          </p>

        </div>

      </div>

      <div className="mt-3 flex flex-wrap gap-2">

        <span className="rounded bg-slate-100 px-2 py-1 text-xs">
          {action.category}
        </span>

        {action.tags?.map(tag => (
          <span
            key={tag}
            className="rounded bg-violet-100 px-2 py-1 text-xs"
          >
            {tag}
          </span>
        ))}

      </div>

    </button>
  );
}