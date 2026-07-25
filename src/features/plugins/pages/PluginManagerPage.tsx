import {
  Blocks,
  Cable,
  Unplug,
} from "lucide-react";

import { PluginCard } from "@/features/plugins/components/PluginCard";
import { PluginSummary } from "@/features/plugins/components/PluginSummary";
import { usePluginStore } from "@/features/plugins";

export function PluginManagerPage() {
  const plugins = usePluginStore(
    (state) => state.plugins,
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      <div className="space-y-12">
        <header className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-6 px-7 py-7 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 text-white shadow-lg shadow-violet-600/20">
                <Blocks
                  aria-hidden="true"
                  size={22}
                />
              </div>

              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-950">
                  プラグイン
                </h1>

                <p className="mt-1.5 text-sm leading-6 text-slate-500">
                  外部サービスとの接続状態とPluginの稼働設定を管理します。
                </p>
              </div>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-violet-50 px-3.5 py-2 text-xs font-black text-violet-700 ring-1 ring-inset ring-violet-600/15">
              <Cable
                aria-hidden="true"
                size={14}
              />

              {plugins.length} Plugins
            </div>
          </div>
        </header>

        <PluginSummary
          plugins={plugins}
        />

        <section
          aria-labelledby="plugin-list-title"
          className="space-y-6"
        >
          <div>
            <h2
              id="plugin-list-title"
              className="text-xl font-black tracking-tight text-slate-950"
            >
              Plugin一覧
            </h2>

            <p className="mt-1.5 text-sm leading-6 text-slate-500">
              各Pluginの接続状態と利用状況を確認できます。
            </p>
          </div>

          {plugins.length > 0 ? (
            <div className="grid gap-6">
              {plugins.map(
                (plugin) => (
                  <PluginCard
                    key={plugin.id}
                    plugin={plugin}
                  />
                ),
              )}
            </div>
          ) : (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white px-6 text-center">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Unplug
                  aria-hidden="true"
                  size={23}
                />
              </div>

              <h3 className="mt-4 text-base font-black text-slate-950">
                Pluginがありません
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Pluginを登録すると、この画面から接続状態や設定を管理できます。
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}