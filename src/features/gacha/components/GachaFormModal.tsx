import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  AlertCircle,
  Check,
  Layers3,
  Save,
  Sparkles,
  X,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
} from "motion/react";

import {
  useEffectStore,
} from "@/features/effects/store/effectStore";

import type {
  GachaCommand,
  GachaItem,
  GachaRarity,
} from "@/features/gacha/types/gacha";

type GachaFormValues = {
  name: string;
  description: string;
  rarity: GachaRarity;
  isEnabled: boolean;
  effectId: string;
};

type GachaFormErrors = {
  name?: string;
  description?: string;
  effectId?: string;
};

type GachaFormModalProps = {
  isOpen: boolean;
  item?: GachaItem | null;
  onClose: () => void;
  onSubmit: (item: GachaItem) => void;
};

const rarityOptions: Array<{
  value: GachaRarity;
  label: string;
}> = [
  {
    value: "common",
    label: "コモン",
  },
  {
    value: "rare",
    label: "レア",
  },
  {
    value: "epic",
    label: "エピック",
  },
  {
    value: "legendary",
    label: "レジェンダリー",
  },
  {
    value: "ultra",
    label: "ウルトラレア",
  },
  {
    value: "secret",
    label: "シークレット",
  },
];

function createId(
  prefix: string,
): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

function createEmptyFormValues(): GachaFormValues {
  return {
    name: "",
    description: "",
    rarity: "common",
    isEnabled: true,
    effectId: "",
  };
}

export function GachaFormModal({
  isOpen,
  item,
  onClose,
  onSubmit,
}: GachaFormModalProps) {
  const effects =
    useEffectStore(
      (state) => state.effects,
    );

  const loadEffects =
    useEffectStore(
      (state) => state.loadEffects,
    );

  const [
    formValues,
    setFormValues,
  ] = useState<GachaFormValues>(
    createEmptyFormValues,
  );

  const [
    errors,
    setErrors,
  ] = useState<GachaFormErrors>(
    {},
  );

  const isEditMode =
    Boolean(item);

  const selectedEffect =
    useMemo(
      () =>
        effects.find(
          (effect) =>
            effect.id ===
            formValues.effectId,
        ),
      [
        effects,
        formValues.effectId,
      ],
    );

  const modalTitle =
    isEditMode
      ? "ガチャ景品を編集"
      : "新しいガチャ景品を追加";

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    void loadEffects();

    if (item) {
      setFormValues({
        name: item.name,
        description:
          item.description,
        rarity: item.rarity,
        isEnabled:
          item.isEnabled,
        effectId:
          item.effectId ?? "",
      });
    } else {
      setFormValues(
        createEmptyFormValues(),
      );
    }

    setErrors({});
  }, [
    isOpen,
    item,
    loadEffects,
  ]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.key === "Escape"
      ) {
        onClose();
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    document.body.style.overflow =
      "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );

      document.body.style.overflow =
        "";
    };
  }, [
    isOpen,
    onClose,
  ]);

  function updateFormField<
    Key extends keyof GachaFormValues,
  >(
    key: Key,
    value: GachaFormValues[Key],
  ) {
    setFormValues(
      (current) => ({
        ...current,
        [key]: value,
      }),
    );

    setErrors(
      (current) => ({
        ...current,
        [key]: undefined,
      }),
    );
  }

  function validateForm(): boolean {
    const nextErrors:
      GachaFormErrors = {};

    if (!formValues.name.trim()) {
      nextErrors.name =
        "景品名を入力してください。";
    }

    if (
      !formValues.description.trim()
    ) {
      nextErrors.description =
        "説明を入力してください。";
    }

    if (
      !formValues.effectId.trim()
    ) {
      nextErrors.effectId =
        "実行するエフェクトを選択してください。";
    } else if (!selectedEffect) {
      nextErrors.effectId =
        "選択したエフェクトが見つかりません。";
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors)
        .length === 0
    );
  }

  function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const legacyCommands:
      GachaCommand[] =
      item?.commands.map(
        (command) => ({
          ...command,
        }),
      ) ?? [];

    const submittedItem:
      GachaItem = {
        id:
          item?.id ??
          createId("gacha"),
        name:
          formValues.name.trim(),
        description:
          formValues.description.trim(),
        effectId:
          formValues.effectId.trim(),
        commands:
          legacyCommands,
        rarity:
          formValues.rarity,
        isEnabled:
          formValues.isEnabled,
        createdAt:
          item?.createdAt ??
          new Date().toISOString(),
      };

    onSubmit(submittedItem);
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
        >
          <button
            type="button"
            aria-label="モーダルを閉じる"
            className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="gacha-form-title"
            className="relative z-10 flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl"
            initial={{
              opacity: 0,
              scale: 0.96,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.97,
              y: 12,
            }}
          >
            <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5 sm:px-8">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-violet-600">
                  <Sparkles
                    aria-hidden="true"
                    size={13}
                  />

                  Gacha Prize
                </div>

                <h2
                  id="gacha-form-title"
                  className="mt-1 text-xl font-black text-slate-950"
                >
                  {modalTitle}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  保存済みエフェクトをガチャ景品として登録します。
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="閉じる"
                className="flex size-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X
                  aria-hidden="true"
                  size={19}
                />
              </button>
            </header>

            <form
              onSubmit={
                handleSubmit
              }
              className="min-h-0 flex-1 overflow-y-auto"
            >
              <div className="space-y-7 px-6 py-6 sm:px-8">
                <section className="grid gap-5">
                  <div>
                    <label
                      htmlFor="gacha-name"
                      className="text-sm font-black text-slate-800"
                    >
                      景品名
                    </label>

                    <input
                      id="gacha-name"
                      value={
                        formValues.name
                      }
                      onChange={(
                        event,
                      ) => {
                        updateFormField(
                          "name",
                          event.target
                            .value,
                        );
                      }}
                      placeholder="例：TNT爆撃"
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    />

                    {errors.name ? (
                      <FieldError
                        message={
                          errors.name
                        }
                      />
                    ) : null}
                  </div>

                  <div>
                    <label
                      htmlFor="gacha-description"
                      className="text-sm font-black text-slate-800"
                    >
                      説明
                    </label>

                    <textarea
                      id="gacha-description"
                      rows={3}
                      value={
                        formValues.description
                      }
                      onChange={(
                        event,
                      ) => {
                        updateFormField(
                          "description",
                          event.target
                            .value,
                        );
                      }}
                      placeholder="景品として当選したときに実行する内容を入力します。"
                      className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    />

                    {errors.description ? (
                      <FieldError
                        message={
                          errors.description
                        }
                      />
                    ) : null}
                  </div>

                  <div>
                    <label
                      htmlFor="gacha-rarity"
                      className="text-sm font-black text-slate-800"
                    >
                      レアリティ
                    </label>

                    <select
                      id="gacha-rarity"
                      value={
                        formValues.rarity
                      }
                      onChange={(
                        event,
                      ) => {
                        updateFormField(
                          "rarity",
                          event.target
                            .value as GachaRarity,
                        );
                      }}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                    >
                      {rarityOptions.map(
                        (option) => (
                          <option
                            key={
                              option.value
                            }
                            value={
                              option.value
                            }
                          >
                            {
                              option.label
                            }
                          </option>
                        ),
                      )}
                    </select>

                    <p className="mt-2 text-xs text-slate-500">
                      出やすさはガチャ箱側の「重み」で設定します。
                    </p>
                  </div>
                </section>

                <section>
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      実行するエフェクト
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      エフェクトページで保存した妨害内容を選択します。
                    </p>
                  </div>

                  {effects.length > 0 ? (
                    <div className="mt-4 grid gap-3">
                      {effects.map(
                        (effect) => {
                          const isSelected =
                            formValues.effectId ===
                            effect.id;

                          return (
                            <button
                              key={
                                effect.id
                              }
                              type="button"
                              aria-pressed={
                                isSelected
                              }
                              onClick={() => {
                                updateFormField(
                                  "effectId",
                                  effect.id,
                                );
                              }}
                              className={[
                                "flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition",
                                isSelected
                                  ? "border-violet-400 bg-violet-50 ring-4 ring-violet-100"
                                  : "border-slate-200 bg-white hover:border-violet-200 hover:bg-violet-50/40",
                              ].join(
                                " ",
                              )}
                            >
                              <div
                                className={[
                                  "flex size-11 shrink-0 items-center justify-center rounded-2xl",
                                  isSelected
                                    ? "bg-violet-600 text-white"
                                    : "bg-violet-100 text-violet-700",
                                ].join(
                                  " ",
                                )}
                              >
                                {isSelected ? (
                                  <Check
                                    aria-hidden="true"
                                    size={18}
                                  />
                                ) : (
                                  <Layers3
                                    aria-hidden="true"
                                    size={18}
                                  />
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="font-black text-slate-900">
                                    {
                                      effect.name
                                    }
                                  </p>

                                  <span className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-black text-slate-500">
                                    {
                                      effect
                                        .actions
                                        .length
                                    }
                                    件
                                  </span>
                                </div>

                                <p className="mt-1 text-sm leading-6 text-slate-500">
                                  {effect.description ||
                                    "説明はありません。"}
                                </p>

                                {effect.tags.length >
                                0 ? (
                                  <div className="mt-3 flex flex-wrap gap-1.5">
                                    {effect.tags.map(
                                      (
                                        tag,
                                      ) => (
                                        <span
                                          key={
                                            tag
                                          }
                                          className="rounded-lg bg-violet-100 px-2 py-1 text-[11px] font-bold text-violet-700"
                                        >
                                          {
                                            tag
                                          }
                                        </span>
                                      ),
                                    )}
                                  </div>
                                ) : null}
                              </div>
                            </button>
                          );
                        },
                      )}
                    </div>
                  ) : (
                    <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
                      <Layers3
                        aria-hidden="true"
                        size={24}
                        className="mx-auto text-slate-400"
                      />

                      <p className="mt-3 text-sm font-black text-slate-700">
                        保存済みエフェクトがありません
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        先にエフェクトページで妨害内容を作成・保存してください。
                      </p>
                    </div>
                  )}

                  {errors.effectId ? (
                    <FieldError
                      message={
                        errors.effectId
                      }
                    />
                  ) : null}
                </section>

                <section>
                  <button
                    type="button"
                    onClick={() => {
                      updateFormField(
                        "isEnabled",
                        !formValues.isEnabled,
                      );
                    }}
                    className={[
                      "flex w-full items-center justify-between rounded-2xl border px-4 py-4 transition",
                      formValues.isEnabled
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-slate-200 bg-slate-50",
                    ].join(" ")}
                  >
                    <div className="text-left">
                      <p className="text-sm font-black text-slate-800">
                        景品の有効状態
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        無効にするとガチャ箱の抽選対象から除外されます。
                      </p>
                    </div>

                    <span
                      className={[
                        "rounded-full px-3 py-1.5 text-xs font-black",
                        formValues.isEnabled
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-300 text-slate-700",
                      ].join(" ")}
                    >
                      {formValues.isEnabled
                        ? "有効"
                        : "無効"}
                    </span>
                  </button>
                </section>
              </div>

              <footer className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-slate-100 bg-white/95 px-6 py-5 backdrop-blur sm:flex-row sm:justify-end sm:px-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-50"
                >
                  キャンセル
                </button>

                <button
                  type="submit"
                  disabled={
                    effects.length === 0
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                >
                  <Save
                    aria-hidden="true"
                    size={17}
                  />

                  {isEditMode
                    ? "変更を保存"
                    : "景品を追加"}
                </button>
              </footer>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function FieldError({
  message,
}: {
  message: string;
}) {
  return (
    <p className="mt-2 flex items-center gap-1.5 text-xs font-bold text-rose-600">
      <AlertCircle
        aria-hidden="true"
        size={13}
      />

      {message}
    </p>
  );
}