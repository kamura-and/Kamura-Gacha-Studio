import { ConnectionStatusSection } from "@/features/dashboard/components/ConnectionStatusSection";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { RecentLogCard } from "@/features/dashboard/components/RecentLogCard";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { TestGachaCard } from "@/features/dashboard/components/TestGachaCard";
import { useDashboardStore } from "@/features/dashboard/store/useDashboardStore";

export function DashboardPage() {
  const isConnected = useDashboardStore(
    (state) => state.isConnected,
  );

  const todayGiftCount = useDashboardStore(
    (state) => state.todayGiftCount,
  );

  const gachaRollCount = useDashboardStore(
    (state) => state.gachaRollCount,
  );

  const isOverlayRunning = useDashboardStore(
    (state) => state.isOverlayRunning,
  );

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <DashboardHeader />

      <ConnectionStatusSection />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="TikTok接続状況"
          value={isConnected ? "接続中" : "未接続"}
          subtitle={
            isConnected
              ? "ギフト受信の準備ができています"
              : "TikTok LIVEへの接続が必要です"
          }
        />

        <StatCard
          title="本日のギフト数"
          value={todayGiftCount.toString()}
          subtitle="本日受信したギフト数"
        />

        <StatCard
          title="ガチャ実行回数"
          value={gachaRollCount.toString()}
          subtitle="本日実行された回数"
        />

        <StatCard
          title="オーバーレイ状態"
          value={isOverlayRunning ? "稼働中" : "停止中"}
          subtitle={
            isOverlayRunning
              ? "ブラウザソースが有効です"
              : "オーバーレイは停止しています"
          }
        />
      </section>

      <section className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <TestGachaCard />
        <RecentLogCard />
      </section>
    </div>
  );
}