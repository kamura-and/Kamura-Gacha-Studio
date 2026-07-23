import type { GachaItem } from "@/features/gacha/types/gacha";

import { enqueueCommandsAndStart } from "../services/commandQueueEngine";
import { useCommandQueueStore } from "../store/commandQueueStore";

type GachaQueueTestButtonProps = {
  item: GachaItem;
  className?: string;
};

export function GachaQueueTestButton({
  item,
  className,
}: GachaQueueTestButtonProps) {
  const isProcessing = useCommandQueueStore(
    (state) => state.isProcessing,
  );

  const enabledCommandCount = item.commands.filter(
    (command) => command.enabled,
  ).length;

  const handleTestExecute = () => {
    enqueueCommandsAndStart({
      gachaItemId: item.id,
      gachaItemName: item.name,
      commands: item.commands,
    });
  };

  return (
    <button
      type="button"
      className={className}
      onClick={handleTestExecute}
      disabled={enabledCommandCount === 0}
      title={
        enabledCommandCount === 0
          ? "有効なコマンドがありません"
          : `${enabledCommandCount}件のコマンドをテスト実行`
      }
    >
      {isProcessing ? "キューに追加" : "テスト実行"}
    </button>
  );
}