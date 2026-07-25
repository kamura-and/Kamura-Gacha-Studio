import { defineAction } from "@/core/actions/defineAction";

import { buildRadiusUpCommands } from "../builders/radiusUpBuilder";

export const radiusUpAction = defineAction({
  id: "minecraft.radiusUp",
  pluginId: "bedrock-box",

  name: "半径を広げる",
  description:
    "Bedrock Boxの半径を、指定したブロック数だけ広げます。",

  icon: "↔️",

  intent: "sabotage",
  category: "フィールド",

  tags: [
    "半径",
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
        "Bedrock Boxの半径を広げるブロック数です。",
      defaultValue: 1,
      min: 1,
      step: 1,
      unit: "ブロック",
      required: true,
    },
  ],

  buildCommands: buildRadiusUpCommands,
});