import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Boxes,
  Dices,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import { PoolFormModal } from "@/features/pools/components/PoolFormModal";
import { usePoolStore } from "@/features/pools/store/poolStore";
import type { GachaPool } from "@/features/pools/types/pool";

import { useGachaStore } from "@/features/gacha/store/gachaStore";

export function PoolPage() {
  const pools = usePoolStore(
    (state) => state.pools,
  );

  const loadPools = usePoolStore(
    (state) => state.loadPools,
  );

  const addPool = usePoolStore(
    (state) => state.addPool,
  );

  const updatePool = usePoolStore(
    (state) => state.updatePool,
  );

  const deletePool = usePoolStore(
    (state) => state.deletePool,
  );

  const gachaItems = useGachaStore(
    (state) => state.items,
  );

  const [searchQuery, setSearchQuery] =
    useState("");

  const [isFormOpen, setIsFormOpen] =
    useState(false);

  const [editingPool, setEditingPool] =
    useState<GachaPool | null>(null);

  useEffect(() => {
    loadPools();
  }, [loadPools]);

  const filteredPools = useMemo(() => {
    const normalizedQuery = searchQuery
      .trim()
      .toLowerCase();

    if (!normalizedQuery) {
      return pools;
    }

    return pools.filter((pool) => {
      const matchesPool =
        pool.name
          .toLowerCase()
          .includes(normalizedQuery) ||
        pool.description
          .toLowerCase()
          .includes(normalizedQuery);

      const matchesEntry =
        pool.entries.some((entry) => {
          const item = gachaItems.find(
            (candidate) =>
              candidate.id ===
              entry.gachaItemId,
          );

          return item?.name
            .toLowerCase()
            .includes(normalizedQuery);
        });

      return matchesPool || matchesEntry;
    });
  }, [gachaItems, pools, searchQuery]);

  const enabledPools = useMemo(
    () =>
      pools.filter((pool) => pool.enabled),
    [pools],
  );

  const handleOpenCreate = () => {
    setEditingPool(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (
    pool: GachaPool,
  ) => {
    setEditingPool(pool);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingPool(null);
  };

  const handleSubmit = (
    pool: GachaPool,
  ) => {
    const exists = pools.some(
      (current) => current.id === pool.id,
    );

    if (exists) {
      updatePool(pool);
      return;
    }

    addPool(pool);
  };

  const handleDelete = (
    pool: GachaPool,
  ) => {
    const shouldDelete = window.confirm(
      `「${pool.name}」を削除しますか？`,
    );

    if (!shouldDelete) {
      return;
    }

    deletePool(pool.id);
  };

  return (
    <>
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1.5 text-xs font-black text-violet-700">
                <Boxes size={14} />
                Gacha Pools
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                ガチャ箱
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                複数の景品をまとめて、重みに応じた抽選率を設定します。
              </p>

              <p className="mt-2 text-xs font-semibold text-emerald-600">
                変更内容はこの端末へ自動保存されます。
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-200"
            >
              <Plus size={18} />
              新しいガチャ箱
            </button>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-slate-500">
              登録ガチャ箱
            </p>

            <p className="mt-3 text-3xl font-black text-slate-950">
              {pools.length}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-slate-500">
              有効なガチャ箱
            </p>

            <p className="mt-3 text-3xl font-black text-emerald-700">
              {enabledPools.length}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-slate-500">
              登録景品
            </p>

            <p className="mt-3 text-3xl font-black text-violet-700">
              {gachaItems.length}
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="relative max-w-lg">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(
                  event.target.value,
                )
              }
              placeholder="ガチャ箱名・説明・景品名を検索"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
            />
          </div>
        </section>

        <section>
          {filteredPools.length > 0 ? (
            <div className="grid gap-5 xl:grid-cols-2">
              {filteredPools.map((pool) => {
                const totalWeight =
                  pool.entries.reduce(
                    (total, entry) =>
                      total +
                      Math.max(
                        0,
                        entry.weight,
                      ),
                    0,
                  );

                return (
                  <article
                    key={pool.id}
                    className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                  >
                    <header className="flex items-start justify-between gap-4 border-b border-slate-100 p-5">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="truncate text-lg font-black text-slate-950">
                            {pool.name}
                          </h2>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-black ${
                              pool.enabled
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {pool.enabled
                              ? "有効"
                              : "無効"}
                          </span>
                        </div>

                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                          {pool.description ||
                            "説明はありません。"}
                        </p>
                      </div>

                      <div className="flex shrink-0 gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            handleOpenEdit(pool)
                          }
                          aria-label={`${pool.name}を編集`}
                          className="flex size-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-violet-100 hover:text-violet-700"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(pool)
                          }
                          aria-label={`${pool.name}を削除`}
                          className="flex size-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-rose-100 hover:text-rose-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </header>

                    <div className="p-5">
                      <div className="mb-4 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl bg-slate-50 p-3">
                          <p className="text-xs font-bold text-slate-400">
                            景品数
                          </p>

                          <p className="mt-1 text-xl font-black text-slate-900">
                            {pool.entries.length}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-violet-50 p-3">
                          <p className="text-xs font-bold text-violet-500">
                            合計重み
                          </p>

                          <p className="mt-1 text-xl font-black text-violet-700">
                            {totalWeight}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {pool.entries.map(
                          (entry) => {
                            const item =
                              gachaItems.find(
                                (candidate) =>
                                  candidate.id ===
                                  entry.gachaItemId,
                              );

                            const probability =
                              totalWeight > 0
                                ? (entry.weight /
                                    totalWeight) *
                                  100
                                : 0;

                            return (
                              <div
                                key={entry.id}
                                className="grid grid-cols-[minmax(0,1fr)_70px_70px] items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                              >
                                <p className="truncate text-sm font-black text-slate-800">
                                  {item?.name ??
                                    "削除された景品"}
                                </p>

                                <p className="text-right text-xs font-bold text-slate-500">
                                  重み{" "}
                                  {entry.weight}
                                </p>

                                <p className="text-right text-sm font-black text-violet-700">
                                  {probability.toFixed(
                                    1,
                                  )}
                                  %
                                </p>
                              </div>
                            );
                          },
                        )}

                        {pool.entries.length ===
                          0 && (
                          <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm font-bold text-slate-400">
                            景品がありません
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 text-center">
              <div className="flex size-16 items-center justify-center rounded-3xl bg-violet-100 text-violet-600">
                <Dices size={28} />
              </div>

              <h2 className="mt-5 text-lg font-black text-slate-900">
                ガチャ箱がありません
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                景品をまとめるガチャ箱を作成してください。
              </p>

              <button
                type="button"
                onClick={handleOpenCreate}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-violet-500"
              >
                <Plus size={16} />
                ガチャ箱を作成
              </button>
            </div>
          )}
        </section>
      </div>

      <PoolFormModal
        isOpen={isFormOpen}
        pool={editingPool}
        gachaItems={gachaItems}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </>
  );
}