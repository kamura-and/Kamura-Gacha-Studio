import type {
  GeneratedActionCommand,
} from "@/core/actions";

import { sendMinecraftCommand } from "@/features/minecraft/services/minecraftConnector";

export type ActionExecutionContext = {
  gachaItemId: string;
  gachaItemName: string;
  queueItemId: string;
};

export type ActionExecutor = (
  command: GeneratedActionCommand,
  context: ActionExecutionContext,
) => Promise<void>;

/**
 * Minecraftコマンドを実行する。
 */
const executeMinecraftCommand: ActionExecutor = async (
  command,
  context,
) => {
  const minecraftCommand = command.value.trim();

  if (!minecraftCommand) {
    throw new Error(
      "Minecraftコマンドが空です。",
    );
  }

  console.info(
    "[Minecraft Executor] SEND",
    {
      command: minecraftCommand,
      context,
    },
  );

  const result = await sendMinecraftCommand(
    minecraftCommand,
  );

  console.info(
    "[Minecraft Executor] RESPONSE",
    {
      command: result.command,
      response:
        result.response ||
        "レスポンスなし",
      context,
    },
  );
};

/**
 * オーバーレイ表示イベントを発行する。
 */
const executeOverlayAction: ActionExecutor = async (
  command,
  context,
) => {
  const overlayValue = command.value.trim();

  if (!overlayValue) {
    throw new Error(
      "オーバーレイ内容が空です。",
    );
  }

  window.dispatchEvent(
    new CustomEvent("kamura:overlay", {
      detail: {
        value: overlayValue,
        context,
      },
    }),
  );

  console.info("[Overlay Executor]", {
    value: overlayValue,
    context,
  });
};

/**
 * サウンド再生イベントを発行する。
 */
const executeSoundAction: ActionExecutor = async (
  command,
  context,
) => {
  const soundValue = command.value.trim();

  if (!soundValue) {
    throw new Error(
      "サウンド指定が空です。",
    );
  }

  window.dispatchEvent(
    new CustomEvent("kamura:sound", {
      detail: {
        value: soundValue,
        context,
      },
    }),
  );

  console.info("[Sound Executor]", {
    value: soundValue,
    context,
  });
};

/**
 * Discord出力イベントを発行する。
 *
 * 実際のDiscord連携処理は、
 * kamura:discordイベントの受信側で実装する。
 */
const executeDiscordAction: ActionExecutor = async (
  command,
  context,
) => {
  const discordValue = command.value.trim();

  if (!discordValue) {
    throw new Error(
      "Discordへ送信する内容が空です。",
    );
  }

  window.dispatchEvent(
    new CustomEvent("kamura:discord", {
      detail: {
        value: discordValue,
        context,
      },
    }),
  );

  console.info("[Discord Executor]", {
    value: discordValue,
    context,
  });
};

/**
 * OBS操作イベントを発行する。
 *
 * 実際のOBS連携処理は、
 * kamura:obsイベントの受信側で実装する。
 */
const executeObsAction: ActionExecutor = async (
  command,
  context,
) => {
  const obsValue = command.value.trim();

  if (!obsValue) {
    throw new Error(
      "OBS操作内容が空です。",
    );
  }

  window.dispatchEvent(
    new CustomEvent("kamura:obs", {
      detail: {
        value: obsValue,
        context,
      },
    }),
  );

  console.info("[OBS Executor]", {
    value: obsValue,
    context,
  });
};

/**
 * Waitコマンド本体の処理。
 *
 * 実際の待機はcommandQueueEngine側で
 * command.delayを使って処理済みのため、
 * ここでは追加のsleepを行わない。
 */
const executeWaitAction: ActionExecutor = async (
  command,
  context,
) => {
  const milliseconds = Math.max(
    0,
    command.delay ?? 0,
  );

  console.info("[Wait Executor]", {
    milliseconds,
    context,
  });
};

/**
 * 出力先ごとのExecutor一覧。
 */
const actionExecutors: Record<
  GeneratedActionCommand["type"],
  ActionExecutor
> = {
  minecraft: executeMinecraftCommand,
  overlay: executeOverlayAction,
  sound: executeSoundAction,
  discord: executeDiscordAction,
  obs: executeObsAction,
  wait: executeWaitAction,
};

/**
 * GeneratedActionCommandを適切なExecutorへ渡して実行する。
 *
 * 関数名は既存コードとの互換性を保つため、
 * executeGachaCommandのまま使用する。
 */
export async function executeGachaCommand(
  command: GeneratedActionCommand,
  context: ActionExecutionContext,
): Promise<void> {
  if (command.enabled === false) {
    console.log(
      `[Queue] SKIP | ${command.type} | disabled`,
    );

    return;
  }

  const delay = command.delay ?? 0;

  console.log(
    `[Queue] START | ${command.type} | value="${command.value}" | delay=${delay}ms`,
  );

  const startedAt = performance.now();

  try {
    const executor =
      actionExecutors[command.type];

    await executor(command, context);

    const elapsedTime = Math.round(
      performance.now() - startedAt,
    );

    console.log(
      `[Queue] DONE  | ${command.type} | ${elapsedTime}ms`,
    );
  } catch (error) {
    console.error(
      `[Queue] ERROR | ${command.type}`,
      error,
    );

    throw error;
  }
}