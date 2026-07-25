import { defineAction } from "@/core/actions/defineAction";

import { buildFillRowsCommands } from "../builders/fillRowsBuilder";

export const fillRowsAction = defineAction({
  id: "minecraft.fillBedrockBoxRows",
  pluginId: "bedrock-box",

  name: "指定段数を埋める",
  description:
    "Bedrock Boxを下から指定した段数だけ、ブロックで埋めます。",

  icon: "🏗️",

  intent: "sabotage",
  category: "フィールド",

  tags: [
    "埋める",
    "段数",
    "ブロック",
    "妨害",
    "Bedrock Box",
  ],

  capabilities: [
    "minecraft.command",
  ],

  outputTargets: [
    "minecraft",
  ],

  impact: 4,

  parameters: [
    {
      key: "rows",
      type: "number",
      label: "埋める段数",
      description:
        "Bedrock Boxを下から埋める段数です。",
      defaultValue: 1,
      min: 1,
      step: 1,
      unit: "段",
      required: true,
    },
  ],

  buildCommands: buildFillRowsCommands,
});