import { cn } from "@/lib/utils";

type StatusType =
  | "connected"
  | "running"
  | "stopped"
  | "disconnected"
  | "error";

type StatusBadgeProps = {
  status: StatusType;
  label: string;
};

const statusStyles: Record<StatusType, string> = {
  connected:
    "border-emerald-200 bg-emerald-50 text-emerald-700",
  running:
    "border-cyan-200 bg-cyan-50 text-cyan-700",
  stopped:
    "border-slate-200 bg-slate-100 text-slate-600",
  disconnected:
    "border-slate-200 bg-slate-100 text-slate-600",
  error:
    "border-red-200 bg-red-50 text-red-700",
};

const dotStyles: Record<StatusType, string> = {
  connected: "bg-emerald-500",
  running: "bg-cyan-500",
  stopped: "bg-slate-400",
  disconnected: "bg-slate-400",
  error: "bg-red-500",
};

export function StatusBadge({
  status,
  label,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
        statusStyles[status],
      )}
    >
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          dotStyles[status],
        )}
      />

      {label}
    </span>
  );
}