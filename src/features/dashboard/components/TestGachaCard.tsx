import { Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function TestGachaCard() {
  return (
    <Card className="relative overflow-hidden rounded-3xl border-zinc-800 bg-zinc-950 text-white">
      <div
        aria-hidden="true"
        className="absolute -right-16 -top-16 size-48 rounded-full bg-violet-600/30 blur-3xl"
      />

      <CardHeader className="relative">
        <div className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
          <Sparkles aria-hidden="true" size={21} />
        </div>

        <CardTitle className="text-white">
          オーバーレイ演出を確認
        </CardTitle>

        <CardDescription className="leading-6 text-zinc-400">
          TikTok連携前でも、テスト用のガチャ演出を確認できるようになります。
        </CardDescription>
      </CardHeader>

      <CardContent className="relative">
        <Button
          type="button"
          className="w-full rounded-2xl bg-violet-600 text-white hover:bg-violet-500"
        >
          <Play aria-hidden="true" fill="currentColor" />
          ガチャを回す
        </Button>
      </CardContent>
    </Card>
  );
}