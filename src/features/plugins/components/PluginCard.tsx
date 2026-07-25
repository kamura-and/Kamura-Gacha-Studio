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
    <article className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/60">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300 to-transparent opacity-0 transition group-hover:opacity-100" />

      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
            <Icon
              aria-hidden="true"
              size={22}
            />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-base font-black text-slate-900">
              {plugin.name}
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              {getPluginDescription(
                plugin,
              )}
            </p>
          </div>
        </div>

        <PluginStatusBadge
          enabled={plugin.enabled}
          connectionStatus={
            plugin.connectionStatus
          }
        />
      </div>

      <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
          {plugin.connectionStatus ===
          "connected" ? (
            <Wifi
              aria-hidden="true"
              size={15}
              className="shrink-0 text-emerald-600"
            />
          ) : (
            <Unplug
              aria-hidden="true"
              size={15}
              className="shrink-0 text-slate-400"
            />
          )}

          <span className="truncate">
            {connectionDescription}
          </span>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled
          title="次のSprintでConfigStoreへ接続します"
          className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-500 opacity-70"
        >
          {plugin.enabled ? (
            <ToggleRight
              aria-hidden="true"
              size={18}
              className="text-violet-600"
            />
          ) : (
            <ToggleLeft
              aria-hidden="true"
              size={18}
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
          className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-violet-600 px-3 text-sm font-bold text-white opacity-60"
        >
          <Cable
            aria-hidden="true"
            size={16}
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
          className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-600 opacity-70"
        >
          <Settings
            aria-hidden="true"
            size={16}
          />

          設定
        </button>
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