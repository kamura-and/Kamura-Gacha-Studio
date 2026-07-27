export type PoolEntry = {
  id: string;

  gachaItemId: string;

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