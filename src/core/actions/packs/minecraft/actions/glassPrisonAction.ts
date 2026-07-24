import { defineAction } from "@/core/actions/defineAction";
import { buildGlassPrisonCommands } from "../builders/glassPrisonBuilder";

export const glassPrisonAction = defineAction({
  id: "minecraft.glassPrison",
  pluginId: "minecraft",

  name: "ガラスの檻",
  description:
    "対象プレイヤーをガラスの檻で囲みます。",

  icon: "🧊",

  intent: "sabotage",
  category: "地形",

  tags: [
    "ガラス",
    "檻",
    "拘束",
    "妨害",
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
      key: "target",
      type: "select",
      label: "対象",
      description:
        "檻に閉じ込める対象を選択します。",
      defaultValue: "@p",
      required: true,
      options: [
        {
          label: "最も近いプレイヤー",
          value: "@p",
        },
        {
          label: "すべてのプレイヤー",
          value: "@a",
        },
        {
          label: "ランダムなプレイヤー",
          value: "@r",
        },
      ],
    },
    {
      key: "size",
      type: "number",
      label: "檻の大きさ",
      description:
        "生成する檻の横幅と奥行きです。",
      defaultValue: 3,
      min: 3,
      max: 9,
      step: 2,
      unit: "ブロック",
      required: true,
    },
    {
      key: "includeRoof",
      type: "boolean",
      label: "天井を付ける",
      description:
        "檻の上部にもガラスを配置します。",
      defaultValue: true,
      required: false,
    },
  ],

  buildCommands: buildGlassPrisonCommands,
});