import type {
  ActionOutputTarget,
} from "@/core/actions";

/**
 * 景品レアリティ。
 *
 * 現行Effect景品でも使用する共通型。
 */
export type GachaRarity =
  | "common"
  | "rare"
  | "epic"
  | "legendary"
  | "ultra"
  | "secret";

/**
 * 旧GachaItem互換用のAction出力先。
 */
export type GachaActionType =
  ActionOutputTarget;

/**
 * 旧GachaItemに直接保存されていたコマンド。
 *
 * 現行の新規景品はEffectDefinition.actionsを使用するため、
 * この型は旧データ互換用途として残します。
 */
export type GachaCommand = {
  id: string;

  type: GachaActionType;

  value: string;

  delay: number;

  enabled: boolean;
};

/**
 * 旧形式のガチャ景品。
 *
 * 現行の新規景品はEffectDefinitionを使用します。
 * この型は既存のlocalStorageおよび
 * 旧PoolEntry.gachaItemIdを読み込むための
 * 互換用途として残します。
 */
export type LegacyGachaItem = {
  id: string;

  name: string;

  description: string;

  /**
   * 旧景品画像のData URL。
   */
  imageDataUrl?:
    | string
    | null;

  /**
   * 旧GachaItemから
   * 保存済みEffectへ接続するID。
   */
  effectId?:
    | string
    | null;

  /**
   * Effect移行前の旧コマンド。
   *
   * effectIdがない場合のみ使用します。
   */
  commands:
    GachaCommand[];

  rarity:
    GachaRarity;

  isEnabled:
    boolean;

  createdAt:
    string;
};