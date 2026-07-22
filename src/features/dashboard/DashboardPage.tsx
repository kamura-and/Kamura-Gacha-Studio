import { ConnectionStatusSection } from "@/features/dashboard/components/ConnectionStatusSection";
import { RecentGachaCard } from "@/features/dashboard/components/RecentGachaCard";
import { TestGachaCard } from "@/features/dashboard/components/TestGachaCard";

export function DashboardPage() {
  return (
    <main className="px-5 py-7 md:px-8 md:py-9">
      <div className="mx-auto max-w-7xl space-y-8">
        <section>
          <p className="text-sm leading-6 text-muted-foreground">
            配信システムの状態を確認し、ガチャ演出をテストできます。
          </p>
        </section>

        <ConnectionStatusSection />

        <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <RecentGachaCard />
          <TestGachaCard />
        </section>
      </div>
    </main>
  );
}