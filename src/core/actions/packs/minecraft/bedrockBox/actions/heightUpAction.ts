import { defineAction } from "@/core/actions/defineAction";

import { buildHeightUpCommands } from "../builders/heightUpBuilder";

export const heightUpAction = defineAction({
  id: "minecraft.heightUp",
  pluginId: "bedrock-box",

  name: "高さを増やす",
  description:
    "Bedrock Boxの高さを、指定したブロック数だけ増やします。",

  icon: "⬆️",

  intent: "sabotage",
  category: "フィールド",

  tags: [
    "高さ",
    "拡張",
    "サイズ変更",
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
      label: "増加量",
      description:
        "Bedrock Boxの高さを上げるブロック数です。",
      defaultValue: 1,
      min: 1,
      step: 1,
      unit: "ブロック",
      required: true,
    },
  ],

  buildCommands: buildHeightUpCommands,
});