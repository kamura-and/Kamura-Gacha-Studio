export const GACHA_OVERLAY_EVENT_NAME =
  "gacha-overlay:event";

export const GACHA_OVERLAY_WINDOW_LABEL =
  "overlay";

export type GachaOverlayRarity =
  | "common"
  | "rare"
  | "epic"
  | "legendary"
  | "ultra"
  | "secret";

export type GachaOverlayPresentationPhase =
  | "starting"
  | "drawing"
  | "revealing"
  | "result"
  | "finishing";

export type GachaOverlayDrawingEvent = {
  type: "drawing";

  poolName: string;
};

export type GachaOverlayResultEvent = {
  type: "result";

  itemId: string;

  itemName: string;

  description: string;

  rarity: GachaOverlayRarity;

  imageDataUrl?: string | null;
};

export type GachaOverlayPresentationEvent = {
  type: "presentation";

  presetId:
    | "simple"
    | "chest";

  phase:
    GachaOverlayPresentationPhase;

  itemId: string;

  itemName: string;

  description: string;

  rarity: GachaOverlayRarity;

  imageDataUrl?: string | null;
};

export type GachaOverlayErrorEvent = {
  type: "error";

  message: string;
};

export type GachaOverlayHideEvent = {
  type: "hide";
};

export type GachaOverlayEvent =
  | GachaOverlayDrawingEvent
  | GachaOverlayResultEvent
  | GachaOverlayPresentationEvent
  | GachaOverlayErrorEvent
  | GachaOverlayHideEvent;