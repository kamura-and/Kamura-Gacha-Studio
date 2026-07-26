import type {
  LucideIcon,
} from "lucide-react";

import {
  Activity,
  ExternalLink,
  LoaderCircle,
  Play,
  Radio,
  Unplug,
  XCircle,
} from "lucide-react";

import {
  usePluginConfigStore,
} from "@/features/plugins/store/pluginConfigStore";

import {
  usePluginRuntimeStore,
} from "@/features/plugins/store/pluginRuntimeStore";

import type {
  PluginConnectionStatus,
  PluginRuntime,
} from "@/features/plugins/types/plugin";

type HeaderConnectionDisplay = {
  label: string;
  description: string;
  badgeClassName: string;
  dotClassName: string;
  icon: LucideIcon;
};

export function DashboardHeader() {
  const tiktokConfig =
    usePluginConfigStore(
      (state) =>
        state.configs[
          "tiktok-live"
        ],
    );

  const overlayConfig =
    usePluginConfigStore(
      (state) =>
        state.configs.overlay,
    );

  const tiktokRuntime =
    usePluginRuntimeStore(
      (state) =>
        state.runtimes[
          "tiktok-live"
        ],
    );

  const overlayRuntime =
    usePluginRuntimeStore(
      (state) =>
        state.runtimes.overlay,
    );

  const runtimes =
    usePluginRuntimeStore(
      (state) => state.runtimes,
    );

  const configs =
    usePluginConfigStore(
      (state) => state.configs,
    );

  const tiktokDisplay =
    getPluginConnectionDisplay({
      enabled:
        tiktokConfig?.enabled ??
        false,
      runtime: tiktokRuntime,
      pluginName: "TikTok LIVE",
    });

const pluginIds = [
  "tiktok-live",
  "minecraft",
  "overlay",
] as const;

const enabledPluginCount =
  pluginIds.filter(
    (id) => configs[id].enabled,
  ).length;

const connectedPluginCount =
  pluginIds.filter(
    (id) =>
      configs[id].enabled &&
      runtimes[id]
        .connectionStatus ===
        "connected",
  ).length;

  const canStartStreaming =
    tiktokConfig?.enabled ===
      true &&
    tiktokRuntime
      ?.connectionStatus ===
      "connected";

  /*
   * Overlayは「接続済みになるまで開けない」仕様にすると、
   * 開く操作そのものができなくなる可能性があります。
   *
   * そのため、Pluginが有効ならボタンを操作可能にしています。
   */
  const canOpenOverlay =
    overlayConfig?.enabled ===
    true;

  const ConnectionIcon =
    tiktokDisplay.icon;

  const overlayButtonLabel =
    getOverlayButtonLabel(
      overlayConfig?.enabled ??
        false,
      overlayRuntime
        ?.connectionStatus,
    );

  function handleOpenOverlay(): void {
    if (!canOpenOverlay) {
      return;
    }

    console.info(
      "[DashboardHeader]",
      "Overlay open requested",
    );
  }

  function handleStartStreaming(): void {
    if (!canStartStreaming) {
      return;
    }

    console.info(
      "[DashboardHeader]",
      "Streaming start requested",
    );
  }

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.10),transparent_38%)]" />

      <div className="relative grid gap-10 px-7 py-9 sm:px-9 sm:py-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center lg:gap-14 lg:px-12 lg:py-12">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3.5 py-1.5 text-xs font-black tracking-wide text-violet-700">
            <Activity
              aria-hidden="true"
              size={14}
              strokeWidth={2.4}
            />

            LIVE Dashboard
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Kamura Gacha Studio
          </h1>

          <p className="mt-3 text-lg font-bold text-slate-700 sm:text-xl">
            TikTok LIVE Gacha
            Controller
          </p>

          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
            TikTok LIVE、Minecraft、
            配信オーバーレイを一括管理し、
            ギフトイベントからガチャ演出、
            ゲーム内コマンドまでを
            リアルタイムで実行します。
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm shadow-sm backdrop-blur">
              <span className="text-slate-500">
                Runtime
              </span>

              <span className="font-black text-slate-900">
                準備完了
              </span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm shadow-sm backdrop-blur">
              <span className="text-slate-500">
                Plugin
              </span>

              <span className="font-black text-slate-900">
                {connectedPluginCount}
                {" / "}
                {enabledPluginCount}
                {" 接続"}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-5 shadow-inner shadow-slate-100/80 backdrop-blur sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3.5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm ring-1 ring-slate-200">
                <ConnectionIcon
                  aria-hidden="true"
                  size={21}
                  strokeWidth={2.2}
                  className={
                    tiktokRuntime
                      ?.connectionStatus ===
                    "connecting"
                      ? "animate-spin"
                      : undefined
                  }
                />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                  TikTok LIVE
                </p>

                <p className="mt-1 text-lg font-black text-slate-950">
                  {
                    tiktokDisplay.label
                  }
                </p>
              </div>
            </div>

            <span
              className={[
                "inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black ring-1 ring-inset",
                tiktokDisplay.badgeClassName,
              ].join(" ")}
            >
              <span
                className={[
                  "size-2 rounded-full",
                  tiktokDisplay.dotClassName,
                ].join(" ")}
              />

              {
                tiktokDisplay.label
              }
            </span>
          </div>

          <p className="mt-4 min-h-12 text-sm leading-6 text-slate-500">
            {
              tiktokDisplay.description
            }
          </p>

          <div className="mt-6 grid gap-3">
            <button
              type="button"
              onClick={
                handleOpenOverlay
              }
              disabled={
                !canOpenOverlay
              }
              className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 shadow-sm transition enabled:hover:-translate-y-0.5 enabled:hover:border-violet-200 enabled:hover:bg-violet-50 enabled:hover:text-violet-700 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none"
            >
              <ExternalLink
                aria-hidden="true"
                size={17}
                strokeWidth={2.2}
              />

              {overlayButtonLabel}
            </button>

            <button
              type="button"
              onClick={
                handleStartStreaming
              }
              disabled={
                !canStartStreaming
              }
              className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-4 text-base font-black text-white shadow-lg shadow-violet-600/20 transition enabled:hover:-translate-y-0.5 enabled:hover:bg-violet-500 enabled:hover:shadow-xl enabled:hover:shadow-violet-600/25 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
            >
              <Play
                aria-hidden="true"
                size={18}
                fill={
                  canStartStreaming
                    ? "currentColor"
                    : "none"
                }
                strokeWidth={2.2}
              />

              配信開始
            </button>
          </div>

          <div className="mt-4 rounded-2xl bg-white px-4 py-3 text-xs leading-5 text-slate-500 ring-1 ring-slate-200">
            {getStartGuidance({
              enabled:
                tiktokConfig
                  ?.enabled ??
                false,
              status:
                tiktokRuntime
                  ?.connectionStatus,
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function getPluginConnectionDisplay({
  enabled,
  runtime,
  pluginName,
}: {
  enabled: boolean;
  runtime:
    | PluginRuntime
    | undefined;
  pluginName: string;
}): HeaderConnectionDisplay {
  if (!enabled) {
    return {
      label: "無効",
      description: `${pluginName} Pluginが無効になっています。`,
      badgeClassName:
        "bg-slate-100 text-slate-500 ring-slate-500/20",
      dotClassName:
        "bg-slate-300",
      icon: Unplug,
    };
  }

  if (!runtime) {
    return {
      label: "状態不明",
      description: `${pluginName} Pluginの実行状態を取得できません。`,
      badgeClassName:
        "bg-slate-100 text-slate-500 ring-slate-500/20",
      dotClassName:
        "bg-slate-400",
      icon: Unplug,
    };
  }

  return getConnectionDisplay(
    runtime.connectionStatus,
    runtime,
  );
}

function getConnectionDisplay(
  connectionStatus:
    PluginConnectionStatus,
  runtime: PluginRuntime,
): HeaderConnectionDisplay {
  switch (connectionStatus) {
    case "connected":
      return {
        label: "接続中",
        description:
          runtime.connectionDetail ??
          "TikTok LIVEからイベントを受信できる状態です。",
        badgeClassName:
          "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
        dotClassName:
          "bg-emerald-500 animate-pulse",
        icon: Radio,
      };

    case "connecting":
      return {
        label: "接続処理中",
        description:
          runtime.connectionDetail ??
          "TikTok LIVEへの接続結果を待っています。",
        badgeClassName:
          "bg-amber-50 text-amber-700 ring-amber-600/20",
        dotClassName:
          "bg-amber-500 animate-pulse",
        icon: LoaderCircle,
      };

    case "error":
      return {
        label: "エラー",
        description:
          runtime.errorMessage ??
          runtime.connectionDetail ??
          "TikTok LIVEとの接続中にエラーが発生しました。",
        badgeClassName:
          "bg-rose-50 text-rose-700 ring-rose-600/20",
        dotClassName:
          "bg-rose-500",
        icon: XCircle,
      };

    case "disconnected":
      return {
        label: "未接続",
        description:
          runtime.connectionDetail ??
          "TikTok LIVEへ接続されていません。",
        badgeClassName:
          "bg-slate-100 text-slate-600 ring-slate-500/20",
        dotClassName:
          "bg-slate-400",
        icon: Unplug,
      };

    default:
      return {
        label: "状態不明",
        description:
          "TikTok LIVEの接続状態を取得できません。",
        badgeClassName:
          "bg-slate-100 text-slate-500 ring-slate-500/20",
        dotClassName:
          "bg-slate-400",
        icon: Unplug,
      };
  }
}

function getOverlayButtonLabel(
  enabled: boolean,
  status:
    | PluginConnectionStatus
    | undefined,
): string {
  if (!enabled) {
    return "Overlayは無効です";
  }

  switch (status) {
    case "connected":
      return "Overlayを表示";

    case "connecting":
      return "Overlay接続中";

    case "error":
      return "Overlayを再試行";

    case "disconnected":
    default:
      return "Overlayを開く";
  }
}

function getStartGuidance({
  enabled,
  status,
}: {
  enabled: boolean;
  status:
    | PluginConnectionStatus
    | undefined;
}): string {
  if (!enabled) {
    return "配信を開始するには、TikTok LIVE Pluginを有効にしてください。";
  }

  switch (status) {
    case "connected":
      return "TikTok LIVEへ接続されています。配信を開始できます。";

    case "connecting":
      return "TikTok LIVEへ接続しています。接続完了までお待ちください。";

    case "error":
      return "TikTok LIVEとの接続でエラーが発生しています。Plugin管理画面から再接続してください。";

    case "disconnected":
    default:
      return "配信を開始するには、TikTok LIVE Pluginを接続してください。";
  }
}