export function DashboardHeader() {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Kamura Gacha Studio
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          TikTok LIVE ガチャコントローラー
        </p>
      </div>

      <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2">
        <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="text-sm font-medium text-emerald-300">
          Connected
        </span>
      </div>
    </div>
  );
}