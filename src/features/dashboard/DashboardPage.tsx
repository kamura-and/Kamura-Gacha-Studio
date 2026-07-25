import { useMemo } from "react";

import {
  Gift,
  Radio,
  Sparkles,
  Tv,
} from "lucide-react";

import { ConnectionStatusSection } from "@/features/dashboard/components/ConnectionStatusSection";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { EffectPreviewCard } from "@/features/dashboard/components/EffectPreviewCard";
import { RecentLogCard } from "@/features/dashboard/components/RecentLogCard";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { usePluginStore } from "@/features/plugins";
import { useCommandQueueStore } from "@/features/queue/store/commandQueueStore";

import type {
  PluginConnectionStatus,
  PluginDefinition,
} from "@/features/plugins";

export function DashboardPage() {
  const plugins = usePluginStore(
    (state) => state.plugins,
  );

  const queueItems =
    useCommandQueueStore(
      (state) => state.items,
    );

  const tiktokPlugin =
    plugins.find(
      (plugin) =>
        plugin.id ===
        "tiktok-live",
    );

  const overlayPlugin =
    plugins.find(
      (plugin) =>
        plugin.id ===
        "overlay",
    );

  const todayCommandCount =
    useMemo(
      () =>
        queueItems.filter(
          (item) =>
            isToday(
              item.createdAt,
            ),
        ).length,
      [queueItems],
    );

  const tiktokDisplay =
    getPluginDisplay(
      tiktokPlugin,
      {
        connectedValue:
          "接続中",
        disconnectedValue:
          "未接続",
        connectedTrend:
          "受信可能",
        disconnectedTrend:
          "待機中",
      },
    );

  const overlayDisplay =
    getPluginDisplay(
      overlayPlugin,
      {
        connectedValue:
          "稼働中",
        disconnectedValue:
          "停止中",
        connectedTrend:
          "配信可能",
        disconnectedTrend:
          "待機中",
      },
    );

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <DashboardHeader />

      <ConnectionStatusSection />

      <section aria-labelledby="dashboard-statistics-title">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2
              id="dashboard-statistics-title"
              className="text-lg font-bold tracking-tight text-slate-900"
            >
              本日の状況
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              PluginとRuntimeの現在の稼働状況を確認できます。
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="TikTok接続状況"
            value={
              tiktokDisplay.value
            }
            description="TikTok LIVEとの接続状態"
            icon={Radio}
            status={
              tiktokDisplay.status
            }
            statusTone={
              tiktokDisplay.statusTone
            }
            trend={
              tiktokDisplay.trend
            }
          />

          <StatCard
            title="本日のギフト数"
            value="—"
            description="本日受信したギフト"
            icon={Gift}
            status="未実装"
            statusTone="neutral"
            trend="Trigger実装後に連携"
          />

          <StatCard
            title="本日のコマンド数"
            value={
              todayCommandCount
            }
            description="本日Queueへ追加されたコマンド"
            icon={Sparkles}
            status={
              todayCommandCount > 0
                ? "履歴あり"
                : "履歴なし"
            }
            statusTone={
              todayCommandCount > 0
                ? "success"
                : "neutral"
            }
            trend="今日"
          />

          <StatCard
            title="オーバーレイ状態"
            value={
              overlayDisplay.value
            }
            description="配信用オーバーレイ"
            icon={Tv}
            status={
              overlayDisplay.status
            }
            statusTone={
              overlayDisplay.statusTone
            }
            trend={
              overlayDisplay.trend
            }
          />
        </div>
      </section>

      <section
        aria-label="エフェクトプレビューと最近のログ"
        className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]"
      >
        <EffectPreviewCard />
        <RecentLogCard />
      </section>
    </div>
  );
}

type PluginDisplayOptions = {
  connectedValue: string;
  disconnectedValue: string;
  connectedTrend: string;
  disconnectedTrend: string;
};

type PluginDisplay = {
  value: string;
  status: string;
  statusTone:
    | "success"
    | "warning"
    | "error"
    | "neutral";
  trend: string;
};

function getPluginDisplay(
  plugin:
    | PluginDefinition
    | undefined,
  options: PluginDisplayOptions,
): PluginDisplay {
  if (!plugin) {
    return {
      value: "未登録",
      status: "未登録",
      statusTone: "neutral",
      trend:
        "Plugin情報なし",
    };
  }

  if (!plugin.enabled) {
    return {
      value: "無効",
      status: "無効",
      statusTone: "neutral",
      trend:
        "Plugin設定を確認",
    };
  }

  return getConnectionDisplay(
    plugin.connectionStatus,
    options,
  );
}

function getConnectionDisplay(
  connectionStatus:
    PluginConnectionStatus,
  options: PluginDisplayOptions,
): PluginDisplay {
  switch (connectionStatus) {
    case "connected":
      return {
        value:
          options.connectedValue,
        status: "正常",
        statusTone: "success",
        trend:
          options.connectedTrend,
      };

    case "connecting":
      return {
        value: "接続中",
        status: "処理中",
        statusTone: "warning",
        trend:
          "接続結果を待機",
      };

    case "error":
      return {
        value: "エラー",
        status: "要確認",
        statusTone: "error",
        trend:
          "接続設定を確認",
      };

    case "disconnected":
      return {
        value:
          options.disconnectedValue,
        status: "未接続",
        statusTone: "neutral",
        trend:
          options.disconnectedTrend,
      };
  }
}

function isToday(
  timestamp: number,
): boolean {
  const today = new Date();
  const target =
    new Date(timestamp);

  return (
    today.getFullYear() ===
      target.getFullYear() &&
    today.getMonth() ===
      target.getMonth() &&
    today.getDate() ===
      target.getDate()
  );
}