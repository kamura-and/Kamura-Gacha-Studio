import type {
  ActionDefinition,
  ActionParameterValues,
} from "@/core/actions";

type ParameterOption = {
  value: unknown;
  label?: string;
  name?: string;
};

type ParameterDefinitionLike = {
  key?: string;
  id?: string;
  name?: string;
  label?: string;
  options?: Array<
    ParameterOption | string | number | boolean
  >;
};

export type ParameterDisplayItem = {
  key: string;
  label: string;
  value: unknown;
  formattedValue: string;
};

/**
 * パラメーター定義に日本語名がない場合の補助辞書。
 *
 * 基本的にはActionDefinition側のnameまたはlabelを
 * 使用することを推奨します。
 */
const fallbackParameterLabels: Record<
  string,
  string
> = {
  target: "対象プレイヤー",
  player: "プレイヤー",
  playerName: "プレイヤー名",

  size: "サイズ",
  radius: "半径",
  range: "範囲",
  width: "幅",
  height: "高さ",
  depth: "奥行き",

  count: "個数",
  amount: "数量",
  quantity: "数量",

  power: "威力",
  strength: "強さ",
  damage: "ダメージ",

  duration: "継続時間",
  delay: "待機時間",
  seconds: "秒数",

  includeRoof: "天井を含める",
  includeFloor: "床を含める",
  includeWalls: "壁を含める",

  material: "素材",
  block: "ブロック",
  blockType: "ブロックの種類",

  message: "メッセージ",
  title: "タイトル",
  text: "テキスト",

  sound: "サウンド",
  volume: "音量",

  command: "コマンド",
  enabled: "有効",
};

function getParameterKey(
  parameter: ParameterDefinitionLike,
): string | null {
  return parameter.key ?? parameter.id ?? null;
}

function getParameterLabel(
  key: string,
  parameter?: ParameterDefinitionLike,
): string {
  return (
    parameter?.name ??
    parameter?.label ??
    fallbackParameterLabels[key] ??
    key
  );
}

function getOptionLabel(
  value: unknown,
  parameter?: ParameterDefinitionLike,
): string | null {
  if (!parameter?.options) {
    return null;
  }

  const matchedOption = parameter.options.find(
    (option) => {
      if (
        typeof option === "object" &&
        option !== null &&
        "value" in option
      ) {
        return option.value === value;
      }

      return option === value;
    },
  );

  if (matchedOption === undefined) {
    return null;
  }

  if (
    typeof matchedOption === "object" &&
    matchedOption !== null
  ) {
    return (
      matchedOption.label ??
      matchedOption.name ??
      String(matchedOption.value)
    );
  }

  return String(matchedOption);
}

export function formatParameterValue(
  value: unknown,
  parameter?: ParameterDefinitionLike,
): string {
  const optionLabel = getOptionLabel(
    value,
    parameter,
  );

  if (optionLabel !== null) {
    return optionLabel;
  }

  if (typeof value === "boolean") {
    return value ? "はい" : "いいえ";
  }

  if (value === null || value === undefined) {
    return "未設定";
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "未設定";
    }

    return value
      .map((item) =>
        formatParameterValue(item),
      )
      .join("、");
  }

  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  const text = String(value);

  return text.length > 0 ? text : "未設定";
}

export function getParameterDisplayItems(
  definition: ActionDefinition,
  values: ActionParameterValues,
): ParameterDisplayItem[] {
  const parameters = (
    definition.parameters ?? []
  ) as ParameterDefinitionLike[];

  const parameterMap = new Map<
    string,
    ParameterDefinitionLike
  >();

  parameters.forEach((parameter) => {
    const key = getParameterKey(parameter);

    if (key) {
      parameterMap.set(key, parameter);
    }
  });

  return Object.entries(values).map(
    ([key, value]) => {
      const parameter = parameterMap.get(key);

      return {
        key,
        label: getParameterLabel(
          key,
          parameter,
        ),
        value,
        formattedValue: formatParameterValue(
          value,
          parameter,
        ),
      };
    },
  );
}