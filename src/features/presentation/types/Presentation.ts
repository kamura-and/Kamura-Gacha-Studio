import type {
  GachaRarity,
} from "@/features/gacha/types/gacha";

export type PresentationPresetId =
  | "simple"
  | "chest";

export type PresentationPhase =
  | "idle"
  | "starting"
  | "drawing"
  | "revealing"
  | "result"
  | "finishing";

export type PresentationItem = {
  id: string;

  name: string;

  description: string;

  rarity: GachaRarity;

  imageDataUrl?: string | null;
};

export type PlayPresentationInput = {
  presetId:
    PresentationPresetId;

  item:
    PresentationItem;
};

export type PresentationContext = {
  item:
    PresentationItem;

  setPhase: (
    phase: PresentationPhase,
  ) => void;

  wait: (
    durationMs: number,
  ) => Promise<void>;
};

export type PresentationPreset = {
  id:
    PresentationPresetId;

  name:
    string;

  description:
    string;

  play: (
    context: PresentationContext,
  ) => Promise<void>;
};

export type PresentationRuntimeState = {
  isPlaying:
    boolean;

  phase:
    PresentationPhase;

  presetId:
    PresentationPresetId | null;

  item:
    PresentationItem | null;
};