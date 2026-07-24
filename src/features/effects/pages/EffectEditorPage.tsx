import { useMemo } from "react";
import {
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";

import { EffectBuilder } from "@/features/effect-builder/components/EffectBuilder";
import { actionRegistry } from "@/core/actions/packs/actionRegistry";
import { useEffectStore } from "@/features/effects/store/effectStore";
import type { EffectDefinition } from "@/features/effects/types/effectDefinition";

export function EffectEditorPage() {
  const navigate = useNavigate();

  const { effectId } = useParams<{
    effectId: string;
  }>();

  const effects = useEffectStore(
    (state) => state.effects,
  );

  const saveEffect = useEffectStore(
    (state) => state.saveEffect,
  );

  const updateEffect = useEffectStore(
    (state) => state.updateEffect,
  );

  const effect = useMemo(() => {
    if (!effectId) {
      return undefined;
    }

    return effects.find(
      (item) => item.id === effectId,
    );
  }, [effects, effectId]);

  if (effectId && !effect) {
    return (
      <Navigate
        to="/effects"
        replace
      />
    );
  }

  const handleSave = (
    savedEffect: EffectDefinition,
  ) => {
    if (effectId) {
      updateEffect(savedEffect);
    } else {
      saveEffect(savedEffect);
    }

    navigate("/effects");
  };

  return (
    <EffectBuilder
      registry={actionRegistry}
      initialEffect={effect}
      onSave={handleSave}
    />
  );
}