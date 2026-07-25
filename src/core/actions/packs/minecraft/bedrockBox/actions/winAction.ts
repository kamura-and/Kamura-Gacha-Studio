import { defineAction } from "@/core/actions/defineAction";

import { buildWinCommands } from "../builders/winBuilder";

export const winAction = defineAction({
  id: "minecraft.win",
  pluginId: "bedrock-box",

  name: "勝利追加",
  description:
    "Bedrock Boxの勝利数を追加します。",

  icon: "🏆",

  intent: "sabotage",
  category: "ゲーム管理",

  tags: [
    "勝利",
    "Win",
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

  parameters: [
    {
      key: "count",
      type: "number",
      variant: "stepper",

      label: "勝利数",

      defaultValue: 1,
      min: 1,
      max: 10,
      step: 1,

      required: true,
    },
  ],

  buildCommands: buildWinCommands,
});