import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  Heart,
  ImagePlus,
  Save,
  Volume2,
  X,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
} from "motion/react";

import type {
  GachaRarity,
} from "@/features/gacha/types/gacha";

export type EffectSaveValues = {
  name: string;

  description: string;

  rarity: GachaRarity;

  imageDataUrl: string | null;

  /**
   * Sound System実装後に使用。
   */
  soundId: string | null;

  isEnabled: boolean;

  tags: string[];

  favorite: boolean;
};

type SaveEffectDialogProps = {
  open: boolean;

  initialValues:
    EffectSaveValues;

  onClose: () => void;

  onSave: (
    values: EffectSaveValues,
  ) => void;
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

async function resizeImage(
  file: File,
): Promise<string> {
  return new Promise(
    (resolve, reject) => {
      const reader =
        new FileReader();

      reader.onerror = () => {
        reject(
          new Error(
            "画像を読み込めませんでした。",
          ),
        );
      };

      reader.onload = () => {
        const image =
          new Image();

        image.onerror = () => {
          reject(
            new Error(
              "画像を読み込めませんでした。",
            ),
          );
        };

        image.onload = () => {
          const MAX_SIZE =
            1024;

          let width =
            image.width;

          let height =
            image.height;

          if (
            width > height &&
            width > MAX_SIZE
          ) {
            height =
              (height *
                MAX_SIZE) /
              width;

            width =
              MAX_SIZE;
          }

          if (
            height >= width &&
            height > MAX_SIZE
          ) {
            width =
              (width *
                MAX_SIZE) /
              height;

            height =
              MAX_SIZE;
          }

          const canvas =
            document.createElement(
              "canvas",
            );

          canvas.width =
            Math.round(width);

          canvas.height =
            Math.round(height);

          const context =
            canvas.getContext(
              "2d",
            );

          if (!context) {
            reject(
              new Error(
                "画像を変換できませんでした。",
              ),
            );

            return;
          }

          context.drawImage(
            image,
            0,
            0,
            canvas.width,
            canvas.height,
          );

          resolve(
            canvas.toDataURL(
              "image/jpeg",
              0.85,
            ),
          );
        };

        image.src =
          reader.result as string;
      };

      reader.readAsDataURL(
        file,
      );
    },
  );
}

export function SaveEffectDialog({
  open,
  initialValues,
  onClose,
  onSave,
}: SaveEffectDialogProps) {
  const fileInputRef =
    useRef<HTMLInputElement>(
      null,
    );

  const [
    name,
    setName,
  ] = useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    rarity,
    setRarity,
  ] =
    useState<GachaRarity>(
      "common",
    );

  const [
    imageDataUrl,
    setImageDataUrl,
  ] =
    useState<
      string | null
    >(null);

  const [
    soundId,
    setSoundId,
  ] =
    useState<
      string | null
    >(null);

  const [
    isEnabled,
    setIsEnabled,
  ] =
    useState(true);

  const [
    tagsText,
    setTagsText,
  ] = useState("");

  const [
    favorite,
    setFavorite,
  ] =
    useState(false);

  const [
    nameError,
    setNameError,
  ] =
    useState<
      string | null
    >(null);

  const [
    imageError,
    setImageError,
  ] =
    useState<
      string | null
    >(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setName(
      initialValues.name,
    );

    setDescription(
      initialValues.description,
    );

    setRarity(
      initialValues.rarity,
    );

    setImageDataUrl(
      initialValues.imageDataUrl,
    );

    setSoundId(
      initialValues.soundId,
    );

    setIsEnabled(
      initialValues.isEnabled,
    );

    setTagsText(
      initialValues.tags.join(
        ", ",
      ),
    );

    setFavorite(
      initialValues.favorite,
    );

    setNameError(null);
    setImageError(null);
  }, [
    open,
    initialValues,
  ]);

  const handleImageChange =
    async (
      event:
        ChangeEvent<HTMLInputElement>,
    ) => {
      const file =
        event.target
          .files?.[0];

      if (!file) {
        return;
      }

      if (
        !file.type.startsWith(
          "image/",
        )
      ) {
        setImageError(
          "画像ファイルを選択してください。",
        );

        return;
      }

      try {
        const resizedImage =
          await resizeImage(
            file,
          );

        setImageDataUrl(
          resizedImage,
        );

        setImageError(null);
      } catch (error) {
        setImageError(
          error instanceof Error
            ? error.message
            : "画像を読み込めませんでした。",
        );
      }
    };

  const handleRemoveImage =
    () => {
      setImageDataUrl(null);
      setImageError(null);

      if (
        fileInputRef.current
      ) {
        fileInputRef.current.value =
          "";
      }
    };

  const handleSubmit = (
    event:
      FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const trimmedName =
      name.trim();

    if (!trimmedName) {
      setNameError(
        "景品名を入力してください。",
      );

      return;
    }

    const tags =
      Array.from(
        new Set(
          tagsText
            .split(/[,、]/)
            .map((tag) =>
              tag.trim(),
            )
            .filter(Boolean),
        ),
      );

    onSave({
      name:
        trimmedName,

      description:
        description.trim(),

      rarity,

      imageDataUrl,

      soundId,

      isEnabled,

      tags,

      favorite,
    });
  };

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.button
            type="button"
            aria-label="景品設定を閉じる"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={
              onClose
            }
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="save-effect-title"
            initial={{
              opacity: 0,
              scale: 0.96,
              y: 16,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.96,
              y: 16,
            }}
            transition={{
              duration: 0.18,
            }}
            className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
          >
            <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-violet-600">
                  Prize Settings
                </p>

                <h2
                  id="save-effect-title"
                  className="mt-1 text-xl font-black text-slate-950"
                >
                  景品設定
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  実行内容とガチャ景品の情報をまとめて保存します。
                </p>
              </div>

              <button
                type="button"
                aria-label="閉じる"
                onClick={
                  onClose
                }
                className="flex size-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X
                  size={18}
                />
              </button>
            </header>

            <form
              onSubmit={
                handleSubmit
              }
              className="min-h-0 flex-1 overflow-y-auto"
            >
              <div className="space-y-6 p-6">
                <div>
                  <label
                    htmlFor="effect-name"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    景品名

                    <span className="ml-1 text-rose-500">
                      *
                    </span>
                  </label>

                  <input
                    id="effect-name"
                    type="text"
                    value={
                      name
                    }
                    autoFocus
                    onChange={(
                      event,
                    ) => {
                      setName(
                        event.target
                          .value,
                      );

                      setNameError(
                        null,
                      );
                    }}
                    placeholder="例：大量TNT"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                  />

                  {nameError ? (
                    <p className="mt-2 text-xs font-semibold text-rose-600">
                      {
                        nameError
                      }
                    </p>
                  ) : null}

                  <p className="mt-2 text-xs text-slate-400">
                    エフェクト名とガチャ景品名を共通化します。
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="effect-description"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    ガチャで表示する説明
                  </label>

                  <textarea
                    id="effect-description"
                    value={
                      description
                    }
                    onChange={(
                      event,
                    ) =>
                      setDescription(
                        event.target
                          .value,
                      )
                    }
                    placeholder="例：周囲に大量のTNTを出現させます。"
                    rows={3}
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="effect-rarity"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    レアリティ
                  </label>

                  <select
                    id="effect-rarity"
                    value={
                      rarity
                    }
                    onChange={(
                      event,
                    ) =>
                      setRarity(
                        event.target
                          .value as GachaRarity,
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                  >
                    {rarityOptions.map(
                      (
                        option,
                      ) => (
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
                </div>

                <div>
                  <p className="mb-2 text-sm font-bold text-slate-700">
                    景品画像
                  </p>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    {imageDataUrl ? (
                      <img
                        src={
                          imageDataUrl
                        }
                        alt="景品プレビュー"
                        className="h-48 w-full rounded-xl bg-white object-contain"
                      />
                    ) : (
                      <div className="flex h-48 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white text-sm font-bold text-slate-400">
                        画像はまだありません
                      </div>
                    )}

                    <input
                      ref={
                        fileInputRef
                      }
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={
                        handleImageChange
                      }
                    />

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          fileInputRef.current?.click()
                        }
                        className="inline-flex items-center gap-2 rounded-xl bg-violet-100 px-4 py-2.5 text-sm font-bold text-violet-700 transition hover:bg-violet-200"
                      >
                        <ImagePlus
                          size={
                            16
                          }
                        />

                        画像を選択
                      </button>

                      {imageDataUrl ? (
                        <button
                          type="button"
                          onClick={
                            handleRemoveImage
                          }
                          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-100"
                        >
                          削除
                        </button>
                      ) : null}
                    </div>

                    {imageError ? (
                      <p className="mt-2 text-xs font-semibold text-rose-600">
                        {
                          imageError
                        }
                      </p>
                    ) : null}

                    <p className="mt-3 text-xs text-slate-400">
                      PNG / JPG / WEBP
                    </p>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-bold text-slate-700">
                    景品SE
                  </p>

                  <div className="flex items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-white text-slate-400">
                      <Volume2
                        size={
                          19
                        }
                      />
                    </span>

                    <div>
                      <p className="text-sm font-bold text-slate-500">
                        SE未設定
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        Sound System実装後にここから設定できるようにします。
                      </p>
                    </div>
                  </div>

                  {soundId ? (
                    <button
                      type="button"
                      onClick={() =>
                        setSoundId(
                          null,
                        )
                      }
                      className="mt-2 text-xs font-bold text-rose-500"
                    >
                      SE設定を解除
                    </button>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="effect-tags"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    タグ
                  </label>

                  <input
                    id="effect-tags"
                    type="text"
                    value={
                      tagsText
                    }
                    onChange={(
                      event,
                    ) =>
                      setTagsText(
                        event.target
                          .value,
                      )
                    }
                    placeholder="Minecraft, 妨害, 爆発"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                  />

                  <p className="mt-2 text-xs text-slate-400">
                    カンマ区切りで複数入力できます。ガチャ箱での景品検索にも使用します。
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setIsEnabled(
                      (
                        current,
                      ) =>
                        !current,
                    )
                  }
                  className={[
                    "flex w-full items-center justify-between rounded-xl border px-4 py-4 text-left transition",
                    isEnabled
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-slate-200 bg-slate-50",
                  ].join(
                    " ",
                  )}
                >
                  <div>
                    <p className="text-sm font-bold text-slate-700">
                      景品の有効状態
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      無効にするとガチャ箱の抽選対象から除外されます。
                    </p>
                  </div>

                  <span
                    className={[
                      "rounded-full px-3 py-1.5 text-xs font-black",
                      isEnabled
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-300 text-slate-600",
                    ].join(
                      " ",
                    )}
                  >
                    {isEnabled
                      ? "有効"
                      : "無効"}
                  </span>
                </button>

                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Heart
                      size={18}
                      className={
                        favorite
                          ? "fill-rose-500 text-rose-500"
                          : "text-slate-400"
                      }
                    />

                    <div>
                      <p className="text-sm font-bold text-slate-700">
                        お気に入り
                      </p>

                      <p className="text-xs text-slate-400">
                        一覧で見つけやすくします。
                      </p>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    checked={
                      favorite
                    }
                    onChange={(
                      event,
                    ) =>
                      setFavorite(
                        event.target
                          .checked,
                      )
                    }
                    className="size-4 accent-violet-600"
                  />
                </label>
              </div>

              <footer className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-200 bg-white/95 px-6 py-5 backdrop-blur">
                <button
                  type="button"
                  onClick={
                    onClose
                  }
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  キャンセル
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-violet-500"
                >
                  <Save
                    size={
                      16
                    }
                  />

                  保存
                </button>
              </footer>
            </form>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}