import type {
  GachaCommand,
  LegacyGachaItem,
  GachaRarity,
} from "../types/gacha";

const STORAGE_KEY =
  "kamura-gacha-items";

type PersistedLegacyGachaItem = {
  id: string;

  name: string;

  description: string;

  imageDataUrl?:
  | string
  | null;

  command?: string;

  commands?: GachaCommand[];

  effectId?:
  | string
  | null;

  rarity?: GachaRarity;

  probability?: number;

  isEnabled?: boolean;

  createdAt?: string;
};

type PersistedGachaState = {
  items?: PersistedLegacyGachaItem[];
};

function isRecord(
  value: unknown,
): value is Record<
  string,
  unknown
> {
  return (
    typeof value ===
    "object" &&
    value !== null
  );
}

function normalizeImageDataUrl(
  value: unknown,
): string | null {
  if (
    typeof value !==
    "string"
  ) {
    return null;
  }

  const trimmedValue =
    value.trim();

  if (!trimmedValue) {
    return null;
  }

  if (
    !trimmedValue.startsWith(
      "data:image/",
    )
  ) {
    return null;
  }

  return trimmedValue;
}

function normalizeRarity(
  value: unknown,
): GachaRarity {
  switch (value) {
    case "common":
    case "rare":
    case "epic":
    case "legendary":
    case "ultra":
    case "secret":
      return value;

    default:
      return "common";
  }
}

function normalizeCommands(
  item: PersistedLegacyGachaItem,
): GachaCommand[] {
  if (
    Array.isArray(
      item.commands,
    )
  ) {
    return item.commands.map(
      (command) => ({
        ...command,
      }),
    );
  }

  if (
    typeof item.command ===
    "string" &&
    item.command.trim()
  ) {
    return [
      {
        id:
          `${item.id}-legacy-command-0`,

        type:
          "minecraft",

        value:
          item.command.trim(),

        delay:
          0,

        enabled:
          true,
      },
    ];
  }

  return [];
}

function normalizeItem(
  item: PersistedLegacyGachaItem,
): LegacyGachaItem {
  return {
    id:
      item.id,

    name:
      item.name,

    description:
      item.description,

    imageDataUrl:
      normalizeImageDataUrl(
        item.imageDataUrl,
      ),

    effectId:
      typeof item.effectId ===
        "string"
        ? item.effectId
        : null,

    commands:
      normalizeCommands(
        item,
      ),

    rarity:
      normalizeRarity(
        item.rarity,
      ),

    isEnabled:
      typeof item.isEnabled ===
        "boolean"
        ? item.isEnabled
        : true,

    createdAt:
      typeof item.createdAt ===
        "string"
        ? item.createdAt
        : new Date(0)
          .toISOString(),
  };
}

function readPersistedItems():
  PersistedLegacyGachaItem[] {
  if (
    typeof localStorage ===
    "undefined"
  ) {
    return [];
  }

  const raw =
    localStorage.getItem(
      STORAGE_KEY,
    );

  if (!raw) {
    return [];
  }

  try {
    const parsed:
      unknown =
      JSON.parse(raw);

    if (!isRecord(parsed)) {
      return [];
    }

    /*
     * Zustand persist の標準形式
     *
     * {
     *   state: {
     *     items: [...]
     *   },
     *   version: 4
     * }
     */
    if (
      isRecord(
        parsed.state,
      )
    ) {
      const state =
        parsed.state as
        PersistedGachaState;

      if (
        Array.isArray(
          state.items,
        )
      ) {
        return state.items;
      }
    }

    /*
     * 念のため、
     * 古い直接保存形式にも対応。
     *
     * {
     *   items: [...]
     * }
     */
    const directState =
      parsed as
      PersistedGachaState;

    if (
      Array.isArray(
        directState.items,
      )
    ) {
      return directState.items;
    }

    return [];
  } catch (error) {
    console.warn(
      "[GachaRepository]",
      "旧ガチャ景品データの読み込みに失敗しました。",
      error,
    );

    return [];
  }
}

/**
 * 旧GachaItem互換専用Repository。
 *
 * 新規景品はEffectDefinitionを使用するため、
 * このRepositoryは既存ガチャ箱の救済用途だけで使用します。
 */
export class GachaRepository {
  /**
   * 保存済み旧GachaItemを取得。
   */
  public findAll():
    LegacyGachaItem[] {
    return readPersistedItems()
      .filter(
        (
          item,
        ): item is PersistedLegacyGachaItem =>
          typeof item.id ===
          "string" &&
          typeof item.name ===
          "string" &&
          typeof item.description ===
          "string",
      )
      .map(
        normalizeItem,
      );
  }

  /**
   * 有効な旧景品だけ取得。
   */
  public findEnabled():
    LegacyGachaItem[] {
    return this.findAll().filter(
      (item) =>
        item.isEnabled,
    );
  }

  /**
   * 旧API互換。
   */
  public findByPoolId(
    _poolId: string,
  ): LegacyGachaItem[] {
    return this.findEnabled();
  }

  /**
   * ID検索。
   */
  public findById(
    id: string,
  ): LegacyGachaItem | undefined {
    const normalizedId =
      id.trim();

    if (!normalizedId) {
      return undefined;
    }

    return this.findAll().find(
      (item) =>
        item.id ===
        normalizedId,
    );
  }

  public count(): number {
    return this.findAll()
      .length;
  }
}

export const gachaRepository =
  new GachaRepository();