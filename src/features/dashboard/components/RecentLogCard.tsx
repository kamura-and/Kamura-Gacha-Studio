import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  CircleDot,
  Clock3,
  History,
  LoaderCircle,
  Trash2,
  XCircle,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

import { useCommandQueueStore } from "@/features/queue/store/commandQueueStore";

import type {
  CommandQueueItem,
  QueueItemStatus,
} from "@/features/queue/types/commandQueue";

type LogFilter =
  | "all"
  | QueueItemStatus;

type StatusStyle = {
  label: string;
  icon: LucideIcon;
  iconContainer: string;
  iconColor: string;
  badge: string;
};

const statusStyles: Record<
  QueueItemStatus,
  StatusStyle
> = {
  pending: {
    label: "待機中",
    icon: Clock3,
    iconContainer:
      "bg-slate-100 ring-slate-200",
    iconColor: "text-slate-500",
    badge:
      "bg-slate-100 text-slate-600 ring-slate-500/20",
  },

  running: {
    label: "実行中",
    icon: LoaderCircle,
    iconContainer:
      "bg-violet-50 ring-violet-100",
    iconColor: "text-violet-600",
    badge:
      "bg-violet-50 text-violet-700 ring-violet-600/20",
  },

  completed: {
    label: "完了",
    icon: CheckCircle2,
    iconContainer:
      "bg-emerald-50 ring-emerald-100",
    iconColor: "text-emerald-600",
    badge:
      "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  },

  failed: {
    label: "失敗",
    icon: XCircle,
    iconContainer:
      "bg-rose-50 ring-rose-100",
    iconColor: "text-rose-600",
    badge:
      "bg-rose-50 text-rose-700 ring-rose-600/20",
  },

  cancelled: {
    label: "キャンセル",
    icon: Ban,
    iconContainer:
      "bg-amber-50 ring-amber-100",
    iconColor: "text-amber-600",
    badge:
      "bg-amber-50 text-amber-700 ring-amber-600/20",
  },
};

const filterItems: Array<{
  value: LogFilter;
  label: string;
  icon: LucideIcon;
}> = [
  {
    value: "all",
    label: "すべて",
    icon: CircleDot,
  },
  {
    value: "pending",
    label: "待機中",
    icon: Clock3,
  },
  {
    value: "running",
    label: "実行中",
    icon: LoaderCircle,
  },
  {
    value: "completed",
    label: "完了",
    icon: CheckCircle2,
  },
  {
    value: "failed",
    label: "失敗",
    icon: XCircle,
  },
];

export function RecentLogCard() {
  const items = useCommandQueueStore(
    (state) => state.items,
  );

  const isProcessing =
    useCommandQueueStore(
      (state) => state.isProcessing,
    );

  const clearFinishedItems =
    useCommandQueueStore(
      (state) =>
        state.clearFinishedItems,
    );

  const [activeFilter, setActiveFilter] =
    useState<LogFilter>("all");

  const sortedItems = useMemo(
    () =>
      [...items].sort(
        (left, right) =>
          right.createdAt -
          left.createdAt,
      ),
    [items],
  );

  const filteredItems = useMemo(() => {
    if (activeFilter === "all") {
      return sortedItems;
    }

    return sortedItems.filter(
      (item) =>
        item.status === activeFilter,
    );
  }, [activeFilter, sortedItems]);

  const runningCount = useMemo(
    () =>
      items.filter(
        (item) =>
          item.status === "running",
      ).length,
    [items],
  );

  const completedCount = useMemo(
    () =>
      items.filter(
        (item) =>
          item.status === "completed",
      ).length,
    [items],
  );

  const issueCount = useMemo(
    () =>
      items.filter(
        (item) =>
          item.status === "failed" ||
          item.status ===
            "cancelled",
      ).length,
    [items],
  );

  const hasFinishedItems =
    items.some(
      (item) =>
        item.status === "completed" ||
        item.status === "failed" ||
        item.status === "cancelled",
    );

  function getFilterCount(
    filter: LogFilter,
  ): number {
    if (filter === "all") {
      return items.length;
    }

    return items.filter(
      (item) =>
        item.status === filter,
    ).length;
  }

  return (
    <section
      aria-labelledby="recent-log-title"
      className="flex min-h-[620px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
    >
      <header className="border-b border-slate-100 px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
              <History size={20} />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2
                  id="recent-log-title"
                  className="text-lg font-black tracking-tight text-slate-900"
                >
                  最近のログ
                </h2>

                {runningCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-bold text-violet-700">
                    <span className="size-1.5 animate-pulse rounded-full bg-violet-500" />

                    {runningCount}件実行中
                  </span>
                )}
              </div>

              <p className="mt-1 text-sm text-slate-500">
                コマンドキューの実行状況と履歴を表示します。
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={
              clearFinishedItems
            }
            disabled={!hasFinishedItems}
            aria-label="完了したログを消去"
            title="完了・失敗・キャンセル済みのログを消去"
            className="flex size-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-200 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Trash2 size={17} />
          </button>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {filterItems.map(
            (filter) => {
              const FilterIcon =
                filter.icon;

              const isActive =
                activeFilter ===
                filter.value;

              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() =>
                    setActiveFilter(
                      filter.value,
                    )
                  }
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-violet-200 ${
                    isActive
                      ? "bg-violet-600 text-white shadow-sm shadow-violet-600/20"
                      : "bg-slate-100 text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                  }`}
                >
                  <FilterIcon
                    size={14}
                    className={
                      filter.value ===
                        "running" &&
                      getFilterCount(
                        filter.value,
                      ) > 0
                        ? "animate-spin"
                        : undefined
                    }
                  />

                  {filter.label}

                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-white text-slate-500"
                    }`}
                  >
                    {getFilterCount(
                      filter.value,
                    )}
                  </span>
                </button>
              );
            },
          )}
        </div>
      </header>

      <div className="grid grid-cols-3 border-b border-slate-100 bg-slate-50/70">
        <SummaryItem
          value={items.length}
          label="総ログ数"
          valueClassName="text-slate-900"
          withBorder
        />

        <SummaryItem
          value={completedCount}
          label="完了"
          valueClassName="text-emerald-600"
          withBorder
        />

        <SummaryItem
          value={issueCount}
          label="要確認"
          valueClassName={
            issueCount > 0
              ? "text-amber-600"
              : "text-emerald-600"
          }
        />
      </div>

      <div className="min-h-0 flex-1 p-3">
        <AnimatePresence mode="popLayout">
          {filteredItems.length > 0 ? (
            <motion.div
              key={activeFilter}
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              className="max-h-[500px] space-y-1 overflow-y-auto pr-1"
            >
              {filteredItems.map(
                (item, index) => (
                  <QueueLogRow
                    key={item.id}
                    item={item}
                    isLatest={
                      index === 0 &&
                      activeFilter ===
                        "all"
                    }
                  />
                ),
              )}
            </motion.div>
          ) : (
            <EmptyLogState
              hasAnyItems={
                items.length > 0
              }
            />
          )}
        </AnimatePresence>
      </div>

      <footer className="border-t border-slate-100 bg-slate-50/60 px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-2 text-xs text-slate-500">
            <span className="relative flex size-2">
              {isProcessing && (
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-violet-400 opacity-60" />
              )}

              <span
                className={`relative inline-flex size-2 rounded-full ${
                  isProcessing
                    ? "bg-violet-500"
                    : "bg-slate-300"
                }`}
              />
            </span>

            <span className="truncate">
              {isProcessing
                ? "コマンドキューを処理中"
                : "コマンドキューは待機中"}
            </span>
          </div>

          <span className="shrink-0 text-xs font-semibold text-slate-400">
            リアルタイム更新
          </span>
        </div>
      </footer>
    </section>
  );
}

type QueueLogRowProps = {
  item: CommandQueueItem;
  isLatest: boolean;
};

function QueueLogRow({
  item,
  isLatest,
}: QueueLogRowProps) {
  const styles =
    statusStyles[item.status];

  const StatusIcon = styles.icon;

  const displayTime =
    item.finishedAt ??
    item.startedAt ??
    item.createdAt;

  return (
    <motion.article
      layout
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        x: -12,
      }}
      transition={{
        duration: 0.2,
      }}
      className={`relative rounded-2xl border p-4 transition ${
        isLatest
          ? "border-violet-200 bg-violet-50/50 shadow-sm shadow-violet-100"
          : "border-transparent bg-white hover:border-slate-200 hover:bg-slate-50/70"
      }`}
    >
      {isLatest && (
        <div className="absolute inset-y-4 left-0 w-1 rounded-r-full bg-violet-500" />
      )}

      <div className="flex items-start gap-3">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-2xl ring-1 ring-inset ${styles.iconContainer}`}
        >
          <StatusIcon
            size={18}
            className={`${styles.iconColor} ${
              item.status ===
              "running"
                ? "animate-spin"
                : ""
            }`}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
            <div className="min-w-0">
              <h3 className="break-words text-sm font-bold leading-5 text-slate-900">
                {item.gachaItemName ||
                  "名称未設定の実行"}
              </h3>

              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Clock3 size={12} />

                  {formatRelativeTime(
                    displayTime,
                  )}
                </span>

                <span aria-hidden="true">
                  ・
                </span>

                <span>
                  {formatCommandType(
                    item.command.type,
                  )}
                </span>
              </div>
            </div>

            <span
              className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${styles.badge}`}
            >
              {styles.label}
            </span>
          </div>

          <p className="mt-3 break-words text-sm leading-6 text-slate-600">
            {item.error ??
              item.command.value ??
              "コマンド内容はありません。"}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <MetadataBadge>
              <Zap
                size={12}
                className="text-violet-500"
              />

              遅延{" "}
              {item.command.delay ??
                0}
              ms
            </MetadataBadge>

            {item.startedAt &&
              item.finishedAt && (
                <MetadataBadge>
                  <Clock3
                    size={12}
                    className="text-slate-500"
                  />

                  処理時間{" "}
                  {Math.max(
                    0,
                    item.finishedAt -
                      item.startedAt,
                  )}
                  ms
                </MetadataBadge>
              )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

type SummaryItemProps = {
  value: number;
  label: string;
  valueClassName: string;
  withBorder?: boolean;
};

function SummaryItem({
  value,
  label,
  valueClassName,
  withBorder = false,
}: SummaryItemProps) {
  return (
    <div
      className={`px-4 py-3 text-center ${
        withBorder
          ? "border-r border-slate-100"
          : ""
      }`}
    >
      <p
        className={`text-lg font-black ${valueClassName}`}
      >
        {value}
      </p>

      <p className="mt-0.5 text-[11px] font-semibold text-slate-500">
        {label}
      </p>
    </div>
  );
}

function MetadataBadge({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 rounded-xl bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600">
      {children}
    </span>
  );
}

function EmptyLogState({
  hasAnyItems,
}: {
  hasAnyItems: boolean;
}) {
  return (
    <motion.div
      key="empty-log"
      initial={{
        opacity: 0,
        scale: 0.98,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      className="flex min-h-[380px] flex-col items-center justify-center px-6 text-center"
    >
      <div className="flex size-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-400">
        {hasAnyItems ? (
          <AlertTriangle size={28} />
        ) : (
          <History size={28} />
        )}
      </div>

      <h3 className="mt-5 text-base font-black text-slate-900">
        {hasAnyItems
          ? "この条件のログはありません"
          : "まだログはありません"}
      </h3>

      <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
        {hasAnyItems
          ? "別のステータスを選択すると、ほかの実行履歴を確認できます。"
          : "コマンドがキューへ追加されると、実行状況と結果がここに表示されます。"}
      </p>
    </motion.div>
  );
}

function formatCommandType(
  type: string,
): string {
  switch (type) {
    case "minecraft":
      return "Minecraft";

    case "wait":
      return "待機";

    case "overlay":
      return "オーバーレイ";

    default:
      return type;
  }
}

function formatRelativeTime(
  timestamp: number,
): string {
  const elapsed =
    Date.now() - timestamp;

  if (elapsed < 0) {
    return formatDate(timestamp);
  }

  const seconds = Math.floor(
    elapsed / 1000,
  );

  if (seconds < 10) {
    return "たった今";
  }

  if (seconds < 60) {
    return `${seconds}秒前`;
  }

  const minutes = Math.floor(
    seconds / 60,
  );

  if (minutes < 60) {
    return `${minutes}分前`;
  }

  const hours = Math.floor(
    minutes / 60,
  );

  if (hours < 24) {
    return `${hours}時間前`;
  }

  const days = Math.floor(
    hours / 24,
  );

  if (days < 7) {
    return `${days}日前`;
  }

  return formatDate(timestamp);
}

function formatDate(
  timestamp: number,
): string {
  return new Intl.DateTimeFormat(
    "ja-JP",
    {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(new Date(timestamp));
}