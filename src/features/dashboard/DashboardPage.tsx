import {
  Gift,
  Radio,
  Sparkles,
  Tv,
} from "lucide-react";

import { ConnectionStatusSection } from "@/features/dashboard/components/ConnectionStatusSection";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { RecentLogCard } from "@/features/dashboard/components/RecentLogCard";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { TestGachaCard } from "@/features/dashboard/components/TestGachaCard";

export function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <DashboardHeader />

      <ConnectionStatusSection />

      <section aria-labelledby="dashboard-statistics-title">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2
              id="dashboard-statistics-title"
              className="text-lg font-bold tracking-tight text-slate-900"
            >
              本日の状況
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              TikTok LIVEとガチャ機能の稼働状況を確認できます。
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="TikTok接続状況"
            value="接続中"
            description="TikTok LIVEとの接続状態"
            icon={Radio}
            status="正常"
            trend="稼働中"
          />

          <StatCard
            title="本日のギフト数"
            value={28}
            description="本日受信したギフト"
            icon={Gift}
            trend="+12 今日"
          />

          <StatCard
            title="ガチャ実行回数"
            value={70}
            description="本日のガチャ実行数"
            icon={Sparkles}
            trend="+18%"
          />

          <StatCard
            title="オーバーレイ状態"
            value="稼働中"
            description="配信用オーバーレイ"
            icon={Tv}
            status="正常"
            trend="配信可能"
          />
        </div>
      </section>

      <section
        aria-label="ガチャテストと最近のログ"
        className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]"
      >
        <TestGachaCard />
        <RecentLogCard />
      </section>
    </div>
  );
}