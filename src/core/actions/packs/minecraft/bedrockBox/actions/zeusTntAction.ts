import { defineAction } from "@/core/actions/defineAction";

import { buildZeusTntCommands } from "../builders/zeusTntBuilder";

export const zeusTntAction = defineAction({
  id: "minecraft.zeusTnt",
  pluginId: "bedrock-box",

  name: "Zeus TNT",
  description:
    "Bedrock BoxでZeus TNTを発生させます。",

  icon: "⚡",

  intent: "sabotage",
  category: "爆発",

  tags: [
    "Zeus TNT",
    "TNT",
    "爆発",
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

  buildCommands: buildZeusTntCommands,
});