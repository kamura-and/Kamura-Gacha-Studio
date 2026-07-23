import type { GachaCommand } from "@/features/gacha/types/gacha";
import { sendMinecraftCommand } from "@/features/minecraft/services/minecraftConnector";

import { sleep } from "./sleep";

export type ActionExecutionContext = {
  gachaItemId: string;
  gachaItemName: string;
  queueItemId: string;
};

export type ActionExecutor = (
  command: GachaCommand,
  context: ActionExecutionContext,
) => Promise<void>;

function parseWaitMilliseconds(value: string): number {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    throw new Error(
      `待機時間が数値ではありません: "${value}"`,
    );
  }

  if (parsedValue < 0) {
    throw new Error(
      "待機時間には0以上の数値を指定してください。",
    );
  }

  return parsedValue;
}

const executeMinecraftCommand: ActionExecutor = async (
  command,
  context,
) => {
  const minecraftCommand = command.value.trim();

  if (!minecraftCommand) {
    throw new Error("Minecraftコマンドが空です。");
  }

  console.info("[Minecraft Executor] SEND", {
    command: minecraftCommand,
    context,
  });

  const result = await sendMinecraftCommand(
    minecraftCommand,
  );

  console.info("[Minecraft Executor] RESPONSE", {
    command: result.command,
    response: result.response || "レスポンスなし",
    context,
  });
};

const executeOverlayAction: ActionExecutor = async (
  command,
  context,
) => {
  const overlayValue = command.value.trim();

  if (!overlayValue) {
    throw new Error("オーバーレイ内容が空です。");
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

const executeSoundAction: ActionExecutor = async (
  command,
  context,
) => {
  const soundValue = command.value.trim();

  if (!soundValue) {
    throw new Error("サウンド指定が空です。");
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

const executeWaitAction: ActionExecutor = async (
  command,
  context,
) => {
  const milliseconds =
    parseWaitMilliseconds(command.value);

  console.info("[Wait Executor]", {
    milliseconds,
    context,
  });

  await sleep(milliseconds);
};

const actionExecutors: Record<
  GachaCommand["type"],
  ActionExecutor
> = {
  minecraft: executeMinecraftCommand,
  overlay: executeOverlayAction,
  sound: executeSoundAction,
  wait: executeWaitAction,
};

export async function executeGachaCommand(
  command: GachaCommand,
  context: ActionExecutionContext,
): Promise<void> {
  if (!command.enabled) {
    console.log(
      `[Queue] SKIP | ${command.type} | disabled`,
    );

    return;
  }

  console.log(
    `[Queue] START | ${command.type} | value="${command.value}" | delay=${command.delay}ms`,
  );

  const startedAt = performance.now();

  try {
    const executor = actionExecutors[command.type];

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