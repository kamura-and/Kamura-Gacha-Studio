import { defineAction } from "@/core/actions/defineAction";

import { buildTntRingCommands } from "../builders/tntRingBuilder";

export const tntRingAction = defineAction({
  id: "minecraft.tntRing",
  pluginId: "bedrock-box",

  name: "TNTリング",
  description:
    "Bedrock Boxでプレイヤーを囲むTNTリングを発生させます。",

  icon: "💍",

  intent: "sabotage",
  category: "爆発",

  tags: [
    "TNTリング",
    "TNT",
    "爆発",
    "囲む",
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

  buildCommands: buildTntRingCommands,
});