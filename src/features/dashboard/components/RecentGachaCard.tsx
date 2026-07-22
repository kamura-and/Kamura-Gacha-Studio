import { Gift } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function RecentGachaCard() {
  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle>最後のガチャ</CardTitle>
        <CardDescription>直近で実行された結果</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex min-h-48 items-center justify-center rounded-3xl border border-dashed border-primary/25 bg-primary/5">
          <div className="px-5 text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-background text-primary shadow-sm">
              <Gift aria-hidden="true" size={25} />
            </div>

            <p className="font-semibold text-foreground">
              まだ実行されていません
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              ガチャ結果がここに表示されます。
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}