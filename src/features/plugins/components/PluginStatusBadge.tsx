import {
  CircleOff,
  LoaderCircle,
  Unplug,
  Wifi,
  XCircle,
} from "lucide-react";

import type {
  PluginConnectionStatus,
} from "@/features/plugins";

type PluginStatusBadgeProps = {
  enabled: boolean;
  connectionStatus: PluginConnectionStatus;
};

type StatusDisplay = {
  label: string;
  className: string;
  dotClassName: string;
  icon: typeof Wifi;
  animate: boolean;
};

export function PluginStatusBadge({
  enabled,
  connectionStatus,
}: PluginStatusBadgeProps) {
  const display = getStatusDisplay(
    enabled,
    connectionStatus,
  );

  const Icon = display.icon;

  return (
    <span
      className={[
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset",
        display.className,
      ].join(" ")}
    >
      <Icon
        aria-hidden="true"
        size={13}
        className={
          display.animate
            ? "animate-spin"
            : undefined
        }
      />

      <span
        aria-hidden="true"
        className={[
          "size-1.5 rounded-full",
          display.dotClassName,
        ].join(" ")}
      />

      {display.label}
    </span>
  );
}

function getStatusDisplay(
  enabled: boolean,
  connectionStatus: PluginConnectionStatus,
): StatusDisplay {
  if (!enabled) {
    return {
      label: "無効",
      className:
        "bg-slate-100 text-slate-500 ring-slate-500/20",
      dotClassName: "bg-slate-400",
      icon: CircleOff,
      animate: false,
    };
  }

  switch (connectionStatus) {
    case "connected":
      return {
        label: "接続中",
        className:
          "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
        dotClassName:
          "bg-emerald-500 animate-pulse",
        icon: Wifi,
        animate: false,
      };

    case "connecting":
      return {
        label: "接続処理中",
        className:
          "bg-amber-50 text-amber-700 ring-amber-600/20",
        dotClassName: "bg-amber-500",
        icon: LoaderCircle,
        animate: true,
      };

    case "error":
      return {
        label: "エラー",
        className:
          "bg-rose-50 text-rose-700 ring-rose-600/20",
        dotClassName: "bg-rose-500",
        icon: XCircle,
        animate: false,
      };

    case "disconnected":
      return {
        label: "未接続",
        className:
          "bg-slate-100 text-slate-600 ring-slate-500/20",
        dotClassName: "bg-slate-400",
        icon: Unplug,
        animate: false,
      };
  }
}