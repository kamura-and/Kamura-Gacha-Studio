import { defineAction } from "@/core/actions/defineAction";

import { buildEndermanCommands } from "../builders/endermanBuilder";

export const endermanAction = defineAction({
  id: "minecraft.enderman",
  pluginId: "bedrock-box",

  name: "エンダーマン",
  description:
    "ブロックを盗むエンダーマンを指定した数だけスポーンします。",

  icon: "👾",

  intent: "sabotage",
  category: "イベント",

  tags: [
    "エンダーマン",
    "Mob",
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
      label: "スポーン数",
      description:
        "出現させるエンダーマンの数です。",
      defaultValue: 5,
      min: 1,
      step: 1,
      unit: "体",
      required: true,
    },
    {
      key: "target",
      type: "string",
      label: "対象",
      description:
        "ギフト送信者名、Minecraftのプレイヤー名、またはターゲットセレクターです。空欄の場合は対象を指定しません。",
      defaultValue: "{nickname}",
      required: false,
    },
  ],

  buildCommands: buildEndermanCommands,
});