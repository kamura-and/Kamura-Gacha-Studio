import type { LucideIcon } from "lucide-react";

type PagePlaceholderProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  nextVersion: string;
};

export function PagePlaceholder({
  title,
  description,
  icon: Icon,
  nextVersion,
}: PagePlaceholderProps) {
  return (
    <main className="px-5 py-7 md:px-8 md:py-9">
      <div className="mx-auto max-w-7xl">
        <div className="flex min-h-[28rem] items-center justify-center rounded-3xl border border-white/80 bg-white/80 p-8 text-center shadow-sm backdrop-blur">
          <div className="max-w-md">
            <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-violet-100 text-violet-700">
              <Icon aria-hidden="true" size={28} />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-zinc-900">
              {title}
            </h2>

            <p className="mt-3 text-sm leading-6 text-zinc-500">
              {description}
            </p>

            <span className="mt-6 inline-flex rounded-full bg-violet-50 px-4 py-2 text-xs font-semibold text-violet-700">
              {nextVersion}で実装予定
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}