import {
  gachaOverlayRuntime,
} from "@/features/overlay/runtime/GachaOverlayRuntime";

import {
  presentationRuntime,
} from "./PresentationRuntime";

let unsubscribe:
  | (() => void)
  | null = null;

export function startPresentationOverlayBridge():
  () => void {
  if (unsubscribe !== null) {
    return unsubscribe;
  }

  unsubscribe =
    presentationRuntime.subscribe(
      (state) => {
        if (
          !state.isPlaying ||
          state.item === null ||
          state.presetId === null ||
          state.phase === "idle"
        ) {
          return;
        }

        gachaOverlayRuntime.showPresentation({
          presetId:
            state.presetId,

          phase:
            state.phase,

          itemId:
            state.item.id,

          itemName:
            state.item.name,

          description:
            state.item.description,

          rarity:
            state.item.rarity,

          imageDataUrl:
            state.item.imageDataUrl,
        });
      },
    );

  return () => {
    unsubscribe?.();

    unsubscribe =
      null;
  };
}