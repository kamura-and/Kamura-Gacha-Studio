import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Check,
  CheckCircle2,
  Clipboard,
  Clock3,
  Command,
  Dices,
  Gamepad2,
  LoaderCircle,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

type Rarity =
  | "common"
  | "rare"
  | "epic"
  | "legendary"
  | "ultra"
  | "secret";

type GachaResult = {
  id: string;
  name: string;
  description: string;
  command: string;
  rarity: Rarity;
  rarityLabel: string;
  stars: number;
  weight: number;
};

type RarityStyle = {
  label: string;
  card: string;
  glow: string;
  badge: string;
  icon: string;
  button: string;
  progress: string;
  star: string;
};

const rarityStyles: Record<Rarity, RarityStyle> = {
  common: {
    label: "Common",
    card: "border-slate-200 bg-gradient-to-br from-white via-white to-slate-50",
    glow: "bg-slate-300/20",
    badge: "bg-slate-100 text-slate-700 ring-slate-500/20",
    icon: "bg-slate-100 text-slate-600",
    button:
      "bg-slate-900 text-white shadow-slate-900/20 hover:bg-slate-800",
    progress: "bg-slate-500",
    star: "text-slate-400",
  },
  rare: {
    label: "Rare",
    card: "border-sky-200 bg-gradient-to-br from-white via-sky-50/40 to-blue-50",
    glow: "bg-sky-400/20",
    badge: "bg-sky-100 text-sky-700 ring-sky-600/20",
    icon: "bg-sky-100 text-sky-600",
    button: "bg-sky-600 text-white shadow-sky-600/20 hover:bg-sky-500",
    progress: "bg-sky-500",
    star: "text-sky-500",
  },
  epic: {
    label: "Epic",
    card: "border-violet-200 bg-gradient-to-br from-white via-violet-50/50 to-fuchsia-50",
    glow: "bg-violet-500/20",
    badge: "bg-violet-100 text-violet-700 ring-violet-600/20",
    icon: "bg-violet-100 text-violet-600",
    button:
      "bg-violet-600 text-white shadow-violet-600/25 hover:bg-violet-500",
    progress: "bg-violet-500",
    star: "text-violet-500",
  },
  legendary: {
    label: "Legendary",
    card: "border-amber-200 bg-gradient-to-br from-white via-amber-50/60 to-orange-50",
    glow: "bg-amber-500/25",
    badge: "bg-amber-100 text-amber-800 ring-amber-600/20",
    icon: "bg-amber-100 text-amber-600",
    button:
      "bg-amber-500 text-white shadow-amber-500/25 hover:bg-amber-400",
    progress: "bg-amber-500",
    star: "text-amber-500",
  },
  ultra: {
    label: "Ultra Rare",
    card:
      "border-fuchsia-200 bg-gradient-to-br from-white via-fuchsia-50/60 to-cyan-50",
    glow: "bg-fuchsia-500/25",
    badge:
      "bg-gradient-to-r from-fuchsia-100 to-cyan-100 text-fuchsia-700 ring-fuchsia-600/20",
    icon:
      "bg-gradient-to-br from-fuchsia-100 to-cyan-100 text-fuchsia-600",
    button:
      "bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-500 text-white shadow-fuchsia-600/25 hover:brightness-110",
    progress:
      "bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-400",
    star: "text-fuchsia-500",
  },
  secret: {
    label: "Secret",
    card:
      "border-rose-200 bg-gradient-to-br from-slate-950 via-violet-950 to-rose-950 text-white",
    glow: "bg-rose-500/30",
    badge:
      "bg-white/10 text-rose-100 ring-white/20 backdrop-blur-sm",
    icon: "bg-white/10 text-rose-200 backdrop-blur-sm",
    button:
      "bg-white text-violet-950 shadow-white/20 hover:bg-rose-50",
    progress:
      "bg-gradient-to-r from-rose-400 via-fuchsia-400 to-cyan-300",
    star: "text-rose-300",
  },
};

const gachaResults: GachaResult[] = [
  {
    id: "speed-down",
    name: "鈍足の呪い",
    description: "プレイヤー全員へ短時間の移動速度低下を付与します。",
    command: "/effect give @a minecraft:slowness 8 1 true",
    rarity: "common",
    rarityLabel: "Common",
    stars: 1,
    weight: 34,
  },
  {
    id: "blindness",
    name: "視界封印",
    description: "画面を暗くし、周囲を見えにくくします。",
    command: "/effect give @a minecraft:blindness 6 0 true",
    rarity: "rare",
    rarityLabel: "Rare",
    stars: 2,
    weight: 26,
  },
  {
    id: "zombie-rain",
    name: "ゾンビレイン",
    description: "プレイヤーの周囲へゾンビを出現させます。",
    command: "/execute at @a run summon minecraft:zombie ~ ~4 ~",
    rarity: "epic",
    rarityLabel: "Epic",
    stars: 3,
    weight: 20,
  },
  {
    id: "lightning-party",
    name: "雷鳴パーティー",
    description: "プレイヤーの現在地へ雷を落とします。",
    command: "/execute at @a run summon minecraft:lightning_bolt ~ ~ ~",
    rarity: "legendary",
    rarityLabel: "Legendary",
    stars: 4,
    weight: 12,
  },
  {
    id: "black-hole",
    name: "ブラックホール",
    description: "強力な暗闇と浮遊効果で行動を大きく妨害します。",
    command:
      "/effect give @a minecraft:darkness 10 1 true",
    rarity: "ultra",
    rarityLabel: "Ultra Rare",
    stars: 5,
    weight: 7,
  },
  {
    id: "kamura-chaos",
    name: "鬼神かむらの大混乱",
    description: "複数の妨害効果が同時に発動する秘密の演出です。",
    command:
      "/effect give @a minecraft:nausea 12 1 true",
    rarity: "secret",
    rarityLabel: "Secret",
    stars: 5,
    weight: 1,
  },
];

function selectWeightedResult(results: GachaResult[]): GachaResult {
  const totalWeight = results.reduce(
    (total, result) => total + result.weight,
    0,
  );

  let randomValue = Math.random() * totalWeight;

  for (const result of results) {
    randomValue -= result.weight;

    if (randomValue <= 0) {
      return result;
    }
  }

  return results[0];
}

type DetailItemProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  dark?: boolean;
};

function DetailItem({
  icon: Icon,
  label,
  value,
  dark = false,
}: DetailItemProps) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 ${
        dark
          ? "border-white/10 bg-white/5"
          : "border-slate-200 bg-white"
      }`}
    >
      <div
        className={`flex items-center gap-2 text-xs font-semibold ${
          dark ? "text-slate-300" : "text-slate-500"
        }`}
      >
        <Icon size={14} />
        {label}
      </div>

      <p
        className={`mt-1 text-sm font-bold ${
          dark ? "text-white" : "text-slate-800"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export function TestGachaCard() {
  const [result, setResult] = useState<GachaResult>(gachaResults[2]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [executionTime, setExecutionTime] = useState(31);
  const [drawCount, setDrawCount] = useState(0);

  const styles = rarityStyles[result.rarity];
  const isSecret = result.rarity === "secret";

  const probabilityLabel = useMemo(() => {
    const totalWeight = gachaResults.reduce(
      (total, item) => total + item.weight,
      0,
    );

    const probability = (result.weight / totalWeight) * 100;

    return `${probability.toFixed(
      probability < 1 ? 1 : 0,
    )}%`;
  }, [result]);

  const handleDraw = () => {
    if (isDrawing) {
      return;
    }

    setIsDrawing(true);
    setIsCopied(false);

    window.setTimeout(() => {
      const nextResult = selectWeightedResult(gachaResults);

      setResult(nextResult);
      setExecutionTime(Math.floor(Math.random() * 41) + 18);
      setDrawCount((currentCount) => currentCount + 1);
      setIsDrawing(false);
    }, 900);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.command);
      setIsCopied(true);

      window.setTimeout(() => {
        setIsCopied(false);
      }, 1800);
    } catch (error) {
      console.error("コマンドのコピーに失敗しました。", error);
    }
  };

  return (
    <section
      aria-labelledby="test-gacha-title"
      className={`relative overflow-hidden rounded-3xl border shadow-sm transition duration-300 ${styles.card}`}
    >
      <div
        className={`pointer-events-none absolute -right-20 -top-20 size-56 rounded-full blur-3xl ${styles.glow}`}
      />

      <div
        className={`pointer-events-none absolute -bottom-24 -left-20 size-56 rounded-full blur-3xl ${styles.glow}`}
      />

      {result.rarity === "ultra" && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          initial={{ x: "-130%" }}
          animate={{ x: "130%" }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            repeatDelay: 1.5,
          }}
        />
      )}

      <div className="relative border-b border-current/10 px-6 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div
                className={`flex size-10 items-center justify-center rounded-2xl ${styles.icon}`}
              >
                <Dices size={20} />
              </div>

              <div>
                <h2
                  id="test-gacha-title"
                  className={`text-lg font-black tracking-tight ${
                    isSecret ? "text-white" : "text-slate-900"
                  }`}
                >
                  テストガチャ
                </h2>

                <p
                  className={`mt-0.5 text-sm ${
                    isSecret ? "text-slate-300" : "text-slate-500"
                  }`}
                >
                  本番実行前に抽選結果とコマンドを確認します。
                </p>
              </div>
            </div>
          </div>

          <div
            className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ring-1 ring-inset ${styles.badge}`}
          >
            <Sparkles size={14} />
            プレビューモード
          </div>
        </div>
      </div>

      <div className="relative p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={isDrawing ? "drawing" : result.id}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.25 }}
          >
            {isDrawing ? (
              <div className="flex min-h-[290px] flex-col items-center justify-center text-center">
                <motion.div
                  animate={{
                    rotate: 360,
                    scale: [1, 1.08, 1],
                  }}
                  transition={{
                    rotate: {
                      duration: 0.8,
                      repeat: Infinity,
                      ease: "linear",
                    },
                    scale: {
                      duration: 0.8,
                      repeat: Infinity,
                    },
                  }}
                  className={`flex size-20 items-center justify-center rounded-3xl ${styles.icon}`}
                >
                  <Dices size={38} />
                </motion.div>

                <p
                  className={`mt-6 text-xl font-black ${
                    isSecret ? "text-white" : "text-slate-900"
                  }`}
                >
                  抽選中...
                </p>

                <p
                  className={`mt-2 text-sm ${
                    isSecret ? "text-slate-300" : "text-slate-500"
                  }`}
                >
                  ガチャ結果を決定しています。
                </p>

                <div
                  className={`mt-6 h-2 w-full max-w-xs overflow-hidden rounded-full ${
                    isSecret ? "bg-white/10" : "bg-slate-100"
                  }`}
                >
                  <motion.div
                    className={`h-full w-1/3 rounded-full ${styles.progress}`}
                    animate={{ x: ["-100%", "300%"] }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-wide ring-1 ring-inset ${styles.badge}`}
                      >
                        <Zap size={13} />
                        {result.rarityLabel}
                      </span>

                      <span
                        className={`text-xs font-semibold ${
                          isSecret ? "text-slate-300" : "text-slate-500"
                        }`}
                      >
                        排出率 {probabilityLabel}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <motion.div
                          key={`${result.id}-star-${index}`}
                          initial={{
                            opacity: 0,
                            scale: 0,
                            rotate: -30,
                          }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            rotate: 0,
                          }}
                          transition={{
                            delay: index * 0.07,
                            type: "spring",
                            stiffness: 260,
                            damping: 16,
                          }}
                        >
                          <Star
                            size={18}
                            className={
                              index < result.stars
                                ? styles.star
                                : isSecret
                                  ? "text-white/15"
                                  : "text-slate-200"
                            }
                            fill={
                              index < result.stars
                                ? "currentColor"
                                : "none"
                            }
                          />
                        </motion.div>
                      ))}
                    </div>

                    <motion.h3
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`mt-4 text-3xl font-black tracking-tight ${
                        isSecret ? "text-white" : "text-slate-950"
                      }`}
                    >
                      {result.name}
                    </motion.h3>

                    <p
                      className={`mt-3 max-w-xl text-sm leading-6 ${
                        isSecret ? "text-slate-300" : "text-slate-600"
                      }`}
                    >
                      {result.description}
                    </p>
                  </div>

                  <motion.div
                    key={`${result.id}-icon`}
                    initial={{ scale: 0.7, rotate: -12 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 220,
                      damping: 16,
                    }}
                    className={`hidden size-24 shrink-0 items-center justify-center rounded-[28px] shadow-lg md:flex ${styles.icon}`}
                  >
                    {result.rarity === "common" && (
                      <ShieldAlert size={42} />
                    )}

                    {result.rarity === "rare" && (
                      <Gamepad2 size={42} />
                    )}

                    {result.rarity === "epic" && (
                      <Sparkles size={42} />
                    )}

                    {result.rarity === "legendary" && (
                      <Zap size={42} />
                    )}

                    {result.rarity === "ultra" && (
                      <Dices size={42} />
                    )}

                    {result.rarity === "secret" && (
                      <Star size={42} fill="currentColor" />
                    )}
                  </motion.div>
                </div>

                <div
                  className={`mt-6 overflow-hidden rounded-2xl border ${
                    isSecret
                      ? "border-white/10 bg-black/20"
                      : "border-slate-200 bg-slate-950"
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                      <Command size={14} />
                      Minecraft Command
                    </div>

                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-300 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                    >
                      {isCopied ? (
                        <>
                          <Check size={14} />
                          コピー済み
                        </>
                      ) : (
                        <>
                          <Clipboard size={14} />
                          コピー
                        </>
                      )}
                    </button>
                  </div>

                  <code className="block overflow-x-auto px-4 py-4 font-mono text-sm leading-6 text-emerald-300">
                    {result.command}
                  </code>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <DetailItem
                    icon={CheckCircle2}
                    label="実行状態"
                    value="SUCCESS"
                    dark={isSecret}
                  />

                  <DetailItem
                    icon={Clock3}
                    label="処理時間"
                    value={`${executionTime} ms`}
                    dark={isSecret}
                  />

                  <DetailItem
                    icon={Gamepad2}
                    label="送信先"
                    value="Minecraft"
                    dark={isSecret}
                  />
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div
          className={`mt-6 border-t pt-5 ${
            isSecret ? "border-white/10" : "border-slate-200"
          }`}
        >
          <motion.button
            type="button"
            onClick={handleDraw}
            disabled={isDrawing}
            whileHover={isDrawing ? undefined : { scale: 1.01 }}
            whileTap={isDrawing ? undefined : { scale: 0.98 }}
            className={`flex w-full items-center justify-center gap-3 rounded-2xl px-5 py-4 text-base font-black shadow-lg transition focus:outline-none focus:ring-4 focus:ring-violet-300/40 disabled:cursor-not-allowed disabled:opacity-70 ${styles.button}`}
          >
            {isDrawing ? (
              <>
                <LoaderCircle
                  size={20}
                  className="animate-spin"
                />
                抽選しています
              </>
            ) : (
              <>
                {drawCount === 0 ? (
                  <Dices size={21} />
                ) : (
                  <RotateCcw size={20} />
                )}

                {drawCount === 0
                  ? "テストガチャを回す"
                  : "もう一度ガチャを回す"}
              </>
            )}
          </motion.button>

          <div
            className={`mt-3 flex items-center justify-between gap-4 text-xs ${
              isSecret ? "text-slate-400" : "text-slate-500"
            }`}
          >
            <span>実際のMinecraftコマンドは送信されません。</span>

            <span className="shrink-0 font-semibold">
              テスト回数：{drawCount}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}