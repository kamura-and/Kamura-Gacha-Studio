import type { PluginSettings } from "../../types/plugin";

type TikTokSettingsProps = {
  settings: PluginSettings;
  onChange: (settings: PluginSettings) => void;
};

export function TikTokSettings({
  settings,
  onChange,
}: TikTokSettingsProps) {
  const username =
    typeof settings.username === "string"
      ? settings.username
      : "";

  const autoConnect =
    typeof settings.autoConnect === "boolean"
      ? settings.autoConnect
      : false;

  const receiveGift =
    typeof settings.receiveGift === "boolean"
      ? settings.receiveGift
      : true;

  const receiveComment =
    typeof settings.receiveComment === "boolean"
      ? settings.receiveComment
      : true;

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
      <SettingSection
        title="TikTok LIVE接続"
        description="接続対象となるTikTokアカウントを設定します。"
      >
        <SettingField
          label="TikTokユーザー名"
          description="「@」を付けずに入力してください。"
        >
          <input
            type="text"
            value={username}
            placeholder="例: kaguragi_kamura"
            autoComplete="off"
            onChange={(event) =>
              updateSetting(
                "username",
                event.target.value,
              )
            }
            className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
          />
        </SettingField>

        <ToggleSetting
          label="起動時に自動接続"
          description="アプリ起動後にTikTok LIVEへの接続を自動で開始します。"
          checked={autoConnect}
          onChange={(checked) =>
            updateSetting(
              "autoConnect",
              checked,
            )
          }
        />
      </SettingSection>

      <SettingSection
        title="イベント受信"
        description="TikTok LIVEから受信するイベントを選択します。"
      >
        <ToggleSetting
          label="ギフトを受信"
          description="視聴者から送信されたギフトイベントを受信します。"
          checked={receiveGift}
          onChange={(checked) =>
            updateSetting(
              "receiveGift",
              checked,
            )
          }
        />

        <ToggleSetting
          label="コメントを受信"
          description="配信中に投稿されたコメントイベントを受信します。"
          checked={receiveComment}
          onChange={(checked) =>
            updateSetting(
              "receiveComment",
              checked,
            )
          }
        />
      </SettingSection>
    </div>
  );
}

type SettingSectionProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

function SettingSection({
  title,
  description,
  children,
}: SettingSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-5">
        <h3 className="text-sm font-black text-slate-900">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <div className="space-y-5">
        {children}
      </div>
    </section>
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