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
    common:
        "COMMON",

    rare:
        "RARE",

    epic:
        "EPIC",

    legendary:
        "LEGENDARY",

    ultra:
        "ULTRA RARE",

    secret:
        "SECRET",
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

export function GachaOverlay() {
    const [
        overlayEvent,
        setOverlayEvent,
    ] = useState<GachaOverlayEvent>({
        type:
            "hide",
    });

    const hideTimerRef =
        useRef<number | null>(
            null,
        );

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

                    setOverlayEvent(
                        event,
                    );

                    if (
                        event.type ===
                        "result"
                    ) {
                        hideTimerRef.current =
                            window.setTimeout(
                                () => {
                                    setOverlayEvent({
                                        type:
                                            "hide",
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
                                        type:
                                            "hide",
                                    });
                                },
                                350,
                            );
                    }

                    if (
                        event.type ===
                        "error"
                    ) {
                        hideTimerRef.current =
                            window.setTimeout(
                                () => {
                                    setOverlayEvent({
                                        type:
                                            "hide",
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
            <AnimatePresence
                mode="wait"
            >
                {overlayEvent.type ===
                    "presentation" ? (
                    <ChestPresentationOverlay
                        key={[
                            overlayEvent.presetId,
                            overlayEvent.itemId,
                        ].join("-")}
                        event={
                            overlayEvent
                        }
                    />
                ) : null}

                {overlayEvent.type ===
                    "result" ? (
                    <ResultOverlay
                        key={[
                            overlayEvent.itemId,
                            overlayEvent.itemName,
                        ].join("-")}
                        event={
                            overlayEvent
                        }
                    />
                ) : null}

                {overlayEvent.type ===
                    "presentation" ? (
                    <ChestPresentationOverlay
                        key={[
                            overlayEvent.itemId,
                            overlayEvent.phase,
                        ].join("-")}
                        event={
                            overlayEvent
                        }
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
            type:
            "presentation";
        }
    >;

function ChestPresentationOverlay({
    event,
}: {
    event:
    PresentationEvent;
}) {
    const rarityStyle =
        rarityStyles[
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

    return (
        <motion.div
            initial={{
                opacity:
                    0,

                scale:
                    0.85,

                y:
                    -70,
            }}
            animate={{
                opacity:
                    event.phase ===
                        "finishing"
                        ? 0
                        : 1,

                scale:
                    event.phase ===
                        "finishing"
                        ? 1.08
                        : 1,

                y:
                    0,
            }}
            exit={{
                opacity:
                    0,

                scale:
                    1.08,
            }}
            transition={{
                type:
                    "spring",

                stiffness:
                    230,

                damping:
                    19,
            }}
            className="relative flex w-full max-w-3xl flex-col items-center justify-center"
        >
            {isRevealing ? (
                <motion.div
                    initial={{
                        opacity:
                            0,

                        scale:
                            0.4,
                    }}
                    animate={{
                        opacity:
                            isResult
                                ? 0.95
                                : 0.65,

                        scale:
                            isResult
                                ? 1.35
                                : 1,
                    }}
                    className={[
                        "absolute size-[28rem] rounded-full bg-gradient-to-br blur-3xl",
                        rarityStyle.light,
                    ].join(" ")}
                />
            ) : null}

            {!isResult ? (
                <motion.div
                    animate={
                        event.phase ===
                            "drawing"
                            ? {
                                rotate: [
                                    0,
                                    -5,
                                    5,
                                    -4,
                                    4,
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
                            }
                            : {
                                rotate:
                                    0,

                                x:
                                    0,
                            }
                    }
                    transition={
                        event.phase ===
                            "drawing"
                            ? {
                                duration:
                                    0.48,

                                repeat:
                                    Infinity,

                                ease:
                                    "easeInOut",
                            }
                            : {
                                duration:
                                    0.2,
                            }
                    }
                    className="relative z-10 mt-16 h-52 w-72"
                >
                    <motion.div
                        animate={{
                            rotateX:
                                isRevealing
                                    ? -110
                                    : 0,

                            y:
                                isRevealing
                                    ? -28
                                    : 0,
                        }}
                        transition={{
                            type:
                                "spring",

                            stiffness:
                                190,

                            damping:
                                16,
                        }}
                        style={{
                            transformOrigin:
                                "center bottom",
                        }}
                        className="absolute left-2 top-0 h-20 w-[17rem] rounded-[2rem_2rem_0.8rem_0.8rem] border-4 border-amber-950 bg-gradient-to-b from-amber-400 to-amber-600 shadow-xl"
                    >
                        <div className="absolute left-1/2 top-4 h-12 w-10 -translate-x-1/2 rounded-xl border-4 border-yellow-950 bg-yellow-300" />
                    </motion.div>

                    <div className="absolute bottom-0 left-0 h-36 w-72 rounded-[1rem_1rem_2.2rem_2.2rem] border-4 border-amber-950 bg-gradient-to-b from-amber-600 to-amber-900 shadow-2xl">
                        <div className="absolute inset-y-0 left-1/2 w-12 -translate-x-1/2 border-x-4 border-yellow-950 bg-yellow-400" />

                        <div className="absolute left-1/2 top-10 size-9 -translate-x-1/2 rounded-full border-4 border-yellow-950 bg-slate-950" />
                    </div>
                </motion.div>
            ) : null}

            {event.phase ===
                "starting" ? (
                <motion.p
                    initial={{
                        opacity:
                            0,

                        y:
                            12,
                    }}
                    animate={{
                        opacity:
                            1,

                        y:
                            0,
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
                        opacity:
                            0,
                    }}
                    animate={{
                        opacity:
                            1,
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
                        opacity:
                            0,

                        scale:
                            0.2,
                    }}
                    animate={{
                        opacity:
                            1,

                        scale:
                            1.2,
                    }}
                    className="relative z-20 mt-10"
                >
                    <Sparkles
                        size={96}
                        className="text-yellow-200 drop-shadow-[0_0_25px_rgba(253,224,71,0.95)]"
                    />
                </motion.div>
            ) : null}

            {isResult ? (
                <motion.div
                    initial={{
                        opacity:
                            0,

                        scale:
                            0.45,

                        y:
                            80,

                        rotate:
                            -4,
                    }}
                    animate={{
                        opacity:
                            event.phase ===
                                "finishing"
                                ? 0
                                : 1,

                        scale:
                            1,

                        y:
                            0,

                        rotate:
                            0,
                    }}
                    transition={{
                        type:
                            "spring",

                        stiffness:
                            250,

                        damping:
                            17,
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
                                opacity:
                                    0,

                                scale:
                                    0.3,

                                rotate:
                                    -8,
                            }}
                            animate={{
                                opacity:
                                    1,

                                scale:
                                    1,

                                rotate:
                                    0,
                            }}
                            transition={{
                                delay:
                                    0.08,

                                type:
                                    "spring",

                                stiffness:
                                    260,

                                damping:
                                    16,
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
            type:
            "result";
        }
    >;
};

function ResultOverlay({
    event,
}: ResultOverlayProps) {
    const rarityStyle =
        rarityStyles[
        event.rarity
        ];

    return (
        <motion.div
            initial={{
                opacity:
                    0,

                scale:
                    0.7,

                rotate:
                    -2,
            }}
            animate={{
                opacity:
                    1,

                scale:
                    1,

                rotate:
                    0,
            }}
            exit={{
                opacity:
                    0,

                scale:
                    1.08,

                y:
                    -28,
            }}
            transition={{
                type:
                    "spring",

                stiffness:
                    260,

                damping:
                    20,
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
                        rotate:
                            -20,

                        scale:
                            0,
                    }}
                    animate={{
                        rotate:
                            0,

                        scale:
                            1,
                    }}
                    transition={{
                        delay:
                            0.12,

                        type:
                            "spring",

                        stiffness:
                            300,

                        damping:
                            16,
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
                opacity:
                    0,

                scale:
                    0.9,

                y:
                    20,
            }}
            animate={{
                opacity:
                    1,

                scale:
                    1,

                y:
                    0,
            }}
            exit={{
                opacity:
                    0,

                y:
                    -20,
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