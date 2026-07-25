import { defineAction } from "@/core/actions/defineAction";

import { buildTntCommands } from "../builders/tntBuilder";

export const tntAction = defineAction({
  id: "minecraft.tnt",
  pluginId: "bedrock-box",

  name: "TNT",
  description:
    "Bedrock Boxの上空から、指定した数のTNTを落下させます。",

  icon: "💣",

  intent: "sabotage",
  category: "爆発",

  tags: [
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

  impact: 3,

  parameters: [
    {
      key: "count",
      type: "number",
      label: "TNTの数",
      description:
        "出現させるTNTの数です。",
      defaultValue: 1,
      min: 1,
      step: 1,
      unit: "個",
      required: true,
    },
    {
      key: "target",
      type: "string",
      label: "対象",
      description:
        "ギフト送信者名、Minecraftのプレイヤー名、またはターゲットセレクターです。",
      defaultValue: "{nickname}",
      required: true,
    },
  ],

  buildCommands: buildTntCommands,
});