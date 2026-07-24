import { CommandQueuePanel } from "@/features/queue/components/CommandQueuePanel";

export function QueuePage() {
  return (
    <main className="min-h-full p-4 lg:p-6">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-6">
          <h1 className="text-2xl font-black tracking-tight text-slate-950">
            実行キュー
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            登録されたコマンドの実行状況を確認します。
          </p>
        </div>

        <CommandQueuePanel />
      </div>
    </main>
  );
}