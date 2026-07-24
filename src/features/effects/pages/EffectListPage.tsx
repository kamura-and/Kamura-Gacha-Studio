import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Plus,
  Search,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { EffectCard } from "../components/EffectCard";
import { useEffectStore } from "../store/effectStore";
import type { EffectDefinition } from "../types/effectDefinition";

export function EffectListPage() {
  const navigate = useNavigate();

  const effects = useEffectStore(
    (state) => state.effects,
  );

  const loadEffects = useEffectStore(
    (state) => state.loadEffects,
  );

  const deleteEffect = useEffectStore(
    (state) => state.deleteEffect,
  );

  const [searchText, setSearchText] =
    useState("");

  useEffect(() => {
    loadEffects();
  }, [loadEffects]);

  const sortedEffects = useMemo(() => {
    const normalizedSearchText =
      searchText.trim().toLowerCase();

    return [...effects]
      .filter((effect) => {
        if (!normalizedSearchText) {
          return true;
        }

        const searchableText = [
          effect.name,
          effect.description,
          ...effect.tags,
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(
          normalizedSearchText,
        );
      })
      .sort((left, right) => {
        if (
          left.favorite !== right.favorite
        ) {
          return left.favorite ? -1 : 1;
        }

        return (
          right.updatedAt -
          left.updatedAt
        );
      });
  }, [effects, searchText]);

  const handleCreate = () => {
    navigate("/effects/new");
  };

  const handleEdit = (
    effect: EffectDefinition,
  ) => {
    navigate(
      `/effects/${effect.id}`,
    );
  };

  const handleDelete = (
    effect: EffectDefinition,
  ) => {
    const shouldDelete =
      window.confirm(
        `「${effect.name}」を削除しますか？\n\nこの操作は取り消せません。`,
      );

    if (!shouldDelete) {
      return;
    }

    deleteEffect(effect.id);
  };

  return (
    <div className="min-h-full p-4 lg:p-6">
      <div className="mx-auto w-full max-w-[1800px]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="flex flex-col gap-5 border-b border-slate-200 px-5 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-6">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                  <Sparkles size={21} />
                </div>

                <div>
                  <h1 className="text-2xl font-black tracking-tight text-slate-950">
                    エフェクト
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    配信中に実行するアクションの組み合わせを管理します。
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCreate}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-violet-500"
            >
              <Plus size={17} />
              新規作成
            </button>
          </header>

          <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">
            <div className="relative w-full max-w-md">
              <Search
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={searchText}
                onChange={(event) =>
                  setSearchText(
                    event.target.value,
                  )
                }
                placeholder="名前・説明・タグで検索"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              />
            </div>

            <p className="shrink-0 text-sm font-semibold text-slate-500">
              {searchText.trim()
                ? `${sortedEffects.length}件見つかりました`
                : `${effects.length}件のエフェクト`}
            </p>
          </div>

          <div className="min-h-[560px] bg-slate-50 p-5 lg:p-6">
            {effects.length === 0 ? (
              <EmptyEffectState
                onCreate={handleCreate}
              />
            ) : sortedEffects.length ===
              0 ? (
              <NoSearchResults
                searchText={searchText}
                onClear={() =>
                  setSearchText("")
                }
              />
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
                {sortedEffects.map(
                  (effect) => (
                    <EffectCard
                      key={effect.id}
                      effect={effect}
                      onEdit={handleEdit}
                      onDelete={
                        handleDelete
                      }
                    />
                  ),
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

type EmptyEffectStateProps = {
  onCreate: () => void;
};

function EmptyEffectState({
  onCreate,
}: EmptyEffectStateProps) {
  return (
    <div className="flex min-h-[500px] items-center justify-center">
      <div className="max-w-md text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
          <Sparkles size={28} />
        </div>

        <h2 className="mt-5 text-xl font-black text-slate-950">
          エフェクトがありません
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          アクションを組み合わせて、最初のエフェクトを作成しましょう。
        </p>

        <button
          type="button"
          onClick={onCreate}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-violet-500"
        >
          <Plus size={17} />
          エフェクトを作成
        </button>
      </div>
    </div>
  );
}

type NoSearchResultsProps = {
  searchText: string;
  onClear: () => void;
};

function NoSearchResults({
  searchText,
  onClear,
}: NoSearchResultsProps) {
  return (
    <div className="flex min-h-[500px] items-center justify-center">
      <div className="max-w-md text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-slate-200 text-slate-500">
          <Search size={28} />
        </div>

        <h2 className="mt-5 text-xl font-black text-slate-950">
          該当するエフェクトがありません
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          「{searchText}」に一致するエフェクトは見つかりませんでした。
        </p>

        <button
          type="button"
          onClick={onClear}
          className="mt-6 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
        >
          検索を解除
        </button>
      </div>
    </div>
  );
}