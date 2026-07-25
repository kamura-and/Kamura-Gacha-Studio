import {
  AlertTriangle,
  CircleOff,
  LoaderCircle,
  PlugZap,
  Unplug,
} from "lucide-react";

import type {
  PluginDefinition,
} from "@/features/plugins";

type PluginSummaryProps = {
  plugins: PluginDefinition[];
};

type SummaryItemProps = {
  label: string;
  value: number;
  icon: typeof PlugZap;
  className: string;
  iconClassName: string;
};

export function PluginSummary({
  plugins,
}: PluginSummaryProps) {
  const enabledPlugins = plugins.filter(
    (plugin) => plugin.enabled,
  );

  const connectedCount =
    enabledPlugins.filter(
      (plugin) =>
        plugin.connectionStatus ===
        "connected",
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

  const errorCount =
    enabledPlugins.filter(
      (plugin) =>
        plugin.connectionStatus ===
        "error",
    ).length;

  const disabledCount =
    plugins.length -
    enabledPlugins.length;

  return (
    <section
      aria-labelledby="plugin-summary-title"
      className="space-y-5"
    >
      <div>
        <h2
          id="plugin-summary-title"
          className="text-xl font-black tracking-tight text-slate-950"
        >
          Plugin概要
        </h2>

        <p className="mt-1.5 text-sm leading-6 text-slate-500">
          登録されているPluginの現在の状態です。
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryItem
          label="接続中"
          value={connectedCount}
          icon={PlugZap}
          className="border-emerald-100 bg-emerald-50/70"
          iconClassName="bg-emerald-100 text-emerald-700"
        />

        <SummaryItem
          label="接続処理中"
          value={connectingCount}
          icon={LoaderCircle}
          className="border-amber-100 bg-amber-50/70"
          iconClassName="bg-amber-100 text-amber-700"
        />

        <SummaryItem
          label="未接続"
          value={disconnectedCount}
          icon={Unplug}
          className="border-slate-200 bg-white"
          iconClassName="bg-slate-100 text-slate-600"
        />

        <SummaryItem
          label="エラー"
          value={errorCount}
          icon={AlertTriangle}
          className="border-rose-100 bg-rose-50/70"
          iconClassName="bg-rose-100 text-rose-700"
        />

        <SummaryItem
          label="無効"
          value={disabledCount}
          icon={CircleOff}
          className="border-slate-200 bg-slate-50"
          iconClassName="bg-slate-200 text-slate-500"
        />
      </div>
    </section>
  );
}

function SummaryItem({
  label,
  value,
  icon: Icon,
  className,
  iconClassName,
}: SummaryItemProps) {
  return (
    <article
      className={[
        "rounded-2xl border px-4 py-3.5",
        className,
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-xs font-black text-slate-500">
            {label}
          </p>

          <p className="mt-1.5 text-xl font-black tracking-tight text-slate-950">
            {value}
          </p>
        </div>

        <div
          className={[
            "flex size-10 shrink-0 items-center justify-center rounded-xl",
            iconClassName,
          ].join(" ")}
        >
          <Icon
            aria-hidden="true"
            size={18}
          />
        </div>
      </div>
    </article>
  );
}