import { invoke } from "@tauri-apps/api/core";

export type MinecraftCommandResult = {
  command: string;
  response: string;
};

export type MinecraftConnectionTestResult = {
  address: string;
  response: string;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

export async function sendMinecraftCommand(
  command: string,
): Promise<MinecraftCommandResult> {
  const normalizedCommand = command.trim();

  if (!normalizedCommand) {
    throw new Error("Minecraftコマンドが空です。");
  }

  try {
    return await invoke<MinecraftCommandResult>(
      "send_minecraft_command",
      {
        command: normalizedCommand,
      },
    );
  } catch (error) {
    throw new Error(
      `Minecraftへのコマンド送信に失敗しました: ${getErrorMessage(error)}`,
    );
  }
}

export async function testMinecraftConnection():
  Promise<MinecraftConnectionTestResult> {
  try {
    return await invoke<MinecraftConnectionTestResult>(
      "test_minecraft_connection",
    );
  } catch (error) {
    throw new Error(
      `Minecraftとの接続テストに失敗しました: ${getErrorMessage(error)}`,
    );
  }
}