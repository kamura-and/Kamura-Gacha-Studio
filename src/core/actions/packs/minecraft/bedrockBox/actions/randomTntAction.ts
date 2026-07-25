import { defineAction } from "@/core/actions/defineAction";

import { buildRandomTntCommands } from "../builders/randomTntBuilder";

export const randomTntAction = defineAction({
  id: "minecraft.randomTnt",
  pluginId: "bedrock-box",

  name: "ランダムTNT",
  description:
    "爆発力がランダムに変化するTNTを出現させます。",

  icon: "🎲",

  intent: "sabotage",
  category: "爆発",

  tags: [
    "ランダムTNT",
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

  impact: 4,

  parameters: [
    {
      key: "count",
      type: "number",
      label: "TNTの数",
      description:
        "出現させるランダムTNTの数です。",
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

  buildCommands: buildRandomTntCommands,
});