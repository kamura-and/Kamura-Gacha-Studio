import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  status?: string;
  trend?: string;
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  status,
  trend,
}: StatCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/70">
      <div className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-violet-100/70 blur-2xl transition duration-300 group-hover:bg-violet-200/80" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 transition duration-200 group-hover:bg-violet-600 group-hover:text-white">
              <Icon aria-hidden="true" size={21} />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900">{title}</p>

              <p className="mt-0.5 text-xs font-medium text-slate-500">
                {description}
              </p>
            </div>
          </div>

          {status ? (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              {status}
            </span>
          ) : null}
        </div>

        <div className="mt-6 flex items-end justify-between gap-4">
          <p className="text-4xl font-black tracking-tight text-slate-950">
            {value}
          </p>

          {trend ? (
            <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-700">
              {trend}
            </span>
          ) : null}
        </div>

        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 transition-all duration-300 group-hover:w-4/5" />
        </div>
      </div>
    </article>
  );
}