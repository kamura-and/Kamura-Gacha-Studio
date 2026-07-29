import {
  Search,
} from "lucide-react";

import type {
  GiftDefinition,
} from "@/features/triggers/gifts/giftDefinitions";

type GiftTriggerEditorProps = {
  gifts: GiftDefinition[];
  selectedGiftId: string;
  minimumCount: number;
  searchQuery: string;
  onSearchQueryChange: (
    value: string,
  ) => void;
  onGiftChange: (
    giftId: string,
  ) => void;
  onMinimumCountChange: (
    value: number,
  ) => void;
};

export function GiftTriggerEditor({
  gifts,
  selectedGiftId,
  minimumCount,
  searchQuery,
  onSearchQueryChange,
  onGiftChange,
  onMinimumCountChange,
}: GiftTriggerEditorProps) {
  return (
    <section className="space-y-5">
      <div>
        <h3 className="text-base font-black text-slate-900">
          ギフト条件
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          画像と名前を確認して、発動対象のギフトを選択します。
        </p>
      </div>

      <div>
        <label className="text-sm font-black text-slate-700">
          ギフト
        </label>

        <div className="relative mt-2">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            value={searchQuery}
            onChange={(event) =>
              onSearchQueryChange(
                event.target.value,
              )
            }
            placeholder="ギフト名を検索"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
          />
        </div>

        <div className="mt-3 grid max-h-72 gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
          {gifts.map((gift) => {
            const isSelected =
              gift.id === selectedGiftId;

            return (
              <button
                key={gift.id}
                type="button"
                onClick={() =>
                  onGiftChange(gift.id)
                }
                className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
                  isSelected
                    ? "border-violet-400 bg-violet-50 ring-4 ring-violet-100"
                    : "border-slate-200 bg-white hover:border-violet-200 hover:bg-violet-50/40"
                }`}
              >
                <GiftArtwork
                  gift={gift}
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-slate-900">
                    {gift.name}
                  </p>

                  <p className="mt-1 text-xs font-bold text-slate-400">
                    {gift.coinValue !==
                    undefined
                      ? `${gift.coinValue}コイン`
                      : "コイン数未取得"}
                  </p>
                </div>

                <span
                  className={`size-4 shrink-0 rounded-full border-4 ${
                    isSelected
                      ? "border-violet-600 bg-white"
                      : "border-slate-300 bg-white"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {gifts.length === 0 ? (
          <div className="mt-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
            <p className="text-sm font-black text-slate-600">
              該当するギフトがありません
            </p>

            <p className="mt-2 text-xs text-slate-500">
              検索条件を変更してください。
            </p>
          </div>
        ) : null}
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-black text-slate-700">
          個数
        </span>

        <div className="flex items-center gap-3">
          <input
            type="number"
            min={1}
            step={1}
            value={minimumCount}
            onChange={(event) => {
              const parsedValue = Number(
                event.target.value,
              );

              onMinimumCountChange(
                Number.isFinite(parsedValue)
                  ? Math.max(
                      1,
                      Math.floor(parsedValue),
                    )
                  : 1,
              );
            }}
            className="w-32 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-900 outline-none transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
          />

          <span className="text-sm font-bold text-slate-500">
            個以上で発動
          </span>
        </div>
      </label>
    </section>
  );
}

type GiftArtworkProps = {
  gift: GiftDefinition;
};

function GiftArtwork({
  gift,
}: GiftArtworkProps) {
  if (gift.imageUrl) {
    return (
      <img
        src={gift.imageUrl}
        alt=""
        className="size-14 shrink-0 rounded-2xl border border-slate-100 bg-white object-contain p-1"
        onError={(event) => {
          event.currentTarget.style.display =
            "none";
        }}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-white text-3xl"
    >
      {gift.fallbackSymbol}
    </div>
  );
}