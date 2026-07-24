import { EffectBuilder } from "./components/EffectBuilder";
import { testActionRegistry } from "./testActionRegistry";

export function EffectBuilderTestPage() {
  return (
    <div className="min-h-full p-4 lg:p-6">
      <div className="mx-auto w-full max-w-[1800px]">
        <EffectBuilder registry={testActionRegistry} />
      </div>
    </div>
  );
}