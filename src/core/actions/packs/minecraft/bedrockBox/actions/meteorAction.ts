import { defineAction } from "@/core/actions/defineAction";

import { buildMeteorCommands } from "../builders/meteorBuilder";

export const meteorAction = defineAction({
  id: "minecraft.meteor",
  pluginId: "bedrock-box",

  name: "メテオ",

  description:
    "巨大なメテオを落下させます。",

  icon: "☄️",

  intent: "sabotage",
  category: "爆発",

  tags: [
    "メテオ",
    "爆発",
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

  buildCommands: buildMeteorCommands,
});