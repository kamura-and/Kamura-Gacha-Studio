export const OVERLAY_CONTROL_EVENT_NAME =
  "overlay-control:event";

export type OverlayShowControlEvent = {
  type: "show";
};

export type OverlayHideControlEvent = {
  type: "hide";
};

export type OverlayStartAdjustmentControlEvent = {
  type: "start-adjustment";
};

export type OverlayFinishAdjustmentControlEvent = {
  type: "finish-adjustment";
};

export type OverlayControlEvent =
  | OverlayShowControlEvent
  | OverlayHideControlEvent
  | OverlayStartAdjustmentControlEvent
  | OverlayFinishAdjustmentControlEvent;