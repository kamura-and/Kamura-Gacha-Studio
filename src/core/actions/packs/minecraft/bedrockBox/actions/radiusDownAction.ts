import { defineAction } from "@/core/actions/defineAction";

import { buildRadiusDownCommands } from "../builders/radiusDownBuilder";

export const radiusDownAction = defineAction({
  id: "minecraft.radiusDown",
  pluginId: "bedrock-box",

  name: "半径を狭める",
  description:
    "Bedrock Boxの半径を、指定したブロック数だけ狭めます。",

  icon: "↔️",

  intent: "sabotage",
  category: "フィールド",

  tags: [
    "半径",
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
        "Bedrock Boxの半径を狭めるブロック数です。",
      defaultValue: 1,
      min: 1,
      step: 1,
      unit: "ブロック",
      required: true,
    },
  ],

  buildCommands: buildRadiusDownCommands,
});