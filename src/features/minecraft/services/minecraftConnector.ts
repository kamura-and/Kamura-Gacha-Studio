import {
  invoke,
} from "@tauri-apps/api/core";

export type MinecraftConnectionSettings = {
  host: string;
  port: number;
  password: string;
};

export type MinecraftCommandResult = {
  command: string;
  response: string;
};

export type MinecraftConnectionTestResult = {
  address: string;
  response: string;
};

let activeConnectionSettings:
  MinecraftConnectionSettings | null =
    null;

export function setActiveMinecraftConnection(
  settings: MinecraftConnectionSettings,
): void {
  activeConnectionSettings =
    normalizeConnectionSettings(
      settings,
    );
}

export function clearActiveMinecraftConnection():
  void {
  activeConnectionSettings = null;
}

export function getActiveMinecraftConnection():
  MinecraftConnectionSettings | null {
  if (!activeConnectionSettings) {
    return null;
  }

  return {
    ...activeConnectionSettings,
  };
}

export async function sendMinecraftCommand(
  command: string,
  settings?: MinecraftConnectionSettings,
): Promise<MinecraftCommandResult> {
  const normalizedCommand =
    command.trim();

  if (!normalizedCommand) {
    throw new Error(
      "Minecraftコマンドが空です。",
    );
  }

  const connectionSettings =
    settings
      ? normalizeConnectionSettings(
          settings,
        )
      : requireActiveConnectionSettings();

  try {
    return await invoke<MinecraftCommandResult>(
      "send_minecraft_command",
      {
        command:
          normalizedCommand,
        host:
          connectionSettings.host,
        port:
          connectionSettings.port,
        password:
          connectionSettings.password,
      },
    );
  } catch (error) {
    throw new Error(
      [
        "Minecraftへのコマンド送信に失敗しました:",
        getErrorMessage(error),
      ].join(" "),
    );
  }
}

export async function testMinecraftConnection(
  settings: MinecraftConnectionSettings,
): Promise<MinecraftConnectionTestResult> {
  const connectionSettings =
    normalizeConnectionSettings(
      settings,
    );

  try {
    return await invoke<MinecraftConnectionTestResult>(
      "test_minecraft_connection",
      {
        host:
          connectionSettings.host,
        port:
          connectionSettings.port,
        password:
          connectionSettings.password,
      },
    );
  } catch (error) {
    throw new Error(
      [
        "Minecraftとの接続テストに失敗しました:",
        getErrorMessage(error),
      ].join(" "),
    );
  }
}

function requireActiveConnectionSettings():
  MinecraftConnectionSettings {
  if (!activeConnectionSettings) {
    throw new Error(
      [
        "Minecraftの接続設定が有効になっていません。",
        "Plugin管理画面からMinecraftへ接続してください。",
      ].join(" "),
    );
  }

  return {
    ...activeConnectionSettings,
  };
}

function normalizeConnectionSettings(
  settings: MinecraftConnectionSettings,
): MinecraftConnectionSettings {
  const host =
    settings.host.trim();

  if (!host) {
    throw new Error(
      "Minecraftのホストが設定されていません。",
    );
  }

  if (
    !Number.isInteger(
      settings.port,
    ) ||
    settings.port < 1 ||
    settings.port > 65535
  ) {
    throw new Error(
      "Minecraftのポート番号が正しくありません。",
    );
  }

  if (
    typeof settings.password !==
      "string" ||
    settings.password.trim().length === 0
  ) {
    throw new Error(
      "MinecraftのRCONパスワードが設定されていません。",
    );
  }

  return {
    host,
    port: settings.port,
    password:
      settings.password,
  };
}

function getErrorMessage(
  error: unknown,
): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === "string"
  ) {
    return error;
  }

  try {
    return JSON.stringify(
      error,
    );
  } catch {
    return String(error);
  }
}