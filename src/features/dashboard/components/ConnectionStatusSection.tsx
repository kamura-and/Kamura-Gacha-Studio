import type {
  LucideIcon,
} from "lucide-react";

import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Gamepad2,
  LoaderCircle,
  Radio,
  Unplug,
  Wifi,
  XCircle,
} from "lucide-react";

import { usePluginStore } from "@/features/plugins";

import type {
  PluginDefinition,
  PluginType,
} from "@/features/plugins";

type DisplayStatus =
  | "online"
  | "waiting"
  | "offline"
  | "error"
  | "disabled";

type ConnectionItemProps = {
  plugin: PluginDefinition;
};

const statusStyles: Record<
  DisplayStatus,
  {
    dot: string;
    badge: string;
    icon: string;
  }
> = {
  online: {
    dot: "bg-emerald-500",
    badge:
      "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    icon:
      "bg-emerald-50 text-emerald-600",
  },

  waiting: {
    dot: "bg-amber-500",
    badge:
      "bg-amber-50 text-amber-700 ring-amber-600/20",
    icon:
      "bg-amber-50 text-amber-600",
  },

  offline: {
    dot: "bg-slate-400",
    badge:
      "bg-slate-100 text-slate-600 ring-slate-500/20",
    icon:
      "bg-slate-100 text-slate-500",
  },

  error: {
    dot: "bg-rose-500",
    badge:
      "bg-rose-50 text-rose-700 ring-rose-600/20",
    icon:
      "bg-rose-50 text-rose-600",
  },

  disabled: {
    dot: "bg-slate-300",
    badge:
      "bg-slate-100 text-slate-400 ring-slate-400/20",
    icon:
      "bg-slate-100 text-slate-400",
  },
};

function getPluginIcon(
  type: PluginType,
): LucideIcon {
  switch (type) {
    case "tiktok":
      return Radio;

    case "minecraft":
      return Gamepad2;

    case "overlay":
      return Wifi;
  }
}

function getDisplayStatus(
  plugin: PluginDefinition,
): DisplayStatus {
  if (!plugin.enabled) {
    return "disabled";
  }

  switch (
    plugin.connectionStatus
  ) {
    case "connected":
      return "online";

    case "connecting":
      return "waiting";

    case "error":
      return "error";

    case "disconnected":
      return "offline";
  }
}

function getStatusLabel(
  plugin: PluginDefinition,
): string {
  if (!plugin.enabled) {
    return "無効";
  }

  switch (
    plugin.connectionStatus
  ) {
    case "connected":
      return "接続中";

    case "connecting":
      return "接続処理中";

    case "error":
      return "エラー";

    case "disconnected":
      return "未接続";
  }
}

function getDescription(
  plugin: PluginDefinition,
): string {
  if (!plugin.enabled) {
    return "このPluginは無効です";
  }

  switch (
    plugin.connectionStatus
  ) {
    case "connected":
      return "サービスへ接続されています";

    case "connecting":
      return "サービスへ接続しています";

    case "error":
      return "接続処理でエラーが発生しました";

    case "disconnected":
      return "サービスへ接続されていません";
  }
}

function getDetail(
  plugin: PluginDefinition,
): string {
  if (!plugin.enabled) {
    return "Plugin設定で有効化してください";
  }

  if (plugin.errorMessage) {
    return plugin.errorMessage;
  }

  if (plugin.connectionDetail) {
    return plugin.connectionDetail;
  }

  if (
    plugin.connectionStatus ===
    "connected"
  ) {
    const timestamp =
      plugin.lastHeartbeatAt ??
      plugin.lastConnectedAt;

    if (timestamp) {
      return `最終確認：${formatRelativeTime(
        timestamp,
      )}`;
    }

    return "接続済み";
  }

  if (
    plugin.connectionStatus ===
    "connecting"
  ) {
    return "接続結果を待っています";
  }

  return "接続情報はありません";
}

function ConnectionItem({
  plugin,
}: ConnectionItemProps) {
  const status =
    getDisplayStatus(plugin);

  const styles =
    statusStyles[status];

  const Icon =
    getPluginIcon(plugin.type);

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/60">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300 to-transparent opacity-0 transition group-hover:opacity-100" />

      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <div
            className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${styles.icon}`}
          >
            <Icon
              size={22}
              strokeWidth={2}
            />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-slate-900">
              {plugin.name}
            </h3>

            <p className="mt-1 text-sm font-medium text-slate-600">
              {getDescription(
                plugin,
              )}
            </p>
          </div>
        </div>

        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${styles.badge}`}
        >
          <span
            className={`size-2 rounded-full ${styles.dot} ${
              status === "online"
                ? "animate-pulse"
                : ""
            }`}
          />

          {getStatusLabel(
            plugin,
          )}
        </span>
      </div>

      <div className="mt-5 flex items-center gap-2 rounded-2xl bg-slate-50 px-3.5 py-3 text-sm text-slate-500">
        {plugin.connectionStatus ===
        "connecting" ? (
          <LoaderCircle
            size={15}
            className="shrink-0 animate-spin text-amber-500"
          />
        ) : plugin.connectionStatus ===
          "error" ? (
          <XCircle
            size={15}
            className="shrink-0 text-rose-500"
          />
        ) : (
          <Clock3
            size={15}
            className="shrink-0 text-slate-400"
          />
        )}

        <span className="truncate">
          {getDetail(plugin)}
        </span>
      </div>
    </article>
  );
}

export function ConnectionStatusSection() {
  const plugins =
    usePluginStore(
      (state) =>
        state.plugins,
    );

  const enabledPlugins =
    plugins.filter(
      (plugin) =>
        plugin.enabled,
    );

  const connectedCount =
    enabledPlugins.filter(
      (plugin) =>
        plugin.connectionStatus ===
        "connected",
    ).length;

  const errorCount =
    enabledPlugins.filter(
      (plugin) =>
        plugin.connectionStatus ===
        "error",
    ).length;

  const connectingCount =
    enabledPlugins.filter(
      (plugin) =>
        plugin.connectionStatus ===
        "connecting",
    ).length;

  const disconnectedCount =
    enabledPlugins.filter(
      (plugin) =>
        plugin.connectionStatus ===
        "disconnected",
    ).length;

  const overallStatus =
    getOverallStatus({
      enabledCount:
        enabledPlugins.length,
      connectedCount,
      connectingCount,
      disconnectedCount,
      errorCount,
    });

  const OverallStatusIcon =
    overallStatus.icon;

  return (
    <section
      aria-labelledby="connection-status-title"
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              <Activity
                size={18}
              />
            </div>

            <h2
              id="connection-status-title"
              className="text-lg font-bold tracking-tight text-slate-900"
            >
              システム接続状況
            </h2>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            各Pluginの現在の接続状態を表示します。
          </p>
        </div>

        <div
          className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ring-1 ring-inset ${overallStatus.className}`}
        >
          <OverallStatusIcon
            size={14}
            className={
              overallStatus.animate
                ? "animate-spin"
                : undefined
            }
          />

          {overallStatus.label}
        </div>
      </div>

      <div className="p-6">
        {plugins.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-3">
            {plugins.map(
              (plugin) => (
                <ConnectionItem
                  key={plugin.id}
                  plugin={plugin}
                />
              ),
            )}
          </div>
        ) : (
          <div className="flex min-h-48 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center">
            <Unplug
              size={30}
              className="text-slate-400"
            />

            <h3 className="mt-4 text-base font-black text-slate-900">
              Pluginがありません
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Pluginを登録すると、接続状況がここに表示されます。
            </p>
          </div>
        )}

        <div
          className={`mt-5 flex items-start gap-3 rounded-2xl border px-4 py-3 ${overallStatus.panelClassName}`}
        >
          <div
            className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ${overallStatus.iconClassName}`}
          >
            <OverallStatusIcon
              size={16}
              className={
                overallStatus.animate
                  ? "animate-spin"
                  : undefined
              }
            />
          </div>

          <div>
            <p className="text-sm font-bold text-slate-800">
              {overallStatus.message}
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              接続状態はPlugin Storeの実データから自動更新されます。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

type OverallStatusInput = {
  enabledCount: number;
  connectedCount: number;
  connectingCount: number;
  disconnectedCount: number;
  errorCount: number;
};

function getOverallStatus({
  enabledCount,
  connectedCount,
  connectingCount,
  disconnectedCount,
  errorCount,
}: OverallStatusInput) {
  if (enabledCount === 0) {
    return {
      label: "すべて無効",
      message:
        "有効なPluginがありません。",
      icon: Unplug,
      animate: false,
      className:
        "bg-slate-100 text-slate-600 ring-slate-500/20",
      panelClassName:
        "border-slate-200 bg-slate-50",
      iconClassName:
        "text-slate-500",
    };
  }

  if (errorCount > 0) {
    return {
      label: "要確認",
      message:
        "接続エラーが発生しているPluginがあります。",
      icon: AlertTriangle,
      animate: false,
      className:
        "bg-rose-50 text-rose-700 ring-rose-600/20",
      panelClassName:
        "border-rose-100 bg-rose-50/60",
      iconClassName:
        "text-rose-600",
    };
  }

  if (connectingCount > 0) {
    return {
      label: "接続処理中",
      message:
        "接続処理中のPluginがあります。",
      icon: LoaderCircle,
      animate: true,
      className:
        "bg-amber-50 text-amber-700 ring-amber-600/20",
      panelClassName:
        "border-amber-100 bg-amber-50/60",
      iconClassName:
        "text-amber-600",
    };
  }

  if (
    connectedCount ===
    enabledCount
  ) {
    return {
      label: "すべて正常",
      message:
        "有効なPluginはすべて接続されています。",
      icon: CheckCircle2,
      animate: false,
      className:
        "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
      panelClassName:
        "border-emerald-100 bg-emerald-50/60",
      iconClassName:
        "text-emerald-600",
    };
  }

  if (
    disconnectedCount > 0
  ) {
    return {
      label: "未接続",
      message:
        "接続されていないPluginがあります。",
      icon: Unplug,
      animate: false,
      className:
        "bg-slate-100 text-slate-600 ring-slate-500/20",
      panelClassName:
        "border-slate-200 bg-slate-50",
      iconClassName:
        "text-slate-500",
    };
  }

  return {
    label: "状態不明",
    message:
      "Pluginの状態を確認できません。",
    icon: Activity,
    animate: false,
    className:
      "bg-slate-100 text-slate-600 ring-slate-500/20",
    panelClassName:
      "border-slate-200 bg-slate-50",
    iconClassName:
      "text-slate-500",
  };
}

function formatRelativeTime(
  timestamp: number,
): string {
  const elapsed =
    Date.now() - timestamp;

  if (elapsed < 0) {
    return formatDate(
      timestamp,
    );
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
  ).format(
    new Date(timestamp),
  );
}