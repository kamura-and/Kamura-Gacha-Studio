import {
  useEffect,
  useState,
} from "react";

import {
  AlertCircle,
  Check,
  Gamepad2,
  Radio,
  Settings,
  Wifi,
  X,
} from "lucide-react";

import { MinecraftSettings } from "./settings/MinecraftSettings";
import { OverlaySettings } from "./settings/OverlaySettings";
import { TikTokSettings } from "./settings/TikTokSettings";

import type {
  PluginDomainDefinition,
  PluginSettings,
  PluginType,
} from "../types/plugin";

type PluginSettingsDialogProps = {
  open: boolean;

  definition:
    PluginDomainDefinition;

  initialSettings:
    PluginSettings;

  onClose: () => void;

  onSave: (
    settings: PluginSettings,
  ) => void;
};

type ValidationResult = {
  valid: boolean;
  message?: string;
};

export function PluginSettingsDialog({
  open,
  definition,
  initialSettings,
  onClose,
  onSave,
}: PluginSettingsDialogProps) {
  const [draftSettings, setDraftSettings] =
    useState<PluginSettings>(
      initialSettings,
    );

  const [validationMessage, setValidationMessage] =
    useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setDraftSettings({
      ...initialSettings,
    });

    setValidationMessage(null);
  }, [
    initialSettings,
    open,
  ]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    onClose,
    open,
  ]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  const Icon = getPluginIcon(
    definition.type,
  );

  const handleSettingsChange = (
    settings: PluginSettings,
  ) => {
    setDraftSettings(settings);
    setValidationMessage(null);
  };

  const handleCancel = () => {
    setDraftSettings({
      ...initialSettings,
    });

    setValidationMessage(null);
    onClose();
  };

  const handleSave = () => {
    const validation =
      validatePluginSettings(
        definition.type,
        draftSettings,
      );

    if (!validation.valid) {
      setValidationMessage(
        validation.message ??
          "設定内容を確認してください。",
      );

      return;
    }

    onSave({
      ...draftSettings,
    });

    setValidationMessage(null);
    onClose();
  };

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          handleCancel();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="plugin-settings-dialog-title"
        aria-describedby="plugin-settings-dialog-description"
        className="flex max-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20"
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
              <Icon
                aria-hidden="true"
                size={21}
              />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2
                  id="plugin-settings-dialog-title"
                  className="text-lg font-black tracking-tight text-slate-950"
                >
                  {definition.name}の設定
                </h2>

                <span className="rounded-lg bg-violet-50 px-2 py-1 text-[10px] font-black text-violet-700">
                  v{definition.version}
                </span>
              </div>

              <p
                id="plugin-settings-dialog-description"
                className="mt-1.5 text-sm leading-6 text-slate-500"
              >
                Pluginの接続先や動作に関する設定を編集します。
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="設定画面を閉じる"
            onClick={handleCancel}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-800"
          >
            <X
              aria-hidden="true"
              size={18}
            />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-violet-100 bg-violet-50/70 p-4">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-violet-700 shadow-sm">
              <Settings
                aria-hidden="true"
                size={17}
              />
            </div>

            <div>
              <p className="text-sm font-black text-slate-800">
                Plugin設定
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                保存するまでは変更内容は反映されません。接続中のPluginでは、設定変更後に再接続が必要になる場合があります。
              </p>
            </div>
          </div>

          {validationMessage && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4"
            >
              <AlertCircle
                aria-hidden="true"
                size={18}
                className="mt-0.5 shrink-0 text-rose-600"
              />

              <p className="text-sm font-bold leading-6 text-rose-700">
                {validationMessage}
              </p>
            </div>
          )}

          <PluginSettingsContent
            type={definition.type}
            settings={draftSettings}
            onChange={
              handleSettingsChange
            }
          />
        </div>

        <footer className="flex shrink-0 flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/80 px-6 py-4 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-600 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
          >
            キャンセル
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-black text-white shadow-sm shadow-violet-300 transition hover:bg-violet-700"
          >
            <Check
              aria-hidden="true"
              size={17}
            />

            設定を保存
          </button>
        </footer>
      </section>
    </div>
  );
}

type PluginSettingsContentProps = {
  type: PluginType;

  settings: PluginSettings;

  onChange: (
    settings: PluginSettings,
  ) => void;
};

function PluginSettingsContent({
  type,
  settings,
  onChange,
}: PluginSettingsContentProps) {
  switch (type) {
    case "tiktok":
      return (
        <TikTokSettings
          settings={settings}
          onChange={onChange}
        />
      );

    case "minecraft":
      return (
        <MinecraftSettings
          settings={settings}
          onChange={onChange}
        />
      );

    case "overlay":
      return (
        <OverlaySettings
          settings={settings}
          onChange={onChange}
        />
      );

    default:
      return (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
          <p className="text-sm font-black text-slate-700">
            設定画面がありません
          </p>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            このPluginに対応する設定UIはまだ実装されていません。
          </p>
        </div>
      );
  }
}

function getPluginIcon(
  type: PluginType,
) {
  switch (type) {
    case "tiktok":
      return Radio;

    case "minecraft":
      return Gamepad2;

    case "overlay":
      return Wifi;

    default:
      return Settings;
  }
}

function validatePluginSettings(
  type: PluginType,
  settings: PluginSettings,
): ValidationResult {
  switch (type) {
    case "tiktok":
      return validateTikTokSettings(
        settings,
      );

    case "minecraft":
      return validateMinecraftSettings(
        settings,
      );

    case "overlay":
      return validateOverlaySettings(
        settings,
      );

    default:
      return {
        valid: true,
      };
  }
}

function validateTikTokSettings(
  settings: PluginSettings,
): ValidationResult {
  const username =
    settings.username;

  if (
    typeof username !== "string" ||
    username.trim().length === 0
  ) {
    return {
      valid: false,
      message:
        "TikTokユーザー名を入力してください。",
    };
  }

  if (
    username.trim().startsWith("@")
  ) {
    return {
      valid: false,
      message:
        "TikTokユーザー名は「@」を付けずに入力してください。",
    };
  }

  return {
    valid: true,
  };
}

function validateMinecraftSettings(
  settings: PluginSettings,
): ValidationResult {
  const host = settings.host;
  const port = settings.port;

  if (
    typeof host !== "string" ||
    host.trim().length === 0
  ) {
    return {
      valid: false,
      message:
        "Minecraftのホストを入力してください。",
    };
  }

  if (
    typeof port !== "number" ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535
  ) {
    return {
      valid: false,
      message:
        "ポート番号は1〜65535の整数で入力してください。",
    };
  }

  return {
    valid: true,
  };
}

function validateOverlaySettings(
  settings: PluginSettings,
): ValidationResult {
  const width = settings.width;
  const height = settings.height;
  const url = settings.url;

  if (
    typeof width !== "number" ||
    !Number.isInteger(width) ||
    width < 1
  ) {
    return {
      valid: false,
      message:
        "オーバーレイの横幅は1以上の整数で入力してください。",
    };
  }

  if (
    typeof height !== "number" ||
    !Number.isInteger(height) ||
    height < 1
  ) {
    return {
      valid: false,
      message:
        "オーバーレイの高さは1以上の整数で入力してください。",
    };
  }

  if (
    typeof url !== "string" ||
    url.trim().length === 0
  ) {
    return {
      valid: false,
      message:
        "Browser Source URLを入力してください。",
    };
  }

  return {
    valid: true,
  };
}