import { defineAction } from "@/core/actions/defineAction";

import { buildClearCommands } from "../builders/clearBuilder";

export const clearAction = defineAction({
  id: "minecraft.clearBedrockBox",
  pluginId: "bedrock-box",

  name: "箱を空にする",
  description:
    "Bedrock Box内部のブロックをすべて消去します。",

  icon: "🧹",

  intent: "sabotage",
  category: "ゲーム管理",

  tags: [
    "消去",
    "クリア",
    "リセット",
    "箱",
    "Bedrock Box",
  ],

  capabilities: [
    "minecraft.command",
  ],

  outputTargets: [
    "minecraft",
  ],

  impact: 1,

  parameters: [],

  buildCommands: buildClearCommands,
});