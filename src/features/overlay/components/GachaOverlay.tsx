import {
    AnimatePresence,
    motion,
} from "motion/react";

import {
    AlertCircle,
    Dices,
    LoaderCircle,
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
        icon: string;
    }
> = {
    common: {
        badge:
            "border-slate-300 bg-slate-100 text-slate-700",

        glow:
            "shadow-slate-400/30",

        icon:
            "bg-slate-100 text-slate-600",
    },

    rare: {
        badge:
            "border-sky-300 bg-sky-100 text-sky-700",

        glow:
            "shadow-sky-500/30",

        icon:
            "bg-sky-100 text-sky-600",
    },

    epic: {
        badge:
            "border-violet-300 bg-violet-100 text-violet-700",

        glow:
            "shadow-violet-500/40",

        icon:
            "bg-violet-100 text-violet-600",
    },

    legendary: {
        badge:
            "border-amber-300 bg-amber-100 text-amber-700",

        glow:
            "shadow-amber-500/40",

        icon:
            "bg-amber-100 text-amber-600",
    },

    ultra: {
        badge:
            "border-fuchsia-300 bg-fuchsia-100 text-fuchsia-700",

        glow:
            "shadow-fuchsia-500/50",

        icon:
            "bg-fuchsia-100 text-fuchsia-600",
    },

    secret: {
        badge:
            "border-rose-300 bg-rose-100 text-rose-700",

        glow:
            "shadow-rose-500/50",

        icon:
            "bg-rose-100 text-rose-600",
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
        const clearHideTimer = () => {
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
        <div className="pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center p-8">
            <AnimatePresence mode="wait">
                {overlayEvent.type ===
                    "drawing" ? (
                    <DrawingOverlay
                        key="drawing"
                        poolName={
                            overlayEvent.poolName
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

type DrawingOverlayProps = {
    poolName: string;
};

function DrawingOverlay({
    poolName,
}: DrawingOverlayProps) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                scale: 0.85,
                y: 24,
            }}
            animate={{
                opacity: 1,
                scale: 1,
                y: 0,
            }}
            exit={{
                opacity: 0,
                scale: 1.05,
                y: -20,
            }}
            transition={{
                duration: 0.25,
            }}
            className="w-full max-w-xl rounded-[2rem] border border-white/60 bg-white/95 px-8 py-10 text-center shadow-2xl backdrop-blur"
        >
            <motion.span
                animate={{
                    rotate: 360,
                }}
                transition={{
                    duration: 1.2,
                    ease: "linear",
                    repeat: Infinity,
                }}
                className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-violet-100 text-violet-600"
            >
                <Dices size={42} />
            </motion.span>

            <p className="mt-6 text-xs font-black uppercase tracking-[0.3em] text-violet-500">
                Gacha Start
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                抽選中…
            </h2>

            <div className="mt-4 flex items-center justify-center gap-2 text-sm font-bold text-slate-500">
                <LoaderCircle
                    size={17}
                    className="animate-spin"
                />

                <span>{poolName}</span>
            </div>
        </motion.div>
    );
}

type ResultOverlayProps = {
    event: Extract<
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
                    src={event.imageDataUrl}
                    alt={event.itemName}
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
                    <Sparkles size={48} />
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
                {rarityLabels[event.rarity]}
            </span>

            <h2 className="mt-5 text-4xl font-black tracking-tight">
                {event.itemName}
            </h2>

            {event.description ? (
                <p className="mx-auto mt-4 max-w-xl text-base font-bold leading-7 text-slate-600">
                    {event.description}
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
                <AlertCircle size={32} />
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