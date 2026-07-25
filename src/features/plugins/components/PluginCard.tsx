import type {
  LucideIcon,
} from "lucide-react";

import {
  Cable,
  Gamepad2,
  Radio,
  Settings,
  ToggleLeft,
  ToggleRight,
  Unplug,
  Wifi,
} from "lucide-react";

import { PluginStatusBadge } from "@/features/plugins/components/PluginStatusBadge";

import type {
  PluginDefinition,
  PluginType,
} from "@/features/plugins";

type PluginCardProps = {
  plugin: PluginDefinition;
};

export function PluginCard({
  plugin,
}: PluginCardProps) {
  const Icon = getPluginIcon(
    plugin.type,
  );

  const connectionDescription =
    getConnectionDescription(plugin);

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/50">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300 to-transparent opacity-0 transition group-hover:opacity-100" />

      <div className="p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
              <Icon
                aria-hidden="true"
                size={22}
              />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-base font-black text-slate-950">
                  {plugin.name}
                </h3>

                <PluginStatusBadge
                  enabled={plugin.enabled}
                  connectionStatus={
                    plugin.connectionStatus
                  }
                />
              </div>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                {getPluginDescription(
                  plugin,
                )}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-black text-slate-500">
              {plugin.type}
            </span>

            {plugin.version ? (
              <span className="rounded-lg bg-violet-50 px-2.5 py-1 text-[11px] font-black text-violet-700">
                v{plugin.version}
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-6 grid gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
              {plugin.connectionStatus ===
              "connected" ? (
                <Wifi
                  aria-hidden="true"
                  size={16}
                  className="text-emerald-600"
                />
              ) : (
                <Unplug
                  aria-hidden="true"
                  size={16}
                  className="text-slate-400"
                />
              )}
            </div>

            <div className="min-w-0">
              <p className="text-xs font-black text-slate-400">
                接続状態
              </p>

              <p className="mt-1 truncate text-sm font-bold text-slate-700">
                {connectionDescription}
              </p>
            </div>
          </div>

          {plugin.author ? (
            <div className="lg:text-right">
              <p className="text-xs font-black text-slate-400">
                提供元
              </p>

              <p className="mt-1 text-sm font-bold text-slate-700">
                {plugin.author}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled
            title="次のSprintでConfigStoreへ接続します"
            className="inline-flex min-h-11 min-w-24 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-500 opacity-70"
          >
            {plugin.enabled ? (
              <ToggleRight
                aria-hidden="true"
                size={19}
                className="text-violet-600"
              />
            ) : (
              <ToggleLeft
                aria-hidden="true"
                size={19}
              />
            )}

            {plugin.enabled
              ? "有効"
              : "無効"}
          </button>

          <button
            type="button"
            disabled
            title="次のSprintでConnectorへ接続します"
            className="inline-flex min-h-11 min-w-24 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-black text-white shadow-sm shadow-violet-200 opacity-60"
          >
            <Cable
              aria-hidden="true"
              size={17}
            />

            {plugin.connectionStatus ===
            "connected"
              ? "切断"
              : "接続"}
          </button>

          <button
            type="button"
            disabled
            title="Plugin設定画面は今後実装します"
            className="inline-flex min-h-11 min-w-24 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-600 opacity-70"
          >
            <Settings
              aria-hidden="true"
              size={17}
            />

            設定
          </button>
        </div>
      </div>
    </article>
  );
}

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

function getPluginDescription(
  plugin: PluginDefinition,
): string {
  if (plugin.description) {
    return plugin.description;
  }

  switch (plugin.type) {
    case "tiktok":
      return "TikTok LIVEのイベントを受信します。";

    case "minecraft":
      return "Minecraftへ妨害コマンドを送信します。";

    case "overlay":
      return "配信用オーバーレイへ演出を出力します。";
  }
}

function getConnectionDescription(
  plugin: PluginDefinition,
): string {
  if (!plugin.enabled) {
    return "Pluginは現在無効です";
  }

  if (plugin.errorMessage) {
    return plugin.errorMessage;
  }

  if (plugin.connectionDetail) {
    return plugin.connectionDetail;
  }

  switch (plugin.connectionStatus) {
    case "connected":
      return "サービスへ接続されています";

    case "connecting":
      return "接続結果を待っています";

    case "error":
      return "接続処理でエラーが発生しました";

    case "disconnected":
      return "サービスへ接続されていません";
  }
}