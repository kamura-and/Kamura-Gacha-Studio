import {
  ActionRegistry,
  type ActionDefinition,
} from "@/core/actions";

const testActions: ActionDefinition[] = [
  {
    id: "test-super-tnt",
    pluginId: "test",

    name: "超TNT",
    description: "大量のTNTを生成するテスト用アクションです。",

    icon: "💣",

    intent: "sabotage",
    category: "爆発",

    tags: ["TNT", "爆発", "妨害"],
    capabilities: ["minecraft.command"],
    outputTargets: ["minecraft"],

    impact: 5,

    parameters: [
      {
        key: "count",
        type: "number",
        label: "個数",
        description: "生成するTNTの個数です。",
        defaultValue: 5,
        min: 1,
        max: 30,
        step: 1,
        unit: "個",
        required: true,
      },
      {
        key: "power",
        type: "number",
        label: "威力",
        description: "爆発の威力です。",
        defaultValue: 4,
        min: 1,
        max: 10,
        step: 1,
        required: true,
      },
      {
        key: "target",
        type: "select",
        label: "対象",
        description: "TNTを発生させる対象です。",
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
    ],

    buildCommands: () => [],
  },

  {
    id: "test-wait",
    pluginId: "builtin",

    name: "待機",
    description: "次のアクションを実行するまで一定時間待機します。",

    icon: "⏱️",

    intent: "system",
    category: "システム",

    tags: ["待機", "時間", "遅延"],
    capabilities: ["timeline.wait"],
    outputTargets: ["wait"],

    impact: 0,

    parameters: [
      {
        key: "duration",
        type: "number",
        label: "待機時間",
        description: "次のアクションを実行するまでの待機時間です。",
        defaultValue: 1000,
        min: 100,
        max: 10000,
        step: 100,
        unit: "ms",
        required: true,
      },
    ],

    buildCommands: () => [],
  },

  {
    id: "test-glass-prison",
    pluginId: "test",

    name: "ガラスの檻",
    description: "対象プレイヤーをガラスの檻で囲みます。",

    icon: "🧊",

    intent: "sabotage",
    category: "地形",

    tags: ["ガラス", "檻", "拘束", "妨害"],
    capabilities: ["minecraft.command"],
    outputTargets: ["minecraft"],

    impact: 3,

    parameters: [
      {
        key: "target",
        type: "select",
        label: "対象",
        description: "檻に閉じ込める対象を選択します。",
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
        description: "生成する檻の横幅と奥行きです。",
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
        description: "檻の上部にもガラスを配置します。",
        defaultValue: true,
        required: false,
      },
    ],

    buildCommands: () => [],
  },

  {
    id: "test-heal",
    pluginId: "test",

    name: "体力回復",
    description: "対象プレイヤーの体力を回復します。",

    icon: "💚",

    intent: "support",
    category: "支援",

    tags: ["回復", "支援", "体力"],
    capabilities: ["minecraft.command"],
    outputTargets: ["minecraft"],

    impact: 1,

    parameters: [
      {
        key: "target",
        type: "select",
        label: "対象",
        description: "回復させる対象を選択します。",
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
        ],
      },
      {
        key: "level",
        type: "number",
        label: "回復レベル",
        description: "付与する回復効果の強さです。",
        defaultValue: 1,
        min: 1,
        max: 5,
        step: 1,
        required: true,
      },
    ],

    buildCommands: () => [],
  },

  {
    id: "test-overlay",
    pluginId: "test",

    name: "画面演出",
    description: "配信画面に画像やアニメーションを表示します。",

    icon: "✨",

    intent: "presentation",
    category: "演出",

    tags: ["演出", "画像", "オーバーレイ"],
    capabilities: ["overlay.show"],
    outputTargets: ["overlay"],

    impact: 0,

    parameters: [
      {
        key: "url",
        type: "string",
        label: "表示URL",
        description: "表示する画像やWebページのURLです。",
        defaultValue: "",
        placeholder: "https://example.com/effect.gif",
        required: true,
      },
      {
        key: "duration",
        type: "number",
        label: "表示時間",
        description: "画面に表示する時間です。",
        defaultValue: 3000,
        min: 500,
        max: 30000,
        step: 500,
        unit: "ms",
        required: true,
      },
    ],

    buildCommands: () => [],
  },
];

export const testActionRegistry = new ActionRegistry();

testActionRegistry.registerMany(testActions);