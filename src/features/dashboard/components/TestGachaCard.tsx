import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function TestGachaCard() {
  return (
    <Card className="overflow-hidden border-violet-500/20 bg-slate-950/50">
      <CardHeader>
        <CardTitle>Test Gacha</CardTitle>
        <CardDescription>
          Run a preview without receiving a TikTok gift
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-slate-950 to-cyan-500/10 p-6 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-violet-300">
            Gacha Result
          </p>

          <div className="mt-5 text-3xl tracking-widest text-yellow-300">
            ★★★★★
          </div>

          <p className="mt-4 text-2xl font-bold">
            Ultra Rare
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            Minecraft Black Hole
          </p>
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full">
          Run Test Gacha
        </Button>
      </CardFooter>
    </Card>
  );
}