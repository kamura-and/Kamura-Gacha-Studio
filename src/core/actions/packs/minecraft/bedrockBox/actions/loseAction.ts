import { defineAction } from "@/core/actions/defineAction";

import { buildLoseCommands } from "../builders/loseBuilder";

export const loseAction = defineAction({
  id: "minecraft.lose",
  pluginId: "bedrock-box",

  name: "敗北追加",
  description:
    "Bedrock Boxの敗北数を追加します。",

  icon: "💀",

  intent: "sabotage",
  category: "ゲーム管理",

  tags: [
    "敗北",
    "Lose",
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

      label: "敗北数",

      defaultValue: 1,
      min: 1,
      max: 10,
      step: 1,

      required: true,
    },
  ],

  buildCommands: buildLoseCommands,
});