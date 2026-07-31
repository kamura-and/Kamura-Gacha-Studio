import {
  AnimatePresence,
  motion,
} from "motion/react";

import {
  AlertCircle,
  Sparkles,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  kamuraChestAssets,
} from "@/features/presentation/assets/KamuraChestAssets";

import {
  gachaOverlayRuntime,
} from "../runtime/GachaOverlayRuntime";

import type {
  GachaOverlayEvent,
  GachaOverlayRarity,
} from "../types/GachaOverlayEvent";

const rarityLabels: Record<
  GachaOverlayRarity,
  string
> = {
  common: "COMMON",
  rare: "RARE",
  epic: "EPIC",
  legendary: "LEGENDARY",
  ultra: "ULTRA RARE",
  secret: "SECRET",
};

const rarityStyles: Record<
  GachaOverlayRarity,
  {
    badge: string;
    glow: string;
    light: string;
    icon: string;
  }
> = {
  common: {
    badge:
      "border-slate-300 bg-slate-100 text-slate-700",
    glow:
      "shadow-slate-400/30",
    light:
      "from-slate-200/70 via-white/80 to-slate-300/70",
    icon:
      "bg-slate-100 text-slate-600",
  },

  rare: {
    badge:
      "border-sky-300 bg-sky-100 text-sky-700",
    glow:
      "shadow-sky-500/30",
    light:
      "from-sky-300/70 via-white/90 to-cyan-300/70",
    icon:
      "bg-sky-100 text-sky-600",
  },

  epic: {
    badge:
      "border-violet-300 bg-violet-100 text-violet-700",
    glow:
      "shadow-violet-500/40",
    light:
      "from-violet-400/70 via-white/90 to-fuchsia-400/70",
    icon:
      "bg-violet-100 text-violet-600",
  },

  legendary: {
    badge:
      "border-amber-300 bg-amber-100 text-amber-700",
    glow:
      "shadow-amber-500/50",
    light:
      "from-amber-300/80 via-white to-yellow-400/80",
    icon:
      "bg-amber-100 text-amber-600",
  },

  ultra: {
    badge:
      "border-fuchsia-300 bg-fuchsia-100 text-fuchsia-700",
    glow:
      "shadow-fuchsia-500/50",
    light:
      "from-fuchsia-400/80 via-cyan-200 to-violet-500/80",
    icon:
      "bg-fuchsia-100 text-fuchsia-600",
  },

  secret: {
    badge:
      "border-rose-300 bg-rose-100 text-rose-700",
    glow:
      "shadow-rose-500/60",
    light:
      "from-rose-500/80 via-violet-300 to-slate-950/80",
    icon:
      "bg-rose-100 text-rose-600",
  },
};


type RarityPresentationProfile = {
  flashClassName: string;
  flashOpacity: number;
  glowScale: number;
  sparkleScale: number;
  sparkleRotate: number;
  ringCount: number;
  ringClassName: string;
};

const rarityPresentationProfiles: Record<
  GachaOverlayRarity,
  RarityPresentationProfile
> = {
  common: {
    flashClassName: "bg-white",
    flashOpacity: 0.18,
    glowScale: 1.05,
    sparkleScale: 0.9,
    sparkleRotate: 0,
    ringCount: 0,
    ringClassName: "border-white/50",
  },

  rare: {
    flashClassName: "bg-sky-200",
    flashOpacity: 0.28,
    glowScale: 1.12,
    sparkleScale: 1,
    sparkleRotate: 4,
    ringCount: 1,
    ringClassName: "border-sky-300/70",
  },

  epic: {
    flashClassName: "bg-violet-300",
    flashOpacity: 0.38,
    glowScale: 1.22,
    sparkleScale: 1.08,
    sparkleRotate: 8,
    ringCount: 2,
    ringClassName: "border-violet-300/75",
  },

  legendary: {
    flashClassName: "bg-amber-200",
    flashOpacity: 0.52,
    glowScale: 1.35,
    sparkleScale: 1.18,
    sparkleRotate: 12,
    ringCount: 3,
    ringClassName: "border-amber-300/80",
  },

  ultra: {
    flashClassName:
      "bg-gradient-to-br from-fuchsia-300 via-cyan-200 to-violet-300",
    flashOpacity: 0.62,
    glowScale: 1.48,
    sparkleScale: 1.3,
    sparkleRotate: 18,
    ringCount: 4,
    ringClassName: "border-fuchsia-300/80",
  },

  secret: {
    flashClassName:
      "bg-gradient-to-br from-slate-950 via-violet-700 to-rose-500",
    flashOpacity: 0.72,
    glowScale: 1.62,
    sparkleScale: 1.42,
    sparkleRotate: 24,
    ringCount: 5,
    ringClassName: "border-rose-300/85",
  },
};

export function GachaOverlay() {
  const [
    overlayEvent,
    setOverlayEvent,
  ] = useState<GachaOverlayEvent>({
    type: "hide",
  });

  const hideTimerRef =
    useRef<number | null>(null);

  useEffect(() => {
    const clearHideTimer =
      (): void => {
        if (
          hideTimerRef.current ===
          null
        ) {
          return;
        }

        window.clearTimeout(
          hideTimerRef.current,
        );

        hideTimerRef.current =
          null;
      };

    const unsubscribe =
      gachaOverlayRuntime.subscribe(
        (event) => {
          clearHideTimer();

          setOverlayEvent(event);

          if (
            event.type === "result"
          ) {
            hideTimerRef.current =
              window.setTimeout(
                () => {
                  setOverlayEvent({
                    type: "hide",
                  });
                },
                4500,
              );
          }

          if (
            event.type ===
              "presentation" &&
            event.phase ===
              "finishing"
          ) {
            hideTimerRef.current =
              window.setTimeout(
                () => {
                  setOverlayEvent({
                    type: "hide",
                  });
                },
                350,
              );
          }

          if (
            event.type === "error"
          ) {
            hideTimerRef.current =
              window.setTimeout(
                () => {
                  setOverlayEvent({
                    type: "hide",
                  });
                },
                3500,
              );
          }
        },
      );

    return () => {
      clearHideTimer();
      unsubscribe();
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden p-8">
      <AnimatePresence mode="wait">
        {overlayEvent.type ===
        "presentation" ? (
          <ChestPresentationOverlay
            key={[
              overlayEvent.presetId,
              overlayEvent.itemId,
            ].join("-")}
            event={overlayEvent}
          />
        ) : null}

        {overlayEvent.type ===
        "result" ? (
          <ResultOverlay
            key={[
              overlayEvent.itemId,
              overlayEvent.itemName,
            ].join("-")}
            event={overlayEvent}
          />
        ) : null}

        {overlayEvent.type ===
        "error" ? (
          <ErrorOverlay
            key="error"
            message={
              overlayEvent.message
            }
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

type PresentationEvent =
  Extract<
    GachaOverlayEvent,
    {
      type: "presentation";
    }
  >;

function ChestPresentationOverlay({
  event,
}: {
  event: PresentationEvent;
}) {
  const rarityStyle =
    rarityStyles[event.rarity];

  const rarityProfile =
    rarityPresentationProfiles[
      event.rarity
    ];

  const isRevealing =
    event.phase ===
      "revealing" ||
    event.phase ===
      "result" ||
    event.phase ===
      "finishing";

  const isResult =
    event.phase ===
      "result" ||
    event.phase ===
      "finishing";

  const isFinishing =
    event.phase ===
    "finishing";

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.85,
        y: -70,
      }}
      animate={{
        opacity:
          isFinishing
            ? 0
            : 1,

        scale:
          isFinishing
            ? 1.08
            : 1,

        y: 0,
      }}
      exit={{
        opacity: 0,
        scale: 1.08,
      }}
      transition={{
        type: "spring",
        stiffness: 230,
        damping: 19,
      }}
      className="relative flex w-full max-w-3xl flex-col items-center justify-center"
    >
      <AnimatePresence>
        {event.phase ===
        "revealing" ? (
          <motion.div
            key={[
              "rarity-flash",
              event.itemId,
              event.rarity,
            ].join("-")}
            aria-hidden="true"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: [
                0,
                rarityProfile.flashOpacity,
                0,
              ],
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration:
                event.rarity ===
                "secret"
                  ? 0.9
                  : 0.55,
              ease: "easeOut",
            }}
            className={[
              "fixed inset-0 z-0",
              rarityProfile
                .flashClassName,
            ].join(" ")}
          />
        ) : null}
      </AnimatePresence>

      {event.rarity ===
        "secret" &&
      !isResult ? (
        <motion.div
          aria-hidden="true"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity:
              event.phase ===
              "revealing"
                ? 0
                : 0.48,
          }}
          className="fixed inset-0 z-0 bg-slate-950"
        />
      ) : null}

      {isRevealing ? (
        <motion.div
          aria-hidden="true"
          initial={{
            opacity: 0,
            scale: 0.4,
          }}
          animate={{
            opacity:
              isResult
                ? 0.95
                : 0.65,

            scale:
              isResult
                ? rarityProfile
                    .glowScale
                : Math.max(
                    1,
                    rarityProfile
                      .glowScale -
                      0.2,
                  ),
          }}
          transition={{
            duration: 0.35,
          }}
          className={[
            "absolute size-[28rem] rounded-full",
            "bg-gradient-to-br blur-3xl",
            rarityStyle.light,
          ].join(" ")}
        />
      ) : null}

      {isRevealing &&
      rarityProfile.ringCount >
        0 ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
        >
          {Array.from({
            length:
              rarityProfile.ringCount,
          }).map((_, index) => (
            <motion.span
              key={[
                "rarity-ring",
                event.itemId,
                index,
              ].join("-")}
              initial={{
                opacity: 0,
                scale: 0.25,
              }}
              animate={{
                opacity: [
                  0,
                  0.85,
                  0,
                ],
                scale: [
                  0.25,
                  1 +
                    index *
                      0.16,
                  1.55 +
                    index *
                      0.2,
                ],
              }}
              transition={{
                duration:
                  0.9 +
                  index *
                    0.12,
                delay:
                  index *
                  0.08,
                ease: "easeOut",
              }}
              className={[
                "absolute size-72 rounded-full border-4",
                rarityProfile
                  .ringClassName,
              ].join(" ")}
            />
          ))}
        </div>
      ) : null}

      {!isResult ? (
        <motion.div
          initial={{
            opacity: 0,
            y: -420,
            scale: 0.85,
          }}
          animate={
            event.phase ===
            "drawing"
              ? {
                  opacity: 1,

                  y: [
                    0,
                    2,
                    -3,
                    1,
                    -2,
                    0,
                  ],

                  x: [
                    0,
                    -7,
                    7,
                    -5,
                    5,
                    0,
                  ],

                  rotate: [
                    0,
                    -4,
                    4,
                    -3,
                    3,
                    0,
                  ],

                  scale: [
                    1,
                    0.98,
                    1.02,
                    1,
                  ],
                }
              : {
                  opacity: 1,
                  y: 0,
                  x: 0,
                  rotate: 0,

                  scale:
                    isRevealing
                      ? 1.08
                      : 1,
                }
          }
          transition={
            event.phase ===
            "drawing"
              ? {
                  duration: 0.52,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
              : {
                  type: "spring",
                  stiffness: 170,
                  damping: 15,
                }
          }
          className="relative z-10 mt-4 flex h-80 w-80 items-center justify-center sm:h-96 sm:w-96"
        >
          <div
            aria-hidden="true"
            className={[
              "absolute bottom-6 left-1/2 h-20 w-72",
              "-translate-x-1/2 rounded-full",
              "bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.65),rgba(59,130,246,0.28)_45%,transparent_72%)]",
              "blur-xl",
            ].join(" ")}
          />

          <AnimatePresence>
            {isRevealing ? (
              <motion.img
                key="kamura-chest-glow"
                src={
                  kamuraChestAssets.glow
                }
                alt=""
                aria-hidden="true"
                initial={{
                  opacity: 0,
                  scale: 0.45,
                }}
                animate={{
                  opacity: [
                    0,
                    1,
                    0.78,
                  ],

                  scale: [
                    0.45,
                    rarityProfile
                      .glowScale,
                    Math.max(
                      1,
                      rarityProfile
                        .glowScale -
                        0.12,
                    ),
                  ],
                }}
                exit={{
                  opacity: 0,
                  scale: 1.4,
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                }}
                className={[
                  "pointer-events-none absolute z-0",
                  "h-[520px] w-[520px] object-contain",
                ].join(" ")}
              />
            ) : null}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.img
              key={
                isRevealing
                  ? "kamura-chest-open"
                  : "kamura-chest-closed"
              }
              src={
                isRevealing
                  ? kamuraChestAssets
                      .chestOpen
                  : kamuraChestAssets
                      .chestClosed
              }
              alt={
                isRevealing
                  ? "開いた鬼の宝箱"
                  : "閉じた鬼の宝箱"
              }
              initial={{
                opacity: 0,
                scale: 0.88,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 1.06,
              }}
              transition={{
                duration: 0.18,
              }}
              className={[
                "relative z-10 h-full w-full object-contain",
                "drop-shadow-[0_28px_30px_rgba(15,23,42,0.48)]",
              ].join(" ")}
            />
          </AnimatePresence>

          <AnimatePresence>
            {isRevealing ? (
              <motion.img
                key="kamura-chest-sparkles"
                src={
                  kamuraChestAssets
                    .sparkles
                }
                alt=""
                aria-hidden="true"
                initial={{
                  opacity: 0,
                  scale: 0.35,
                  rotate: -18,
                }}
                animate={{
                  opacity: [
                    0,
                    1,
                    0.9,
                  ],

                  scale: [
                    0.35,
                    rarityProfile
                      .sparkleScale,
                    Math.max(
                      1,
                      rarityProfile
                        .sparkleScale -
                        0.12,
                    ),
                  ],

                  rotate: [
                    -18,
                    rarityProfile
                      .sparkleRotate,
                    0,
                  ],
                }}
                exit={{
                  opacity: 0,
                  scale: 1.2,
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                }}
                className={[
                  "pointer-events-none absolute z-20",
                  "h-[540px] w-[540px] object-contain",
                ].join(" ")}
              />
            ) : null}
          </AnimatePresence>
        </motion.div>
      ) : null}

      {event.phase ===
      "starting" ? (
        <motion.p
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="relative z-20 mt-6 text-2xl font-black text-white drop-shadow-[0_3px_4px_rgba(0,0,0,0.8)]"
        >
          宝箱が現れた！
        </motion.p>
      ) : null}

      {event.phase ===
      "drawing" ? (
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          className="relative z-20 mt-6 text-2xl font-black text-white drop-shadow-[0_3px_4px_rgba(0,0,0,0.8)]"
        >
          中身は……？
        </motion.p>
      ) : null}

      {event.phase ===
      "revealing" ? (
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.2,
          }}
          animate={{
            opacity: 1,
            scale: 1.2,
          }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 16,
          }}
          className="relative z-30 mt-6"
        >
          <Sparkles
            size={84}
            className="text-yellow-100 drop-shadow-[0_0_28px_rgba(253,224,71,0.95)]"
          />
        </motion.div>
      ) : null}

      {isResult ? (
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.45,
            y: 80,
            rotate: -4,
          }}
          animate={{
            opacity:
              isFinishing
                ? 0
                : 1,

            scale: 1,
            y: 0,
            rotate: 0,
          }}
          transition={{
            type: "spring",
            stiffness: 250,
            damping: 17,
          }}
          className={[
            "relative z-20 w-full max-w-2xl rounded-[2.5rem]",
            "border border-white/80 bg-white/95 px-10 py-9",
            "text-center shadow-2xl backdrop-blur",
            rarityStyle.glow,
          ].join(" ")}
        >
          {event.imageDataUrl ? (
            <motion.img
              initial={{
                opacity: 0,
                scale: 0.3,
                rotate: -8,
                y: 80,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: 0,
                y: 0,
              }}
              transition={{
                delay: 0.08,
                type: "spring",
                stiffness: 260,
                damping: 16,
              }}
              src={
                event.imageDataUrl
              }
              alt={
                event.itemName
              }
              className="mx-auto h-48 w-48 rounded-3xl object-cover shadow-xl ring-4 ring-white"
            />
          ) : (
            <span
              className={[
                "mx-auto flex size-24 items-center justify-center rounded-[2rem]",
                rarityStyle.icon,
              ].join(" ")}
            >
              <Sparkles
                size={48}
              />
            </span>
          )}

          <p className="mt-6 text-sm font-black uppercase tracking-[0.35em] text-slate-400">
            Treasure Result
          </p>

          <span
            className={[
              "mt-4 inline-flex rounded-full border px-4 py-2",
              "text-xs font-black tracking-wider",
              rarityStyle.badge,
            ].join(" ")}
          >
            {
              rarityLabels[
                event.rarity
              ]
            }
          </span>

          <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-950">
            {event.itemName}
          </h2>

          {event.description ? (
            <p className="mx-auto mt-4 max-w-xl text-base font-bold leading-7 text-slate-600">
              {
                event.description
              }
            </p>
          ) : null}
        </motion.div>
      ) : null}
    </motion.div>
  );
}

type ResultOverlayProps = {
  event:
    Extract<
      GachaOverlayEvent,
      {
        type: "result";
      }
    >;
};

function ResultOverlay({
  event,
}: ResultOverlayProps) {
  const rarityStyle =
    rarityStyles[event.rarity];

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.7,
        rotate: -2,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        rotate: 0,
      }}
      exit={{
        opacity: 0,
        scale: 1.08,
        y: -28,
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      className={[
        "w-full max-w-2xl rounded-[2.25rem]",
        "border border-white/70 bg-white/95",
        "px-10 py-10 text-center shadow-2xl backdrop-blur",
        rarityStyle.glow,
      ].join(" ")}
    >
      {event.imageDataUrl ? (
        <img
          src={
            event.imageDataUrl
          }
          alt={
            event.itemName
          }
          className="mx-auto h-44 w-44 rounded-3xl object-cover shadow-xl"
        />
      ) : (
        <motion.span
          initial={{
            rotate: -20,
            scale: 0,
          }}
          animate={{
            rotate: 0,
            scale: 1,
          }}
          transition={{
            delay: 0.12,
            type: "spring",
            stiffness: 300,
            damping: 16,
          }}
          className={[
            "mx-auto flex size-24",
            "items-center justify-center",
            "rounded-[2rem]",
            rarityStyle.icon,
          ].join(" ")}
        >
          <Sparkles
            size={48}
          />
        </motion.span>
      )}

      <p className="mt-6 text-sm font-black uppercase tracking-[0.35em] text-slate-400">
        Gacha Result
      </p>

      <span
        className={[
          "mt-4 inline-flex rounded-full",
          "border px-4 py-2",
          "text-xs font-black tracking-wider",
          rarityStyle.badge,
        ].join(" ")}
      >
        {
          rarityLabels[
            event.rarity
          ]
        }
      </span>

      <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-950">
        {event.itemName}
      </h2>

      {event.description ? (
        <p className="mx-auto mt-4 max-w-xl text-base font-bold leading-7 text-slate-600">
          {
            event.description
          }
        </p>
      ) : null}
    </motion.div>
  );
}

type ErrorOverlayProps = {
  message: string;
};

function ErrorOverlay({
  message,
}: ErrorOverlayProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.9,
        y: 20,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -20,
      }}
      className="w-full max-w-lg rounded-[2rem] border border-rose-200 bg-white/95 px-8 py-8 text-center shadow-2xl backdrop-blur"
    >
      <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
        <AlertCircle
          size={32}
        />
      </span>

      <h2 className="mt-5 text-2xl font-black text-slate-950">
        ガチャを実行できませんでした
      </h2>

      <p className="mt-3 text-sm font-bold leading-6 text-rose-700">
        {message}
      </p>
    </motion.div>
  );
}