import { defineAction } from "@/core/actions/defineAction";

import { buildResetCommands } from "../builders/resetBuilder";

export const resetAction = defineAction({
  id: "minecraft.reset",
  pluginId: "bedrock-box",

  name: "リセット",
  description:
    "Bedrock Boxを雷でリセットします。",

  icon: "🔄",

  intent: "sabotage",
  category: "ゲーム管理",

  tags: [
    "リセット",
    "ゲーム",
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

  buildCommands: buildResetCommands,
});