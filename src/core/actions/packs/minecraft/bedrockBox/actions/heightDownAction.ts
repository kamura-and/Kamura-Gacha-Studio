import { defineAction } from "@/core/actions/defineAction";

import { buildHeightDownCommands } from "../builders/heightDownBuilder";

export const heightDownAction = defineAction({
  id: "minecraft.heightDown",
  pluginId: "bedrock-box",

  name: "高さを減らす",
  description:
    "Bedrock Boxの高さを、指定したブロック数だけ減らします。",

  icon: "⬇️",

  intent: "sabotage",
  category: "フィールド",

  tags: [
    "高さ",
    "縮小",
    "サイズ変更",
    "妨害",
    "Bedrock Box",
  ],

  capabilities: [
    "minecraft.command",
  ],

  outputTargets: [
    "minecraft",
  ],

  impact: 3,

  parameters: [
    {
      key: "count",
      type: "number",
      label: "減少量",
      description:
        "Bedrock Boxの高さを下げるブロック数です。",
      defaultValue: 1,
      min: 1,
      step: 1,
      unit: "ブロック",
      required: true,
    },
  ],

  buildCommands: buildHeightDownCommands,
});