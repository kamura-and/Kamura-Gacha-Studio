import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Clock3,
  Dices,
  Gift,
  History,
  Info,
  Radio,
  RefreshCw,
  Server,
  Sparkles,
  Trash2,
  XCircle,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

type LogCategory = "gift" | "gacha" | "system";

type LogStatus =
  | "success"
  | "processing"
  | "warning"
  | "error"
  | "info";

type LogItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  category: LogCategory;
  status: LogStatus;
  metadata?: string;
  isNew?: boolean;
};

type LogFilter = "all" | LogCategory;

type StatusStyle = {
  icon: LucideIcon;
  iconContainer: string;
  iconColor: string;
  badge: string;
  label: string;
  timeline: string;
};

const initialLogs: LogItem[] = [
  {
    id: "log-001",
    title: "ガチャ結果：ゾンビレイン",
    description:
      "Minecraftへゾンビ召喚コマンドを送信しました。",
    time: "たった今",
    category: "gacha",
    status: "success",
    metadata: "Epic・31 ms",
    isNew: true,
  },
  {
    id: "log-002",
    title: "ギフトを受信しました",
    description:
      "視聴者「kamura_fan」さんからバラを1個受信しました。",
    time: "12秒前",
    category: "gift",
    status: "success",
    metadata: "Rose × 1",
    isNew: true,
  },
  {
    id: "log-003",
    title: "ガチャ抽選を開始",
    description:
      "ギフト設定に基づいて抽選処理を開始しました。",
    time: "13秒前",
    category: "gacha",
    status: "processing",
    metadata: "抽選ID：GACHA-0248",
  },
  {
    id: "log-004",
    title: "オーバーレイ演出を再生",
    description:
      "OBS Browser SourceへEpic演出を送信しました。",
    time: "1分前",
    category: "system",
    status: "success",
    metadata: "Overlay・Epic",
  },
  {
    id: "log-005",
    title: "Minecraftへ再接続しました",
    description:
      "ゲームサーバーとの接続が正常に復旧しました。",
    time: "3分前",
    category: "system",
    status: "success",
    metadata: "Paper 1.21",
  },
  {
    id: "log-006",
    title: "コマンドの応答が遅延しています",
    description:
      "通常より処理に時間がかかっています。接続状態を確認してください。",
    time: "8分前",
    category: "system",
    status: "warning",
    metadata: "応答時間：842 ms",
  },
  {
    id: "log-007",
    title: "TikTok LIVEへ接続",
    description:
      "ギフトイベントの受信を開始しました。",
    time: "15分前",
    category: "system",
    status: "info",
    metadata: "接続済み",
  },
  {
    id: "log-008",
    title: "ギフトイベントを処理できませんでした",
    description:
      "対応するガチャ設定が見つからなかったため、実行を中止しました。",
    time: "22分前",
    category: "gift",
    status: "error",
    metadata: "未設定ギフト",
  },
];

const statusStyles: Record<LogStatus, StatusStyle> = {
  success: {
    icon: CheckCircle2,
    iconContainer: "bg-emerald-50 ring-emerald-100",
    iconColor: "text-emerald-600",
    badge:
      "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    label: "成功",
    timeline: "bg-emerald-400",
  },
  processing: {
    icon: RefreshCw,
    iconContainer: "bg-violet-50 ring-violet-100",
    iconColor: "text-violet-600",
    badge:
      "bg-violet-50 text-violet-700 ring-violet-600/20",
    label: "処理中",
    timeline: "bg-violet-400",
  },
  warning: {
    icon: AlertTriangle,
    iconContainer: "bg-amber-50 ring-amber-100",
    iconColor: "text-amber-600",
    badge:
      "bg-amber-50 text-amber-700 ring-amber-600/20",
    label: "注意",
    timeline: "bg-amber-400",
  },
  error: {
    icon: XCircle,
    iconContainer: "bg-rose-50 ring-rose-100",
    iconColor: "text-rose-600",
    badge: "bg-rose-50 text-rose-700 ring-rose-600/20",
    label: "エラー",
    timeline: "bg-rose-400",
  },
  info: {
    icon: Info,
    iconContainer: "bg-sky-50 ring-sky-100",
    iconColor: "text-sky-600",
    badge: "bg-sky-50 text-sky-700 ring-sky-600/20",
    label: "情報",
    timeline: "bg-sky-400",
  },
};

const categoryLabels: Record<LogCategory, string> = {
  gift: "ギフト",
  gacha: "ガチャ",
  system: "システム",
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
    value: "gift",
    label: "ギフト",
    icon: Gift,
  },
  {
    value: "gacha",
    label: "ガチャ",
    icon: Dices,
  },
  {
    value: "system",
    label: "システム",
    icon: Server,
  },
];

function getCategoryIcon(category: LogCategory): LucideIcon {
  switch (category) {
    case "gift":
      return Gift;

    case "gacha":
      return Sparkles;

    case "system":
      return Radio;
  }
}

function LogRow({
  log,
  isLatest,
}: {
  log: LogItem;
  isLatest: boolean;
}) {
  const styles = statusStyles[log.status];
  const StatusIcon = styles.icon;
  const CategoryIcon = getCategoryIcon(log.category);

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
      className={`group relative rounded-2xl border p-4 transition ${
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
          className={`relative flex size-10 shrink-0 items-center justify-center rounded-2xl ring-1 ring-inset ${styles.iconContainer}`}
        >
          <StatusIcon
            size={18}
            className={`${styles.iconColor} ${
              log.status === "processing"
                ? "animate-spin"
                : ""
            }`}
          />

          <div className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-white">
            <CategoryIcon size={10} />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-bold leading-5 text-slate-900">
                  {log.title}
                </h3>

                {log.isNew && (
                  <span className="rounded-full bg-violet-600 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-white">
                    New
                  </span>
                )}
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Clock3 size={12} />
                  {log.time}
                </span>

                <span aria-hidden="true">・</span>

                <span>{categoryLabels[log.category]}</span>
              </div>
            </div>

            <span
              className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${styles.badge}`}
            >
              {styles.label}
            </span>
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            {log.description}
          </p>

          {log.metadata && (
            <div className="mt-3 inline-flex max-w-full items-center gap-1.5 rounded-xl bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600">
              <Zap
                size={12}
                className="shrink-0 text-violet-500"
              />

              <span className="truncate">
                {log.metadata}
              </span>
            </div>
          )}
        </div>

        <ChevronRight
          size={17}
          className="mt-2 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-violet-500"
        />
      </div>
    </motion.article>
  );
}

export function RecentLogCard() {
  const [logs, setLogs] = useState<LogItem[]>(initialLogs);
  const [activeFilter, setActiveFilter] =
    useState<LogFilter>("all");

  const filteredLogs = useMemo(() => {
    if (activeFilter === "all") {
      return logs;
    }

    return logs.filter(
      (log) => log.category === activeFilter,
    );
  }, [activeFilter, logs]);

  const newLogCount = useMemo(
    () => logs.filter((log) => log.isNew).length,
    [logs],
  );

  const errorCount = useMemo(
    () =>
      logs.filter(
        (log) =>
          log.status === "error" ||
          log.status === "warning",
      ).length,
    [logs],
  );

  const handleClearLogs = () => {
    setLogs([]);
  };

  const handleRestoreLogs = () => {
    setLogs(initialLogs);
    setActiveFilter("all");
  };

  return (
    <section
      aria-labelledby="recent-log-title"
      className="flex min-h-[620px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="border-b border-slate-100 px-6 py-5">
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

                {newLogCount > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-bold text-violet-700">
                    <span className="size-1.5 animate-pulse rounded-full bg-violet-500" />
                    {newLogCount}件の新着
                  </span>
                )}
              </div>

              <p className="mt-1 text-sm text-slate-500">
                ギフト受信からコマンド実行までの履歴です。
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClearLogs}
            disabled={logs.length === 0}
            aria-label="ログをすべて消去"
            className="flex size-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-200 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Trash2 size={17} />
          </button>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {filterItems.map((filter) => {
            const FilterIcon = filter.icon;
            const isActive =
              activeFilter === filter.value;

            const itemCount =
              filter.value === "all"
                ? logs.length
                : logs.filter(
                    (log) =>
                      log.category === filter.value,
                  ).length;

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() =>
                  setActiveFilter(filter.value)
                }
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-violet-200 ${
                  isActive
                    ? "bg-violet-600 text-white shadow-sm shadow-violet-600/20"
                    : "bg-slate-100 text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                }`}
              >
                <FilterIcon size={14} />

                {filter.label}

                <span
                  className={`rounded-md px-1.5 py-0.5 text-[10px] ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-white text-slate-500"
                  }`}
                >
                  {itemCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 border-b border-slate-100 bg-slate-50/70">
        <div className="border-r border-slate-100 px-4 py-3 text-center">
          <p className="text-lg font-black text-slate-900">
            {logs.length}
          </p>

          <p className="mt-0.5 text-[11px] font-semibold text-slate-500">
            総ログ数
          </p>
        </div>

        <div className="border-r border-slate-100 px-4 py-3 text-center">
          <p className="text-lg font-black text-violet-600">
            {newLogCount}
          </p>

          <p className="mt-0.5 text-[11px] font-semibold text-slate-500">
            新着
          </p>
        </div>

        <div className="px-4 py-3 text-center">
          <p
            className={`text-lg font-black ${
              errorCount > 0
                ? "text-amber-600"
                : "text-emerald-600"
            }`}
          >
            {errorCount}
          </p>

          <p className="mt-0.5 text-[11px] font-semibold text-slate-500">
            要確認
          </p>
        </div>
      </div>

      <div className="min-h-0 flex-1 p-3">
        <AnimatePresence mode="popLayout">
          {filteredLogs.length > 0 ? (
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-h-[500px] space-y-1 overflow-y-auto pr-1"
            >
              {filteredLogs.map((log, index) => (
                <LogRow
                  key={log.id}
                  log={log}
                  isLatest={
                    index === 0 &&
                    activeFilter === "all"
                  }
                />
              ))}
            </motion.div>
          ) : (
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
                <History size={28} />
              </div>

              <h3 className="mt-5 text-base font-black text-slate-900">
                表示できるログがありません
              </h3>

              <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                イベントが発生すると、ギフトやガチャの履歴がここに表示されます。
              </p>

              {logs.length === 0 && (
                <button
                  type="button"
                  onClick={handleRestoreLogs}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-100 px-4 py-2.5 text-sm font-bold text-violet-700 transition hover:bg-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-200"
                >
                  <RefreshCw size={15} />
                  サンプルログを復元
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-2 text-xs text-slate-500">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />

              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>

            <span className="truncate">
              リアルタイムログを監視中
            </span>
          </div>

          <span className="shrink-0 text-xs font-semibold text-slate-400">
            自動更新
          </span>
        </div>
      </div>
    </section>
  );
}