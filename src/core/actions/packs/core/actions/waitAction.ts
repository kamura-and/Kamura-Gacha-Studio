import { defineAction } from "@/core/actions/defineAction";
import { buildWaitCommands } from "@/core/actions/builders/waitBuilder";

/**
 * 次のアクションを実行するまで一定時間待機するAction。
 */
export const waitAction = defineAction({
  id: "core.wait",
  pluginId: "core",

  name: "待機",
  description:
    "次のアクションを実行するまで一定時間待機します。",

  icon: "⏱️",

  intent: "system",
  category: "システム",

  tags: [
    "待機",
    "時間",
    "遅延",
  ],

  capabilities: [
    "timeline.wait",
  ],

  outputTargets: [
    "wait",
  ],

  impact: 0,

  parameters: [
    {
      key: "duration",
      type: "number",
      label: "待機時間",
      description:
        "次のアクションを実行するまでの待機時間です。",
      defaultValue: 1000,
      min: 100,
      max: 10000,
      step: 100,
      unit: "ms",
      required: true,
    },
  ],

  buildCommands: buildWaitCommands,
});