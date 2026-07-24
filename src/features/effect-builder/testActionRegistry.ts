import {
  ActionRegistry,
  type ActionDefinition,
  type ActionParameterValues,
  type GeneratedActionCommand,
} from "@/core/actions";

/**
 * パラメーターを文字列として取得する。
 */
function getStringValue(
  values: ActionParameterValues,
  key: string,
  fallback: string,
): string {
  const value = values[key];

  if (typeof value === "string") {
    return value;
  }

  return fallback;
}

/**
 * パラメーターを数値として取得する。
 */
function getNumberValue(
  values: ActionParameterValues,
  key: string,
  fallback: number,
): number {
  const value = values[key];

  if (typeof value === "number") {
    return Number.isFinite(value)
      ? value
      : fallback;
  }

  if (typeof value === "string") {
    const parsedValue = Number(value);

    return Number.isFinite(parsedValue)
      ? parsedValue
      : fallback;
  }

  return fallback;
}

/**
 * パラメーターを真偽値として取得する。
 */
function getBooleanValue(
  values: ActionParameterValues,
  key: string,
  fallback: boolean,
): boolean {
  const value = values[key];

  if (typeof value === "boolean") {
    return value;
  }

  return fallback;
}

/**
 * 数値を指定された範囲に収める。
 */
function clamp(
  value: number,
  min: number,
  max: number,
): number {
  return Math.min(
    Math.max(value, min),
    max,
  );
}

/**
 * 超TNTのコマンドを生成する。
 *
 * 「威力」は、TNTを配置する範囲として使用する。
 * vanillaのTNTには爆発半径を直接指定するプロパティがないため、
 * 数値が大きいほど広い範囲へTNTを配置する。
 */
function buildSuperTntCommands(
  values: ActionParameterValues,
): GeneratedActionCommand[] {
  const target = getStringValue(
    values,
    "target",
    "@p",
  );

  const count = Math.floor(
    clamp(
      getNumberValue(values, "count", 5),
      1,
      30,
    ),
  );

  const power = Math.floor(
    clamp(
      getNumberValue(values, "power", 4),
      1,
      10,
    ),
  );

  return Array.from(
    { length: count },
    (_, index) => {
      const angle =
        (index / Math.max(count, 1)) *
        Math.PI *
        2;

      const distance =
        count === 1
          ? 0
          : 1 +
            (index % power);

      const offsetX = Math.round(
        Math.cos(angle) * distance,
      );

      const offsetZ = Math.round(
        Math.sin(angle) * distance,
      );

      return {
        type: "minecraft",
        value:
          `execute as ${target} at @s run ` +
          `summon minecraft:tnt ` +
          `~${formatOffset(offsetX)} ~1 ~${formatOffset(offsetZ)} ` +
          `{fuse:40}`,
        enabled: true,
      };
    },
  );
}

/**
 * 相対座標用の数値を整形する。
 *
 * 0の場合は空文字を返し、
 * 「~0」ではなく「~」になるようにする。
 */
function formatOffset(
  value: number,
): string {
  if (value === 0) {
    return "";
  }

  return String(value);
}

/**
 * 待機コマンドを生成する。
 */
function buildWaitCommands(
  values: ActionParameterValues,
): GeneratedActionCommand[] {
  const duration = Math.floor(
    clamp(
      getNumberValue(
        values,
        "duration",
        1000,
      ),
      100,
      10000,
    ),
  );

  return [
    {
      type: "wait",
      value: `待機 ${duration}ms`,
      delay: duration,
      enabled: true,
    },
  ];
}

/**
 * ガラスの檻を生成する。
 *
 * sizeは檻全体の横幅・奥行きとして扱う。
 * 例：
 * size 3 → 半径1ブロック
 * size 5 → 半径2ブロック
 */
function buildGlassPrisonCommands(
  values: ActionParameterValues,
): GeneratedActionCommand[] {
  const target = getStringValue(
    values,
    "target",
    "@p",
  );

  const size = Math.floor(
    clamp(
      getNumberValue(values, "size", 3),
      3,
      9,
    ),
  );

  const includeRoof = getBooleanValue(
    values,
    "includeRoof",
    true,
  );

  const radius = Math.floor(size / 2);
  const height = 3;

  const commands: GeneratedActionCommand[] = [
    {
      type: "minecraft",
      value:
        `execute as ${target} at @s run ` +
        `fill ` +
        `~-${radius} ~ ~-${radius} ` +
        `~-${radius} ~${height} ~${radius} ` +
        `minecraft:glass`,
      enabled: true,
    },
    {
      type: "minecraft",
      value:
        `execute as ${target} at @s run ` +
        `fill ` +
        `~${radius} ~ ~-${radius} ` +
        `~${radius} ~${height} ~${radius} ` +
        `minecraft:glass`,
      enabled: true,
    },
    {
      type: "minecraft",
      value:
        `execute as ${target} at @s run ` +
        `fill ` +
        `~-${radius} ~ ~-${radius} ` +
        `~${radius} ~${height} ~-${radius} ` +
        `minecraft:glass`,
      enabled: true,
    },
    {
      type: "minecraft",
      value:
        `execute as ${target} at @s run ` +
        `fill ` +
        `~-${radius} ~ ~${radius} ` +
        `~${radius} ~${height} ~${radius} ` +
        `minecraft:glass`,
      enabled: true,
    },
  ];

  if (includeRoof) {
    commands.push({
      type: "minecraft",
      value:
        `execute as ${target} at @s run ` +
        `fill ` +
        `~-${radius} ~${height} ~-${radius} ` +
        `~${radius} ~${height} ~${radius} ` +
        `minecraft:glass`,
      enabled: true,
    });
  }

  return commands;
}

/**
 * 体力回復コマンドを生成する。
 */
function buildHealCommands(
  values: ActionParameterValues,
): GeneratedActionCommand[] {
  const target = getStringValue(
    values,
    "target",
    "@p",
  );

  const level = Math.floor(
    clamp(
      getNumberValue(values, "level", 1),
      1,
      5,
    ),
  );

  const amplifier = level - 1;

  return [
    {
      type: "minecraft",
      value:
        `effect give ${target} ` +
        `minecraft:instant_health ` +
        `1 ${amplifier} true`,
      enabled: true,
    },
  ];
}

/**
 * 画面演出用の出力を生成する。
 *
 * overlay実行側でJSONを解析して使用する想定。
 */
function buildOverlayCommands(
  values: ActionParameterValues,
): GeneratedActionCommand[] {
  const url = getStringValue(
    values,
    "url",
    "",
  ).trim();

  const duration = Math.floor(
    clamp(
      getNumberValue(
        values,
        "duration",
        3000,
      ),
      500,
      30000,
    ),
  );

  if (!url) {
    throw new Error(
      "表示URLを入力してください。",
    );
  }

  return [
    {
      type: "overlay",
      value: JSON.stringify({
        action: "show",
        url,
        duration,
      }),
      enabled: true,
    },
  ];
}

const testActions: ActionDefinition[] = [
  {
    id: "test-super-tnt",
    pluginId: "test",

    name: "超TNT",
    description:
      "大量のTNTを生成するテスト用アクションです。",

    icon: "💣",

    intent: "sabotage",
    category: "爆発",

    tags: [
      "TNT",
      "爆発",
      "妨害",
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
          "生成するTNTの個数です。",
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
        description:
          "TNTを配置する範囲の広さです。",
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
        description:
          "TNTを発生させる対象です。",
        defaultValue: "@p",
        required: true,
        options: [
          {
            label:
              "最も近いプレイヤー",
            value: "@p",
          },
          {
            label:
              "すべてのプレイヤー",
            value: "@a",
          },
          {
            label:
              "ランダムなプレイヤー",
            value: "@r",
          },
        ],
      },
    ],

    buildCommands:
      buildSuperTntCommands,
  },

  {
    id: "test-wait",
    pluginId: "builtin",

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

    buildCommands:
      buildWaitCommands,
  },

  {
    id: "test-glass-prison",
    pluginId: "test",

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
            label:
              "最も近いプレイヤー",
            value: "@p",
          },
          {
            label:
              "すべてのプレイヤー",
            value: "@a",
          },
          {
            label:
              "ランダムなプレイヤー",
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

    buildCommands:
      buildGlassPrisonCommands,
  },

  {
    id: "test-heal",
    pluginId: "test",

    name: "体力回復",
    description:
      "対象プレイヤーの体力を回復します。",

    icon: "💚",

    intent: "support",
    category: "支援",

    tags: [
      "回復",
      "支援",
      "体力",
    ],

    capabilities: [
      "minecraft.command",
    ],

    outputTargets: [
      "minecraft",
    ],

    impact: 1,

    parameters: [
      {
        key: "target",
        type: "select",
        label: "対象",
        description:
          "回復させる対象を選択します。",
        defaultValue: "@p",
        required: true,
        options: [
          {
            label:
              "最も近いプレイヤー",
            value: "@p",
          },
          {
            label:
              "すべてのプレイヤー",
            value: "@a",
          },
        ],
      },
      {
        key: "level",
        type: "number",
        label: "回復レベル",
        description:
          "付与する回復効果の強さです。",
        defaultValue: 1,
        min: 1,
        max: 5,
        step: 1,
        required: true,
      },
    ],

    buildCommands:
      buildHealCommands,
  },

  {
    id: "test-overlay",
    pluginId: "test",

    name: "画面演出",
    description:
      "配信画面に画像やアニメーションを表示します。",

    icon: "✨",

    intent: "presentation",
    category: "演出",

    tags: [
      "演出",
      "画像",
      "オーバーレイ",
    ],

    capabilities: [
      "overlay.show",
    ],

    outputTargets: [
      "overlay",
    ],

    impact: 0,

    parameters: [
      {
        key: "url",
        type: "string",
        label: "表示URL",
        description:
          "表示する画像やWebページのURLです。",
        defaultValue: "",
        placeholder:
          "https://example.com/effect.gif",
        required: true,
      },
      {
        key: "duration",
        type: "number",
        label: "表示時間",
        description:
          "画面に表示する時間です。",
        defaultValue: 3000,
        min: 500,
        max: 30000,
        step: 500,
        unit: "ms",
        required: true,
      },
    ],

    buildCommands:
      buildOverlayCommands,
  },
];

export const testActionRegistry =
  new ActionRegistry();

testActionRegistry.registerMany(
  testActions,
);