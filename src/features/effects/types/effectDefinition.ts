import type { ActionInstance } from "@/core/actions";

export type EffectDefinition = {
  id: string;

  name: string;

  description: string;

  actions: ActionInstance[];

  tags: string[];

  favorite: boolean;

  createdAt: number;

  updatedAt: number;
};