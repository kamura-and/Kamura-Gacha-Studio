import { useEffect } from "react";

import type { EffectDefinition } from "@/features/effects/types/effectDefinition";
import { useEffectStore } from "@/features/effects/store/effectStore";

import { EffectBuilder } from "./components/EffectBuilder";
import { actionRegistry } from "@/core/actions/packs";

export function EffectBuilderTestPage() {
  const effects = useEffectStore(
    (state) => state.effects,
  );

  const loadEffects = useEffectStore(
    (state) => state.loadEffects,
  );

  const saveEffect = useEffectStore(
    (state) => state.saveEffect,
  );

  const updateEffect = useEffectStore(
    (state) => state.updateEffect,
  );

  useEffect(() => {
    loadEffects();
  }, [loadEffects]);

  const handleSave = (
    effect: EffectDefinition,
  ) => {
    const alreadyExists = effects.some(
      (savedEffect) =>
        savedEffect.id === effect.id,
    );

    if (alreadyExists) {
      updateEffect(effect);
      return;
    }

    saveEffect(effect);
  };

  return (
    <div className="min-h-full p-4 lg:p-6">
      <div className="mx-auto w-full max-w-[1800px]">
        <EffectBuilder
          registry={actionRegistry}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}