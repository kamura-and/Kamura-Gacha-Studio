import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Check,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import type {
  EffectDefinition,
} from "@/features/effects/types/effectDefinition";

import type {
  GachaPool,
  PoolEntry,
} from "@/features/pools/types/pool";

type PoolFormModalProps = {
  isOpen: boolean;

  pool: GachaPool | null;

  effects: EffectDefinition[];

  onClose: () => void;

  onSubmit: (
    pool: GachaPool,
  ) => void;
};

type PoolFormState = {
  name: string;

  description: string;

  enabled: boolean;

  entries: PoolEntry[];
};

const createInitialState = (
  pool: GachaPool | null,
): PoolFormState => {
  if (pool) {
    return {
      name: pool.name,

      description:
        pool.description,

      enabled:
        pool.enabled,

      entries:
        pool.entries,
    };
  }

  return {
    name: "",

    description: "",

    enabled: true,

    entries: [],
  };
};

const createId = () => {
  if (
    typeof crypto !==
    "undefined" &&
    typeof crypto.randomUUID ===
    "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
};

const rarityLabels: Record<
  string,
  string
> = {
  common: "COMMON",
  rare: "RARE",
  epic: "EPIC",
  legendary: "LEGENDARY",
  ultra: "ULTRA",
  secret: "SECRET",
};

export function PoolFormModal({
  isOpen,

  pool,

  effects,

  onClose,

  onSubmit,
}: PoolFormModalProps) {
  const [
    form,
    setForm,
  ] =
    useState<PoolFormState>(
      createInitialState(
        pool,
      ),
    );

  const [
    searchText,
    setSearchText,
  ] = useState("");

  const [
    selectedTag,
    setSelectedTag,
  ] =
    useState<string | null>(
      null,
    );

  const [
    selectedRarity,
    setSelectedRarity,
  ] = useState("all");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setForm(
      createInitialState(
        pool,
      ),
    );

    setSearchText("");

    setSelectedTag(null);

    setSelectedRarity(
      "all",
    );
  }, [
    isOpen,
    pool,
  ]);

  /*
   * Effectに登録されている
   * 全タグを取得します。
   */
  const availableTags =
    useMemo(() => {
      const tagSet =
        new Set<string>();

      effects.forEach(
        (effect) => {
          effect.tags.forEach(
            (tag) => {
              const trimmedTag =
                tag.trim();

              if (
                trimmedTag
              ) {
                tagSet.add(
                  trimmedTag,
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

  /*
   * すでにPoolへ入っている
   * Effect ID一覧。
   */
  const selectedEffectIds =
    useMemo(
      () =>
        new Set(
          form.entries
            .map(
              (entry) =>
                entry.effectId,
            )
            .filter(
              (
                effectId,
              ): effectId is string =>
                Boolean(
                  effectId,
                ),
            ),
        ),
      [form.entries],
    );

  /*
   * 景品検索。
   *
   * ・有効なEffectのみ
   * ・まだPoolに入っていない
   * ・名前
   * ・説明
   * ・タグ
   * ・レアリティ
   */
  const availableEffects =
    useMemo(() => {
      const normalizedSearch =
        searchText
          .trim()
          .toLowerCase();

      return effects.filter(
        (effect) => {
          /*
           * 古いEffectには
           * isEnabledが存在しないので
           * undefinedは有効扱い。
           */
          if (
            effect.isEnabled ===
            false
          ) {
            return false;
          }

          if (
            selectedEffectIds.has(
              effect.id,
            )
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
            !normalizedSearch
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
            normalizedSearch,
          );
        },
      );
    }, [
      effects,
      searchText,
      selectedTag,
      selectedRarity,
      selectedEffectIds,
    ]);

  const totalWeight =
    useMemo(
      () =>
        form.entries.reduce(
          (
            total,
            entry,
          ) =>
            total +
            Math.max(
              0,
              entry.weight,
            ),
          0,
        ),
      [form.entries],
    );

  if (!isOpen) {
    return null;
  }

  const handleAddEntry = (
    effectId: string,
  ) => {
    if (!effectId) {
      return;
    }

    if (
      form.entries.some(
        (entry) =>
          entry.effectId ===
          effectId,
      )
    ) {
      return;
    }

    setForm(
      (current) => ({
        ...current,

        entries: [
          ...current.entries,

          {
            id:
              createId(),

            effectId,

            weight: 1,
          },
        ],
      }),
    );
  };

  const handleWeightChange = (
    entryId: string,

    value: string,
  ) => {
    const parsedValue =
      Number(value);

    setForm(
      (current) => ({
        ...current,

        entries:
          current.entries.map(
            (entry) =>
              entry.id ===
                entryId
                ? {
                  ...entry,

                  weight:
                    Number.isFinite(
                      parsedValue,
                    )
                      ? Math.max(
                        0,
                        parsedValue,
                      )
                      : 0,
                }
                : entry,
          ),
      }),
    );
  };

  const handleDeleteEntry = (
    entryId: string,
  ) => {
    setForm(
      (current) => ({
        ...current,

        entries:
          current.entries.filter(
            (entry) =>
              entry.id !==
              entryId,
          ),
      }),
    );
  };

  const handleSubmit =
    () => {
      const trimmedName =
        form.name.trim();

      if (!trimmedName) {
        window.alert(
          "ガチャ箱の名前を入力してください。",
        );

        return;
      }

      if (
        form.entries
          .length === 0
      ) {
        window.alert(
          "ガチャ箱に景品を1件以上追加してください。",
        );

        return;
      }

      if (
        totalWeight <= 0
      ) {
        window.alert(
          "重みの合計を1以上にしてください。",
        );

        return;
      }

      const now =
        new Date()
          .toISOString();

      onSubmit({
        id:
          pool?.id ??
          createId(),

        name:
          trimmedName,

        description:
          form.description.trim(),

        enabled:
          form.enabled,

        entries:
          form.entries,

        createdAt:
          pool?.createdAt ??
          now,

        updatedAt:
          now,
      });

      onClose();
    };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="閉じる"
        onClick={
          onClose
        }
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
      />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-violet-600">
              Gacha Pool
            </p>

            <h2 className="mt-1 text-xl font-black text-slate-950">
              {pool
                ? "ガチャ箱を編集"
                : "新しいガチャ箱を作成"}
            </h2>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            className="flex size-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X
              size={20}
            />
          </button>
        </header>

        <div className="flex-1 space-y-7 overflow-y-auto p-6">
          <section className="grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-black text-slate-700">
                ガチャ箱名
              </span>

              <input
                type="text"
                value={
                  form.name
                }
                onChange={(
                  event,
                ) =>
                  setForm(
                    (
                      current,
                    ) => ({
                      ...current,

                      name:
                        event
                          .target
                          .value,
                    }),
                  )
                }
                placeholder="例：Minecraft妨害BOX"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-black text-slate-700">
                説明
              </span>

              <textarea
                value={
                  form.description
                }
                onChange={(
                  event,
                ) =>
                  setForm(
                    (
                      current,
                    ) => ({
                      ...current,

                      description:
                        event
                          .target
                          .value,
                    }),
                  )
                }
                placeholder="このガチャ箱の用途や内容"
                rows={3}
                className="resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
              />
            </label>

            <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <p className="text-sm font-black text-slate-700">
                  ガチャ箱を有効にする
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  無効にすると抽選対象として使用しません。
                </p>
              </div>

              <input
                type="checkbox"
                checked={
                  form.enabled
                }
                onChange={(
                  event,
                ) =>
                  setForm(
                    (
                      current,
                    ) => ({
                      ...current,

                      enabled:
                        event
                          .target
                          .checked,
                    }),
                  )
                }
                className="size-5 accent-violet-600"
              />
            </label>
          </section>

          <section>
            <div className="flex items-end justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  景品
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  保存済みの景品から選択します。名前・説明・タグで検索できます。
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs font-bold text-slate-400">
                  合計重み
                </p>

                <p className="text-xl font-black text-violet-700">
                  {
                    totalWeight
                  }
                </p>
              </div>
            </div>

            {/* 検索 */}

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="relative">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
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
                  placeholder="景品名・説明・タグを検索"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <select
                  value={
                    selectedRarity
                  }
                  onChange={(
                    event,
                  ) =>
                    setSelectedRarity(
                      event
                        .target
                        .value,
                    )
                  }
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-violet-300"
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

                <button
                  type="button"
                  onClick={() =>
                    setSelectedTag(
                      null,
                    )
                  }
                  className={[
                    "rounded-full px-3 py-2 text-xs font-black transition",
                    selectedTag ===
                      null
                      ? "bg-violet-600 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100",
                  ].join(
                    " ",
                  )}
                >
                  すべて
                </button>

                {availableTags.map(
                  (tag) => (
                    <button
                      key={
                        tag
                      }
                      type="button"
                      onClick={() =>
                        setSelectedTag(
                          tag,
                        )
                      }
                      className={[
                        "rounded-full px-3 py-2 text-xs font-black transition",
                        selectedTag ===
                          tag
                          ? "bg-violet-600 text-white"
                          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100",
                      ].join(
                        " ",
                      )}
                    >
                      #{tag}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* 景品候補 */}

            <div className="mt-4">
              {availableEffects.length >
                0 ? (
                <div className="grid max-h-72 gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
                  {availableEffects.map(
                    (
                      effect,
                    ) => (
                      <button
                        key={
                          effect.id
                        }
                        type="button"
                        onClick={() =>
                          handleAddEntry(
                            effect.id,
                          )
                        }
                        className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-left transition hover:border-violet-300 hover:bg-violet-50"
                      >
                        <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                          {effect.imageDataUrl ? (
                            <img
                              src={
                                effect.imageDataUrl
                              }
                              alt=""
                              className="size-full object-cover"
                            />
                          ) : (
                            <Plus
                              size={
                                20
                              }
                              className="text-slate-300"
                            />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-black text-slate-900">
                              {
                                effect.name
                              }
                            </p>

                            <span className="shrink-0 rounded-full bg-violet-100 px-2 py-1 text-[10px] font-black text-violet-700">
                              {
                                rarityLabels[
                                effect.rarity ??
                                "common"
                                ]
                              }
                            </span>
                          </div>

                          <p className="mt-1 truncate text-xs text-slate-500">
                            {effect.description ||
                              "説明なし"}
                          </p>

                          {effect.tags.length >
                            0 ? (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {effect.tags
                                .slice(
                                  0,
                                  3,
                                )
                                .map(
                                  (
                                    tag,
                                  ) => (
                                    <span
                                      key={
                                        tag
                                      }
                                      className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500"
                                    >
                                      #
                                      {
                                        tag
                                      }
                                    </span>
                                  ),
                                )}
                            </div>
                          ) : null}
                        </div>

                        <Plus
                          size={
                            18
                          }
                          className="shrink-0 text-violet-500 opacity-60 transition group-hover:opacity-100"
                        />
                      </button>
                    ),
                  )}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center">
                  <p className="text-sm font-black text-slate-600">
                    条件に一致する景品がありません
                  </p>

                  <p className="mt-2 text-xs text-slate-500">
                    検索条件・タグ・レア度を変更してください。
                  </p>
                </div>
              )}
            </div>

            {/* Pool登録済み景品 */}

            <div className="mt-7">
              <h4 className="text-sm font-black text-slate-700">
                このガチャ箱に入っている景品
              </h4>

              <div className="mt-3 space-y-3">
                {form.entries.length >
                  0 ? (
                  form.entries.map(
                    (
                      entry,
                    ) => {
                      const effect =
                        effects.find(
                          (candidate) =>
                            candidate.id ===
                            entry.effectId,
                        );

                      const probability =
                        totalWeight >
                          0
                          ? (entry.weight /
                            totalWeight) *
                          100
                          : 0;

                      return (
                        <div
                          key={
                            entry.id
                          }
                          className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[minmax(0,1fr)_120px_90px_44px] sm:items-center"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            {effect?.imageDataUrl ? (
                              <img
                                src={
                                  effect.imageDataUrl
                                }
                                alt=""
                                className="size-11 shrink-0 rounded-xl bg-white object-cover"
                              />
                            ) : null}

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="truncate text-sm font-black text-slate-900">
                                  {effect?.name ??
                                    "削除された景品"}
                                </p>

                                {effect ? (
                                  <span className="shrink-0 rounded-full bg-violet-100 px-2 py-1 text-[10px] font-black text-violet-700">
                                    {
                                      rarityLabels[
                                      effect.rarity ??
                                      "common"
                                      ]
                                    }
                                  </span>
                                ) : null}
                              </div>

                              <p className="mt-1 truncate text-xs text-slate-500">
                                {effect?.description ??
                                  "景品データが見つかりません。"}
                              </p>
                            </div>
                          </div>

                          <label className="grid gap-1">
                            <span className="text-xs font-bold text-slate-500">
                              重み
                            </span>

                            <input
                              type="number"
                              min={
                                0
                              }
                              step={
                                1
                              }
                              value={
                                entry.weight
                              }
                              onChange={(
                                event,
                              ) =>
                                handleWeightChange(
                                  entry.id,

                                  event
                                    .target
                                    .value,
                                )
                              }
                              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-900 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                            />
                          </label>

                          <div>
                            <p className="text-xs font-bold text-slate-500">
                              抽選率
                            </p>

                            <p className="mt-1 text-sm font-black text-violet-700">
                              {probability.toFixed(
                                1,
                              )}
                              %
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteEntry(
                                entry.id,
                              )
                            }
                            aria-label={`${effect?.name ?? "景品"}を削除`}
                            className="flex size-11 items-center justify-center rounded-xl text-slate-400 transition hover:bg-rose-100 hover:text-rose-600"
                          >
                            <Trash2
                              size={
                                17
                              }
                            />
                          </button>
                        </div>
                      );
                    },
                  )
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                    <p className="text-sm font-black text-slate-600">
                      景品が登録されていません
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      上の景品一覧から追加してください。
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        <footer className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={
              onClose
            }
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-100"
          >
            キャンセル
          </button>

          <button
            type="button"
            onClick={
              handleSubmit
            }
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-200"
          >
            <Check
              size={17}
            />

            {pool
              ? "変更を保存"
              : "ガチャ箱を作成"}
          </button>
        </footer>
      </div>
    </div>
  );
}