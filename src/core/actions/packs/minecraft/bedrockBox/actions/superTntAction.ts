import { defineAction } from "@/core/actions/defineAction";
import { buildSuperTntCommands } from "../builders/superTntBuilder";

export const superTntAction = defineAction({
  id: "minecraft.superTnt",
  pluginId: "bedrock-box",

  name: "スーパーTNT",
  description:
    "指定した個数と爆発威力のスーパーTNTを生成します。",

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

  impact: 5,

  parameters: [
    {
      key: "count",
      type: "number",
      label: "個数",
      description:
        "生成するスーパーTNTの個数です。",
      defaultValue: 1,
      min: 1,
      max: 30,
      step: 1,
      unit: "個",
      required: true,
    },
    {
      key: "power",
      type: "number",
      label: "爆発威力",
      description:
        "スーパーTNTの爆発威力です。数値を大きくするほど強力になります。",
      defaultValue: 1,
      min: 1,
      max: 10,
      step: 1,
      required: true,
    },
  ],

  buildCommands: buildSuperTntCommands,
});