import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Check,
  Gift,
  X,
} from "lucide-react";

import { GiftTriggerEditor } from "@/features/triggers/components/GiftTriggerEditor";
import {
  findGiftDefinition,
  giftDefinitions,
} from "@/features/triggers/gifts/giftDefinitions";

import type { GachaPool } from "@/features/pools/types/pool";
import type {
  CreateTriggerInput,
  Trigger,
  UpdateTriggerInput,
} from "@/features/triggers/types/Trigger";

type TriggerFormModalProps = {
  isOpen: boolean;
  trigger: Trigger | null;
  pools: GachaPool[];
  onClose: () => void;
  onCreate: (
    input: CreateTriggerInput,
  ) => void;
  onUpdate: (
    id: string,
    input: UpdateTriggerInput,
  ) => void;
};

type TriggerFormState = {
  name: string;
  description: string;
  enabled: boolean;
  selectedGiftId: string;
  minimumCount: number;
  gachaPoolId: string;
};

const DEFAULT_GIFT_ID =
  giftDefinitions[0]?.id ?? "";

function createInitialState(
  trigger: Trigger | null,
  pools: GachaPool[],
): TriggerFormState {
  if (!trigger) {
    return {
      name: "",
      description: "",
      enabled: true,
      selectedGiftId:
        DEFAULT_GIFT_ID,
      minimumCount: 1,
      gachaPoolId:
        pools.find(
          (pool) => pool.enabled,
        )?.id ??
        pools[0]?.id ??
        "",
    };
  }

  const giftIdCondition =
    trigger.conditions.find(
      (condition) =>
        condition.field === "giftId" &&
        condition.operator === "equals",
    );

  const countCondition =
    trigger.conditions.find(
      (condition) =>
        condition.field ===
        "repeatCount" &&
        condition.operator ===
        "greaterThanOrEqual",
    );

  return {
    name: trigger.name,
    description:
      trigger.description ?? "",
    enabled: trigger.enabled,
    selectedGiftId:
      typeof giftIdCondition?.value ===
        "string"
        ? giftIdCondition.value
        : DEFAULT_GIFT_ID,
    minimumCount:
      typeof countCondition?.value ===
        "number"
        ? Math.max(
          1,
          Math.floor(
            countCondition.value,
          ),
        )
        : 1,
    gachaPoolId:
      trigger.gachaPoolId,
  };
}

export function TriggerFormModal({
  isOpen,
  trigger,
  pools,
  onClose,
  onCreate,
  onUpdate,
}: TriggerFormModalProps) {
  const [form, setForm] =
    useState<TriggerFormState>(
      createInitialState(
        trigger,
        pools,
      ),
    );

  const [giftSearchQuery, setGiftSearchQuery] =
    useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setForm(
      createInitialState(
        trigger,
        pools,
      ),
    );
    setGiftSearchQuery("");
  }, [
    isOpen,
    pools,
    trigger,
  ]);

  const filteredGifts = useMemo(() => {
    const normalizedQuery =
      giftSearchQuery
        .trim()
        .toLowerCase();

    if (!normalizedQuery) {
      return giftDefinitions;
    }

    return giftDefinitions.filter(
      (gift) =>
        [
          gift.name,
          gift.id,
          ...(gift.aliases ?? []),
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery),
    );
  }, [giftSearchQuery]);

  const selectedGift =
    findGiftDefinition(
      form.selectedGiftId,
    );

  if (!isOpen) {
    return null;
  }

  const handleSubmit = () => {
    const trimmedName =
      form.name.trim();

    if (!trimmedName) {
      window.alert(
        "発動条件の名前を入力してください。",
      );
      return;
    }

    if (!form.selectedGiftId) {
      window.alert(
        "対象のギフトを選択してください。",
      );
      return;
    }

    if (!form.gachaPoolId) {
      window.alert(
        "実行するガチャ箱を選択してください。",
      );
      return;
    }

    const conditions = [
      {
        field: "giftId",
        operator:
          "equals" as const,
        value: form.selectedGiftId,
      },
      {
        field: "repeatCount",
        operator:
          "greaterThanOrEqual" as const,
        value: form.minimumCount,
      },
    ];

    const commonInput = {
      name: trimmedName,
      description:
        form.description.trim() ||
        undefined,
      enabled: form.enabled,
      pluginId: "tiktok-live",
      eventCategory: "gift",
      eventType: "gift",
      conditions,
      matchMode: "all",
      gachaPoolId:
        form.gachaPoolId,
    } satisfies CreateTriggerInput;

    if (trigger) {
      onUpdate(
        trigger.id,
        commonInput,
      );
    } else {
      onCreate(commonInput);
    }

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

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-violet-600">
              TikTok Gift Trigger
            </p>

            <h2 className="mt-1 text-xl font-black text-slate-950">
              {trigger
                ? "発動条件を編集"
                : "新しい発動条件を作成"}
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

        <div className="flex-1 space-y-7 overflow-y-auto p-6">
          <section className="grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-black text-slate-700">
                発動条件名
              </span>

              <input
                type="text"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name:
                      event.target.value,
                  }))
                }
                placeholder="例：バラ5個で妨害"
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
                placeholder="この条件の用途や内容"
                rows={3}
                className="resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
              />
            </label>

            <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <p className="text-sm font-black text-slate-700">
                  発動条件を有効にする
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  無効にするとイベントを受け取っても実行しません。
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

          <section className="rounded-3xl border border-violet-100 bg-violet-50/50 p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-violet-600 text-white">
                <Gift size={20} />
              </div>

              <div>
                <p className="text-xs font-black text-violet-500">
                  イベント種別
                </p>

                <p className="mt-1 text-sm font-black text-violet-900">
                  TikTok・ギフト
                </p>
              </div>
            </div>
          </section>

          <GiftTriggerEditor
            gifts={filteredGifts}
            selectedGiftId={
              form.selectedGiftId
            }
            minimumCount={
              form.minimumCount
            }
            searchQuery={
              giftSearchQuery
            }
            onSearchQueryChange={
              setGiftSearchQuery
            }
            onGiftChange={(
              selectedGiftId,
            ) =>
              setForm((current) => ({
                ...current,
                selectedGiftId,
              }))
            }
            onMinimumCountChange={(
              minimumCount,
            ) =>
              setForm((current) => ({
                ...current,
                minimumCount,
              }))
            }
          />

          <section>
            <label className="grid gap-2">
              <span className="text-sm font-black text-slate-700">
                実行するガチャ箱
              </span>

              <select
                value={
                  form.gachaPoolId
                }
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    gachaPoolId:
                      event.target.value,
                  }))
                }
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              >
                <option value="">
                  ガチャ箱を選択
                </option>

                {pools.map((pool) => (
                  <option
                    key={pool.id}
                    value={pool.id}
                  >
                    {pool.name}
                    {pool.enabled
                      ? ""
                      : "（無効）"}
                  </option>
                ))}
              </select>
            </label>

            {selectedGift ? (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <span className="font-black text-slate-800">
                  保存内容：
                </span>{" "}
                {selectedGift.name}を
                {form.minimumCount}
                個以上受信したら、選択したガチャ箱を実行します。
              </div>
            ) : null}
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
            {trigger
              ? "変更を保存"
              : "発動条件を作成"}
          </button>
        </footer>
      </div>
    </div>
  );
}