import {
  Clock3,
  Copy,
  Heart,
  Pencil,
  Trash2,
  Zap,
} from "lucide-react";

import type { EffectDefinition } from "../types/effectDefinition";

type EffectCardProps = {
  effect: EffectDefinition;

  onEdit: (
    effect: EffectDefinition,
  ) => void;

  onDelete: (
    effect: EffectDefinition,
  ) => void;
};

export function EffectCard({
  effect,
  onEdit,
  onDelete,
}: EffectCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md">
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              <Zap size={20} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-base font-black text-slate-950">
                  {effect.name}
                </h2>

                {effect.favorite && (
                  <Heart
                    size={16}
                    aria-label="お気に入り"
                    className="shrink-0 fill-rose-500 text-rose-500"
                  />
                )}
              </div>

              <p className="mt-1 text-xs font-semibold text-slate-400">
                ID: {shortenId(effect.id)}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-4 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-600">
          {effect.description ||
            "説明はまだ登録されていません。"}
        </p>

        {effect.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {effect.tags
              .slice(0, 4)
              .map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-700"
                >
                  {tag}
                </span>
              ))}

            {effect.tags.length > 4 && (
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
                +{effect.tags.length - 4}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto grid grid-cols-2 gap-3 pt-5">
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
            <Copy
              size={15}
              className="shrink-0 text-slate-400"
            />

            <div className="min-w-0">
              <p className="text-[10px] font-bold tracking-wide text-slate-400">
                アクション
              </p>

              <p className="text-sm font-black text-slate-700">
                {effect.actions.length}件
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
            <Clock3
              size={15}
              className="shrink-0 text-slate-400"
            />

            <div className="min-w-0">
              <p className="text-[10px] font-bold tracking-wide text-slate-400">
                最終更新
              </p>

              <p
                className="truncate text-sm font-black text-slate-700"
                title={formatFullDate(
                  effect.updatedAt,
                )}
              >
                {formatRelativeDate(
                  effect.updatedAt,
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50/70 px-5 py-3">
        <button
          type="button"
          onClick={() =>
            onDelete(effect)
          }
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
        >
          <Trash2 size={15} />
          削除
        </button>

        <button
          type="button"
          onClick={() =>
            onEdit(effect)
          }
          className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-violet-500"
        >
          <Pencil size={15} />
          編集
        </button>
      </div>
    </article>
  );
}

function shortenId(id: string) {
  if (id.length <= 8) {
    return id;
  }

  return id.slice(0, 8);
}

function formatRelativeDate(
  timestamp: number,
) {
  const elapsedMilliseconds =
    Date.now() - timestamp;

  if (elapsedMilliseconds < 0) {
    return formatShortDate(timestamp);
  }

  const elapsedSeconds = Math.floor(
    elapsedMilliseconds / 1000,
  );

  if (elapsedSeconds < 60) {
    return "たった今";
  }

  const elapsedMinutes = Math.floor(
    elapsedSeconds / 60,
  );

  if (elapsedMinutes < 60) {
    return `${elapsedMinutes}分前`;
  }

  const elapsedHours = Math.floor(
    elapsedMinutes / 60,
  );

  if (elapsedHours < 24) {
    return `${elapsedHours}時間前`;
  }

  const elapsedDays = Math.floor(
    elapsedHours / 24,
  );

  if (elapsedDays < 7) {
    return `${elapsedDays}日前`;
  }

  return formatShortDate(timestamp);
}

function formatShortDate(
  timestamp: number,
) {
  return new Intl.DateTimeFormat(
    "ja-JP",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  ).format(new Date(timestamp));
}

function formatFullDate(
  timestamp: number,
) {
  return new Intl.DateTimeFormat(
    "ja-JP",
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(new Date(timestamp));
}