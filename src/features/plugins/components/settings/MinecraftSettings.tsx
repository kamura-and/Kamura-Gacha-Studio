import type { PluginSettings } from "../../types/plugin";

type MinecraftSettingsProps = {
  settings: PluginSettings;
  onChange: (settings: PluginSettings) => void;
};

export function MinecraftSettings({
  settings,
  onChange,
}: MinecraftSettingsProps) {
  const host =
    typeof settings.host === "string"
      ? settings.host
      : "127.0.0.1";

  const port =
    typeof settings.port === "number"
      ? settings.port
      : 19132;

  const password =
    typeof settings.password === "string"
      ? settings.password
      : "";

  const autoConnect =
    typeof settings.autoConnect === "boolean"
      ? settings.autoConnect
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
            Minecraftサーバー接続
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Bedrock BoxまたはMinecraftサーバーの接続情報を設定します。
          </p>
        </div>

        <div className="space-y-5">
          <SettingField
            label="ホスト"
            description="ローカル接続の場合は127.0.0.1を使用します。"
          >
            <input
              type="text"
              value={host}
              placeholder="127.0.0.1"
              autoComplete="off"
              onChange={(event) =>
                updateSetting(
                  "host",
                  event.target.value,
                )
              }
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            />
          </SettingField>

          <SettingField
            label="ポート"
            description="1〜65535の範囲で入力してください。"
          >
            <input
              type="number"
              value={port}
              min={1}
              max={65535}
              step={1}
              onChange={(event) => {
                const nextPort =
                  event.target.valueAsNumber;

                updateSetting(
                  "port",
                  Number.isNaN(nextPort)
                    ? 0
                    : nextPort,
                );
              }}
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            />
          </SettingField>

          <SettingField
            label="パスワード"
            description="接続先で認証が不要な場合は空欄にしてください。"
          >
            <input
              type="password"
              value={password}
              placeholder="パスワードを入力"
              autoComplete="new-password"
              onChange={(event) =>
                updateSetting(
                  "password",
                  event.target.value,
                )
              }
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            />
          </SettingField>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-5">
          <h3 className="text-sm font-black text-slate-900">
            接続動作
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Minecraft Pluginの起動時動作を設定します。
          </p>
        </div>

        <ToggleSetting
          label="起動時に自動接続"
          description="アプリ起動後にMinecraftサーバーへの接続を自動で開始します。"
          checked={autoConnect}
          onChange={(checked) =>
            updateSetting(
              "autoConnect",
              checked,
            )
          }
        />
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