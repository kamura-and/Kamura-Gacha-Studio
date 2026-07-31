import {
  Check,
  Clock3,
  Command,
  Layers3,
  MessageCircle,
  Monitor,
  Pencil,
  Trash2,
  Volume2,
} from "lucide-react";
import { motion } from "motion/react";

import { useEffectStore } from "@/features/effects/store/effectStore";

import { GachaQueueTestButton } from "@/features/queue/components/GachaQueueTestButton";
import { useCommandQueueStore } from "@/features/queue/store/commandQueueStore";

import type {
  GachaActionType,
  GachaItem,
} from "@/features/gacha/types/gacha";

type GachaItemCardProps = {
  item: GachaItem;
  onToggleEnabled: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
};

const rarityLabels = {
  common: "コモン",
  rare: "レア",
  epic: "エピック",
  legendary: "レジェンダリー",
  ultra: "ウルトラレア",
  secret: "シークレット",
} as const;

const rarityStyles = {
  common: "bg-slate-100 text-slate-700",
  rare: "bg-sky-100 text-sky-700",
  epic: "bg-violet-100 text-violet-700",
  legendary: "bg-amber-100 text-amber-700",
  ultra: "bg-fuchsia-100 text-fuchsia-700",
  secret: "bg-rose-100 text-rose-700",
} as const;

function getActionLabel(
  type: GachaActionType,
): string {
  switch (type) {
    case "minecraft":
      return "Minecraft";

    case "obs":
      return "OBS";

    case "overlay":
      return "Overlay";

    case "sound":
      return "Sound";

    case "wait":
      return "Wait";

    case "discord":
      return "Discord";

    default: {
      const exhaustiveCheck: never =
        type;

      return exhaustiveCheck;
    }
  }
}

function getActionIcon(
  type: GachaActionType,
) {
  switch (type) {
    case "minecraft":
      return <Command size={14} />;

    case "obs":
      return <Monitor size={14} />;

    case "overlay":
      return <Layers3 size={14} />;

    case "sound":
      return <Volume2 size={14} />;

    case "wait":
      return <Clock3 size={14} />;

    case "discord":
      return <MessageCircle size={14} />;

    default: {
      const exhaustiveCheck: never =
        type;

      return exhaustiveCheck;
    }
  }
}

export function GachaItemCard({
  item,
  onToggleEnabled,
  onDelete,
  onEdit,
}: GachaItemCardProps) {
  const linkedEffect = useEffectStore(
    (state) =>
      item.effectId
        ? state.effects.find(
          (effect) =>
            effect.id ===
            item.effectId,
        )
        : undefined,
  );

  const queueItems =
    useCommandQueueStore(
      (state) => state.items,
    );

  const currentItemId =
    useCommandQueueStore(
      (state) =>
        state.currentItemId,
    );

  const enabledCommands =
    item.commands.filter(
      (command) =>
        command.enabled,
    );

  const currentQueueItem =
    queueItems.find(
      (queueItem) =>
        queueItem.id ===
        currentItemId,
    );

  const isCurrentlyRunning =
    currentQueueItem?.gachaItemId ===
    item.id &&
    currentQueueItem.status ===
    "running";

  const queuedCount =
    queueItems.filter(
      (queueItem) =>
        queueItem.gachaItemId ===
        item.id &&
        queueItem.status ===
        "pending",
    ).length;

  const completedCount =
    queueItems.filter(
      (queueItem) =>
        queueItem.gachaItemId ===
        item.id &&
        queueItem.status ===
        "completed",
    ).length;

  const failedCount =
    queueItems.filter(
      (queueItem) =>
        queueItem.gachaItemId ===
        item.id &&
        queueItem.status ===
        "failed",
    ).length;

  const handleDelete = () => {
    const shouldDelete =
      window.confirm(
        `「${item.name}」を削除しますか？`,
      );

    if (shouldDelete) {
      onDelete(item.id);
    }
  };

  return (
    <motion.article
      layout
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        scale: 0.97,
      }}
      className={[
        "rounded-3xl border bg-white p-5 shadow-sm transition",
        item.isEnabled
          ? "border-slate-200"
          : "border-slate-200 opacity-60",
      ].join(" ")}
    >
      <div className="flex items-start gap-4">
        {item.imageDataUrl ? (
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            <img
              src={item.imageDataUrl}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-xs font-bold text-slate-400">
            No Image
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={[
                "rounded-full px-2.5 py-1 text-[11px] font-black",
                rarityStyles[
                item.rarity
                ],
              ].join(" ")}
            >
              {
                rarityLabels[
                item.rarity
                ]
              }
            </span>

            <span
              className={[
                "rounded-full px-2.5 py-1 text-[11px] font-black",
                item.isEnabled
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-200 text-slate-500",
              ].join(" ")}
            >
              {item.isEnabled
                ? "有効"
                : "無効"}
            </span>

            {isCurrentlyRunning ? (
              <span className="animate-pulse rounded-full bg-violet-600 px-2.5 py-1 text-[11px] font-black text-white">
                実行中
              </span>
            ) : null}

            {queuedCount > 0 ? (
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-black text-amber-700">
                待機中 ×{" "}
                {queuedCount}
              </span>
            ) : null}

            {failedCount > 0 ? (
              <span className="rounded-full bg-rose-100 px-2.5 py-1 text-[11px] font-black text-rose-700">
                失敗 ×{" "}
                {failedCount}
              </span>
            ) : null}

            {completedCount > 0 &&
              !isCurrentlyRunning &&
              queuedCount === 0 &&
              failedCount === 0 ? (
              <span className="rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-black text-sky-700">
                実行済み
              </span>
            ) : null}
          </div>

          <h3 className="mt-3 truncate text-lg font-black text-slate-950">
            {item.name}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {item.description}
          </p>
        </div>
        <div className="ml-auto">
          <button
            type="button"
            onClick={() =>
              onToggleEnabled(item.id)
            }
            className={[
              "relative h-7 w-12 shrink-0 rounded-full transition",
              item.isEnabled
                ? "bg-emerald-500"
                : "bg-slate-300",
            ].join(" ")}
            aria-label={`${item.name}の有効状態を切り替える`}
            aria-pressed={
              item.isEnabled
            }
          >
            <motion.span
              className="absolute top-1 flex size-5 items-center justify-center rounded-full bg-white shadow-sm"
              animate={{
                left: item.isEnabled
                  ? 24
                  : 4,
              }}
            >
              {item.isEnabled ? (
                <Check
                  size={12}
                  className="text-emerald-600"
                />
              ) : null}
            </motion.span>
          </button>
        </div>
      </div>
      {item.effectId ? (
        <div className="mt-5 rounded-2xl border border-violet-200 bg-violet-50/60 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-black uppercase tracking-wider text-violet-600">
              連携エフェクト
            </p>

            {linkedEffect ? (
              <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-black text-violet-700">
                {
                  linkedEffect
                    .actions
                    .length
                }
                アクション
              </span>
            ) : null}
          </div>

          {linkedEffect ? (
            <div className="mt-3 rounded-2xl border border-violet-100 bg-white p-4">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                  <Layers3
                    size={18}
                  />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="font-black text-slate-900">
                    {
                      linkedEffect.name
                    }
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {linkedEffect.description ||
                      "説明はありません。"}
                  </p>

                  {linkedEffect.tags
                    .length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {linkedEffect.tags.map(
                        (tag) => (
                          <span
                            key={
                              tag
                            }
                            className="rounded-lg bg-violet-100 px-2 py-1 text-[11px] font-bold text-violet-700"
                          >
                            {tag}
                          </span>
                        ),
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-4 text-center">
              <p className="text-xs font-black text-rose-700">
                連携エフェクトが見つかりません。
              </p>

              <p className="mt-1 text-xs text-rose-500">
                エフェクトが削除された可能性があります。
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-black uppercase tracking-wider text-slate-500">
              旧形式アクション
            </p>

            <p className="text-xs font-bold text-slate-500">
              {
                enabledCommands.length
              }{" "}
              /{" "}
              {
                item.commands
                  .length
              }{" "}
              actions
            </p>
          </div>

          {item.commands.length >
            0 ? (
            <div className="mt-3 space-y-2">
              {item.commands
                .slice(0, 4)
                .map(
                  (
                    command,
                    index,
                  ) => (
                    <div
                      key={
                        command.id
                      }
                      className={[
                        "flex items-center gap-3 rounded-xl bg-white px-3 py-2.5",
                        command.enabled
                          ? ""
                          : "opacity-40",
                      ].join(
                        " ",
                      )}
                    >
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
                        {getActionIcon(
                          command.type,
                        )}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-black text-slate-700">
                          {index +
                            1}
                          .{" "}
                          {getActionLabel(
                            command.type,
                          )}
                        </p>

                        <p className="truncate font-mono text-[11px] text-slate-500">
                          {command.type ===
                            "wait"
                            ? `${command.value ||
                            command.delay
                            }ms 待機`
                            : command.value ||
                            "値が未設定です"}
                        </p>
                      </div>

                      {command.type !==
                        "wait" ? (
                        <span className="shrink-0 text-[11px] font-bold text-slate-400">
                          +
                          {
                            command.delay
                          }
                          ms
                        </span>
                      ) : null}
                    </div>
                  ),
                )}
            </div>
          ) : (
            <p className="mt-3 rounded-xl bg-white px-3 py-4 text-center text-xs font-bold text-slate-400">
              エフェクトが設定されていない旧形式の景品です。
            </p>
          )}

          {item.commands.length >
            4 ? (
            <p className="mt-3 text-center text-xs font-bold text-slate-400">
              ほか{" "}
              {item.commands
                .length - 4}
              件
            </p>
          ) : null}
        </div>
      )}

      <div className="mt-5 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] gap-2">
        <GachaQueueTestButton
          item={item}
          className="inline-flex min-w-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
        />

        <button
          type="button"
          onClick={() =>
            onEdit(item.id)
          }
          className="inline-flex min-w-0 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-violet-500"
        >
          <Pencil size={15} />
          編集
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="inline-flex items-center justify-center rounded-xl border border-rose-200 px-3 py-2.5 text-rose-600 transition hover:bg-rose-50"
          aria-label={`${item.name}を削除`}
          title="削除"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.article>
  );
}