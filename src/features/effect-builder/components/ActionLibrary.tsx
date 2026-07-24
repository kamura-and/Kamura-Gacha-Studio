import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import type {
  ActionDefinition,
  ActionRegistry,
} from "@/core/actions";

import { ActionCard } from "./ActionCard";

type ActionLibraryProps = {
  registry: ActionRegistry;
  onSelect: (action: ActionDefinition) => void;
};

export function ActionLibrary({
  registry,
  onSelect,
}: ActionLibraryProps) {
  const [search, setSearch] = useState("");

  const actions = useMemo(() => {
    return registry.search({
      query: search,
    }).actions;
  }, [registry, search]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search
          size={17}
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="search"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="アクションを検索..."
          aria-label="アクションを検索"
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
        />
      </div>

      {actions.length > 0 ? (
        <div className="space-y-3">
          {actions.map((action) => (
            <ActionCard
              key={action.id}
              action={action}
              onClick={() => onSelect(action)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-slate-200 px-4 py-10 text-center">
          <Search
            size={25}
            aria-hidden="true"
            className="mx-auto text-slate-300"
          />

          <p className="mt-3 text-sm font-semibold text-slate-500">
            該当するアクションがありません
          </p>

          <p className="mt-1 text-xs text-slate-400">
            別のキーワードで検索してください。
          </p>
        </div>
      )}
    </div>
  );
}