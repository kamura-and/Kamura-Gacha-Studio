import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDashboardStore } from "@/features/dashboard/store/useDashboardStore";

export function RecentLogCard() {
  const recentLogs = useDashboardStore(
    (state) => state.recentLogs,
  );

  return (
    <Card className="border-violet-500/20 bg-slate-950/50">
      <CardHeader>
        <CardTitle>最新アクティビティ</CardTitle>

        <CardDescription className="text-slate-200">
          TikTok LIVEとガチャの最新履歴
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {recentLogs.map((log) => (
            <div
              key={log.id}
              className="flex gap-4 border-b border-border/60 pb-4 last:border-b-0 last:pb-0"
            >
              <time className="w-12 shrink-0 text-sm text-slate-200">
                {log.time}
              </time>

              <div className="min-w-0">
                <p className="text-sm font-medium text-violet-300">
                  {log.label}
                </p>

                <p className="mt-1 break-words text-sm text-slate-300">
                  {log.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}