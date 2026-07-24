import {
  useEffect,
  useState,
} from "react";

import {
  Heart,
  Save,
  X,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
} from "motion/react";

export type EffectSaveValues = {
  name: string;
  description: string;
  tags: string[];
  favorite: boolean;
};

type SaveEffectDialogProps = {
  open: boolean;

  initialValues: EffectSaveValues;

  onClose: () => void;

  onSave: (
    values: EffectSaveValues,
  ) => void;
};

export function SaveEffectDialog({
  open,
  initialValues,
  onClose,
  onSave,
}: SaveEffectDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");
  const [tagsText, setTagsText] =
    useState("");
  const [favorite, setFavorite] =
    useState(false);

  const [nameError, setNameError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setName(initialValues.name);
    setDescription(
      initialValues.description,
    );
    setTagsText(
      initialValues.tags.join(", "),
    );
    setFavorite(initialValues.favorite);
    setNameError(null);
  }, [open, initialValues]);

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setNameError(
        "エフェクト名を入力してください。",
      );
      return;
    }

    const tags = Array.from(
      new Set(
        tagsText
          .split(/[,、]/)
          .map((tag) => tag.trim())
          .filter(Boolean),
      ),
    );

    onSave({
      name: trimmedName,
      description: description.trim(),
      tags,
      favorite,
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.button
            type="button"
            aria-label="保存画面を閉じる"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2
                  id="save-effect-title"
                  className="text-lg font-black text-slate-950"
                >
                  エフェクトを保存
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  エフェクトの基本情報を入力します。
                </p>
              </div>

              <button
                type="button"
                aria-label="閉じる"
                onClick={onClose}
                className="flex size-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >
              <div>
                <label
                  htmlFor="effect-name"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  エフェクト名
                  <span className="ml-1 text-rose-500">
                    *
                  </span>
                </label>

                <input
                  id="effect-name"
                  type="text"
                  value={name}
                  autoFocus
                  onChange={(event) => {
                    setName(event.target.value);
                    setNameError(null);
                  }}
                  placeholder="例：大量TNT"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                />

                {nameError && (
                  <p className="mt-2 text-xs font-semibold text-rose-600">
                    {nameError}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="effect-description"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  説明
                </label>

                <textarea
                  id="effect-description"
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value,
                    )
                  }
                  placeholder="エフェクトの内容や用途を入力"
                  rows={4}
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                />
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
                  value={tagsText}
                  onChange={(event) =>
                    setTagsText(
                      event.target.value,
                    )
                  }
                  placeholder="Minecraft, 妨害, 高額ギフト"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                />

                <p className="mt-2 text-xs text-slate-400">
                  カンマ区切りで複数入力できます。
                </p>
              </div>

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
                      ホームや一覧で見つけやすくします。
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={favorite}
                  onChange={(event) =>
                    setFavorite(
                      event.target.checked,
                    )
                  }
                  className="size-4 accent-violet-600"
                />
              </label>

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  キャンセル
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-violet-500"
                >
                  <Save size={16} />
                  保存
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}