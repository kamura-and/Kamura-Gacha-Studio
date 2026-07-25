import { defineAction } from "@/core/actions/defineAction";

import { buildFillCommands } from "../builders/fillBuilder";

export const fillAction = defineAction({
  id: "minecraft.fillBedrockBox",
  pluginId: "bedrock-box",

  name: "箱をすべて埋める",
  description:
    "Bedrock Boxの内部をブロックですべて埋めます。",

  icon: "🧱",

  intent: "sabotage",
  category: "フィールド",

  tags: [
    "埋める",
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

  impact: 5,

  parameters: [],

  buildCommands: buildFillCommands,
});