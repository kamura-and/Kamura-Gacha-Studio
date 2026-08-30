import { useMemo } from "react";

import {
  Gift,
} from "lucide-react";

import { ConnectionStatusSection } from "@/features/dashboard/components/ConnectionStatusSection";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { RecentLogCard } from "@/features/dashboard/components/RecentLogCard";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { TestGachaCard } from "@/features/dashboard/components/TestGachaCard";
import { useRuntimeStatsStore } from "@/features/runtime/stats/runtimeStatsStore";

export function DashboardPage() {
  const giftEvents =
    useRuntimeStatsStore(
      (state) =>
        state.giftEvents,
    );

 const todayGiftCount =
  useMemo(
    () =>
      giftEvents.filter(
        (giftEvent) =>
          isToday(
            giftEvent
              .occurredAt,
          ),
      ).length,
    [giftEvents],
  );

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <DashboardHeader />

      {/* ページ内ナビゲーション */}
      <nav
        aria-label="ダッシュボード内ナビゲーション"
        className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div className="mb-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-500">
              Dashboard Index
            </p>

            <h2 className="mt-1 text-sm font-black tracking-tight text-slate-900">
              ダッシュボード目次
            </h2>
          </div>

          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500">
            3 sections
          </span>
        </div>

        <div className="grid gap-2 md:grid-cols-3">
          <a
            href="#connection-status"
            className="group flex items-center gap-3 rounded-2xl border border-transparent bg-slate-50 px-4 py-3 transition hover:border-violet-200 hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-violet-200"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-white text-xs font-black text-violet-600 shadow-sm ring-1 ring-slate-200 transition group-hover:ring-violet-200">
              01
            </span>

            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900">
                接続状況
              </p>

              <p className="mt-0.5 truncate text-xs text-slate-500">
                TikTok・Minecraft・Overlay
              </p>
            </div>

            <span className="ml-auto text-sm font-bold text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-violet-500">
              ↓
            </span>
          </a>

          <a
            href="#dashboard-runtime"
            className="group flex items-center gap-3 rounded-2xl border border-transparent bg-slate-50 px-4 py-3 transition hover:border-violet-200 hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-violet-200"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-white text-xs font-black text-violet-600 shadow-sm ring-1 ring-slate-200 transition group-hover:ring-violet-200">
              02
            </span>

            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900">
                テスト・ログ
              </p>

              <p className="mt-0.5 truncate text-xs text-slate-500">
                ガチャテストと実行履歴
              </p>
            </div>

            <span className="ml-auto text-sm font-bold text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-violet-500">
              ↓
            </span>
          </a>

          <a
            href="#dashboard-gift"
            className="group flex items-center gap-3 rounded-2xl border border-transparent bg-slate-50 px-4 py-3 transition hover:border-violet-200 hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-violet-200"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-white text-xs font-black text-violet-600 shadow-sm ring-1 ring-slate-200 transition group-hover:ring-violet-200">
              03
            </span>

            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900">
                本日のギフト
              </p>

              <p className="mt-0.5 truncate text-xs text-slate-500">
                今日受信したギフト数
              </p>
            </div>

            <span className="ml-auto text-sm font-bold text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-violet-500">
              ↓
            </span>
          </a>
        </div>
      </nav>

      {/* 接続状況 */}
      <div
        id="connection-status"
        className="scroll-mt-6"
      >
        <ConnectionStatusSection />
      </div>

      {/* テストガチャ / 最近のログ */}
      <section
        id="dashboard-runtime"
        aria-label="テストガチャ箱と最近のログ"
        className="scroll-mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]"
      >
        <TestGachaCard />
        <RecentLogCard />
      </section>

      {/* 本日のギフト */}
      <section
        id="dashboard-gift"
        aria-labelledby="dashboard-gift-title"
        className="scroll-mt-6"
      >
        <div className="mb-5">
          <h2
            id="dashboard-gift-title"
            className="text-lg font-bold tracking-tight text-slate-900"
          >
            本日のギフト
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            今日受信したTikTok LIVEギフトを確認できます。
          </p>
        </div>

        <div className="max-w-2xl">
          <StatCard
            title="本日のギフト数"
            value={
              todayGiftCount
            }
            description="本日受信したギフト"
            icon={Gift}
            status={
              todayGiftCount > 0
                ? "受信あり"
                : "受信なし"
            }
            statusTone={
              todayGiftCount > 0
                ? "success"
                : "neutral"
            }
            trend="今日"
          />
        </div>
      </section>
    </div>
  );
}

function isToday(
  timestamp: number,
): boolean {
  const today = new Date();

  const target =
    new Date(timestamp);

  return (
    today.getFullYear() ===
    target.getFullYear()
    && today.getMonth() ===
    target.getMonth()
    && today.getDate() ===
    target.getDate()
  );
}