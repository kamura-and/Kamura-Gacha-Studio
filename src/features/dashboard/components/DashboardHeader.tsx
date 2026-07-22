import { Activity, ExternalLink, Play } from "lucide-react";

export function DashboardHeader() {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-8 p-8 lg:flex-row lg:items-center lg:justify-between">

        {/* 左側 */}
        <div className="max-w-xl">

          <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
            <Activity size={14} />
            LIVE Dashboard
          </div>

          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900">
            Kamura Gacha Studio
          </h1>

          <p className="mt-2 text-lg font-semibold text-slate-700">
            TikTok LIVE Gacha Controller
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            TikTok LIVE・Minecraft・Overlayを一括で管理し、
            ギフトイベントやガチャ演出をリアルタイムで実行します。
          </p>
        </div>

        {/* 右側 */}
        <div className="flex flex-col gap-3 lg:w-72">

          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <span className="text-sm font-semibold text-slate-700">
              TikTok LIVE
            </span>

            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
              接続中
            </span>
          </div>

          <button className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-3 font-semibold transition hover:border-violet-200 hover:bg-violet-50">
            <ExternalLink size={17} />
            Overlayを開く
          </button>

          <button className="flex items-center justify-center gap-2 rounded-2xl bg-violet-600 py-3 font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-500">
            <Play
              size={18}
              fill="currentColor"
            />
            配信開始
          </button>

        </div>

      </div>
    </section>
  );
}