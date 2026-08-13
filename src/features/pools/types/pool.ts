export type PoolEntry = {
  id: string;

  /**
   * 景品として使用するEffectDefinitionのID。
   */
  effectId: string;

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