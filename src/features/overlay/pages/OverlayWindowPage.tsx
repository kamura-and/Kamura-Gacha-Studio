import {
  isTauri,
} from "@tauri-apps/api/core";

import {
  PhysicalPosition,
  PhysicalSize,
} from "@tauri-apps/api/dpi";

import {
  listen,
} from "@tauri-apps/api/event";

import {
  getCurrentWindow,
} from "@tauri-apps/api/window";

import {
  Move,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  GachaOverlay,
} from "@/features/overlay/components/GachaOverlay";

import {
  gachaOverlayRuntime,
} from "@/features/overlay/runtime/GachaOverlayRuntime";

import {
  GACHA_OVERLAY_EVENT_NAME,
} from "@/features/overlay/types/GachaOverlayEvent";

import type {
  GachaOverlayEvent,
} from "@/features/overlay/types/GachaOverlayEvent";

import {
  OVERLAY_CONTROL_EVENT_NAME,
} from "@/features/overlay/types/OverlayControlEvent";

import type {
  OverlayControlEvent,
} from "@/features/overlay/types/OverlayControlEvent";

const OVERLAY_BOUNDS_STORAGE_KEY =
  "kamura-gacha-studio:overlay-bounds";

const MIN_OVERLAY_WIDTH =
  320;

const MIN_OVERLAY_HEIGHT =
  240;

type SavedOverlayBounds = {
  x: number;

  y: number;

  width: number;

  height: number;
};

export function OverlayWindowPage() {
  const [
    isAdjustmentMode,
    setIsAdjustmentMode,
  ] = useState(false);

  useEffect(() => {
    if (!isTauri()) {
      return;
    }

    let isDisposed = false;

    let unlistenGacha:
      | (() => void)
      | undefined;

    let unlistenControl:
      | (() => void)
      | undefined;

    const initializeOverlay =
      async (): Promise<void> => {
        const overlayWindow =
          getCurrentWindow();

        try {
          /*
           * 前回保存した位置とサイズを
           * Overlay表示前に復元します。
           */
          await restoreOverlayBounds();

          /*
           * 通常時はOverlayを
           * マウスクリック透過にします。
           */
          await overlayWindow.setIgnoreCursorEvents(
            true,
          );

          const nextUnlistenGacha =
            await listen<GachaOverlayEvent>(
              GACHA_OVERLAY_EVENT_NAME,
              (event) => {
                gachaOverlayRuntime.receive(
                  event.payload,
                );
              },
            );

          const nextUnlistenControl =
            await listen<OverlayControlEvent>(
              OVERLAY_CONTROL_EVENT_NAME,
              (event) => {
                void handleControlEvent(
                  event.payload,
                );
              },
            );

          if (isDisposed) {
            nextUnlistenGacha();
            nextUnlistenControl();

            return;
          }

          unlistenGacha =
            nextUnlistenGacha;

          unlistenControl =
            nextUnlistenControl;

          console.info(
            "[OverlayWindowPage]",
            "Overlayの初期化が完了しました。",
          );
        } catch (error) {
          console.error(
            "[OverlayWindowPage]",
            "Overlayの初期化に失敗しました。",
            error,
          );
        }

        async function handleControlEvent(
          event: OverlayControlEvent,
        ): Promise<void> {
          try {
            switch (event.type) {
              case "show": {
                await overlayWindow.show();

                return;
              }

              case "hide": {
                setIsAdjustmentMode(false);

                await overlayWindow.setIgnoreCursorEvents(
                  true,
                );

                await overlayWindow.hide();

                return;
              }

              case "start-adjustment": {
                await overlayWindow.show();

                await overlayWindow.setIgnoreCursorEvents(
                  false,
                );

                await overlayWindow.setFocus();

                setIsAdjustmentMode(true);

                return;
              }

              case "finish-adjustment": {
                /*
                 * クリック透過へ戻す前に、
                 * 現在の位置とサイズを保存します。
                 */
                await saveOverlayBounds();

                setIsAdjustmentMode(false);

                await overlayWindow.setIgnoreCursorEvents(
                  true,
                );

                return;
              }

              default: {
                const exhaustiveCheck: never =
                  event;

                return exhaustiveCheck;
              }
            }
          } catch (error) {
            console.error(
              "[OverlayWindowPage]",
              "Overlay操作に失敗しました。",
              error,
            );
          }
        }

        async function saveOverlayBounds():
          Promise<void> {
          try {
            const [
              position,
              size,
            ] = await Promise.all([
              overlayWindow.outerPosition(),
              overlayWindow.outerSize(),
            ]);

            const bounds:
              SavedOverlayBounds = {
                x:
                  position.x,

                y:
                  position.y,

                width:
                  size.width,

                height:
                  size.height,
              };

            window.localStorage.setItem(
              OVERLAY_BOUNDS_STORAGE_KEY,
              JSON.stringify(bounds),
            );

            console.info(
              "[OverlayWindowPage]",
              "Overlayの位置とサイズを保存しました。",
              bounds,
            );
          } catch (error) {
            console.error(
              "[OverlayWindowPage]",
              "Overlayの位置とサイズを保存できませんでした。",
              error,
            );
          }
        }

        async function restoreOverlayBounds():
          Promise<void> {
          const savedValue =
            window.localStorage.getItem(
              OVERLAY_BOUNDS_STORAGE_KEY,
            );

          if (!savedValue) {
            return;
          }

          try {
            const parsedValue: unknown =
              JSON.parse(savedValue);

            if (
              !isSavedOverlayBounds(
                parsedValue,
              )
            ) {
              window.localStorage.removeItem(
                OVERLAY_BOUNDS_STORAGE_KEY,
              );

              console.warn(
                "[OverlayWindowPage]",
                "保存されたOverlay設定が不正なため削除しました。",
              );

              return;
            }

            /*
             * サイズを先に復元してから、
             * 位置を復元します。
             */
            await overlayWindow.setSize(
              new PhysicalSize(
                Math.max(
                  parsedValue.width,
                  MIN_OVERLAY_WIDTH,
                ),

                Math.max(
                  parsedValue.height,
                  MIN_OVERLAY_HEIGHT,
                ),
              ),
            );

            await overlayWindow.setPosition(
              new PhysicalPosition(
                parsedValue.x,
                parsedValue.y,
              ),
            );

            console.info(
              "[OverlayWindowPage]",
              "Overlayの位置とサイズを復元しました。",
              parsedValue,
            );
          } catch (error) {
            console.error(
              "[OverlayWindowPage]",
              "Overlayの位置とサイズを復元できませんでした。",
              error,
            );

            window.localStorage.removeItem(
              OVERLAY_BOUNDS_STORAGE_KEY,
            );
          }
        }
      };

    void initializeOverlay();

    return () => {
      isDisposed = true;

      unlistenGacha?.();
      unlistenControl?.();
    };
  }, []);

  const handleStartDragging =
    async (): Promise<void> => {
      if (
        !isTauri() ||
        !isAdjustmentMode
      ) {
        return;
      }

      try {
        await getCurrentWindow().startDragging();
      } catch (error) {
        console.error(
          "[OverlayWindowPage]",
          "Overlayの移動を開始できませんでした。",
          error,
        );
      }
    };

  return (
    <main
      aria-label="ガチャオーバーレイ"
      className="relative h-screen w-screen overflow-hidden bg-transparent"
      style={{
        background:
          "transparent",
      }}
    >
      <GachaOverlay />

      {isAdjustmentMode ? (
        <div className="pointer-events-auto fixed inset-0 z-[10000] border-4 border-dashed border-violet-500 bg-violet-500/5">
          <button
            type="button"
            onMouseDown={() => {
              void handleStartDragging();
            }}
            className="absolute left-1/2 top-4 flex -translate-x-1/2 cursor-move items-center gap-3 rounded-2xl border border-violet-300 bg-white/95 px-5 py-3 text-sm font-black text-violet-700 shadow-xl backdrop-blur transition hover:bg-violet-50"
          >
            <Move
              aria-hidden="true"
              size={19}
              strokeWidth={2.4}
            />

            ここをドラッグして移動
          </button>

          <div className="pointer-events-none absolute bottom-5 left-1/2 w-max max-w-[calc(100%-2rem)] -translate-x-1/2 rounded-2xl bg-slate-950/85 px-5 py-3 text-center text-sm font-bold leading-6 text-white shadow-xl backdrop-blur">
            ウィンドウ端をドラッグするとサイズを変更できます
          </div>

          <span className="pointer-events-none absolute left-3 top-3 size-5 border-l-4 border-t-4 border-violet-600" />

          <span className="pointer-events-none absolute right-3 top-3 size-5 border-r-4 border-t-4 border-violet-600" />

          <span className="pointer-events-none absolute bottom-3 left-3 size-5 border-b-4 border-l-4 border-violet-600" />

          <span className="pointer-events-none absolute bottom-3 right-3 size-5 border-b-4 border-r-4 border-violet-600" />
        </div>
      ) : null}
    </main>
  );
}

function isSavedOverlayBounds(
  value: unknown,
): value is SavedOverlayBounds {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const candidate =
    value as Partial<SavedOverlayBounds>;

  return (
    isFiniteNumber(candidate.x) &&
    isFiniteNumber(candidate.y) &&
    isFiniteNumber(candidate.width) &&
    isFiniteNumber(candidate.height) &&
    candidate.width > 0 &&
    candidate.height > 0
  );
}

function isFiniteNumber(
  value: unknown,
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value)
  );
}