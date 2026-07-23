import { EffectBuilder } from "./components/EffectBuilder";
import { testActionRegistry } from "./testActionRegistry";

export function EffectBuilderTestPage() {
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-3xl font-bold">
          エフェクトビルダー テスト
        </h1>

        <EffectBuilder
          registry={testActionRegistry}
        />
      </div>
    </div>
  );
}