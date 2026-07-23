import { useMemo, useState } from "react";
import {
  CircleDot,
  Dices,
  Plus,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { AnimatePresence } from "motion/react";

import { GachaFormModal } from "@/features/gacha/components/GachaFormModal";
import { GachaItemCard } from "@/features/gacha/components/GachaItemCard";
import { useGachaStore } from "@/features/gacha/store/gachaStore";
import type {
  GachaItem,
  GachaRarity,
} from "@/features/gacha/types/gacha";

type RarityFilter = "all" | GachaRarity;

const rarityFilters: Array<{
  value: RarityFilter;
  label: string;
}> = [
  { value: "all", label: "すべて" },
  { value: "common", label: "Common" },
  { value: "rare", label: "Rare" },
  { value: "epic", label: "Epic" },
  { value: "legendary", label: "Legendary" },
  { value: "ultra", label: "Ultra Rare" },
  { value: "secret", label: "Secret" },
];

export function GachaPage() {
  const items = useGachaStore((state) => state.items);

  const upsertItem = useGachaStore(
    (state) => state.upsertItem,
  );

  const deleteItem = useGachaStore(
    (state) => state.deleteItem,
  );

  const toggleItemEnabled = useGachaStore(
    (state) => state.toggleItemEnabled,
  );

  const resetItems = useGachaStore(
    (state) => state.resetItems,
  );

  const [searchQuery, setSearchQuery] = useState("");

  const [rarityFilter, setRarityFilter] =
    useState<RarityFilter>("all");

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [editingItem, setEditingItem] =
    useState<GachaItem | null>(null);

  const filteredItems = useMemo(() => {
    const normalizedQuery = searchQuery
      .trim()
      .toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
  normalizedQuery.length === 0 ||
  item.name
    .toLowerCase()
    .includes(normalizedQuery) ||
  item.description
    .toLowerCase()
    .includes(normalizedQuery) ||
  item.commands.some((command) =>
    command.value
      .toLowerCase()
      .includes(normalizedQuery),
  );

      const matchesRarity =
        rarityFilter === "all" ||
        item.rarity === rarityFilter;

      return matchesSearch && matchesRarity;
    });
  }, [items, rarityFilter, searchQuery]);

  const enabledItems = useMemo(
    () => items.filter((item) => item.isEnabled),
    [items],
  );

  const totalProbability = useMemo(
    () =>
      enabledItems.reduce(
        (total, item) =>
          total + item.probability,
        0,
      ),
    [enabledItems],
  );

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (id: string) => {
    const targetItem =
      items.find((item) => item.id === id) ?? null;

    if (!targetItem) {
      return;
    }

    setEditingItem(targetItem);
    setIsFormOpen(true);
  };

  const handleCloseModal = () => {
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const handleSubmitItem = (
    submittedItem: GachaItem,
  ) => {
    upsertItem(submittedItem);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setRarityFilter("all");
  };

  const handleResetItems = () => {
    const shouldReset = window.confirm(
      "ガチャデータを初期状態へ戻しますか？\n現在の変更内容はすべて失われます。",
    );

    if (!shouldReset) {
      return;
    }

    resetItems();
    handleResetFilters();
  };

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    rarityFilter !== "all";

  return (
    <>
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1.5 text-xs font-black text-violet-700">
                <Sparkles size={14} />
                Gacha Editor
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                ガチャ管理
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                ガチャの排出率、レアリティ、
                Minecraftコマンドを管理します。
              </p>

              <p className="mt-2 text-xs font-semibold text-emerald-600">
                変更内容はこの端末へ自動保存されます。
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleResetItems}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-black text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-100"
              >
                <RotateCcw size={17} />
                初期状態へ戻す
              </button>

              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-200"
              >
                <Plus size={18} />
                新しいガチャを追加
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                <Dices size={19} />
              </div>

              <p className="text-sm font-bold text-slate-600">
                登録ガチャ
              </p>
            </div>

            <p className="mt-4 text-3xl font-black text-slate-950">
              {items.length}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <CircleDot size={19} />
              </div>

              <p className="text-sm font-bold text-slate-600">
                有効なガチャ
              </p>
            </div>

            <p className="mt-4 text-3xl font-black text-slate-950">
              {enabledItems.length}
            </p>
          </div>

          <div
            className={`rounded-3xl border bg-white p-5 shadow-sm ${
              totalProbability === 100
                ? "border-emerald-200"
                : "border-amber-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex size-10 items-center justify-center rounded-2xl ${
                  totalProbability === 100
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                <SlidersHorizontal size={19} />
              </div>

              <p className="text-sm font-bold text-slate-600">
                排出率合計
              </p>
            </div>

            <p
              className={`mt-4 text-3xl font-black ${
                totalProbability === 100
                  ? "text-emerald-700"
                  : "text-amber-700"
              }`}
            >
              {totalProbability}%
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex w-full gap-2 xl:max-w-lg">
              <div className="relative min-w-0 flex-1">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(event.target.value)
                  }
                  placeholder="ガチャ名・説明・コマンドを検索"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  aria-label="絞り込みを解除"
                  className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                >
                  <RotateCcw size={17} />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {rarityFilters.map((filter) => {
                const isActive =
                  rarityFilter === filter.value;

                return (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() =>
                      setRarityFilter(filter.value)
                    }
                    className={`rounded-xl px-3 py-2 text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-violet-200 ${
                      isActive
                        ? "bg-violet-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {totalProbability !== 100 && (
          <section className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
            <p className="text-sm font-black text-amber-800">
              有効なガチャの排出率合計が100%ではありません。
            </p>

            <p className="mt-1 text-sm text-amber-700">
              現在の合計は
              {totalProbability}
              %です。抽選実装前に調整してください。
            </p>
          </section>
        )}

        <section>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                ガチャ一覧
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {filteredItems.length}
                件を表示しています。
              </p>
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {filteredItems.length > 0 ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {filteredItems.map((item) => (
                  <GachaItemCard
                    key={item.id}
                    item={item}
                    onToggleEnabled={
                      toggleItemEnabled
                    }
                    onDelete={deleteItem}
                    onEdit={handleOpenEditModal}
                  />
                ))}
              </div>
            ) : (
              <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 text-center">
                <div className="flex size-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-400">
                  <Search size={27} />
                </div>

                <h2 className="mt-5 text-lg font-black text-slate-900">
                  該当するガチャがありません
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  検索条件またはレアリティの絞り込みを変更してください。
                </p>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-100 px-4 py-2.5 text-sm font-black text-violet-700 transition hover:bg-violet-200"
                  >
                    <RotateCcw size={15} />
                    絞り込みを解除
                  </button>
                )}
              </div>
            )}
          </AnimatePresence>
        </section>
      </div>

      <GachaFormModal
        isOpen={isFormOpen}
        item={editingItem}
        onClose={handleCloseModal}
        onSubmit={handleSubmitItem}
      />
    </>
  );
}