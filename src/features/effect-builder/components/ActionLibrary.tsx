import { useMemo, useState } from "react";

import type {
  ActionDefinition,
  ActionRegistry,
} from "@/core/actions";

import { ActionCard } from "./ActionCard";

type Props = {
  registry: ActionRegistry;

  onSelect(
    action: ActionDefinition,
  ): void;
};

export function ActionLibrary({
  registry,
  onSelect,
}: Props) {

  const [search, setSearch] =
    useState("");

  const actions = useMemo(() => {

    return registry.search({
      query: search,
    }).actions;

  }, [registry, search]);

  return (
    <div className="space-y-4">

      <input
        className="
          w-full
          rounded-lg
          border
          border-slate-200
          p-3
        "
        placeholder="Actionを検索..."
        value={search}
        onChange={(e)=>
          setSearch(e.target.value)
        }
      />

      <div className="space-y-3">

        {actions.map(action=>(
          <ActionCard
            key={action.id}
            action={action}
            onClick={()=>
              onSelect(action)
            }
          />
        ))}

      </div>

    </div>
  );
}