import type {
  MinecraftCommandCategoryDefinition,
  MinecraftCommandDefinition,
} from "@/features/minecraft/types/commandLibrary";

export const minecraftCommandCategories: MinecraftCommandCategoryDefinition[] =
  [
    {
      id: "all",
      name: "すべて",
      icon: "📚",
    },
    {
      id: "debuff",
      name: "デバフ",
      icon: "💀",
    },
    {
      id: "buff",
      name: "バフ",
      icon: "✨",
    },
    {
      id: "combat",
      name: "戦闘",
      icon: "⚔️",
    },
    {
      id: "movement",
      name: "移動",
      icon: "🪽",
    },
    {
      id: "world",
      name: "ワールド",
      icon: "🌍",
    },
    {
      id: "item",
      name: "アイテム",
      icon: "📦",
    },
    {
      id: "summon",
      name: "召喚",
      icon: "👾",
    },
    {
      id: "special",
      name: "特殊",
      icon: "🎲",
    },
  ];

const playerParameter = {
  key: "player",
  label: "対象プレイヤー",
  type: "text" as const,
  defaultValue: "@a",
  placeholder: "@a またはプレイヤー名",
  description:
    "@aですべてのプレイヤー、@pで最寄りのプレイヤーを対象にします。",
};

const durationParameter = {
  key: "duration",
  label: "効果時間",
  type: "number" as const,
  defaultValue: "10",
  min: 1,
  max: 999999,
  step: 1,
  description: "効果を継続する秒数です。",
};

const amplifierParameter = {
  key: "amplifier",
  label: "効果レベル",
  type: "number" as const,
  defaultValue: "0",
  min: 0,
  max: 255,
  step: 1,
  description:
    "Minecraft内部では0がレベル1、1がレベル2です。",
};

export const minecraftCommandLibrary: MinecraftCommandDefinition[] =
  [
    {
      id: "blindness",
      name: "盲目",
      description:
        "対象プレイヤーの視界を暗くします。",
      category: "debuff",
      icon: "🌑",
      template:
        "effect give {player} minecraft:blindness {duration} {amplifier}",
      tags: ["暗闇", "視界", "妨害", "盲目"],
      parameters: [
        playerParameter,
        durationParameter,
        amplifierParameter,
      ],
    },
    {
      id: "darkness",
      name: "暗闇",
      description:
        "対象プレイヤーの周囲を脈動する暗闇で覆います。",
      category: "debuff",
      icon: "🌘",
      template:
        "effect give {player} minecraft:darkness {duration} {amplifier}",
      tags: ["暗闇", "視界", "ディープダーク"],
      parameters: [
        playerParameter,
        durationParameter,
        amplifierParameter,
      ],
    },
    {
      id: "slowness",
      name: "移動速度低下",
      description:
        "対象プレイヤーの移動速度を下げます。",
      category: "debuff",
      icon: "🐌",
      template:
        "effect give {player} minecraft:slowness {duration} {amplifier}",
      tags: ["鈍足", "遅い", "移動", "妨害"],
      parameters: [
        playerParameter,
        durationParameter,
        amplifierParameter,
      ],
    },
    {
      id: "weakness",
      name: "弱体化",
      description:
        "対象プレイヤーの攻撃力を下げます。",
      category: "debuff",
      icon: "🥀",
      template:
        "effect give {player} minecraft:weakness {duration} {amplifier}",
      tags: ["弱体化", "攻撃力", "戦闘"],
      parameters: [
        playerParameter,
        durationParameter,
        amplifierParameter,
      ],
    },
    {
      id: "poison",
      name: "毒",
      description:
        "対象プレイヤーに毒を付与します。",
      category: "debuff",
      icon: "☠️",
      template:
        "effect give {player} minecraft:poison {duration} {amplifier}",
      tags: ["毒", "ダメージ", "妨害"],
      parameters: [
        playerParameter,
        durationParameter,
        amplifierParameter,
      ],
    },
    {
      id: "nausea",
      name: "吐き気",
      description:
        "対象プレイヤーの画面を歪ませます。",
      category: "debuff",
      icon: "🌀",
      template:
        "effect give {player} minecraft:nausea {duration} {amplifier}",
      tags: ["吐き気", "画面", "ぐるぐる", "妨害"],
      parameters: [
        playerParameter,
        durationParameter,
        amplifierParameter,
      ],
    },
    {
      id: "hunger",
      name: "空腹",
      description:
        "対象プレイヤーの満腹度を減少させます。",
      category: "debuff",
      icon: "🍖",
      template:
        "effect give {player} minecraft:hunger {duration} {amplifier}",
      tags: ["空腹", "満腹度", "食料"],
      parameters: [
        playerParameter,
        durationParameter,
        amplifierParameter,
      ],
    },
    {
      id: "levitation",
      name: "浮遊",
      description:
        "対象プレイヤーを空中へ浮かせます。",
      category: "movement",
      icon: "🎈",
      template:
        "effect give {player} minecraft:levitation {duration} {amplifier}",
      tags: ["浮遊", "空中", "落下", "移動"],
      parameters: [
        playerParameter,
        {
          ...durationParameter,
          defaultValue: "3",
        },
        amplifierParameter,
      ],
    },
    {
      id: "speed",
      name: "移動速度上昇",
      description:
        "対象プレイヤーの移動速度を上げます。",
      category: "buff",
      icon: "💨",
      template:
        "effect give {player} minecraft:speed {duration} {amplifier}",
      tags: ["速度", "スピード", "移動", "バフ"],
      parameters: [
        playerParameter,
        durationParameter,
        amplifierParameter,
      ],
    },
    {
      id: "jump-boost",
      name: "跳躍力上昇",
      description:
        "対象プレイヤーのジャンプ力を上げます。",
      category: "buff",
      icon: "🐇",
      template:
        "effect give {player} minecraft:jump_boost {duration} {amplifier}",
      tags: ["ジャンプ", "跳躍", "移動"],
      parameters: [
        playerParameter,
        durationParameter,
        amplifierParameter,
      ],
    },
    {
      id: "glowing",
      name: "発光",
      description:
        "対象プレイヤーを壁越しでも見える状態にします。",
      category: "special",
      icon: "💡",
      template:
        "effect give {player} minecraft:glowing {duration} {amplifier}",
      tags: ["発光", "輪郭", "視認"],
      parameters: [
        playerParameter,
        durationParameter,
        amplifierParameter,
      ],
    },
    {
      id: "lightning",
      name: "雷を落とす",
      description:
        "対象プレイヤーの位置へ雷を召喚します。",
      category: "combat",
      icon: "⚡",
      template:
        "execute at {player} run summon minecraft:lightning_bolt ~ ~ ~",
      tags: ["雷", "ダメージ", "天候", "攻撃"],
      parameters: [playerParameter],
    },
    {
      id: "instant-tnt",
      name: "即時爆発",
      description:
        "対象プレイヤーの位置へ即時起爆するTNTを召喚します。",
      category: "combat",
      icon: "💥",
      template:
        "execute at {player} run summon minecraft:tnt ~ ~ ~ {fuse:0}",
      tags: ["TNT", "爆発", "破壊", "危険"],
      parameters: [playerParameter],
    },
    {
      id: "launch-up",
      name: "上空へ転送",
      description:
        "対象プレイヤーを現在位置から上空へ移動させます。",
      category: "movement",
      icon: "🚀",
      template:
        "execute as {player} at @s run tp @s ~ ~{height} ~",
      tags: ["上空", "テレポート", "落下", "移動"],
      parameters: [
        playerParameter,
        {
          key: "height",
          label: "上昇距離",
          type: "number",
          defaultValue: "20",
          min: 1,
          max: 300,
          step: 1,
          description:
            "現在位置から上方向へ移動するブロック数です。",
        },
      ],
    },
    {
      id: "random-teleport",
      name: "ランダムテレポート",
      description:
        "対象プレイヤーを指定範囲内のランダムな地点へ移動させます。",
      category: "movement",
      icon: "🎲",
      template:
        "spreadplayers ~ ~ {minimumDistance} {maximumRange} false {player}",
      tags: [
        "ランダム",
        "テレポート",
        "移動",
        "ワープ",
      ],
      parameters: [
        playerParameter,
        {
          key: "minimumDistance",
          label: "最小間隔",
          type: "number",
          defaultValue: "0",
          min: 0,
          max: 1000,
          step: 1,
        },
        {
          key: "maximumRange",
          label: "最大範囲",
          type: "number",
          defaultValue: "100",
          min: 1,
          max: 100000,
          step: 1,
        },
      ],
    },
    {
      id: "clear-inventory",
      name: "インベントリ消去",
      description:
        "対象プレイヤーの所持品をすべて削除します。",
      category: "item",
      icon: "🗑️",
      template: "clear {player}",
      tags: [
        "アイテム",
        "削除",
        "インベントリ",
        "危険",
      ],
      parameters: [playerParameter],
    },
    {
      id: "give-dirt",
      name: "土を配布",
      description:
        "対象プレイヤーへ指定数の土を渡します。",
      category: "item",
      icon: "🟫",
      template:
        "give {player} minecraft:dirt {amount}",
      tags: ["アイテム", "土", "配布", "ネタ"],
      parameters: [
        playerParameter,
        {
          key: "amount",
          label: "個数",
          type: "number",
          defaultValue: "64",
          min: 1,
          max: 6400,
          step: 1,
        },
      ],
    },
    {
      id: "summon-zombie",
      name: "ゾンビ召喚",
      description:
        "対象プレイヤーの位置へゾンビを召喚します。",
      category: "summon",
      icon: "🧟",
      template:
        "execute at {player} run summon minecraft:zombie ~ ~ ~",
      tags: ["ゾンビ", "敵", "モブ", "召喚"],
      parameters: [playerParameter],
    },
    {
      id: "summon-creeper",
      name: "クリーパー召喚",
      description:
        "対象プレイヤーの位置へクリーパーを召喚します。",
      category: "summon",
      icon: "🟩",
      template:
        "execute at {player} run summon minecraft:creeper ~ ~ ~",
      tags: [
        "クリーパー",
        "敵",
        "モブ",
        "爆発",
        "召喚",
      ],
      parameters: [playerParameter],
    },
    {
      id: "set-night",
      name: "夜に変更",
      description:
        "ワールドの時刻を夜へ変更します。",
      category: "world",
      icon: "🌙",
      template: "time set night",
      tags: ["時間", "夜", "ワールド"],
      parameters: [],
    },
    {
      id: "set-day",
      name: "昼に変更",
      description:
        "ワールドの時刻を昼へ変更します。",
      category: "world",
      icon: "☀️",
      template: "time set day",
      tags: ["時間", "昼", "ワールド"],
      parameters: [],
    },
    {
      id: "weather-thunder",
      name: "雷雨に変更",
      description:
        "ワールドの天候を雷雨へ変更します。",
      category: "world",
      icon: "⛈️",
      template:
        "weather thunder {duration}",
      tags: ["天候", "雷雨", "雨", "ワールド"],
      parameters: [
        {
          key: "duration",
          label: "継続時間",
          type: "number",
          defaultValue: "30",
          min: 1,
          max: 1000000,
          step: 1,
          description:
            "天候を継続する秒数です。",
        },
      ],
    },
    {
      id: "weather-clear",
      name: "晴れに変更",
      description:
        "ワールドの天候を晴れへ変更します。",
      category: "world",
      icon: "🌤️",
      template:
        "weather clear {duration}",
      tags: ["天候", "晴れ", "ワールド"],
      parameters: [
        {
          key: "duration",
          label: "継続時間",
          type: "number",
          defaultValue: "30",
          min: 1,
          max: 1000000,
          step: 1,
        },
      ],
    },
  ];