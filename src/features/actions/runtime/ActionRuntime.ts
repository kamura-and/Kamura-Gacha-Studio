import type {
  GeneratedActionCommand,
} from "@/core/actions";

import {
  enqueueCommandsAndStart,
} from "@/features/queue/services/commandQueueEngine";

export type ExecuteActionCommandsInput = {
  gachaItemId: string;
  gachaItemName: string;
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
      commands,
    });

    console.info(
      "[ActionRuntime]",
      "Commands Enqueued",
      {
        gachaItemId:
          input.gachaItemId,
        commandCount:
          commands.length,
      },
    );
  }
}

export const actionRuntime =
  new ActionRuntime();