export type GachaRarity =
  | "common"
  | "rare"
  | "epic"
  | "legendary"
  | "ultra"
  | "secret";

export type GachaActionType =
  | "minecraft"
  | "overlay"
  | "sound"
  | "wait";

export type GachaCommand = {
  id: string;
  type: GachaActionType;
  value: string;
  delay: number;
  enabled: boolean;
};

export type GachaItem = {
  id: string;
  name: string;
  description: string;
  commands: GachaCommand[];
  rarity: GachaRarity;
  probability: number;
  isEnabled: boolean;
  createdAt: string;
};