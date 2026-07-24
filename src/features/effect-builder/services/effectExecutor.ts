import type {
  ActionInstance,
  GeneratedActionCommand,
} from "@/core/actions";

import { enqueueCommandsAndStart } from "@/features/queue/services/commandQueueEngine";

export type ExecuteEffectResult = {
  executionId: string;
  commandCount: number;
};

function createExecutionId(): string {
  if (
    typeof globalThis.crypto !==
      "undefined" &&
    typeof globalThis.crypto
      .randomUUID === "function"
  ) {
    return `effect-${globalThis.crypto.randomUUID()}`;
  }

  return `effect-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

function getErrorMessage(
  error: unknown,
): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "コマンドの生成中に不明なエラーが発生しました。";
}

/**
 * タイムライン内のアクションから
 * 実行コマンドを生成する。
 */
export function buildEffectCommands(
  items: ActionInstance[],
): GeneratedActionCommand[] {
  const commands: GeneratedActionCommand[] =
    [];

  for (const item of items) {
    try {
      const generatedCommands =
        item.definition.buildCommands(
          item.values,
        );

      for (const command of generatedCommands) {
        commands.push({
          ...command,

          // waitは制御命令なのでvalueを空にする
          value:
            command.type === "wait"
              ? ""
              : command.value,

          delay: command.delay ?? 0,

          enabled:
            command.enabled !== false,
        });
      }
    } catch (error) {
      throw new Error(
        `「${item.definition.name}」：${getErrorMessage(
          error,
        )}`,
      );
    }
  }

  return commands;
}

/**
 * Effect Builderの内容をQueueへ登録し、
 * Queue Engineを開始する。
 */
export function executeEffect(
  items: ActionInstance[],
): ExecuteEffectResult {
  if (items.length === 0) {
    throw new Error(
      "タイムラインにアクションがありません。",
    );
  }

  const commands =
    buildEffectCommands(items);

  const enabledCommands = commands.filter(
    (command) =>
      command.enabled !== false,
  );

  if (enabledCommands.length === 0) {
    throw new Error(
      "実行可能なコマンドがありません。",
    );
  }

  const executionId =
    createExecutionId();

  enqueueCommandsAndStart({
    gachaItemId: executionId,
    gachaItemName:
      "エフェクトビルダー",
    commands,
  });

  return {
    executionId,
    commandCount:
      enabledCommands.length,
  };
}