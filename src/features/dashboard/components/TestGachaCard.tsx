import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDashboardStore } from "@/features/dashboard/store/useDashboardStore";

export function TestGachaCard() {
  const currentResult = useDashboardStore(
    (state) => state.currentResult,
  );

  const rollTestGacha = useDashboardStore(
    (state) => state.rollTestGacha,
  );

  const stars = "★".repeat(currentResult.stars);

  return (
    <Card className="overflow-hidden border-violet-500/30 bg-slate-400 text-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-white">
          テストガチャ
        </CardTitle>

        <CardDescription className="text-slate-200">
          TikTokギフトなしでガチャを試せます
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-violet-400/30 bg-gradient-to-br from-violet-300 via-slate-300 to-cyan-400 p-6 text-center shadow-inner">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">
            ガチャ結果
          </p>

          <div className="mt-5 min-h-10 text-3xl tracking-widest text-cyan-100">
            {stars}
          </div>

          <p className="mt-4 text-2xl font-bold text-violet-400">
            {currentResult.rarity}
          </p>

          <p className="mt-2 text-base text-slate-500">
            {currentResult.name}
          </p>

          <code className="mt-5 max-w-full overflow-x-auto rounded-md border border-cyan-400/30 bg-slate-600 px-3 py-2 text-xs text-cyan-300">
            {currentResult.minecraftCommand}
          </code>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full bg-violet-400 text-white hover:bg-violet-500"
          type="button"
          onClick={rollTestGacha}
        >
          ガチャを回す
        </Button>
      </CardFooter>
    </Card>
  );
}