import { BarChart3 } from "lucide-react";
import { PagePlaceholder } from "../components/PagePlaceholder";

export function StatisticsPage() {
  return (
    <PagePlaceholder
      title="Statistics"
      description="ガチャ回数、排出結果、ギフト、視聴者ごとの集計を確認する画面です。"
      icon={BarChart3}
      nextVersion="Release v0.8.0"
    />
  );
}