import { defineAction } from "@/core/actions/defineAction";

import { buildFillBlockCommands } from "../builders/fillBlockBuilder";

export const fillBlockAction = defineAction({
  id: "minecraft.fillBlock",
  pluginId: "bedrock-box",

  name: "ブロック追加",
  description:
    "Bedrock Box内に指定した数のブロックを追加します。",

  icon: "🧱",

  intent: "sabotage",
  category: "フィールド",

  tags: [
    "ブロック追加",
    "FillBlock",
    "フィールド",
    "Bedrock Box",
  ],

  capabilities: [
    "minecraft.command",
  ],

  outputTargets: [
    "minecraft",
  ],

  impact: 2,

  parameters: [
    {
      key: "count",
      type: "number",
      label: "追加数",
      description:
        "Bedrock Box内に追加するブロックの数です。",
      defaultValue: 1,
      min: 1,
      step: 1,
      unit: "個",
      required: true,
    },
  ],

  buildCommands: buildFillBlockCommands,
});