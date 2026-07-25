import { useState } from "react";
import {
  Clock3,
  Heart,
  RefreshCcw,
  Tag,
  Zap,
} from "lucide-react";

import { effectRepository } from "@/features/effects/repository/EffectRepository";

import type { EffectDefinition } from "@/features/effects/types/effectDefinition";

export function EffectPreviewCard() {
  const [effect, setEffect] =
    useState<EffectDefinition | undefined>(
      () => effectRepository.getRandom(),
    );

  function handleRandom() {
    setEffect(
      effectRepository.getRandom(),
    );
  }

  if (!effect) {
    return (
      <section className="rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black">
          エフェクトプレビュー
        </h2>

        <p className="mt-6 text-sm text-slate-500">
          まだエフェクトがありません。
        </p>

        <p className="mt-2 text-sm text-slate-400">
          「エフェクト」画面から作成すると
          ここに表示されます。
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-xl font-black">
            エフェクトプレビュー
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            登録済みエフェクトを表示しています
          </p>

        </div>

        <button
          onClick={handleRandom}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-bold text-white hover:bg-violet-500"
        >
          <RefreshCcw size={16} />
          ランダム表示
        </button>

      </div>

      <div className="mt-8">

        <div className="flex items-center gap-3">

          <Zap
            className="text-violet-600"
            size={28}
          />

          <h3 className="text-3xl font-black">
            {effect.name}
          </h3>

          {effect.favorite && (
            <Heart
              size={18}
              className="fill-rose-500 text-rose-500"
            />
          )}

        </div>

        <p className="mt-4 text-slate-600">
          {effect.description ||
            "説明はありません。"}
        </p>

      </div>

      <div className="mt-8 grid gap-3 md:grid-cols-3">

        <Info
          icon={<Zap size={16} />}
          label="アクション"
          value={`${effect.actions.length}件`}
        />

        <Info
          icon={<Tag size={16} />}
          label="タグ"
          value={
            effect.tags.length
              ? effect.tags.join(", ")
              : "なし"
          }
        />

        <Info
          icon={<Clock3 size={16} />}
          label="更新"
          value={new Intl.DateTimeFormat(
            "ja-JP",
          ).format(
            new Date(effect.updatedAt),
          )}
        />

      </div>

    </section>
  );
}

type InfoProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function Info({
  icon,
  label,
  value,
}: InfoProps) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">

      <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
        {icon}
        {label}
      </div>

      <div className="mt-2 text-lg font-black">
        {value}
      </div>

    </div>
  );
}