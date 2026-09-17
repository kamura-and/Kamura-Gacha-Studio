import {
  RefreshCw,
  Search,
} from "lucide-react";

import type {
  GiftDefinition,
} from "@/features/triggers/gifts/giftDefinitions";

import type {
  TriggerActivationPolicy,
  TriggerAggregationScope,
} from "@/features/triggers/types/Trigger";


type GiftTriggerEditorProps = {
  gifts: GiftDefinition[];
  selectedGiftId: string;

  activationPolicy:
    TriggerActivationPolicy;

  threshold: number;

  aggregationScope:
    TriggerAggregationScope;

  searchQuery: string;

  isGiftCatalogSyncing?: boolean;
  giftCatalogSyncMessage?: string;

  onSearchQueryChange: (
    value: string,
  ) => void;

  onGiftChange: (
    giftId: string,
  ) => void;

  onActivationPolicyChange: (
    policy: TriggerActivationPolicy,
  ) => void;

  onThresholdChange: (
    value: number,
  ) => void;

  onAggregationScopeChange: (
    scope: TriggerAggregationScope,
  ) => void;

  onGiftCatalogSync?: () => void;
};


export function GiftTriggerEditor({
  gifts,
  selectedGiftId,
  activationPolicy,
  threshold,
  aggregationScope,
  searchQuery,
  isGiftCatalogSyncing = false,
  giftCatalogSyncMessage,
  onSearchQueryChange,
  onGiftChange,
  onActivationPolicyChange,
  onThresholdChange,
  onAggregationScopeChange,
  onGiftCatalogSync,
}: GiftTriggerEditorProps) {
  const usesThreshold =
    activationPolicy !==
    "every-event";

  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-base font-black text-slate-900">
          ギフト条件
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          発動対象のギフトと、何個受信したときにガチャを実行するかを設定します。
        </p>
      </div>


      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="text-sm font-black text-slate-700">
            ギフト
          </label>

          {onGiftCatalogSync ? (
            <button
              type="button"
              onClick={
                onGiftCatalogSync
              }
              disabled={
                isGiftCatalogSyncing
              }
              className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-black text-violet-700 transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={
                  isGiftCatalogSyncing
                    ? "animate-spin"
                    : undefined
                }
              />

              {isGiftCatalogSyncing
                ? "更新中..."
                : "ギフト一覧更新"}
            </button>
          ) : null}
        </div>


        {giftCatalogSyncMessage ? (
          <p className="mt-2 text-xs font-bold text-slate-500">
            {giftCatalogSyncMessage}
          </p>
        ) : null}


        <div className="relative mt-2">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            value={
              searchQuery
            }
            onChange={(
              event,
            ) =>
              onSearchQueryChange(
                event.target.value,
              )
            }
            placeholder="ギフト名・IDを検索"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
          />
        </div>


        <div className="mt-3 grid max-h-72 gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
          {gifts.map(
            (
              gift,
            ) => {
              const isSelected =
                gift.id ===
                selectedGiftId;

              return (
                <button
                  key={
                    gift.id
                  }
                  type="button"
                  onClick={
                    () =>
                      onGiftChange(
                        gift.id,
                      )
                  }
                  className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
                    isSelected
                      ? "border-violet-400 bg-violet-50 ring-4 ring-violet-100"
                      : "border-slate-200 bg-white hover:border-violet-200 hover:bg-violet-50/40"
                  }`}
                >
                  <GiftArtwork
                    gift={
                      gift
                    }
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black text-slate-900">
                      {gift.name}
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-xs font-bold text-slate-500">
                        {gift.coinValue !==
                        undefined
                          ? `${gift.coinValue}コイン`
                          : "コイン数未取得"}
                      </span>

                      <span
                        aria-hidden="true"
                        className="text-xs font-bold text-slate-300"
                      >
                        ・
                      </span>

                      <span className="font-mono text-[11px] font-bold text-slate-400">
                        ID: {gift.id}
                      </span>
                    </div>
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
            },
          )}
        </div>


        {gifts.length ===
        0 ? (
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


      <div className="grid gap-3">
        <span className="text-sm font-black text-slate-700">
          発動方法
        </span>

        <ActivationPolicyOption
          checked={
            activationPolicy ===
            "every-event"
          }
          title="1個ごとに発動"
          description="ギフト1個につき1回、ガチャを実行します。"
          onChange={
            () =>
              onActivationPolicyChange(
                "every-event",
              )
          }
        />

        <ActivationPolicyOption
          checked={
            activationPolicy ===
            "once-threshold"
          }
          title="指定個数に到達したら1回"
          description="集計した個数が指定数に到達したとき、その範囲では1回だけ発動します。"
          onChange={
            () =>
              onActivationPolicyChange(
                "once-threshold",
              )
          }
        />

        <ActivationPolicyOption
          checked={
            activationPolicy ===
            "every-threshold"
          }
          title="指定個数ごとに発動"
          description="指定個数に到達するたび、繰り返し発動します。"
          onChange={
            () =>
              onActivationPolicyChange(
                "every-threshold",
              )
          }
        />
      </div>


      {usesThreshold ? (
        <div className="grid gap-2">
          <label className="text-sm font-black text-slate-700">
            指定個数
          </label>

          <div className="flex items-center gap-3">
            <input
              type="number"
              min={1}
              step={1}
              value={
                threshold
              }
              onChange={(
                event,
              ) => {
                const parsedValue =
                  Number(
                    event.target.value,
                  );

                onThresholdChange(
                  Number.isFinite(
                    parsedValue,
                  )
                    ? Math.max(
                        1,
                        Math.floor(
                          parsedValue,
                        ),
                      )
                    : 1,
                );
              }}
              className="w-32 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-900 outline-none transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
            />

            <span className="text-sm font-bold text-slate-500">
              個
            </span>
          </div>

          <p className="text-xs leading-5 text-slate-500">
            {activationPolicy ===
            "once-threshold"
              ? `${threshold}個に到達したとき1回だけ発動します。`
              : `${threshold}個、${threshold * 2}個、${threshold * 3}個…と到達するたびに発動します。`}
          </p>
        </div>
      ) : null}


      {usesThreshold ? (
        <div className="grid gap-3">
          <span className="text-sm font-black text-slate-700">
            集計方法
          </span>

          <label
            className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
              aggregationScope ===
              "global"
                ? "border-violet-300 bg-violet-50 ring-4 ring-violet-100"
                : "border-slate-200 bg-white hover:border-violet-200"
            }`}
          >
            <input
              type="radio"
              name="gift-aggregation-scope"
              checked={
                aggregationScope ===
                "global"
              }
              onChange={
                () =>
                  onAggregationScopeChange(
                    "global",
                  )
              }
              className="mt-1 size-4 accent-violet-600"
            />

            <div>
              <p className="text-sm font-black text-slate-800">
                配信全体で合計
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                すべてのリスナーから受信した対象ギフトを合算します。
              </p>
            </div>
          </label>


          <label
            className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
              aggregationScope ===
              "per-user"
                ? "border-violet-300 bg-violet-50 ring-4 ring-violet-100"
                : "border-slate-200 bg-white hover:border-violet-200"
            }`}
          >
            <input
              type="radio"
              name="gift-aggregation-scope"
              checked={
                aggregationScope ===
                "per-user"
              }
              onChange={
                () =>
                  onAggregationScopeChange(
                    "per-user",
                  )
              }
              className="mt-1 size-4 accent-violet-600"
            />

            <div>
              <p className="text-sm font-black text-slate-800">
                リスナーごとに集計
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                リスナーごとに対象ギフトの個数を別々に数えます。
              </p>
            </div>
          </label>
        </div>
      ) : null}
    </section>
  );
}


type ActivationPolicyOptionProps = {
  checked: boolean;
  title: string;
  description: string;
  onChange: () => void;
};


function ActivationPolicyOption({
  checked,
  title,
  description,
  onChange,
}: ActivationPolicyOptionProps) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
        checked
          ? "border-violet-300 bg-violet-50 ring-4 ring-violet-100"
          : "border-slate-200 bg-white hover:border-violet-200"
      }`}
    >
      <input
        type="radio"
        name="gift-activation-policy"
        checked={
          checked
        }
        onChange={
          onChange
        }
        className="mt-1 size-4 accent-violet-600"
      />

      <div>
        <p className="text-sm font-black text-slate-800">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </label>
  );
}


type GiftArtworkProps = {
  gift: GiftDefinition;
};


function GiftArtwork({
  gift,
}: GiftArtworkProps) {
  if (
    gift.imageUrl
  ) {
    return (
      <img
        src={
          gift.imageUrl
        }
        alt=""
        className="size-14 shrink-0 rounded-2xl border border-slate-100 bg-white object-contain p-1"
        onError={(
          event,
        ) => {
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