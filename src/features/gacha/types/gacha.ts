import type {
  ActionOutputTarget,
} from "@/core/actions";

export type GachaRarity =
  | "common"
  | "rare"
  | "epic"
  | "legendary"
  | "ultra"
  | "secret";

export type GachaActionType =
  ActionOutputTarget;

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

  /**
   * 景品画像のData URL。
   *
   * PNG・JPEG・WebPなどの画像を、
   * Base64形式で保存する。
   *
   * 未指定の場合は、
   * 従来どおりアイコンを表示する。
   */
  imageDataUrl?: string | null;

  /**
   * 保存済みエフェクトのID。
   *
   * 指定されている場合は、
   * EffectRepositoryからエフェクトを取得して実行する。
   *
   * 未指定の場合は、
   * 従来どおりcommandsを実行する。
   */
  effectId?: string | null;

  /**
   * 旧形式との互換用コマンド。
   *
   * effectIdが未指定の場合に使用する。
   */
  commands: GachaCommand[];

  rarity: GachaRarity;
  isEnabled: boolean;
  createdAt: string;
};