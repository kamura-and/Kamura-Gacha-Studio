import {
  Clock3,
  Copy,
  Heart,
  ImageIcon,
  LoaderCircle,
  Pencil,
  Play,
  Sparkles,
  Trash2,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  effectRuntime,
} from "../runtime/EffectRuntime";

import type {
  EffectDefinition,
} from "../types/effectDefinition";

type EffectCardProps = {
  effect:
    EffectDefinition;

  onEdit: (
    effect:
      EffectDefinition,
  ) => void;

  onDelete: (
    effect:
      EffectDefinition,
  ) => void;
};

const rarityLabels = {
  common: "COMMON",
  rare: "RARE",
  epic: "EPIC",
  legendary: "LEGENDARY",
  ultra: "ULTRA",
  secret: "SECRET",
} as const;

const rarityStyles = {
  common:
    "bg-slate-100 text-slate-700",

  rare:
    "bg-sky-100 text-sky-700",

  epic:
    "bg-violet-100 text-violet-700",

  legendary:
    "bg-amber-100 text-amber-700",

  ultra:
    "bg-fuchsia-100 text-fuchsia-700",

  secret:
    "bg-rose-100 text-rose-700",
} as const;

export function EffectCard({
  effect,
  onEdit,
  onDelete,
}: EffectCardProps) {
  const [
    isTesting,
    setIsTesting,
  ] = useState(false);

  const [
    testMessage,
    setTestMessage,
  ] =
    useState<
      string | null
    >(null);

  const [
    testError,
    setTestError,
  ] =
    useState<
      string | null
    >(null);

  const rarity =
    effect.rarity ??
    "common";

  const isEnabled =
    effect.isEnabled !==
    false;

  const handleTest =
    async () => {
      if (
        isTesting ||
        !isEnabled
      ) {
        return;
      }

      setIsTesting(true);
      setTestMessage(null);
      setTestError(null);

      try {
        const result =
          effectRuntime.execute({
            effectId:
              effect.id,

            gachaItemId:
              effect.id,

            gachaItemName:
              effect.name,

            gachaItemDescription:
              effect.description,

            gachaItemRarity:
              rarity,

            gachaItemImageDataUrl:
              effect.imageDataUrl ??
              null,
          });

        setTestMessage(
          `${result.commandCount}件のコマンドを実行しました。`,
        );
      } catch (error) {
        console.error(
          "[EffectCard]",
          "景品テストに失敗しました。",
          {
            effectId:
              effect.id,

            effectName:
              effect.name,
          },
          error,
        );

        setTestError(
          error instanceof Error
            ? error.message
            : "テスト実行に失敗しました。",
        );
      } finally {
        setIsTesting(false);
      }
    };

  return (
    <article
      className={[
        "group flex h-full flex-col overflow-hidden rounded-2xl",
        "border bg-white shadow-sm transition",
        "hover:-translate-y-0.5 hover:shadow-md",
        isEnabled
          ? "border-slate-200 hover:border-violet-200"
          : "border-slate-200 opacity-65",
      ].join(" ")}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        {effect.imageDataUrl ? (
          <img
            src={
              effect.imageDataUrl
            }
            alt={
              effect.name
            }
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-slate-300">
            <ImageIcon
              size={36}
            />

            <p className="mt-2 text-xs font-bold">
              画像なし
            </p>
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span
            className={[
              "rounded-full px-2.5 py-1 text-[10px] font-black shadow-sm",
              rarityStyles[
                rarity
              ],
            ].join(" ")}
          >
            {
              rarityLabels[
                rarity
              ]
            }
          </span>

          <span
            className={[
              "rounded-full px-2.5 py-1 text-[10px] font-black shadow-sm",
              isEnabled
                ? "bg-emerald-500 text-white"
                : "bg-slate-500 text-white",
            ].join(" ")}
          >
            {isEnabled
              ? "有効"
              : "無効"}
          </span>
        </div>

        {effect.favorite ? (
          <span className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur">
            <Heart
              size={16}
              aria-label="お気に入り"
              className="fill-rose-500 text-rose-500"
            />
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-black text-slate-950">
              {
                effect.name
              }
            </h2>

            <p className="mt-1 text-xs font-semibold text-slate-400">
              ID:{" "}
              {shortenId(
                effect.id,
              )}
            </p>
          </div>

          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
            <Sparkles
              size={18}
            />
          </span>
        </div>

        <p className="mt-4 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-600">
          {effect.description ||
            "説明はまだ登録されていません。"}
        </p>

        {effect.tags.length >
        0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {effect.tags
              .slice(
                0,
                4,
              )
              .map(
                (tag) => (
                  <span
                    key={
                      tag
                    }
                    className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-700"
                  >
                    #{tag}
                  </span>
                ),
              )}

            {effect.tags.length >
            4 ? (
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
                +
                {effect.tags.length -
                  4}
              </span>
            ) : null}
          </div>
        ) : null}

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
                {
                  effect.actions
                    .length
                }
                件
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

        {testMessage ? (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-bold text-emerald-700">
            {
              testMessage
            }
          </div>
        ) : null}

        {testError ? (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-bold text-rose-700">
            {
              testError
            }
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2 border-t border-slate-200 bg-slate-50/70 px-5 py-3">
        <button
          type="button"
          onClick={
            handleTest
          }
          disabled={
            isTesting ||
            !isEnabled
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
        >
          {isTesting ? (
            <LoaderCircle
              size={15}
              className="animate-spin"
            />
          ) : (
            <Play
              size={15}
            />
          )}

          {isTesting
            ? "実行中"
            : "テスト"}
        </button>

        <button
          type="button"
          onClick={() =>
            onDelete(effect)
          }
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
        >
          <Trash2
            size={15}
          />

          削除
        </button>

        <button
          type="button"
          onClick={() =>
            onEdit(effect)
          }
          className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-violet-500"
        >
          <Pencil
            size={15}
          />

          編集
        </button>
      </div>
    </article>
  );
}

function shortenId(
  id: string,
): string {
  if (
    id.length <= 8
  ) {
    return id;
  }

  return id.slice(
    0,
    8,
  );
}

function formatRelativeDate(
  timestamp: number,
): string {
  const elapsedMilliseconds =
    Date.now() -
    timestamp;

  if (
    elapsedMilliseconds <
    0
  ) {
    return formatShortDate(
      timestamp,
    );
  }

  const elapsedSeconds =
    Math.floor(
      elapsedMilliseconds /
        1000,
    );

  if (
    elapsedSeconds < 60
  ) {
    return "たった今";
  }

  const elapsedMinutes =
    Math.floor(
      elapsedSeconds /
        60,
    );

  if (
    elapsedMinutes < 60
  ) {
    return `${elapsedMinutes}分前`;
  }

  const elapsedHours =
    Math.floor(
      elapsedMinutes /
        60,
    );

  if (
    elapsedHours < 24
  ) {
    return `${elapsedHours}時間前`;
  }

  const elapsedDays =
    Math.floor(
      elapsedHours /
        24,
    );

  if (
    elapsedDays < 7
  ) {
    return `${elapsedDays}日前`;
  }

  return formatShortDate(
    timestamp,
  );
}

function formatShortDate(
  timestamp: number,
): string {
  return new Intl.DateTimeFormat(
    "ja-JP",
    {
      year:
        "numeric",

      month:
        "short",

      day:
        "numeric",
    },
  ).format(
    new Date(timestamp),
  );
}

function formatFullDate(
  timestamp: number,
): string {
  return new Intl.DateTimeFormat(
    "ja-JP",
    {
      year:
        "numeric",

      month:
        "2-digit",

      day:
        "2-digit",

      hour:
        "2-digit",

      minute:
        "2-digit",
    },
  ).format(
    new Date(timestamp),
  );
}