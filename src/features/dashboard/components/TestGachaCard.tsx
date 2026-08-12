import {
  AlertCircle,
  CheckCircle2,
  Dices,
  Layers3,
  LoaderCircle,
  RotateCcw,
  Sparkles,
  Zap,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
} from "motion/react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  gachaExecutionRuntime,
} from "@/features/gacha/runtime/GachaExecutionRuntime";

import {
  presentationRuntime,
} from "@/features/presentation/runtime/PresentationRuntime";

import type {
  ExecuteGachaResult,
} from "@/features/gacha/runtime/GachaExecutionRuntime";

import {
  useGachaStore,
} from "@/features/gacha/store/gachaStore";

import {
  useEffectStore,
} from "@/features/effects/store/effectStore";

import type {
  GachaRarity,
} from "@/features/gacha/types/gacha";

import {
  executionHistoryRuntime,
} from "@/features/history/runtime/ExecutionHistoryRuntime";

import {
  gachaOverlayRuntime,
} from "@/features/overlay/runtime/GachaOverlayRuntime";

import {
  usePoolStore,
} from "@/features/pools/store/poolStore";

const DASHBOARD_TEST_TRIGGER_ID =
  "dashboard-test";

const DASHBOARD_TEST_TRIGGER_NAME =
  "ダッシュボードテスト";

const rarityLabels = {
  common: "コモン",
  rare: "レア",
  epic: "エピック",
  legendary: "レジェンダリー",
  ultra: "ウルトラレア",
  secret: "シークレット",
} as const;

const rarityStyles = {
  common: {
    badge:
      "bg-slate-100 text-slate-700",

    icon:
      "bg-slate-100 text-slate-600",
  },

  rare: {
    badge:
      "bg-sky-100 text-sky-700",

    icon:
      "bg-sky-100 text-sky-600",
  },

  epic: {
    badge:
      "bg-violet-100 text-violet-700",

    icon:
      "bg-violet-100 text-violet-600",
  },

  legendary: {
    badge:
      "bg-amber-100 text-amber-700",

    icon:
      "bg-amber-100 text-amber-600",
  },

  ultra: {
    badge:
      "bg-fuchsia-100 text-fuchsia-700",

    icon:
      "bg-fuchsia-100 text-fuchsia-600",
  },

  secret: {
    badge:
      "bg-rose-100 text-rose-700",

    icon:
      "bg-rose-100 text-rose-600",
  },
} as const;

type ResolvedSpinPrize = {
  id: string;

  name: string;

  description: string;

  rarity: GachaRarity;

  imageDataUrl:
  | string
  | null;

  effectId:
  | string
  | null;
};

function getSpinPrize(
  result: ExecuteGachaResult,
): ResolvedSpinPrize {
  if (
    result.spin.source ===
    "effect"
  ) {
    const effect =
      result.spin.effect;

    return {
      id:
        effect.id,

      name:
        effect.name,

      description:
        effect.description,

      rarity:
        effect.rarity ??
        "common",

      imageDataUrl:
        effect.imageDataUrl ??
        null,

      effectId:
        effect.id,
    };
  }

  const item =
    result.spin.item;

  return {
    id:
      item.id,

    name:
      item.name,

    description:
      item.description,

    rarity:
      item.rarity,

    imageDataUrl:
      item.imageDataUrl ??
      null,

    effectId:
      item.effectId ??
      null,
  };
}

function createDashboardEventId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID ===
    "function"
  ) {
    return `dashboard-test-${crypto.randomUUID()}`;
  }

  return [
    "dashboard-test",
    Date.now().toString(36),
    Math.random()
      .toString(36)
      .slice(2, 10),
  ].join("-");
}

function getExecutionModeLabel(
  result: ExecuteGachaResult,
): string {
  switch (result.mode) {
    case "effect":
      return "エフェクト";

    case "legacy-effect":
      return "旧景品＋エフェクト";

    case "legacy-commands":
      return "旧形式コマンド";

    case "none":
      return "実行内容なし";
  }
}

function getCommandCount(
  result: ExecuteGachaResult,
): number {
  if (
    result.mode === "effect" ||
    result.mode ===
    "legacy-effect"
  ) {
    return (
      result.effect?.commandCount ??
      0
    );
  }

  return result.legacyCommandCount;
}

export function TestGachaCard() {
  const pools = usePoolStore(
    (state) => state.pools,
  );

  const loadPools = usePoolStore(
    (state) => state.loadPools,
  );

  const gachaItems = useGachaStore(
    (state) => state.items,
  );

  const effects =
    useEffectStore(
      (state) =>
        state.effects,
    );

  const loadEffects =
    useEffectStore(
      (state) =>
        state.loadEffects,
    );

  const enabledPools = useMemo(
    () =>
      pools.filter(
        (pool) => pool.enabled,
      ),
    [pools],
  );

  const [
    selectedPoolId,
    setSelectedPoolId,
  ] = useState("");

  const [
    result,
    setResult,
  ] =
    useState<ExecuteGachaResult>();

  const [
    isDrawing,
    setIsDrawing,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    drawCount,
    setDrawCount,
  ] = useState(0);

  useEffect(() => {
    loadPools();
    loadEffects();
  }, [
    loadPools,
    loadEffects,
  ]);

  useEffect(() => {
    if (
      selectedPoolId &&
      enabledPools.some(
        (pool) =>
          pool.id === selectedPoolId,
      )
    ) {
      return;
    }

    setSelectedPoolId(
      enabledPools[0]?.id ?? "",
    );
  }, [
    enabledPools,
    selectedPoolId,
  ]);

  const selectedPool =
    enabledPools.find(
      (pool) =>
        pool.id === selectedPoolId,
    );

  const selectedPoolStats =
    useMemo(() => {
      if (!selectedPool) {
        return {
          entryCount: 0,
          enabledItemCount: 0,
          totalWeight: 0,
        };
      }

      const enabledItemCount =
        selectedPool.entries.filter(
          (entry) => {
            const effectId =
              entry.effectId?.trim();

            if (effectId) {
              const effect =
                effects.find(
                  (candidate) =>
                    candidate.id ===
                    effectId,
                );

              return (
                effect?.isEnabled !==
                false &&
                effect !== undefined
              );
            }

            const gachaItemId =
              entry.gachaItemId?.trim();

            if (!gachaItemId) {
              return false;
            }

            const item =
              gachaItems.find(
                (candidate) =>
                  candidate.id ===
                  gachaItemId,
              );

            return Boolean(
              item?.isEnabled,
            );
          },
        ).length;

      const totalWeight =
        selectedPool.entries.reduce(
          (total, entry) =>
            total +
            Math.max(
              0,
              entry.weight,
            ),
          0,
        );

      return {
        entryCount:
          selectedPool.entries.length,

        enabledItemCount,

        totalWeight,
      };
    }, [
      effects,
      gachaItems,
      selectedPool,
    ]);

  const resultPrize =
    result
      ? getSpinPrize(result)
      : undefined;

  const rarityStyle =
    resultPrize
      ? rarityStyles[
      resultPrize.rarity
      ]
      : undefined;

  const handleDraw =
    async (): Promise<void> => {
      if (
        isDrawing ||
        !selectedPool
      ) {
        return;
      }

      setIsDrawing(true);
      setErrorMessage("");

      try {
        await new Promise<void>(
          (resolve) => {
            window.setTimeout(
              resolve,
              650,
            );
          },
        );

        const executionResult =
          gachaExecutionRuntime.execute({
            gachaPoolId:
              selectedPool.id,
          });

        const prize =
          getSpinPrize(
            executionResult,
          );

        executionHistoryRuntime.recordSuccess({
          eventId:
            createDashboardEventId(),

          triggerId:
            DASHBOARD_TEST_TRIGGER_ID,

          triggerName:
            `${DASHBOARD_TEST_TRIGGER_NAME}：${selectedPool.name}`,

          gachaPoolId:
            executionResult.spin
              .gachaPoolId,

          poolEntryId:
            executionResult.spin
              .poolEntry.id,

          gachaItemId:
            prize.id,

          gachaItemName:
            prize.name,

          effectId:
            prize.effectId,

          mode:
            executionResult.mode,

          commandCount:
            getCommandCount(
              executionResult,
            ),

          drawnAt:
            executionResult.spin.drawnAt,
        });

        setResult(
          executionResult,
        );

        await presentationRuntime.play({
          presetId:
            "chest",

          item: {
            id:
              prize.id,

            name:
              prize.name,

            description:
              prize.description,

            rarity:
              prize.rarity,

            imageDataUrl:
              prize.imageDataUrl,
          },
        });

        setDrawCount(
          (currentCount) =>
            currentCount + 1,
        );
      } catch (error) {
        console.error(
          "[TestGachaCard]",
          "テストガチャの実行に失敗しました。",
          error,
        );

        const nextErrorMessage =
          error instanceof Error
            ? error.message
            : "テストガチャの実行に失敗しました。";

        setErrorMessage(
          nextErrorMessage,
        );

        gachaOverlayRuntime.showError(
          nextErrorMessage,
        );
      } finally {
        setIsDrawing(false);
      }
    };

  return (
    <section
      aria-labelledby="test-gacha-title"
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
              <Dices size={22} />
            </span>

            <div>
              <h2
                id="test-gacha-title"
                className="text-lg font-black tracking-tight text-slate-950"
              >
                テストガチャ箱
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                ガチャ箱を選び、抽選からMinecraft送信まで確認します。
              </p>
            </div>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-black text-emerald-700">
            <Zap size={14} />
            Minecraftへ送信
          </span>
        </div>
      </div>

      <div className="p-6">
        <div>
          <label
            htmlFor="dashboard-test-pool"
            className="text-xs font-black uppercase tracking-wider text-slate-500"
          >
            テストするガチャ箱
          </label>

          <select
            id="dashboard-test-pool"
            value={selectedPoolId}
            onChange={(event) => {
              setSelectedPoolId(
                event.target.value,
              );

              setResult(undefined);
              setErrorMessage("");

              gachaOverlayRuntime.hide();
            }}
            disabled={
              isDrawing ||
              enabledPools.length === 0
            }
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
          >
            {enabledPools.length === 0 ? (
              <option value="">
                有効なガチャ箱がありません
              </option>
            ) : (
              enabledPools.map(
                (pool) => (
                  <option
                    key={pool.id}
                    value={pool.id}
                  >
                    {pool.name}
                  </option>
                ),
              )
            )}
          </select>
        </div>

        {selectedPool ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-bold text-slate-400">
                登録景品
              </p>

              <p className="mt-1 text-xl font-black text-slate-800">
                {
                  selectedPoolStats.entryCount
                }
                件
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-bold text-slate-400">
                有効な景品
              </p>

              <p className="mt-1 text-xl font-black text-emerald-700">
                {
                  selectedPoolStats.enabledItemCount
                }
                件
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-bold text-slate-400">
                合計重み
              </p>

              <p className="mt-1 text-xl font-black text-violet-700">
                {
                  selectedPoolStats.totalWeight
                }
              </p>
            </div>
          </div>
        ) : null}

        <AnimatePresence mode="wait">
          {isDrawing ? (
            <motion.div
              key="drawing"
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              className="mt-6 flex min-h-56 flex-col items-center justify-center rounded-3xl border border-violet-200 bg-violet-50 text-center"
            >
              <LoaderCircle
                size={42}
                className="animate-spin text-violet-600"
              />

              <p className="mt-5 text-lg font-black text-slate-950">
                抽選・実行中...
              </p>

              <p className="mt-2 text-sm text-slate-500">
                景品抽選からMinecraft送信まで実行しています。
              </p>
            </motion.div>
          ) : result ? (
            <motion.div
              key={`${resultPrize?.id ?? "unknown"}-${result.spin.drawnAt}`}
              initial={{
                opacity: 0,
                y: 12,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={[
                        "rounded-full px-3 py-1.5 text-xs font-black",
                        rarityStyle?.badge,
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {
                        resultPrize
                          ? rarityLabels[
                          resultPrize.rarity
                          ]
                          : ""
                      }
                    </span>

                    <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-black text-emerald-700">
                      実行成功
                    </span>
                  </div>

                  <h3 className="mt-4 text-2xl font-black tracking-tight text-slate-950">
                    {
                      resultPrize?.name ?? ""
                    }
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {
                      resultPrize?.description ?? ""
                    }
                  </p>
                </div>

                <span
                  className={[
                    "flex size-16 shrink-0 items-center justify-center rounded-2xl",
                    rarityStyle?.icon,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <Sparkles size={30} />
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <Layers3 size={14} />
                    実行方式
                  </div>

                  <p className="mt-1 text-sm font-black text-slate-800">
                    {
                      getExecutionModeLabel(
                        result,
                      )
                    }
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <Zap size={14} />
                    生成コマンド
                  </div>

                  <p className="mt-1 text-sm font-black text-slate-800">
                    {getCommandCount(
                      result,
                    )}
                    件
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <CheckCircle2 size={14} />
                    履歴
                  </div>

                  <p className="mt-1 text-sm font-black text-slate-800">
                    保存済み
                  </p>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {errorMessage ? (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="text-sm font-black">
                実行できませんでした
              </p>

              <p className="mt-1 text-xs leading-5">
                {errorMessage}
              </p>
            </div>
          </div>
        ) : null}

        <motion.button
          type="button"
          onClick={handleDraw}
          disabled={
            isDrawing ||
            !selectedPool ||
            selectedPoolStats.enabledItemCount ===
            0 ||
            selectedPoolStats.totalWeight <=
            0
          }
          whileHover={
            isDrawing ||
              !selectedPool
              ? undefined
              : {
                scale: 1.01,
              }
          }
          whileTap={
            isDrawing ||
              !selectedPool
              ? undefined
              : {
                scale: 0.98,
              }
          }
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-violet-600 px-5 py-4 text-base font-black text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isDrawing ? (
            <>
              <LoaderCircle
                size={20}
                className="animate-spin"
              />

              抽選しています
            </>
          ) : drawCount === 0 ? (
            <>
              <Dices size={21} />

              ガチャ箱を回す
            </>
          ) : (
            <>
              <RotateCcw size={20} />

              もう一度回す
            </>
          )}
        </motion.button>

        <div className="mt-3 flex flex-col gap-1 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            実際にMinecraftへ送信され、実行履歴にも保存されます。
          </span>

          <span className="shrink-0 font-bold">
            テスト回数：{drawCount}
          </span>
        </div>
      </div>
    </section>
  );
}