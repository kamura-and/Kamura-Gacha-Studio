import type {
  ActionParameterValues,
} from "@/core/actions";

import type {
  GachaRarity,
} from "@/features/gacha/types/gacha";

export type PersistedActionInstance = {
  /**
   * タイムライン上のアクションを識別するID
   */
  id: string;

  /**
   * ActionRegistryに登録されている
   * ActionDefinitionのID
   */
  actionId: string;

  /**
   * このアクションインスタンス固有の
   * パラメーター値
   */
  values: ActionParameterValues;
};

export type PersistedEffectDefinition = {
  id: string;

  /**
   * エフェクト名 ＝ 景品名
   */
  name: string;

  /**
   * ガチャ結果画面などで表示する説明
   */
  description: string;

  /**
   * 実行するAction
   */
  actions: PersistedActionInstance[];

  /**
   * 景品レアリティ
   *
   * 旧保存データとの互換性のためoptional。
   */
  rarity?: GachaRarity;

  /**
   * 景品画像
   */
  imageDataUrl?: string | null;

  /**
   * 景品専用SE
   *
   * Sound System実装後に使用。
   */
  soundId?: string | null;

  /**
   * 景品が有効かどうか
   *
   * 旧データでは未保存のためoptional。
   */
  isEnabled?: boolean;

  /**
   * 景品検索・分類用タグ
   */
  tags: string[];

  favorite: boolean;

  createdAt: number;

  updatedAt: number;
};