import type { PluginSettings } from "../../types/plugin";

type OverlaySettingsProps = {
  settings: PluginSettings;
  onChange: (settings: PluginSettings) => void;
};

export function OverlaySettings({
  settings,
  onChange,
}: OverlaySettingsProps) {
  const width =
    typeof settings.width === "number"
      ? settings.width
      : 1920;

  const height =
    typeof settings.height === "number"
      ? settings.height
      : 1080;

  const url =
    typeof settings.url === "string"
      ? settings.url
      : "http://localhost:5173/overlay";

  const autoShow =
    typeof settings.autoShow === "boolean"
      ? settings.autoShow
      : false;

  const updateSetting = (
    key: string,
    value: string | number | boolean,
  ) => {
    onChange({
      ...settings,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-5">
          <h3 className="text-sm font-black text-slate-900">
            オーバーレイサイズ
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            OBSのキャンバスサイズに合わせて設定してください。
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <SettingField
            label="横幅"
            description="ピクセル単位"
          >
            <input
              type="number"
              value={width}
              min={1}
              step={1}
              onChange={(event) => {
                const nextWidth =
                  event.target.valueAsNumber;

                updateSetting(
                  "width",
                  Number.isNaN(nextWidth)
                    ? 0
                    : nextWidth,
                );
              }}
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            />
          </SettingField>

          <SettingField
            label="高さ"
            description="ピクセル単位"
          >
            <input
              type="number"
              value={height}
              min={1}
              step={1}
              onChange={(event) => {
                const nextHeight =
                  event.target.valueAsNumber;

                updateSetting(
                  "height",
                  Number.isNaN(nextHeight)
                    ? 0
                    : nextHeight,
                );
              }}
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            />
          </SettingField>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-5">
          <h3 className="text-sm font-black text-slate-900">
            Browser Source
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            OBSのブラウザソースで使用するURLを設定します。
          </p>
        </div>

        <div className="space-y-5">
          <SettingField
            label="Browser Source URL"
            description="OBSのブラウザソースに登録するURLです。"
          >
            <input
              type="url"
              value={url}
              placeholder="http://localhost:5173/overlay"
              autoComplete="off"
              onChange={(event) =>
                updateSetting(
                  "url",
                  event.target.value,
                )
              }
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            />
          </SettingField>

          <ToggleSetting
            label="起動時に自動表示"
            description="アプリ起動後にオーバーレイ画面を自動で表示します。"
            checked={autoShow}
            onChange={(checked) =>
              updateSetting(
                "autoShow",
                checked,
              )
            }
          />
        </div>
      </section>
    </div>
  );
}

type SettingFieldProps = {
  label: string;
  description?: string;
  children: React.ReactNode;
};

function SettingField({
  label,
  description,
  children,
}: SettingFieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-800">
        {label}
      </span>

      {description && (
        <span className="mt-1 block text-xs leading-5 text-slate-500">
          {description}
        </span>
      )}

      <span className="mt-3 block">
        {children}
      </span>
    </label>
  );
}

type ToggleSettingProps = {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

function ToggleSetting({
  label,
  description,
  checked,
  onChange,
}: ToggleSettingProps) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4">
      <span>
        <span className="block text-sm font-bold text-slate-800">
          {label}
        </span>

        <span className="mt-1 block text-xs leading-5 text-slate-500">
          {description}
        </span>
      </span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(event.target.checked)
        }
        className="mt-1 size-5 shrink-0 cursor-pointer accent-violet-600"
      />
    </label>
  );
}