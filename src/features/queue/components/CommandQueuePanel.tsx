import type { ReactNode } from "react";

import {
  Ban,
  CheckCircle2,
  Clock3,
  Code2,
  Command,
  Layers3,
  ListChecks,
  LoaderCircle,
  MessageCircle,
  Monitor,
  Trash2,
  Volume2,
  XCircle,
} from "lucide-react";

import type { GeneratedActionCommand } from "@/core/actions";

import { useCommandQueueStore } from "../store/commandQueueStore";
import type {
  CommandQueueItem,
  QueueItemStatus,
} from "../types/commandQueue";

type StatusDefinition = {
  label: string;
  icon: ReactNode;
  className: string;
};

const finishedStatuses = new Set<QueueItemStatus>([
  "completed",
  "failed",
  "cancelled",
]);

function getStatusDefinition(
  status: QueueItemStatus,
): StatusDefinition {
  switch (status) {
    case "pending":
      return {
        label: "待機中",
        icon: <Clock3 size={13} />,
        className:
          "border-amber-200 bg-amber-50 text-amber-700",
      };

    case "running":
      return {
        label: "実行中",
        icon: (
          <LoaderCircle
            size={13}
            className="animate-spin"
          />
        ),
        className:
          "border-violet-200 bg-violet-50 text-violet-700",
      };

    case "completed":
      return {
        label: "完了",
        icon: <CheckCircle2 size={13} />,
        className:
          "border-emerald-200 bg-emerald-50 text-emerald-700",
      };

    case "failed":
      return {
        label: "失敗",
        icon: <XCircle size={13} />,
        className:
          "border-rose-200 bg-rose-50 text-rose-700",
      };

    case "cancelled":
      return {
        label: "キャンセル",
        icon: <Ban size={13} />,
        className:
          "border-slate-200 bg-slate-100 text-slate-600",
      };
  }
}

function getCommandIcon(
  type: GeneratedActionCommand["type"],
): ReactNode {
  switch (type) {
    case "minecraft":
      return <Command size={17} />;

    case "overlay":
      return <Layers3 size={17} />;

    case "sound":
      return <Volume2 size={17} />;

    case "discord":
      return <MessageCircle size={17} />;

    case "obs":
      return <Monitor size={17} />;

    case "wait":
      return <Clock3 size={17} />;

    default:
      return <Code2 size={17} />;
  }
}

function getCommandLabel(
  type: GeneratedActionCommand["type"],
): string {
  switch (type) {
    case "minecraft":
      return "Minecraft";

    case "overlay":
      return "オーバーレイ";

    case "sound":
      return "サウンド";

    case "discord":
      return "Discord";

    case "obs":
      return "OBS";

    case "wait":
      return "待機";

    default:
      return String(type);
  }
}

function getCommandValue(
  command: GeneratedActionCommand,
): string {
  if (command.type === "wait") {
    return `${command.delay ?? 0}ms 待機`;
  }

  const value = command.value.trim();

  return value || "内容なし";
}

function formatTime(
  timestamp: number | undefined,
): string {
  if (timestamp === undefined) {
    return "—";
  }

  return new Intl.DateTimeFormat("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(timestamp));
}

function formatDuration(
  item: CommandQueueItem,
): string {
  if (item.startedAt === undefined) {
    return "—";
  }

  const endTime =
    item.finishedAt ?? Date.now();

  const duration = Math.max(
    0,
    endTime - item.startedAt,
  );

  if (duration < 1000) {
    return `${duration}ms`;
  }

  return `${(duration / 1000).toFixed(2)}秒`;
}

function QueueStatusBadge({
  status,
}: {
  status: QueueItemStatus;
}) {
  const definition =
    getStatusDefinition(status);

  return (
    <span
      className={[
        "inline-flex shrink-0 items-center gap-1.5",
        "rounded-full border px-2.5 py-1",
        "text-[11px] font-semibold",
        definition.className,
      ].join(" ")}
    >
      {definition.icon}
      {definition.label}
    </span>
  );
}

function QueueSummary({
  label,
  value,
  className,
}: {
  label: string;
  value: number;
  className: string;
}) {
  return (
    <div
      className={[
        "rounded-xl px-3 py-2.5 text-center",
        className,
      ].join(" ")}
    >
      <p className="text-lg font-bold">
        {value}
      </p>

      <p className="text-[11px] font-semibold">
        {label}
      </p>
    </div>
  );
}

function QueueItemCard({
  item,
  index,
  isCurrent,
}: {
  item: CommandQueueItem;
  index: number;
  isCurrent: boolean;
}) {
  const cardClassName = isCurrent
    ? "border-violet-300 ring-4 ring-violet-100"
    : item.status === "failed"
      ? "border-rose-200"
      : "border-slate-200";

  return (
    <article
      className={[
        "rounded-2xl border bg-white p-4 shadow-sm",
        "transition",
        cardClassName,
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={[
              "flex h-10 w-10 shrink-0 items-center",
              "justify-center rounded-xl",
              isCurrent
                ? "bg-violet-100 text-violet-700"
                : "bg-slate-100 text-slate-600",
            ].join(" ")}
          >
            {getCommandIcon(
              item.command.type,
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-slate-900">
                {getCommandLabel(
                  item.command.type,
                )}
              </p>

              <span className="text-[11px] font-medium text-slate-400">
                #{index + 1}
              </span>
            </div>

            <p className="mt-1 truncate text-xs text-slate-500">
              {item.gachaItemName}
            </p>
          </div>
        </div>

        <QueueStatusBadge
          status={item.status}
        />
      </div>

      <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
        <code className="block whitespace-pre-wrap break-all text-xs leading-5 text-slate-700">
          {getCommandValue(item.command)}
        </code>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
        <div>
          <dt className="text-slate-400">
            登録時刻
          </dt>

          <dd className="mt-0.5 font-medium text-slate-600">
            {formatTime(item.createdAt)}
          </dd>
        </div>

        <div>
          <dt className="text-slate-400">
            実行開始
          </dt>

          <dd className="mt-0.5 font-medium text-slate-600">
            {formatTime(item.startedAt)}
          </dd>
        </div>

        {item.startedAt !== undefined && (
          <div>
            <dt className="text-slate-400">
              処理時間
            </dt>

            <dd className="mt-0.5 font-medium text-slate-600">
              {formatDuration(item)}
            </dd>
          </div>
        )}

        {item.command.type !== "wait" &&
          (item.command.delay ?? 0) > 0 && (
            <div>
              <dt className="text-slate-400">
                実行前待機
              </dt>

              <dd className="mt-0.5 font-medium text-slate-600">
                {item.command.delay ?? 0}ms
              </dd>
            </div>
          )}
      </dl>

      {item.error && (
        <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5">
          <p className="flex items-start gap-2 text-xs font-medium leading-5 text-rose-700">
            <XCircle
              size={14}
              className="mt-0.5 shrink-0"
            />

            <span>{item.error}</span>
          </p>
        </div>
      )}
    </article>
  );
}

function QueueEmptyState() {
  return (
    <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white px-5 py-14 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <ListChecks size={24} />
      </div>

      <p className="mt-4 text-sm font-semibold text-slate-600">
        キューは空です
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-400">
        Effect Builderで「実行」を押すと、
        <br />
        ここにコマンドが表示されます。
      </p>
    </div>
  );
}

export function CommandQueuePanel() {
  const items = useCommandQueueStore(
    (state) => state.items,
  );

  const isProcessing =
    useCommandQueueStore(
      (state) => state.isProcessing,
    );

  const currentItemId =
    useCommandQueueStore(
      (state) => state.currentItemId,
    );

  const cancelPendingItems =
    useCommandQueueStore(
      (state) => state.cancelPendingItems,
    );

  const clearFinishedItems =
    useCommandQueueStore(
      (state) => state.clearFinishedItems,
    );

  const clearAllItems =
    useCommandQueueStore(
      (state) => state.clearAllItems,
    );

  const pendingCount = items.filter(
    (item) => item.status === "pending",
  ).length;

  const runningCount = items.filter(
    (item) => item.status === "running",
  ).length;

  const finishedCount = items.filter(
    (item) =>
      finishedStatuses.has(item.status),
  ).length;

  const handleCancelPending = () => {
    if (pendingCount === 0) {
      return;
    }

    const shouldCancel = window.confirm(
      `${pendingCount}件の待機中コマンドをキャンセルしますか？\n現在実行中のコマンドは継続されます。`,
    );

    if (!shouldCancel) {
      return;
    }

    cancelPendingItems();
  };

  const handleClearFinished = () => {
    if (finishedCount === 0) {
      return;
    }

    clearFinishedItems();
  };

  const handleClearAll = () => {
    const removableCount =
      items.length - runningCount;

    if (removableCount === 0) {
      return;
    }

    const shouldClear = window.confirm(
      `${removableCount}件のキュー項目を削除しますか？\n現在実行中の項目は削除されません。`,
    );

    if (!shouldClear) {
      return;
    }

    clearAllItems();
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-200 px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              <ListChecks size={20} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold text-slate-900">
                  コマンドキュー
                </h2>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                  {items.length}件
                </span>
              </div>

              <p className="mt-0.5 text-xs text-slate-500">
                登録されたコマンドを順番に実行します
              </p>
            </div>
          </div>

          <div
            className={[
              "inline-flex items-center gap-2 rounded-full",
              "px-3 py-1.5 text-xs font-semibold",
              isProcessing
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-500",
            ].join(" ")}
          >
            {isProcessing ? (
              <>
                <LoaderCircle
                  size={13}
                  className="animate-spin"
                />
                実行中
              </>
            ) : (
              <>
                <Clock3 size={13} />
                停止中
              </>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <QueueSummary
            label="実行中"
            value={runningCount}
            className="bg-violet-50 text-violet-700"
          />

          <QueueSummary
            label="待機中"
            value={pendingCount}
            className="bg-amber-50 text-amber-700"
          />

          <QueueSummary
            label="終了"
            value={finishedCount}
            className="bg-emerald-50 text-emerald-700"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleCancelPending}
            disabled={pendingCount === 0}
            className={[
              "inline-flex items-center gap-2 rounded-lg",
              "border border-amber-200 bg-amber-50",
              "px-3 py-2 text-xs font-semibold text-amber-700",
              "transition hover:bg-amber-100",
              "disabled:cursor-not-allowed disabled:opacity-40",
            ].join(" ")}
          >
            <Ban size={14} />
            待機中をキャンセル
          </button>

          <button
            type="button"
            onClick={handleClearFinished}
            disabled={finishedCount === 0}
            className={[
              "inline-flex items-center gap-2 rounded-lg",
              "border border-slate-200 bg-white",
              "px-3 py-2 text-xs font-semibold text-slate-600",
              "transition hover:bg-slate-50",
              "disabled:cursor-not-allowed disabled:opacity-40",
            ].join(" ")}
          >
            <CheckCircle2 size={14} />
            終了済みを削除
          </button>

          <button
            type="button"
            onClick={handleClearAll}
            disabled={
              items.length === 0 ||
              items.length === runningCount
            }
            className={[
              "inline-flex items-center gap-2 rounded-lg",
              "border border-slate-200 bg-white",
              "px-3 py-2 text-xs font-semibold text-slate-600",
              "transition",
              "hover:border-rose-200 hover:bg-rose-50",
              "hover:text-rose-600",
              "disabled:cursor-not-allowed disabled:opacity-40",
            ].join(" ")}
          >
            <Trash2 size={14} />
            全件クリア
          </button>
        </div>
      </header>

      <div className="max-h-[calc(100vh-280px)] min-h-[280px] overflow-y-auto bg-slate-50 p-4">
        {items.length === 0 ? (
          <QueueEmptyState />
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <QueueItemCard
                key={item.id}
                item={item}
                index={index}
                isCurrent={
                  item.id === currentItemId
                }
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}