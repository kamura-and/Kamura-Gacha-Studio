import type { LucideIcon } from "lucide-react";
import {
  Activity,
  CheckCircle2,
  Clock3,
  Gamepad2,
  Radio,
  RefreshCw,
  Wifi,
} from "lucide-react";

type ConnectionStatus = "online" | "waiting" | "offline";

type ConnectionItemProps = {
  title: string;
  description: string;
  detail: string;
  status: ConnectionStatus;
  statusLabel: string;
  icon: LucideIcon;
};

const statusStyles: Record<
  ConnectionStatus,
  {
    dot: string;
    badge: string;
    icon: string;
  }
> = {
  online: {
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    icon: "bg-emerald-50 text-emerald-600",
  },
  waiting: {
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 ring-amber-600/20",
    icon: "bg-amber-50 text-amber-600",
  },
  offline: {
    dot: "bg-rose-500",
    badge: "bg-rose-50 text-rose-700 ring-rose-600/20",
    icon: "bg-rose-50 text-rose-600",
  },
};

function ConnectionItem({
  title,
  description,
  detail,
  status,
  statusLabel,
  icon: Icon,
}: ConnectionItemProps) {
  const styles = statusStyles[status];

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/60">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300 to-transparent opacity-0 transition group-hover:opacity-100" />

      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <div
            className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${styles.icon}`}
          >
            <Icon size={22} strokeWidth={2} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-slate-900">
              {title}
            </h3>

            <p className="mt-1 text-sm font-medium text-slate-600">
              {description}
            </p>
          </div>
        </div>

        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${styles.badge}`}
        >
          <span
            className={`size-2 rounded-full ${styles.dot} ${
              status === "online" ? "animate-pulse" : ""
            }`}
          />
          {statusLabel}
        </span>
      </div>

      <div className="mt-5 flex items-center gap-2 rounded-2xl bg-slate-50 px-3.5 py-3 text-sm text-slate-500">
        <Clock3 size={15} className="shrink-0 text-slate-400" />

        <span className="truncate">{detail}</span>
      </div>
    </article>
  );
}

export function ConnectionStatusSection() {
  const connectionItems: ConnectionItemProps[] = [
    {
      title: "TikTok LIVE",
      description: "ギフトイベントを受信しています",
      detail: "最後の受信：3秒前",
      status: "online",
      statusLabel: "接続中",
      icon: Radio,
    },
    {
      title: "Minecraft",
      description: "ゲームサーバーと接続済みです",
      detail: "サーバー：Paper 1.21",
      status: "online",
      statusLabel: "接続済み",
      icon: Gamepad2,
    },
    {
      title: "配信オーバーレイ",
      description: "OBS Browser Sourceで待機中です",
      detail: "最終更新：たった今",
      status: "waiting",
      statusLabel: "待機中",
      icon: Wifi,
    },
  ];

  const hasOfflineConnection = connectionItems.some(
    (item) => item.status === "offline",
  );

  const hasWaitingConnection = connectionItems.some(
    (item) => item.status === "waiting",
  );

  const overallStatus = hasOfflineConnection
    ? {
        label: "要確認",
        message: "接続できていないサービスがあります。",
        icon: Activity,
        className: "bg-rose-50 text-rose-700 ring-rose-600/20",
      }
    : hasWaitingConnection
      ? {
          label: "一部待機中",
          message: "接続済みのサービスは正常に稼働しています。",
          icon: RefreshCw,
          className: "bg-amber-50 text-amber-700 ring-amber-600/20",
        }
      : {
          label: "すべて正常",
          message: "すべてのサービスが正常に稼働しています。",
          icon: CheckCircle2,
          className: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
        };

  const OverallStatusIcon = overallStatus.icon;

  return (
    <section
      aria-labelledby="connection-status-title"
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              <Activity size={18} />
            </div>

            <h2
              id="connection-status-title"
              className="text-lg font-bold tracking-tight text-slate-900"
            >
              システム接続状況
            </h2>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            TikTok LIVE、Minecraft、配信オーバーレイの稼働状態です。
          </p>
        </div>

        <div
          className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ring-1 ring-inset ${overallStatus.className}`}
        >
          <OverallStatusIcon size={14} />
          {overallStatus.label}
        </div>
      </div>

      <div className="p-6">
        <div className="grid gap-4 lg:grid-cols-3">
          {connectionItems.map((item) => (
            <ConnectionItem key={item.title} {...item} />
          ))}
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-violet-100 bg-violet-50/60 px-4 py-3">
          <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm">
            <CheckCircle2 size={16} />
          </div>

          <div>
            <p className="text-sm font-bold text-slate-800">
              {overallStatus.message}
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              接続状態は今後、各サービスの実データと連動して自動更新されます。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}