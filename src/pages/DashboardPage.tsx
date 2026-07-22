import { Gift, Radio, Server, Sparkles } from "lucide-react";
import { motion } from "motion/react";

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

export function DashboardPage() {
  return (
    <main className="px-5 py-7 md:px-8 md:py-9">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8">
          <p className="text-sm leading-6 text-zinc-500">
            配信システムの状態を確認し、ガチャ演出をテストできます。
          </p>
        </section>

        <section
          aria-labelledby="connection-status-title"
          className="mb-8"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2
                id="connection-status-title"
                className="text-lg font-bold text-zinc-900"
              >
                接続状況
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                外部サービスとの接続状態
              </p>
            </div>

            <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-500 shadow-sm">
              3サービス
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {statusItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.article
                  key={item.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: index * 0.08,
                  }}
                  className="rounded-3xl border border-white/80 bg-white/80 p-6 shadow-sm backdrop-blur"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                      <Icon aria-hidden="true" size={21} />
                    </div>

                    <span className="flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-500">
                      <span className="size-1.5 rounded-full bg-zinc-400" />
                      {item.status}
                    </span>
                  </div>

                  <h3 className="font-semibold text-zinc-900">
                    {item.label}
                  </h3>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <article className="rounded-3xl border border-white/80 bg-white/80 p-7 shadow-sm backdrop-blur">
            <div>
              <h2 className="text-lg font-bold text-zinc-900">
                最後のガチャ
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                直近で実行された結果
              </p>
            </div>

            <div className="mt-6 flex min-h-48 items-center justify-center rounded-3xl border border-dashed border-violet-200 bg-violet-50/60">
              <div className="px-5 text-center">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm">
                  <Gift aria-hidden="true" size={25} />
                </div>

                <p className="font-semibold text-zinc-800">
                  まだ実行されていません
                </p>

                <p className="mt-1 text-sm text-zinc-500">
                  ガチャ結果がここに表示されます
                </p>
              </div>
            </div>
          </article>

          <article className="relative overflow-hidden rounded-3xl bg-zinc-950 p-7 text-white shadow-lg shadow-violet-950/10">
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-16 size-48 rounded-full bg-violet-600/30 blur-3xl"
            />

            <div className="relative">
              <p className="text-sm font-medium text-violet-200">
                ガチャテスト
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                オーバーレイ演出を確認
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                TikTok連携前でも、テスト用のガチャを実行できるようになります。
              </p>

              <button
                type="button"
                className="mt-8 w-full rounded-2xl bg-violet-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-500 active:scale-[0.98]"
              >
                ガチャを回す
              </button>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}