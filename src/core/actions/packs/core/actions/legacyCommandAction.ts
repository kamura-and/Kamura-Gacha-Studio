import {
  defineAction,
} from "@/core/actions/defineAction";

import {
  buildLegacyCommand,
} from "@/core/actions/builders/legacyCommandBuilder";

/**
 * 旧GachaCommandを
 * EffectDefinitionへ移行するための
 * 互換専用Action。
 *
 * 新規Effectでは原則使用しません。
 */
export const legacyCommandAction =
  defineAction({
    id:
      "core.legacy-command",

    pluginId:
      "core",

    name:
      "旧データ互換コマンド",

    description:
      "旧ガチャ景品を新しい景品形式へ移行するための互換アクションです。",

    icon:
      "🔧",

    intent:
      "system",

    category:
      "システム",

    tags: [
      "旧データ",
      "互換",
      "migration",
    ],

    capabilities: [
      "legacy.command",
    ],

    outputTargets: [
      "minecraft",
      "overlay",
      "sound",
      "discord",
      "obs",
      "wait",
    ],

    impact:
      0,

    parameters: [
      {
        key:
          "type",

        type:
          "select",

        label:
          "出力先",

        defaultValue:
          "minecraft",

        options: [
          {
            label:
              "Minecraft",

            value:
              "minecraft",
          },

          {
            label:
              "Overlay",

            value:
              "overlay",
          },

          {
            label:
              "Sound",

            value:
              "sound",
          },

          {
            label:
              "Discord",

            value:
              "discord",
          },

          {
            label:
              "OBS",

            value:
              "obs",
          },

          {
            label:
              "Wait",

            value:
              "wait",
          },
        ],

        required:
          true,
      },

      {
        key:
          "value",

        type:
          "string",

        label:
          "値",

        defaultValue:
          "",

        description:
          "旧コマンドに保存されていた値です。",
      },

      {
        key:
          "delay",

        type:
          "number",

        label:
          "遅延",

        defaultValue:
          0,

        min:
          0,

        step:
          100,

        unit:
          "ms",
      },

      {
        key:
          "enabled",

        type:
          "boolean",

        label:
          "有効",

        defaultValue:
          true,
      },
    ],

    buildCommands:
      buildLegacyCommand,
  });