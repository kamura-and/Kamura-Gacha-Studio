import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Pencil,
  Plus,
  Search,
  Trash2,
  Zap,
} from "lucide-react";

import { usePoolStore } from "@/features/pools/store/poolStore";
import { useTriggerStore } from "@/features/triggers/store/triggerStore";
import { TriggerFormModal } from "@/features/triggers/components/TriggerFormModal";
import type { Trigger } from "@/features/triggers/types/Trigger";
import type { TriggerCondition } from "@/features/triggers/types/TriggerCondition";

export function TriggerPage() {
  const triggers = useTriggerStore(
    (state) => state.triggers,
  );

  const loadTriggers = useTriggerStore(
    (state) => state.loadTriggers,
  );

  const deleteTrigger = useTriggerStore(
    (state) => state.deleteTrigger,
  );

  const setTriggerEnabled = useTriggerStore(
    (state) => state.setTriggerEnabled,
  );

  const addTrigger = useTriggerStore(
    (state) => state.addTrigger,
  );

  const updateTrigger = useTriggerStore(
    (state) => state.updateTrigger,
  );

  const pools = usePoolStore(
    (state) => state.pools,
  );

  const loadPools = usePoolStore(
    (state) => state.loadPools,
  );

  const [searchQuery, setSearchQuery] =
    useState("");

  const [isFormOpen, setIsFormOpen] =
    useState(false);

  const [editingTrigger, setEditingTrigger] =
    useState<Trigger | null>(null);

  useEffect(() => {
    loadTriggers();
    loadPools();
  }, [
    loadPools,
    loadTriggers,
  ]);

  const filteredTriggers = useMemo(() => {
    const normalizedQuery = searchQuery
      .trim()
      .toLowerCase();

    if (!normalizedQuery) {
      return triggers;
    }

    return triggers.filter((trigger) => {
      const poolName =
        pools.find(
          (pool) =>
            pool.id ===
            trigger.gachaPoolId,
        )?.name ?? "";

      const searchableText = [
        trigger.name,
        trigger.description ?? "",
        trigger.pluginId ?? "",
        trigger.eventCategory ?? "",
        trigger.eventType ?? "",
        poolName,
        ...trigger.conditions.flatMap(
          (condition) => [
            condition.field,
            condition.operator,
            formatConditionValue(
              condition.value,
            ),
          ],
        ),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(
        normalizedQuery,
      );
    });
  }, [
    pools,
    searchQuery,
    triggers,
  ]);

  const enabledCount = useMemo(
    () =>
      triggers.filter(
        (trigger) =>
          trigger.enabled,
      ).length,
    [triggers],
  );

  const handleDelete = (
    trigger: Trigger,
  ) => {
    const shouldDelete = window.confirm(
      `「${trigger.name}」を削除しますか？`,
    );

    if (!shouldDelete) {
      return;
    }

    deleteTrigger(trigger.id);
  };

  const handleToggleEnabled = (
    trigger: Trigger,
  ) => {
    setTriggerEnabled(
      trigger.id,
      !trigger.enabled,
    );
  };

  const handleOpenCreate = () => {
    setEditingTrigger(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (
    trigger: Trigger,
  ) => {
    setEditingTrigger(trigger);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTrigger(null);
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1.5 text-xs font-black text-violet-700">
              <Zap size={14} />
              Triggers
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              発動条件
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              受信したイベントとガチャ箱を結び付けます。
            </p>

            <p className="mt-2 text-xs font-semibold text-emerald-600">
              変更内容はこの端末へ自動保存されます。
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-3.5 text-sm font-black text-white transition hover:bg-violet-700"
          >
            <Plus size={18} />
            新しい発動条件
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          label="登録条件"
          value={triggers.length}
          valueClassName="text-slate-950"
        />

        <SummaryCard
          label="有効な条件"
          value={enabledCount}
          valueClassName="text-emerald-700"
        />

        <SummaryCard
          label="接続ガチャ箱"
          value={
            new Set(
              triggers.map(
                (trigger) =>
                  trigger.gachaPoolId,
              ),
            ).size
          }
          valueClassName="text-violet-700"
        />
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
            placeholder="条件名・イベント・ガチャ箱を検索"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
          />
        </div>
      </section>

      <section>
        {filteredTriggers.length > 0 ? (
          <div className="grid gap-5 xl:grid-cols-2">
            {filteredTriggers.map(
              (trigger) => {
                const pool =
                  pools.find(
                    (candidate) =>
                      candidate.id ===
                      trigger.gachaPoolId,
                  );

                return (
                  <article
                    key={trigger.id}
                    className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                  >
                    <header className="flex items-start justify-between gap-4 border-b border-slate-100 p-5">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="truncate text-lg font-black text-slate-950">
                            {trigger.name}
                          </h2>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-black ${trigger.enabled
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                              }`}
                          >
                            {trigger.enabled
                              ? "有効"
                              : "無効"}
                          </span>
                        </div>

                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                          {trigger.description ||
                            "説明はありません。"}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(trigger)}
                          aria-label={`${trigger.name}を編集`}
                          className="flex size-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-violet-600"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              trigger,
                            )
                          }
                          aria-label={`${trigger.name}を削除`}
                          className="flex size-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-rose-100 hover:text-rose-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </header>

                    <div className="space-y-4 p-5">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <InfoBlock
                          label="イベント"
                          value={formatEventLabel(
                            trigger,
                          )}
                        />

                        <InfoBlock
                          label="実行するガチャ箱"
                          value={
                            pool?.name ??
                            "削除されたガチャ箱"
                          }
                          tone={
                            pool
                              ? "violet"
                              : "warning"
                          }
                        />
                      </div>

                      <div>
                        <p className="mb-2 text-xs font-black text-slate-400">
                          条件
                        </p>

                        {trigger.conditions.length >
                          0 ? (
                          <div className="space-y-2">
                            {trigger.conditions.map(
                              (
                                condition,
                              ) => (
                                <div
                                  key={
                                    condition.id
                                  }
                                  className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                                >
                                  <p className="break-words text-sm font-bold text-slate-700">
                                    {formatConditionLabel(
                                      condition,
                                    )}
                                  </p>
                                </div>
                              ),
                            )}
                          </div>
                        ) : (
                          <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-5 text-center text-sm font-bold text-slate-400">
                            追加条件なし
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
                        <div>
                          <p className="text-sm font-black text-slate-700">
                            発動条件を使用
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            無効にするとイベントを受け取っても実行されません。
                          </p>
                        </div>

                        <button
                          type="button"
                          role="switch"
                          aria-checked={
                            trigger.enabled
                          }
                          onClick={() =>
                            handleToggleEnabled(
                              trigger,
                            )
                          }
                          className={`relative h-7 w-12 shrink-0 rounded-full transition ${trigger.enabled
                            ? "bg-violet-600"
                            : "bg-slate-300"
                            }`}
                        >
                          <span
                            className={`absolute top-1 size-5 rounded-full bg-white shadow-sm transition ${trigger.enabled
                              ? "left-6"
                              : "left-1"
                              }`}
                          />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              },
            )}
          </div>
        ) : (
          <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 text-center">
            <div className="flex size-16 items-center justify-center rounded-3xl bg-violet-100 text-violet-600">
              <Zap size={28} />
            </div>

            <h2 className="mt-5 text-lg font-black text-slate-900">
              {triggers.length === 0
                ? "発動条件がありません"
                : "該当する発動条件がありません"}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {triggers.length === 0
                ? "次の工程で新しい発動条件を作成できるようにします。"
                : "検索条件を変更してください。"}
            </p>
          </div>
        )}
      </section>
      <TriggerFormModal
        isOpen={isFormOpen}
        trigger={editingTrigger}
        pools={pools}
        onClose={handleCloseForm}
        onCreate={(input) => {
          addTrigger(input);
          handleCloseForm();
        }}
        onUpdate={(id, input) => {
          updateTrigger(id, input);
          handleCloseForm();
        }}
      />
    </div>
  );
}

type SummaryCardProps = {
  label: string;
  value: number;
  valueClassName: string;
};

function SummaryCard({
  label,
  value,
  valueClassName,
}: SummaryCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold text-slate-500">
        {label}
      </p>

      <p
        className={`mt-3 text-3xl font-black ${valueClassName}`}
      >
        {value}
      </p>
    </div>
  );
}

type InfoBlockProps = {
  label: string;
  value: string;
  tone?: "default" | "violet" | "warning";
};

function InfoBlock({
  label,
  value,
  tone = "default",
}: InfoBlockProps) {
  const valueClassName =
    tone === "violet"
      ? "text-violet-700"
      : tone === "warning"
        ? "text-amber-700"
        : "text-slate-800";

  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-black text-slate-400">
        {label}
      </p>

      <p
        className={`mt-2 break-words text-sm font-black ${valueClassName}`}
      >
        {value}
      </p>
    </div>
  );
}

function formatEventLabel(
  trigger: Trigger,
): string {
  if (
    trigger.pluginId ===
    "tiktok-live" &&
    trigger.eventCategory === "gift"
  ) {
    return "TikTok LIVE・ギフト";
  }

  const pluginLabel =
    formatPluginLabel(
      trigger.pluginId,
    );

  const eventLabel =
    formatEventCategoryLabel(
      trigger.eventCategory,
    );

  return [
    pluginLabel,
    eventLabel,
  ]
    .filter(Boolean)
    .join("・") ||
    "すべてのイベント";
}

function formatConditionLabel(
  condition: TriggerCondition,
): string {
  if (
    condition.field === "giftId" &&
    condition.operator === "equals"
  ) {
    return `ギフト：${formatGiftName(
      condition.value,
    )}`;
  }

  if (
    condition.field ===
      "repeatCount" &&
    condition.operator ===
      "greaterThanOrEqual"
  ) {
    return `個数：${formatConditionValue(
      condition.value,
    )}個以上`;
  }

  const fieldLabel =
    formatConditionFieldLabel(
      condition.field,
    );

  const operatorLabel =
    formatConditionOperatorLabel(
      condition.operator,
    );

  const valueLabel =
    formatConditionValue(
      condition.value,
    );

  return [
    fieldLabel,
    operatorLabel,
    valueLabel,
  ]
    .filter(Boolean)
    .join(" ");
}

function formatGiftName(
  value: unknown,
): string {
  if (typeof value !== "string") {
    return formatConditionValue(
      value,
    );
  }

  const giftNames: Record<
    string,
    string
  > = {
    rose: "バラ",
    donut: "ドーナッツ",
    galaxy: "銀河",
    corgi: "コーギー",
    swan: "白鳥",
    fingerHeart:
      "フィンガーハート",
    heartPose:
      "ハートポーズ",
    moneyGun:
      "マネーガン",
  };

  return giftNames[value] ?? value;
}

function formatPluginLabel(
  pluginId:
    | Trigger["pluginId"]
    | undefined,
): string {
  switch (pluginId) {
    case "tiktok-live":
      return "TikTok LIVE";

    case "minecraft":
      return "Minecraft";

    case "overlay":
      return "オーバーレイ";

    default:
      return pluginId ?? "";
  }
}

function formatEventCategoryLabel(
  category:
    | Trigger["eventCategory"]
    | undefined,
): string {
  switch (category) {
    case "gift":
      return "ギフト";

    case "comment":
      return "コメント";

    case "like":
      return "いいね";

    case "share":
      return "シェア";

    case "follow":
      return "フォロー";

    case "join":
      return "入室";

    default:
      return category ?? "";
  }
}

function formatConditionFieldLabel(
  field: string,
): string {
  switch (field) {
    case "giftId":
      return "ギフト";

    case "repeatCount":
      return "個数";

    case "comment":
      return "コメント";

    case "username":
      return "ユーザー名";

    default:
      return field;
  }
}

function formatConditionOperatorLabel(
  operator:
    TriggerCondition["operator"],
): string {
  switch (operator) {
    case "equals":
      return "が一致";

    case "notEquals":
      return "が一致しない";

    case "greaterThan":
      return "より大きい";

    case "greaterThanOrEqual":
      return "以上";

    case "lessThan":
      return "より小さい";

    case "lessThanOrEqual":
      return "以下";

    case "contains":
      return "を含む";

    case "notContains":
      return "を含まない";

    case "startsWith":
      return "で始まる";

    case "endsWith":
      return "で終わる";

    case "in":
      return "のいずれか";

    case "notIn":
      return "のいずれでもない";

    case "exists":
      return "が存在する";

    case "notExists":
      return "が存在しない";

    default:
      return operator;
  }
}

function formatConditionValue(
  value: unknown,
): string {
  if (value === undefined) {
    return "";
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (
    typeof value === "object" &&
    value !== null
  ) {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  return String(value);
}