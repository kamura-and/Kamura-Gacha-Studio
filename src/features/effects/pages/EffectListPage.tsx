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

import {
  useNavigate,
} from "react-router-dom";

import {
  EffectCard,
} from "../components/EffectCard";

import {
  useEffectStore,
} from "../store/effectStore";

import type {
  EffectDefinition,
} from "../types/effectDefinition";

export function EffectListPage() {
  const navigate =
    useNavigate();

  const effects =
    useEffectStore(
      (state) =>
        state.effects,
    );

  const loadEffects =
    useEffectStore(
      (state) =>
        state.loadEffects,
    );

  const deleteEffect =
    useEffectStore(
      (state) =>
        state.deleteEffect,
    );

  const [
    searchText,
    setSearchText,
  ] = useState("");

  const [
    selectedRarity,
    setSelectedRarity,
  ] = useState("all");

  const [
    selectedTag,
    setSelectedTag,
  ] =
    useState<string | null>(
      null,
    );

  const [
    enabledOnly,
    setEnabledOnly,
  ] = useState(false);

  useEffect(() => {
    loadEffects();
  }, [loadEffects]);

  const availableTags =
    useMemo(() => {
      const tagSet =
        new Set<string>();

      effects.forEach(
        (effect) => {
          effect.tags.forEach(
            (tag) => {
              const trimmed =
                tag.trim();

              if (trimmed) {
                tagSet.add(
                  trimmed,
                );
              }
            },
          );
        },
      );

      return Array.from(
        tagSet,
      ).sort((a, b) =>
        a.localeCompare(
          b,
          "ja",
        ),
      );
    }, [effects]);

  const filteredEffects =
    useMemo(() => {
      const normalizedSearchText =
        searchText
          .trim()
          .toLowerCase();

      return [...effects]
        .filter(
          (effect) => {
            if (
              enabledOnly &&
              effect.isEnabled ===
                false
            ) {
              return false;
            }

            if (
              selectedRarity !==
                "all" &&
              (
                effect.rarity ??
                "common"
              ) !==
                selectedRarity
            ) {
              return false;
            }

            if (
              selectedTag &&
              !effect.tags.includes(
                selectedTag,
              )
            ) {
              return false;
            }

            if (
              !normalizedSearchText
            ) {
              return true;
            }

            const searchableText =
              [
                effect.name,
                effect.description,
                ...effect.tags,
              ]
                .join(" ")
                .toLowerCase();

            return searchableText.includes(
              normalizedSearchText,
            );
          },
        )
        .sort(
          (left, right) => {
            if (
              left.favorite !==
              right.favorite
            ) {
              return left.favorite
                ? -1
                : 1;
            }

            return (
              right.updatedAt -
              left.updatedAt
            );
          },
        );
    }, [
      effects,
      searchText,
      selectedRarity,
      selectedTag,
      enabledOnly,
    ]);

  const enabledCount =
    useMemo(
      () =>
        effects.filter(
          (effect) =>
            effect.isEnabled !==
            false,
        ).length,
      [effects],
    );

  const handleCreate =
    () => {
      navigate(
        "/effects/new",
      );
    };

  const handleEdit = (
    effect:
      EffectDefinition,
  ) => {
    navigate(
      `/effects/${effect.id}`,
    );
  };

  const handleDelete = (
    effect:
      EffectDefinition,
  ) => {
    const shouldDelete =
      window.confirm(
        `「${effect.name}」を削除しますか？\n\nこの操作は取り消せません。`,
      );

    if (!shouldDelete) {
      return;
    }

    deleteEffect(
      effect.id,
    );
  };

  return (
    <div className="min-h-full p-4 lg:p-6">
      <div className="mx-auto w-full max-w-[1800px]">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <header className="flex flex-col gap-5 border-b border-slate-200 px-5 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-6">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                <Sparkles
                  size={21}
                />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-violet-600">
                  Prizes
                </p>

                <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                  景品
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  実行内容・レア度・画像・タグをまとめて管理します。
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={
                handleCreate
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-violet-500"
            >
              <Plus
                size={17}
              />

              新規景品
            </button>
          </header>

          <div className="grid gap-3 border-b border-slate-200 bg-slate-50/70 px-5 py-4 lg:grid-cols-[minmax(260px,1fr)_180px_auto] lg:items-center lg:px-6">
            <div className="relative">
              <Search
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={
                  searchText
                }
                onChange={(
                  event,
                ) =>
                  setSearchText(
                    event
                      .target
                      .value,
                  )
                }
                placeholder="景品名・説明・タグで検索"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              />
            </div>

            <select
              value={
                selectedRarity
              }
              onChange={(
                event,
              ) =>
                setSelectedRarity(
                  event.target
                    .value,
                )
              }
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
            >
              <option value="all">
                すべてのレア度
              </option>

              <option value="common">
                COMMON
              </option>

              <option value="rare">
                RARE
              </option>

              <option value="epic">
                EPIC
              </option>

              <option value="legendary">
                LEGENDARY
              </option>

              <option value="ultra">
                ULTRA
              </option>

              <option value="secret">
                SECRET
              </option>
            </select>

            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
              <input
                type="checkbox"
                checked={
                  enabledOnly
                }
                onChange={(
                  event,
                ) =>
                  setEnabledOnly(
                    event.target
                      .checked,
                  )
                }
                className="size-4 accent-violet-600"
              />

              <span className="text-sm font-bold text-slate-600">
                有効のみ
              </span>
            </label>
          </div>

          {availableTags.length >
          0 ? (
            <div className="flex flex-wrap gap-2 border-b border-slate-200 bg-white px-5 py-3 lg:px-6">
              <button
                type="button"
                onClick={() =>
                  setSelectedTag(
                    null,
                  )
                }
                className={[
                  "rounded-full px-3 py-1.5 text-xs font-black transition",
                  selectedTag ===
                  null
                    ? "bg-violet-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                ].join(
                  " ",
                )}
              >
                すべて
              </button>

              {availableTags.map(
                (tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() =>
                      setSelectedTag(
                        tag,
                      )
                    }
                    className={[
                      "rounded-full px-3 py-1.5 text-xs font-black transition",
                      selectedTag ===
                      tag
                        ? "bg-violet-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                    ].join(
                      " ",
                    )}
                  >
                    #{tag}
                  </button>
                ),
              )}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/40 px-5 py-3 lg:px-6">
            <p className="text-sm font-semibold text-slate-500">
              {filteredEffects.length}
              件表示
            </p>

            <p className="text-xs font-bold text-slate-400">
              登録{" "}
              {effects.length}
              件 / 有効{" "}
              {enabledCount}
              件
            </p>
          </div>

          <div className="min-h-[560px] bg-slate-50 p-5 lg:p-6">
            {effects.length ===
            0 ? (
              <EmptyEffectState
                onCreate={
                  handleCreate
                }
              />
            ) : filteredEffects.length ===
              0 ? (
              <NoSearchResults
                onClear={() => {
                  setSearchText(
                    "",
                  );

                  setSelectedRarity(
                    "all",
                  );

                  setSelectedTag(
                    null,
                  );

                  setEnabledOnly(
                    false,
                  );
                }}
              />
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
                {filteredEffects.map(
                  (effect) => (
                    <EffectCard
                      key={
                        effect.id
                      }
                      effect={
                        effect
                      }
                      onEdit={
                        handleEdit
                      }
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
          <Sparkles
            size={28}
          />
        </div>

        <h2 className="mt-5 text-xl font-black text-slate-950">
          景品がありません
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          実行内容とガチャ表示情報をまとめた最初の景品を作成しましょう。
        </p>

        <button
          type="button"
          onClick={
            onCreate
          }
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-violet-500"
        >
          <Plus
            size={17}
          />

          景品を作成
        </button>
      </div>
    </div>
  );
}

type NoSearchResultsProps = {
  onClear: () => void;
};

function NoSearchResults({
  onClear,
}: NoSearchResultsProps) {
  return (
    <div className="flex min-h-[500px] items-center justify-center">
      <div className="max-w-md text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-slate-200 text-slate-500">
          <Search
            size={28}
          />
        </div>

        <h2 className="mt-5 text-xl font-black text-slate-950">
          条件に一致する景品がありません
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          検索ワード・タグ・レア度・有効状態を変更してください。
        </p>

        <button
          type="button"
          onClick={
            onClear
          }
          className="mt-6 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
        >
          絞り込みを解除
        </button>
      </div>
    </div>
  );
}