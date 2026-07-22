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

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="TikTok Connection"
          value="Connected"
          subtitle="Ready to receive gifts"
        />

        <StatCard
          title="Today's Gifts"
          value="28"
          subtitle="+12% from yesterday"
        />

        <StatCard
          title="Gacha Rolls"
          value="54"
          subtitle="Triggered today"
        />

        <StatCard
          title="Overlay"
          value="Running"
          subtitle="Browser source active"
        />
      </section>

      <section className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <TestGachaCard />
        <RecentLogCard />
      </section>
    </div>
  );
}