import type {
  ActionInstance,
} from "@/core/actions";

import type {
  GachaRarity,
} from "@/features/gacha/types/gacha";

export type EffectDefinition = {
  id: string;

  /**
   * エフェクト名 ＝ 景品名
   *
   * 今後は別々の名前を持たせません。
   */
  name: string;

  /**
   * ガチャ結果画面などで表示する説明。
   */
  description: string;

  /**
   * 実際に実行するAction。
   */
  actions: ActionInstance[];

  /**
   * 景品検索・分類に使用するタグ。
   */
  tags: string[];

  /**
   * 一覧のお気に入り状態。
   */
  favorite: boolean;

  /**
   * 景品レアリティ。
   *
   * 旧Effectとの互換性のためoptional。
   */
  rarity?: GachaRarity;

  /**
   * ガチャ演出で表示する景品画像。
   */
  imageDataUrl?: string | null;

  /**
   * 景品専用SE。
   *
   * SEシステム実装後は、
   * ファイル本体ではなくIDまたはPathを保存します。
   */
  soundId?: string | null;

  /**
   * ガチャ箱の抽選対象として使用できるか。
   */
  isEnabled?: boolean;

  createdAt: number;

  updatedAt: number;
};