import { testActionRegistry } from "@/features/effect-builder/testActionRegistry";
import { useMemo } from "react";
import {
  Navigate,
  useParams,
} from "react-router-dom";

import { EffectBuilder } from "@/features/effect-builder/components/EffectBuilder";
import { useEffectStore } from "@/features/effects/store/effectStore";

export function EffectEditorPage() {
  const { effectId } = useParams<{
    effectId: string;
  }>();

  const effects = useEffectStore(
    (state) => state.effects,
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

  return (
    <EffectBuilder
      registry={testActionRegistry}
      initialEffect={effect}
    />
  );
}