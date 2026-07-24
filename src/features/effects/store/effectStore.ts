import { create } from "zustand";

import { effectRepository } from "../repository/effectRepository";
import type { EffectDefinition } from "../types/effectDefinition";

type EffectStore = {
  effects: EffectDefinition[];

  loadEffects(): void;

  saveEffect(
    effect: EffectDefinition,
  ): void;

  updateEffect(
    effect: EffectDefinition,
  ): void;

  deleteEffect(
    id: string,
  ): void;
};

export const useEffectStore =
  create<EffectStore>((set) => ({
    effects: [],

    loadEffects() {
      set({
        effects:
          effectRepository.loadAll(),
      });
    },

    saveEffect(effect) {
      effectRepository.save(effect);

      set({
        effects:
          effectRepository.loadAll(),
      });
    },

    updateEffect(effect) {
      effectRepository.update(effect);

      set({
        effects:
          effectRepository.loadAll(),
      });
    },

    deleteEffect(id) {
      effectRepository.delete(id);

      set({
        effects:
          effectRepository.loadAll(),
      });
    },
  }));