import {
  Clock3,
  History,
  RotateCcw,
  Trash2,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  executionHistoryRepository,
} from "@/features/history/repository/ExecutionHistoryRepository";

import {
  EXECUTION_HISTORY_UPDATED_EVENT,
} from "@/features/history/runtime/ExecutionHistoryRuntime";

import type {
  ExecutionHistoryEntry,
  ExecutionHistoryMode,
} from "@/features/history/types/ExecutionHistory";

function formatDateTime(
  timestamp: number,
): string {
  if (!Number.isFinite(timestamp)) {
    return "-";
  }

  return new Intl.DateTimeFormat(
    "ja-JP",
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    },
  ).format(new Date(timestamp));
}

function getModeLabel(
  mode: ExecutionHistoryMode,
): string {
  switch (mode) {
    case "effect":
      return "エフェクト";

    case "legacy-commands":
      return "旧コマンド";

    case "none":
      return "実行なし";

    default:
      return mode satisfies never;
  }
}

function getModeClassName(
  mode: ExecutionHistoryMode,
): string {
  switch (mode) {
    case "effect":
      return [
        "border-violet-200",
        "bg-violet-50",
        "text-violet-700",
      ].join(" ");

    case "legacy-commands":
      return [
        "border-amber-200",
        "bg-amber-50",
        "text-amber-700",
      ].join(" ");

    case "none":
      return [
        "border-slate-200",
        "bg-slate-100",
        "text-slate-600",
      ].join(" ");

    default:
      return mode satisfies never;
  }
}

export function ExecutionHistoryPage() {
  const [
    entries,
    setEntries,
  ] = useState<
    ExecutionHistoryEntry[]
  >([]);

  const loadEntries =
    useCallback(() => {
      setEntries(
        executionHistoryRepository.load(),
      );
    }, []);

useEffect(() => {
  loadEntries();

  const handleHistoryUpdated =
    (): void => {
      loadEntries();
    };

  window.addEventListener(
    EXECUTION_HISTORY_UPDATED_EVENT,
    handleHistoryUpdated,
  );

  return () => {
    window.removeEventListener(
      EXECUTION_HISTORY_UPDATED_EVENT,
      handleHistoryUpdated,
    );
  };
}, [loadEntries]);

  const handleRemove = (
    entry: ExecutionHistoryEntry,
  ): void => {
    const shouldRemove =
      window.confirm(
        [
          `「${entry.gachaItemName}」の履歴を削除しますか？`,
          "",
          "この操作は取り消せません。",
        ].join("\n"),
      );

    if (!shouldRemove) {
      return;
    }

    executionHistoryRepository.remove(
      entry.id,
    );

    loadEntries();
  };

  const handleClear = (): void => {
    if (entries.length === 0) {
      return;
    }

    const shouldClear =
      window.confirm(
        [
          "すべての実行履歴を削除しますか？",
          "",
          `${entries.length}件の履歴が削除されます。`,
          "この操作は取り消せません。",
        ].join("\n"),
      );

    if (!shouldClear) {
      return;
    }

    executionHistoryRepository.clear();

    loadEntries();
  };

  return (
    <main className="min-h-full p-4 lg:p-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-950">
              実行履歴
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              ガチャの抽選結果と実行状況を確認します。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={loadEntries}
              className={[
                "inline-flex min-h-10 items-center",
                "justify-center gap-2 rounded-xl",
                "border border-slate-200 bg-white",
                "px-4 py-2 text-sm font-bold",
                "text-slate-700 shadow-sm",
                "transition-colors",
                "hover:bg-slate-50",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-violet-400",
                "focus-visible:ring-offset-2",
              ].join(" ")}
            >
              <RotateCcw
                size={16}
                aria-hidden="true"
              />

              更新
            </button>

            <button
              type="button"
              onClick={handleClear}
              disabled={
                entries.length === 0
              }
              className={[
                "inline-flex min-h-10 items-center",
                "justify-center gap-2 rounded-xl",
                "border border-red-200 bg-white",
                "px-4 py-2 text-sm font-bold",
                "text-red-600 shadow-sm",
                "transition-colors",
                "hover:bg-red-50",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-red-400",
                "focus-visible:ring-offset-2",
                "disabled:cursor-not-allowed",
                "disabled:opacity-40",
              ].join(" ")}
            >
              <Trash2
                size={16}
                aria-hidden="true"
              />

              すべて削除
            </button>
          </div>
        </div>

        <section className="mb-4 grid gap-3 sm:grid-cols-3">
          <SummaryCard
            label="保存件数"
            value={`${entries.length}件`}
          />

          <SummaryCard
            label="成功"
            value={`${
              entries.filter(
                (entry) =>
                  entry.status ===
                  "success",
              ).length
            }件`}
          />

          <SummaryCard
            label="失敗"
            value={`${
              entries.filter(
                (entry) =>
                  entry.status ===
                  "failed",
              ).length
            }件`}
          />
        </section>

        {entries.length === 0 ? (
          <EmptyHistory />
        ) : (
          <HistoryTable
            entries={entries}
            onRemove={handleRemove}
          />
        )}
      </div>
    </main>
  );
}

type SummaryCardProps = {
  label: string;
  value: string;
};

function SummaryCard({
  label,
  value,
}: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <p className="text-xs font-bold text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-xl font-black text-slate-950">
        {value}
      </p>
    </div>
  );
}

function EmptyHistory() {
  return (
    <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
        <History
          size={26}
          aria-hidden="true"
        />
      </div>

      <h2 className="mt-4 text-base font-black text-slate-900">
        実行履歴はまだありません
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        発動条件からガチャが実行されると、
        <br />
        ここに抽選結果が保存されます。
      </p>
    </section>
  );
}

type HistoryTableProps = {
  entries: ExecutionHistoryEntry[];

  onRemove: (
    entry: ExecutionHistoryEntry,
  ) => void;
};

function HistoryTable({
  entries,
  onRemove,
}: HistoryTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <TableHeader>
                実行日時
              </TableHeader>

              <TableHeader>
                発動条件
              </TableHeader>

              <TableHeader>
                景品
              </TableHeader>

              <TableHeader>
                実行方式
              </TableHeader>

              <TableHeader>
                コマンド
              </TableHeader>

              <TableHeader>
                状態
              </TableHeader>

              <TableHeader align="right">
                操作
              </TableHeader>
            </tr>
          </thead>

          <tbody>
            {entries.map((entry) => (
              <tr
                key={entry.id}
                className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70"
              >
                <td className="whitespace-nowrap px-4 py-4 align-top">
                  <div className="flex items-start gap-2">
                    <Clock3
                      size={15}
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-slate-400"
                    />

                    <div>
                      <p className="text-sm font-bold text-slate-700">
                        {formatDateTime(
                          entry.executedAt,
                        )}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        抽選：
                        {formatDateTime(
                          entry.drawnAt,
                        )}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4 align-top">
                  <p className="text-sm font-bold text-slate-800">
                    {entry.triggerName ||
                      "手動・不明"}
                  </p>

                  {entry.triggerId && (
                    <p className="mt-1 max-w-48 truncate font-mono text-[11px] text-slate-400">
                      {entry.triggerId}
                    </p>
                  )}
                </td>

                <td className="px-4 py-4 align-top">
                  <p className="text-sm font-black text-slate-950">
                    {entry.gachaItemName}
                  </p>

                  <p className="mt-1 max-w-48 truncate font-mono text-[11px] text-slate-400">
                    {entry.gachaItemId}
                  </p>
                </td>

                <td className="px-4 py-4 align-top">
                  <span
                    className={[
                      "inline-flex rounded-full",
                      "border px-2.5 py-1",
                      "text-xs font-black",
                      getModeClassName(
                        entry.mode,
                      ),
                    ].join(" ")}
                  >
                    {getModeLabel(
                      entry.mode,
                    )}
                  </span>
                </td>

                <td className="px-4 py-4 align-top">
                  <p className="text-sm font-black text-slate-800">
                    {entry.commandCount}
                  </p>
                </td>

                <td className="px-4 py-4 align-top">
                  <ExecutionStatusBadge
                    entry={entry}
                  />
                </td>

                <td className="px-4 py-4 text-right align-top">
                  <button
                    type="button"
                    onClick={() =>
                      onRemove(entry)
                    }
                    aria-label={`${entry.gachaItemName}の履歴を削除`}
                    title="履歴を削除"
                    className={[
                      "inline-flex size-9 items-center",
                      "justify-center rounded-xl",
                      "text-slate-400",
                      "transition-colors",
                      "hover:bg-red-50",
                      "hover:text-red-600",
                      "focus-visible:outline-none",
                      "focus-visible:ring-2",
                      "focus-visible:ring-red-400",
                    ].join(" ")}
                  >
                    <Trash2
                      size={17}
                      aria-hidden="true"
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

type TableHeaderProps = {
  children: React.ReactNode;
  align?: "left" | "right";
};

function TableHeader({
  children,
  align = "left",
}: TableHeaderProps) {
  return (
    <th
      className={[
        "px-4 py-3 text-xs",
        "font-black tracking-wide",
        "text-slate-500",
        align === "right"
          ? "text-right"
          : "text-left",
      ].join(" ")}
    >
      {children}
    </th>
  );
}

type ExecutionStatusBadgeProps = {
  entry: ExecutionHistoryEntry;
};

function ExecutionStatusBadge({
  entry,
}: ExecutionStatusBadgeProps) {
  if (entry.status === "success") {
    return (
      <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700">
        成功
      </span>
    );
  }

  return (
    <div>
      <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-black text-red-700">
        失敗
      </span>

      {entry.errorMessage && (
        <p
          title={entry.errorMessage}
          className="mt-1 max-w-44 truncate text-xs text-red-500"
        >
          {entry.errorMessage}
        </p>
      )}
    </div>
  );
}