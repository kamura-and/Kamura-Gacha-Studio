import { useEffect, useMemo, useState } from "react";
import { Check, Plus, Trash2, X } from "lucide-react";

import type { GachaItem } from "@/features/gacha/types/gacha";
import type {
  GachaPool,
  PoolEntry,
} from "@/features/pools/types/pool";

type PoolFormModalProps = {
  isOpen: boolean;
  pool: GachaPool | null;
  gachaItems: GachaItem[];
  onClose: () => void;
  onSubmit: (pool: GachaPool) => void;
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
      description: pool.description,
      enabled: pool.enabled,
      entries: pool.entries,
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
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
};

export function PoolFormModal({
  isOpen,
  pool,
  gachaItems,
  onClose,
  onSubmit,
}: PoolFormModalProps) {
  const [form, setForm] = useState<PoolFormState>(
    createInitialState(pool),
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setForm(createInitialState(pool));
  }, [isOpen, pool]);

  const availableItems = useMemo(
    () =>
      gachaItems.filter(
        (item) =>
          !form.entries.some(
            (entry) =>
              entry.gachaItemId === item.id,
          ),
      ),
    [form.entries, gachaItems],
  );

  const totalWeight = useMemo(
    () =>
      form.entries.reduce(
        (total, entry) =>
          total + Math.max(0, entry.weight),
        0,
      ),
    [form.entries],
  );

  if (!isOpen) {
    return null;
  }

  const handleAddEntry = (
    gachaItemId: string,
  ) => {
    if (!gachaItemId) {
      return;
    }

    setForm((current) => ({
      ...current,
      entries: [
        ...current.entries,
        {
          id: createId(),
          gachaItemId,
          weight: 1,
        },
      ],
    }));
  };

  const handleWeightChange = (
    entryId: string,
    value: string,
  ) => {
    const parsedValue = Number(value);

    setForm((current) => ({
      ...current,
      entries: current.entries.map((entry) =>
        entry.id === entryId
          ? {
              ...entry,
              weight: Number.isFinite(parsedValue)
                ? Math.max(0, parsedValue)
                : 0,
            }
          : entry,
      ),
    }));
  };

  const handleDeleteEntry = (
    entryId: string,
  ) => {
    setForm((current) => ({
      ...current,
      entries: current.entries.filter(
        (entry) => entry.id !== entryId,
      ),
    }));
  };

  const handleSubmit = () => {
    const trimmedName = form.name.trim();

    if (!trimmedName) {
      window.alert(
        "ガチャ箱の名前を入力してください。",
      );
      return;
    }

    if (form.entries.length === 0) {
      window.alert(
        "ガチャ箱に景品を1件以上追加してください。",
      );
      return;
    }

    if (totalWeight <= 0) {
      window.alert(
        "重みの合計を1以上にしてください。",
      );
      return;
    }

    const now = new Date().toISOString();

    onSubmit({
      id: pool?.id ?? createId(),
      name: trimmedName,
      description: form.description.trim(),
      enabled: form.enabled,
      entries: form.entries,
      createdAt: pool?.createdAt ?? now,
      updatedAt: now,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="閉じる"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
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
            onClick={onClose}
            className="flex size-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          <section className="grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-black text-slate-700">
                ガチャ箱名
              </span>

              <input
                type="text"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
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
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description:
                      event.target.value,
                  }))
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
                checked={form.enabled}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    enabled:
                      event.target.checked,
                  }))
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
                  景品ごとの重みから抽選率を自動計算します。
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs font-bold text-slate-400">
                  合計重み
                </p>

                <p className="text-xl font-black text-violet-700">
                  {totalWeight}
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <select
                value=""
                onChange={(event) =>
                  handleAddEntry(
                    event.target.value,
                  )
                }
                disabled={
                  availableItems.length === 0
                }
                className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
              >
                <option value="">
                  {availableItems.length > 0
                    ? "追加する景品を選択"
                    : "追加できる景品がありません"}
                </option>

                {availableItems.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </option>
                ))}
              </select>

              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                <Plus size={19} />
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {form.entries.length > 0 ? (
                form.entries.map((entry) => {
                  const item = gachaItems.find(
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
                      className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[minmax(0,1fr)_120px_90px_44px] sm:items-center"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-slate-900">
                          {item?.name ??
                            "削除された景品"}
                        </p>

                        <p className="mt-1 truncate text-xs text-slate-500">
                          {item?.description ||
                            "説明なし"}
                        </p>
                      </div>

                      <label className="grid gap-1">
                        <span className="text-xs font-bold text-slate-500">
                          重み
                        </span>

                        <input
                          type="number"
                          min={0}
                          step={1}
                          value={entry.weight}
                          onChange={(event) =>
                            handleWeightChange(
                              entry.id,
                              event.target.value,
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
                          {probability.toFixed(1)}%
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteEntry(
                            entry.id,
                          )
                        }
                        aria-label={`${item?.name ?? "景品"}を削除`}
                        className="flex size-11 items-center justify-center rounded-xl text-slate-400 transition hover:bg-rose-100 hover:text-rose-600"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                  <p className="text-sm font-black text-slate-600">
                    景品が登録されていません
                  </p>

                  <p className="mt-2 text-xs text-slate-500">
                    上の選択欄から景品を追加してください。
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        <footer className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-100"
          >
            キャンセル
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-200"
          >
            <Check size={17} />
            {pool ? "変更を保存" : "ガチャ箱を作成"}
          </button>
        </footer>
      </div>
    </div>
  );
}