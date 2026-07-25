import { defineAction } from "@/core/actions/defineAction";

import { buildDragonResetCommands } from "../builders/dragonResetBuilder";

export const dragonResetAction = defineAction({
  id: "minecraft.dragonReset",
  pluginId: "bedrock-box",

  name: "ドラゴンリセット",
  description:
    "Bedrock Boxをドラゴンモードでリセットします。",

  icon: "🐉",

  intent: "sabotage",
  category: "ゲーム管理",

  tags: [
    "ドラゴン",
    "リセット",
    "Bedrock Box",
  ],

  capabilities: [
    "minecraft.command",
  ],

  outputTargets: [
    "minecraft",
  ],

  impact: 2,

  parameters: [],

  buildCommands: buildDragonResetCommands,
});