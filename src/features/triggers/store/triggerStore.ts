import { create } from "zustand";

import { triggerRepository } from "../repository/TriggerRepository";

import type {
  CreateTriggerInput,
  Trigger,
  TriggerId,
  UpdateTriggerInput,
} from "../types/Trigger";

type TriggerStore = {
  triggers: Trigger[];

  loadTriggers: () => void;

  addTrigger: (
    input: CreateTriggerInput,
  ) => Trigger;

  updateTrigger: (
    id: TriggerId,
    input: UpdateTriggerInput,
  ) => Trigger;

  deleteTrigger: (
    id: TriggerId,
  ) => void;

  setTriggerEnabled: (
    id: TriggerId,
    enabled: boolean,
  ) => Trigger;
};

export const useTriggerStore =
  create<TriggerStore>(
    (set) => ({
      triggers: [],

      loadTriggers() {
        set({
          triggers:
            triggerRepository.findAll(),
        });
      },

      addTrigger(input) {
        const trigger =
          triggerRepository.add(input);

        set({
          triggers:
            triggerRepository.findAll(),
        });

        return trigger;
      },

      updateTrigger(
        id,
        input,
      ) {
        const trigger =
          triggerRepository.update(
            id,
            input,
          );

        set({
          triggers:
            triggerRepository.findAll(),
        });

        return trigger;
      },

      deleteTrigger(id) {
        triggerRepository.remove(id);

        set({
          triggers:
            triggerRepository.findAll(),
        });
      },

      setTriggerEnabled(
        id,
        enabled,
      ) {
        const trigger =
          triggerRepository.setEnabled(
            id,
            enabled,
          );

        set({
          triggers:
            triggerRepository.findAll(),
        });

        return trigger;
      },
    }),
  );