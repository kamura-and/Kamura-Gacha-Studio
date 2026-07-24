import { EffectBuilderTestPage } from "./features/effect-builder/EffectBuilderTestPage";
import { CommandQueuePanel } from "./features/queue/components/CommandQueuePanel";

function App() {
  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto grid w-full max-w-[1600px] gap-6 p-4 lg:grid-cols-[minmax(0,1fr)_420px] lg:p-6">
        <section className="min-w-0">
          <EffectBuilderTestPage />
        </section>

        <aside className="min-w-0 lg:sticky lg:top-6 lg:self-start">
          <CommandQueuePanel />
        </aside>
      </div>
    </main>
  );
}

export default App;