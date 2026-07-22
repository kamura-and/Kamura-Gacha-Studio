import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type LogItem = {
  id: number;
  time: string;
  label: string;
  detail: string;
};

const recentLogs: LogItem[] = [
  {
    id: 1,
    time: "22:14",
    label: "TikTok",
    detail: "LIVE connection established",
  },
  {
    id: 2,
    time: "22:16",
    label: "Gift",
    detail: "Rose ×10 received",
  },
  {
    id: 3,
    time: "22:18",
    label: "Gift",
    detail: "Whale received",
  },
  {
    id: 4,
    time: "22:19",
    label: "Gacha",
    detail: "★★★★★ Ultra Rare",
  },
];

export function RecentLogCard() {
  return (
    <Card className="border-violet-500/20 bg-slate-950/50">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest TikTok LIVE and gacha events
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {recentLogs.map((log) => (
            <div
              key={log.id}
              className="flex gap-4 border-b border-border/60 pb-4 last:border-b-0 last:pb-0"
            >
              <time className="w-12 shrink-0 text-sm text-muted-foreground">
                {log.time}
              </time>

              <div className="min-w-0">
                <p className="text-sm font-medium text-violet-300">
                  {log.label}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
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