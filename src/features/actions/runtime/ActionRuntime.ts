import type {
  GeneratedActionCommand,
} from "@/core/actions";

import {
  enqueueCommandsAndStart,
} from "@/features/queue/services/commandQueueEngine";

export type ExecuteActionCommandsInput = {
  gachaItemId: string;

  gachaItemName: string;

  gachaItemDescription?: string;

  gachaItemRarity?: string;

  gachaItemImageDataUrl?: string | null;

  commands: GeneratedActionCommand[];
};

export class ActionRuntime {
  public execute(
    input: ExecuteActionCommandsInput,
  ): void {
    const commands =
      input.commands.filter(
        (command) =>
          command.enabled !== false,
      );

    if (commands.length === 0) {
      console.warn(
        "[ActionRuntime]",
        "実行可能なコマンドがありません。",
        input,
      );

      return;
    }

    enqueueCommandsAndStart({
      gachaItemId:
        input.gachaItemId,

      gachaItemName:
        input.gachaItemName,

      gachaItemDescription:
        input.gachaItemDescription,

      gachaItemRarity:
        input.gachaItemRarity,

      gachaItemImageDataUrl:
        input.gachaItemImageDataUrl,

      commands,
    });

    console.info(
      "[ActionRuntime]",
      "Commands Enqueued",
      {
        gachaItemId:
          input.gachaItemId,

        gachaItemName:
          input.gachaItemName,

        commandCount:
          commands.length,
      },
    );
  }
}

export const actionRuntime =
  new ActionRuntime();