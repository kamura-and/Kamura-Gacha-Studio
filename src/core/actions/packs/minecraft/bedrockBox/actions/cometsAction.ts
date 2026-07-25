import { defineAction } from "@/core/actions/defineAction";

import { buildCometsCommands } from "../builders/cometsBuilder";

export const cometsAction = defineAction({
  id: "minecraft.comets",
  pluginId: "bedrock-box",

  name: "コメット",

  description:
    "一定時間、小型メテオを降らせ続けます。",

  icon: "🌠",

  intent: "sabotage",
  category: "爆発",

  tags: [
    "コメット",
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

  impact: 4,

  parameters: [
    {
      key: "duration",
      type: "number",
      label: "継続時間",
      description: "降らせ続ける時間です。",
      defaultValue: 10,
      step: 1,
      unit: "秒",
      required: true,
    },
    {
      key: "interval",
      type: "number",
      label: "間隔",
      description: "落下間隔です。",
      defaultValue: 5,
      step: 1,
      unit: "tick",
      required: true,
    },
  ],

  buildCommands: buildCometsCommands,
});