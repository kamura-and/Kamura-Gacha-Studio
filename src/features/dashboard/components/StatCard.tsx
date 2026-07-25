import type {
  LucideIcon,
} from "lucide-react";

export type StatCardStatusTone =
  | "success"
  | "warning"
  | "error"
  | "neutral";

type StatCardProps = {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  status?: string;
  statusTone?: StatCardStatusTone;
  trend?: string;
};

const statusToneStyles: Record<
  StatCardStatusTone,
  {
    badge: string;
    dot: string;
  }
> = {
  success: {
    badge:
      "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    dot:
      "bg-emerald-500",
  },

  warning: {
    badge:
      "bg-amber-50 text-amber-700 ring-amber-600/20",
    dot:
      "bg-amber-500",
  },

  error: {
    badge:
      "bg-rose-50 text-rose-700 ring-rose-600/20",
    dot:
      "bg-rose-500",
  },

  neutral: {
    badge:
      "bg-slate-100 text-slate-600 ring-slate-500/20",
    dot:
      "bg-slate-400",
  },
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  status,
  statusTone = "neutral",
  trend,
}: StatCardProps) {
  const statusStyles =
    statusToneStyles[
      statusTone
    ];

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/70">
      <div className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-violet-100/70 blur-2xl transition duration-300 group-hover:bg-violet-200/80" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 transition duration-200 group-hover:bg-violet-600 group-hover:text-white">
              <Icon
                aria-hidden="true"
                size={21}
              />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">
                {title}
              </p>

              <p className="mt-0.5 text-xs font-medium text-slate-500">
                {description}
              </p>
            </div>
          </div>

          {status ? (
            <span
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${statusStyles.badge}`}
            >
              <span
                className={`size-1.5 rounded-full ${statusStyles.dot}`}
              />

              {status}
            </span>
          ) : null}
        </div>

        <div className="mt-6 flex items-end justify-between gap-4">
          <p className="min-w-0 truncate text-4xl font-black tracking-tight text-slate-950">
            {value}
          </p>

          {trend ? (
            <span className="max-w-[50%] shrink-0 truncate rounded-full bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-700">
              {trend}
            </span>
          ) : null}
        </div>

        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full w-full origin-left rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 opacity-70 transition duration-300 group-hover:opacity-100" />
        </div>
      </div>
    </article>
  );
}