import { defineAction } from "@/core/actions/defineAction";

import { buildBlackHoleCommands } from "../builders/blackHoleBuilder";

export const blackHoleAction = defineAction({
  id: "minecraft.blackHole",
  pluginId: "bedrock-box",

  name: "ブラックホール",
  description:
    "プレイヤーの周囲にブラックホールを生成し、指定時間吸い込みます。",

  icon: "🌀",

  intent: "sabotage",
  category: "拘束",

  tags: [
    "ブラックホール",
    "吸い込み",
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
      key: "seconds",
      type: "number",
      label: "継続時間",
      description:
        "ブラックホールが持続する時間です。",
      defaultValue: 10,
      step: 1,
      unit: "秒",
      required: true,
    },
  ],

  buildCommands: buildBlackHoleCommands,
});