import type { GachaItem } from "@/features/gacha/types/gacha";

import {
  effectRuntime,
} from "@/features/effects/runtime/EffectRuntime";

import {
  enqueueCommandsAndStart,
} from "../services/commandQueueEngine";

import {
  useCommandQueueStore,
} from "../store/commandQueueStore";

type GachaQueueTestButtonProps = {
  item: GachaItem;
  className?: string;
};

export function GachaQueueTestButton({
  item,
  className,
}: GachaQueueTestButtonProps) {
  const isProcessing =
    useCommandQueueStore(
      (state) => state.isProcessing,
    );

  const effectId =
    item.effectId?.trim();

  const enabledCommandCount =
    item.commands.filter(
      (command) => command.enabled,
    ).length;

  const hasEffect =
    Boolean(effectId);

  const canTestExecute =
    hasEffect ||
    enabledCommandCount > 0;

  const handleTestExecute = (): void => {
    try {
      if (effectId) {
        const result =
          effectRuntime.execute({
            effectId,

            gachaItemId:
              item.id,

            gachaItemName:
              item.name,
          });

        console.info(
          "[GachaQueueTestButton]",
          "Effect test executed",
          {
            gachaItemId:
              item.id,

            gachaItemName:
              item.name,

            effectId:
              result.effectId,

            effectName:
              result.effectName,

            actionCount:
              result.actionCount,

            commandCount:
              result.commandCount,
          },
        );

        return;
      }

      enqueueCommandsAndStart({
        gachaItemId:
          item.id,

        gachaItemName:
          item.name,

        commands:
          item.commands,
      });

      console.info(
        "[GachaQueueTestButton]",
        "Legacy command test executed",
        {
          gachaItemId:
            item.id,

          gachaItemName:
            item.name,

          commandCount:
            enabledCommandCount,
        },
      );
    } catch (error) {
      console.error(
        "[GachaQueueTestButton]",
        "Test execution failed",
        {
          gachaItemId:
            item.id,

          gachaItemName:
            item.name,

          effectId:
            item.effectId,
        },
        error,
      );
    }
  };

  const buttonTitle = (() => {
    if (effectId) {
      return "連携エフェクトをテスト実行";
    }

    if (enabledCommandCount > 0) {
      return `${enabledCommandCount}件のコマンドをテスト実行`;
    }

    return "連携エフェクトまたは有効なコマンドがありません";
  })();

  return (
    <button
      type="button"
      className={className}
      onClick={handleTestExecute}
      disabled={!canTestExecute}
      title={buttonTitle}
    >
      {isProcessing
        ? "キューに追加"
        : "テスト実行"}
    </button>
  );
}