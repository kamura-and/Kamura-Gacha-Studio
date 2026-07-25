import { defineAction } from "@/core/actions/defineAction";
import { buildGlassPrisonCommands } from "../builders/glassPrisonBuilder";

export const glassPrisonAction = defineAction({
  id: "minecraft.glassPrison",
  pluginId: "bedrock-box",

  name: "ガラスの檻",
  description:
    "プレイヤーをボックス上空の檻へ移動させ、指定した時間だけ閉じ込めます。",

  icon: "🧊",

  intent: "sabotage",
  category: "拘束",

  tags: [
    "ガラス",
    "檻",
    "拘束",
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
      key: "seconds",
      type: "number",
      label: "拘束時間",
      description:
        "プレイヤーを檻に閉じ込める秒数です。負の値を指定すると、残り時間を減らせます。",
      defaultValue: 10,
      step: 1,
      unit: "秒",
      required: true,
    },
  ],

  buildCommands: buildGlassPrisonCommands,
});