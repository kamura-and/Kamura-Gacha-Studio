import type { GachaItem } from "@/features/gacha/types/gacha";

export const sampleGachaItems: GachaItem[] = [
  {
    id: "slowness-curse",
    name: "鈍足の呪い",
    description:
      "プレイヤー全員へ短時間の移動速度低下を付与します。",
    commands: [
      {
        id: "slowness-command",
        type: "minecraft",
        value: "/effect give @a minecraft:slowness 8 1 true",
        delay: 0,
        enabled: true,
      },
    ],
    rarity: "common",
    probability: 34,
    isEnabled: true,
    createdAt: "2026-07-23T10:00:00.000Z",
  },
  {
    id: "blindness",
    name: "視界封印",
    description:
      "プレイヤーの視界を奪い、周囲を見えにくくします。",
    commands: [
      {
        id: "blindness-overlay",
        type: "overlay",
        value: "blindness",
        delay: 0,
        enabled: true,
      },
      {
        id: "blindness-command",
        type: "minecraft",
        value: "/effect give @a minecraft:blindness 6 0 true",
        delay: 300,
        enabled: true,
      },
    ],
    rarity: "rare",
    probability: 26,
    isEnabled: true,
    createdAt: "2026-07-23T10:01:00.000Z",
  },
  {
    id: "zombie-rain",
    name: "ゾンビレイン",
    description:
      "演出後、プレイヤーの頭上からゾンビを出現させます。",
    commands: [
      {
        id: "zombie-overlay",
        type: "overlay",
        value: "zombie-rain",
        delay: 0,
        enabled: true,
      },
      {
        id: "zombie-sound",
        type: "sound",
        value: "zombie-warning.mp3",
        delay: 0,
        enabled: true,
      },
      {
        id: "zombie-command",
        type: "minecraft",
        value:
          "/execute at @a run summon minecraft:zombie ~ ~4 ~",
        delay: 800,
        enabled: true,
      },
    ],
    rarity: "epic",
    probability: 20,
    isEnabled: true,
    createdAt: "2026-07-23T10:02:00.000Z",
  },
  {
    id: "lightning-party",
    name: "雷鳴パーティー",
    description:
      "警告演出のあと、プレイヤーの現在地へ雷を落とします。",
    commands: [
      {
        id: "lightning-overlay",
        type: "overlay",
        value: "lightning-warning",
        delay: 0,
        enabled: true,
      },
      {
        id: "lightning-command",
        type: "minecraft",
        value:
          "/execute at @a run summon minecraft:lightning_bolt ~ ~ ~",
        delay: 1000,
        enabled: true,
      },
    ],
    rarity: "legendary",
    probability: 12,
    isEnabled: true,
    createdAt: "2026-07-23T10:03:00.000Z",
  },
  {
    id: "black-hole",
    name: "ブラックホール",
    description:
      "暗闇・鈍足・吐き気を時間差で付与します。",
    commands: [
      {
        id: "black-hole-overlay",
        type: "overlay",
        value: "black-hole",
        delay: 0,
        enabled: true,
      },
      {
        id: "black-hole-darkness",
        type: "minecraft",
        value: "/effect give @a minecraft:darkness 10 1 true",
        delay: 300,
        enabled: true,
      },
      {
        id: "black-hole-slowness",
        type: "minecraft",
        value: "/effect give @a minecraft:slowness 8 1 true",
        delay: 700,
        enabled: true,
      },
      {
        id: "black-hole-nausea",
        type: "minecraft",
        value: "/effect give @a minecraft:nausea 8 1 true",
        delay: 1200,
        enabled: true,
      },
    ],
    rarity: "ultra",
    probability: 7,
    isEnabled: true,
    createdAt: "2026-07-23T10:04:00.000Z",
  },
  {
    id: "kamura-chaos",
    name: "鬼神かむらの大混乱",
    description:
      "演出・効果音・状態異常・雷を組み合わせた秘密のガチャです。",
    commands: [
      {
        id: "chaos-overlay",
        type: "overlay",
        value: "kamura-chaos",
        delay: 0,
        enabled: true,
      },
      {
        id: "chaos-sound",
        type: "sound",
        value: "secret-gacha.mp3",
        delay: 0,
        enabled: true,
      },
      {
        id: "chaos-nausea",
        type: "minecraft",
        value: "/effect give @a minecraft:nausea 12 1 true",
        delay: 500,
        enabled: true,
      },
      {
        id: "chaos-lightning",
        type: "minecraft",
        value:
          "/execute at @a run summon minecraft:lightning_bolt ~ ~ ~",
        delay: 2000,
        enabled: true,
      },
    ],
    rarity: "secret",
    probability: 1,
    isEnabled: true,
    createdAt: "2026-07-23T10:05:00.000Z",
  },
];