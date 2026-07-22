import { Radio, Server, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const statusItems = [
  {
    label: "TikTok LIVE",
    status: "未接続",
    icon: Radio,
  },
  {
    label: "Overlay",
    status: "停止中",
    icon: Sparkles,
  },
  {
    label: "Minecraft",
    status: "未接続",
    icon: Server,
  },
];

export function ConnectionStatusSection() {
  return (
    <section aria-labelledby="connection-status-title">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2
            id="connection-status-title"
            className="text-lg font-bold text-foreground"
          >
            接続状況
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            外部サービスとの接続状態を確認します。
          </p>
        </div>

        <Badge variant="secondary">3サービス</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {statusItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: index * 0.08,
              }}
            >
              <Card className="h-full rounded-3xl">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon aria-hidden="true" size={21} />
                  </div>

                  <Badge variant="secondary">
                    <span className="mr-1.5 size-1.5 rounded-full bg-muted-foreground" />
                    {item.status}
                  </Badge>
                </CardHeader>

                <CardContent>
                  <CardTitle className="text-base">{item.label}</CardTitle>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}