export type PoolEntry = {
  id: string;

  /**
   * 新しい景品参照。
   *
   * EffectDefinition が景品本体になるため、
   * 今後はこちらを使用します。
   */
  effectId?: string;

  /**
   * 旧ガチャ景品参照。
   *
   * 既存データとの互換性のため一時的に残します。
   * 移行完了後に削除予定です。
   */
  gachaItemId?: string;

  /**
   * 抽選時の重み。
   */
  weight: number;
};

export type GachaPool = {
  id: string;

  name: string;

  description: string;

  entries: PoolEntry[];

  enabled: boolean;

  createdAt: string;

  updatedAt: string;
};