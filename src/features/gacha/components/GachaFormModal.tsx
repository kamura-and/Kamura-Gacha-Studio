import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Check,
  Clock3,
  Command,
  Layers3,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Volume2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import type {
  GachaActionType,
  GachaCommand,
  GachaItem,
  GachaRarity,
} from "@/features/gacha/types/gacha";

type GachaFormValues = {
  name: string;
  description: string;
  rarity: GachaRarity;
  probability: string;
  isEnabled: boolean;
  commands: GachaCommand[];
};

type GachaFormErrors = {
  name?: string;
  description?: string;
  probability?: string;
  commands?: Record<string, string>;
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
  { value: "common", label: "Common" },
  { value: "rare", label: "Rare" },
  { value: "epic", label: "Epic" },
  { value: "legendary", label: "Legendary" },
  { value: "ultra", label: "Ultra Rare" },
  { value: "secret", label: "Secret" },
];

const actionOptions: Array<{
  value: GachaActionType;
  label: string;
}> = [
  { value: "minecraft", label: "Minecraft" },
  { value: "overlay", label: "Overlay" },
  { value: "sound", label: "Sound" },
  { value: "wait", label: "Wait" },
];

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function createEmptyCommand(
  type: GachaActionType = "minecraft",
): GachaCommand {
  return {
    id: createId("action"),
    type,
    value: "",
    delay: 0,
    enabled: true,
  };
}

function createEmptyFormValues(): GachaFormValues {
  return {
    name: "",
    description: "",
    rarity: "common",
    probability: "10",
    isEnabled: true,
    commands: [createEmptyCommand()],
  };
}

function getActionPlaceholder(type: GachaActionType) {
  switch (type) {
    case "minecraft":
      return "/effect give @a minecraft:slowness 8 1 true";

    case "overlay":
      return "ultra-rare-animation";

    case "sound":
      return "gacha-result.mp3";

    case "wait":
      return "Waitでは値の入力は不要です";

    default:
      return "";
  }
}

function getActionIcon(type: GachaActionType) {
  switch (type) {
    case "minecraft":
      return <Command size={17} />;

    case "overlay":
      return <Layers3 size={17} />;

    case "sound":
      return <Volume2 size={17} />;

    case "wait":
      return <Clock3 size={17} />;
  }
}

export function GachaFormModal({
  isOpen,
  item,
  onClose,
  onSubmit,
}: GachaFormModalProps) {
  const [formValues, setFormValues] =
    useState<GachaFormValues>(createEmptyFormValues);

  const [errors, setErrors] =
    useState<GachaFormErrors>({});

  const isEditMode = Boolean(item);

  const modalTitle = useMemo(
    () =>
      isEditMode
        ? "ガチャを編集"
        : "新しいガチャを追加",
    [isEditMode],
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (item) {
      setFormValues({
        name: item.name,
        description: item.description,
        rarity: item.rarity,
        probability: String(item.probability),
        isEnabled: item.isEnabled,
        commands: item.commands.map((command) => ({
          ...command,
        })),
      });
    } else {
      setFormValues(createEmptyFormValues());
    }

    setErrors({});
  }, [isOpen, item]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );

      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const updateFormField = <
    Key extends keyof GachaFormValues,
  >(
    key: Key,
    value: GachaFormValues[Key],
  ) => {
    setFormValues((current) => ({
      ...current,
      [key]: value,
    }));

    setErrors((current) => ({
      ...current,
      [key]: undefined,
    }));
  };

  const updateCommand = (
    id: string,
    updates: Partial<GachaCommand>,
  ) => {
    setFormValues((current) => ({
      ...current,
      commands: current.commands.map((command) =>
        command.id === id
          ? {
              ...command,
              ...updates,
            }
          : command,
      ),
    }));

    setErrors((current) => ({
      ...current,
      commands: {
        ...current.commands,
        [id]: "",
      },
    }));
  };

  const addCommand = () => {
    setFormValues((current) => ({
      ...current,
      commands: [
        ...current.commands,
        createEmptyCommand(),
      ],
    }));
  };

  const deleteCommand = (id: string) => {
    setFormValues((current) => ({
      ...current,
      commands: current.commands.filter(
        (command) => command.id !== id,
      ),
    }));
  };

  const moveCommand = (
    index: number,
    direction: -1 | 1,
  ) => {
    const targetIndex = index + direction;

    if (
      targetIndex < 0 ||
      targetIndex >= formValues.commands.length
    ) {
      return;
    }

    setFormValues((current) => {
      const nextCommands = [...current.commands];

      [
        nextCommands[index],
        nextCommands[targetIndex],
      ] = [
        nextCommands[targetIndex],
        nextCommands[index],
      ];

      return {
        ...current,
        commands: nextCommands,
      };
    });
  };

  const validateForm = () => {
    const nextErrors: GachaFormErrors = {};
    const commandErrors: Record<string, string> =
      {};

    const probability = Number(
      formValues.probability,
    );

    if (!formValues.name.trim()) {
      nextErrors.name =
        "ガチャ名を入力してください。";
    }

    if (!formValues.description.trim()) {
      nextErrors.description =
        "説明を入力してください。";
    }

    if (
      formValues.probability.trim() === "" ||
      Number.isNaN(probability)
    ) {
      nextErrors.probability =
        "排出率を数値で入力してください。";
    } else if (
      probability < 0 ||
      probability > 100
    ) {
      nextErrors.probability =
        "排出率は0〜100の範囲で入力してください。";
    }

    if (formValues.commands.length === 0) {
      commandErrors.form =
        "アクションを1件以上追加してください。";
    }

    formValues.commands.forEach((command) => {
      if (
        command.type !== "wait" &&
        !command.value.trim()
      ) {
        commandErrors[command.id] =
          "実行内容を入力してください。";
        return;
      }

      if (
        command.type === "minecraft" &&
        !command.value.trim().startsWith("/")
      ) {
        commandErrors[command.id] =
          "Minecraftコマンドは「/」から始めてください。";
        return;
      }

      if (
        !Number.isFinite(command.delay) ||
        command.delay < 0
      ) {
        commandErrors[command.id] =
          "遅延時間は0以上で入力してください。";
        return;
      }

      if (
        command.type === "wait" &&
        command.delay <= 0
      ) {
        commandErrors[command.id] =
          "Waitの待機時間は1ms以上にしてください。";
      }
    });

    if (
      Object.keys(commandErrors).length > 0
    ) {
      nextErrors.commands = commandErrors;
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submittedItem: GachaItem = {
      id: item?.id ?? createId("gacha"),
      name: formValues.name.trim(),
      description:
        formValues.description.trim(),
      rarity: formValues.rarity,
      probability: Number(
        formValues.probability,
      ),
      isEnabled: formValues.isEnabled,
      commands: formValues.commands.map(
        (command) => ({
          ...command,
          value: command.value.trim(),
          delay: Number(command.delay),
        }),
      ),
      createdAt:
        item?.createdAt ??
        new Date().toISOString(),
    };

    onSubmit(submittedItem);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
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
            className="relative z-10 flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl"
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
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5 sm:px-8">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-violet-600">
                  <Sparkles size={13} />
                  Timeline Editor
                </div>

                <h2
                  id="gacha-form-title"
                  className="mt-1 text-xl font-black text-slate-950"
                >
                  {modalTitle}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  複数のアクションを時間差で実行できます。
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="閉じる"
                className="flex size-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={19} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="min-h-0 flex-1 overflow-y-auto"
            >
              <div className="space-y-7 px-6 py-6 sm:px-8">
                <section className="grid gap-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label
                      htmlFor="gacha-name"
                      className="text-sm font-black text-slate-800"
                    >
                      ガチャ名
                    </label>

                    <input
                      id="gacha-name"
                      value={formValues.name}
                      onChange={(event) =>
                        updateFormField(
                          "name",
                          event.target.value,
                        )
                      }
                      placeholder="例：ゾンビレイン"
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    />

                    {errors.name && (
                      <FieldError
                        message={errors.name}
                      />
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="gacha-description"
                      className="text-sm font-black text-slate-800"
                    >
                      説明
                    </label>

                    <textarea
                      id="gacha-description"
                      rows={3}
                      value={formValues.description}
                      onChange={(event) =>
                        updateFormField(
                          "description",
                          event.target.value,
                        )
                      }
                      className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    />

                    {errors.description && (
                      <FieldError
                        message={
                          errors.description
                        }
                      />
                    )}
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
                      value={formValues.rarity}
                      onChange={(event) =>
                        updateFormField(
                          "rarity",
                          event.target
                            .value as GachaRarity,
                        )
                      }
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                    >
                      {rarityOptions.map(
                        (option) => (
                          <option
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="gacha-probability"
                      className="text-sm font-black text-slate-800"
                    >
                      排出率
                    </label>

                    <input
                      id="gacha-probability"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={
                        formValues.probability
                      }
                      onChange={(event) =>
                        updateFormField(
                          "probability",
                          event.target.value,
                        )
                      }
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                    />

                    {errors.probability && (
                      <FieldError
                        message={
                          errors.probability
                        }
                      />
                    )}
                  </div>
                </section>

                <section>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h3 className="text-base font-black text-slate-900">
                        アクション・タイムライン
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        上から順番にキューへ登録されます。
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={addCommand}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-100 px-4 py-2.5 text-sm font-black text-violet-700 transition hover:bg-violet-200"
                    >
                      <Plus size={16} />
                      アクションを追加
                    </button>
                  </div>

                  {errors.commands?.form && (
                    <FieldError
                      message={
                        errors.commands.form
                      }
                    />
                  )}

                  <div className="mt-4 space-y-4">
                    {formValues.commands.map(
                      (command, index) => (
                        <div
                          key={command.id}
                          className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="flex size-10 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm">
                                {getActionIcon(
                                  command.type,
                                )}
                              </div>

                              <div>
                                <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                                  Action {index + 1}
                                </p>

                                <p className="text-sm font-black text-slate-800">
                                  {
                                    actionOptions.find(
                                      (option) =>
                                        option.value ===
                                        command.type,
                                    )?.label
                                  }
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-1">
                              <ActionIconButton
                                label="上へ移動"
                                disabled={index === 0}
                                onClick={() =>
                                  moveCommand(
                                    index,
                                    -1,
                                  )
                                }
                              >
                                <ArrowUp
                                  size={15}
                                />
                              </ActionIconButton>

                              <ActionIconButton
                                label="下へ移動"
                                disabled={
                                  index ===
                                  formValues.commands
                                    .length -
                                    1
                                }
                                onClick={() =>
                                  moveCommand(
                                    index,
                                    1,
                                  )
                                }
                              >
                                <ArrowDown
                                  size={15}
                                />
                              </ActionIconButton>

                              <ActionIconButton
                                label="削除"
                                onClick={() =>
                                  deleteCommand(
                                    command.id,
                                  )
                                }
                                danger
                              >
                                <Trash2
                                  size={15}
                                />
                              </ActionIconButton>
                            </div>
                          </div>

                          <div className="mt-4 grid gap-4 md:grid-cols-[180px_1fr_150px]">
                            <div>
                              <label className="text-xs font-black text-slate-600">
                                種類
                              </label>

                              <select
                                value={command.type}
                                onChange={(event) => {
                                  const type =
                                    event.target
                                      .value as GachaActionType;

                                  updateCommand(
                                    command.id,
                                    {
                                      type,
                                      value:
                                        type ===
                                        "wait"
                                          ? ""
                                          : command.value,
                                    },
                                  );
                                }}
                                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                              >
                                {actionOptions.map(
                                  (option) => (
                                    <option
                                      key={
                                        option.value
                                      }
                                      value={
                                        option.value
                                      }
                                    >
                                      {option.label}
                                    </option>
                                  ),
                                )}
                              </select>
                            </div>

                            <div>
                              <label className="text-xs font-black text-slate-600">
                                実行内容
                              </label>

                              <input
                                value={command.value}
                                disabled={
                                  command.type ===
                                  "wait"
                                }
                                onChange={(event) =>
                                  updateCommand(
                                    command.id,
                                    {
                                      value:
                                        event.target
                                          .value,
                                    },
                                  )
                                }
                                placeholder={getActionPlaceholder(
                                  command.type,
                                )}
                                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-mono text-sm outline-none transition disabled:bg-slate-100 disabled:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                              />
                            </div>

                            <div>
                              <label className="text-xs font-black text-slate-600">
                                遅延時間（ms）
                              </label>

                              <input
                                type="number"
                                min="0"
                                step="100"
                                value={command.delay}
                                onChange={(event) =>
                                  updateCommand(
                                    command.id,
                                    {
                                      delay:
                                        Number(
                                          event
                                            .target
                                            .value,
                                        ) || 0,
                                    },
                                  )
                                }
                                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                              />
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              updateCommand(
                                command.id,
                                {
                                  enabled:
                                    !command.enabled,
                                },
                              )
                            }
                            className={`mt-4 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-black transition ${
                              command.enabled
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-200 text-slate-500"
                            }`}
                          >
                            {command.enabled && (
                              <Check size={14} />
                            )}

                            {command.enabled
                              ? "このアクションは有効"
                              : "このアクションは無効"}
                          </button>

                          {errors.commands?.[
                            command.id
                          ] && (
                            <FieldError
                              message={
                                errors.commands[
                                  command.id
                                ]
                              }
                            />
                          )}
                        </div>
                      ),
                    )}
                  </div>
                </section>

                <section>
                  <button
                    type="button"
                    onClick={() =>
                      updateFormField(
                        "isEnabled",
                        !formValues.isEnabled,
                      )
                    }
                    className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 transition ${
                      formValues.isEnabled
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <div className="text-left">
                      <p className="text-sm font-black text-slate-800">
                        ガチャ全体の有効状態
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        無効にすると抽選対象から除外されます。
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-black ${
                        formValues.isEnabled
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-300 text-slate-700"
                      }`}
                    >
                      {formValues.isEnabled
                        ? "有効"
                        : "無効"}
                    </span>
                  </button>
                </section>
              </div>

              <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-slate-100 bg-white/95 px-6 py-5 backdrop-blur sm:flex-row sm:justify-end sm:px-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-50"
                >
                  キャンセル
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-500"
                >
                  <Save size={17} />

                  {isEditMode
                    ? "変更を保存"
                    : "ガチャを追加"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
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
      <AlertCircle size={13} />
      {message}
    </p>
  );
}

type ActionIconButtonProps = {
  label: string;
  disabled?: boolean;
  danger?: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

function ActionIconButton({
  label,
  disabled = false,
  danger = false,
  onClick,
  children,
}: ActionIconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`flex size-8 items-center justify-center rounded-lg transition disabled:cursor-not-allowed disabled:opacity-30 ${
        danger
          ? "text-rose-500 hover:bg-rose-100"
          : "text-slate-500 hover:bg-white hover:text-violet-700"
      }`}
    >
      {children}
    </button>
  );
}