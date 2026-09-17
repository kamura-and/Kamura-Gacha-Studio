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

export type PoolSoundSettings = {
  /**
   * 再生するSEの音源。
   */
  source: string;

  /**
   * 再生音量。
   * 0〜1で保持する。
   */
  volume: number;
};

export type GachaPool = {
  id: string;

  name: string;

  description: string;

  entries: PoolEntry[];

  /**
   * このガチャ箱が発動したときに再生するSE。
   * 未設定の場合はSEを再生しない。
   */
  sound?: PoolSoundSettings;

  enabled: boolean;

  createdAt: string;

  updatedAt: string;
};