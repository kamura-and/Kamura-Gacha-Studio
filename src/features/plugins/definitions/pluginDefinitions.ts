import type {
  PluginDomainDefinition,
} from "../types/plugin";

export const pluginDefinitions = [
  {
    id: "tiktok-live",
    type: "tiktok",
    name: "TikTok LIVE",
    description:
      "TikTok LIVEのギフト、いいね、フォロー、シェアなどのイベントを受信します。",
    version: "0.1.0",
    author: "Kamura Gacha Studio",
    capabilities: [
      "trigger-source",
    ],
  },
  {
    id: "minecraft",
    type: "minecraft",
    name: "Minecraft",
    description:
      "Minecraftへ妨害コマンドを送信し、Bedrock Boxのアクションを実行します。",
    version: "0.1.0",
    author: "Kamura Gacha Studio",
    capabilities: [
      "command-executor",
    ],
  },
  {
    id: "overlay",
    type: "overlay",
    name: "配信オーバーレイ",
    description:
      "OBSなどの配信画面へ、ガチャ結果や妨害演出を表示します。",
    version: "0.1.0",
    author: "Kamura Gacha Studio",
    capabilities: [
      "overlay-output",
    ],
  },
] satisfies PluginDomainDefinition[];