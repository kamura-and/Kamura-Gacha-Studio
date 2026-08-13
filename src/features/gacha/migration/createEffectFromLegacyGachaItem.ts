import {
  actionRegistry,
} from "@/core/actions/packs";

import type {
  ActionInstance,
} from "@/core/actions";

import type {
  EffectDefinition,
} from "@/features/effects/types/effectDefinition";

import type {
  GachaCommand,
  LegacyGachaItem,
} from "@/features/gacha/types/gacha";

const LEGACY_COMMAND_ACTION_ID =
  "core.legacy-command";

/**
 * 旧GachaItemを
 * 現行のEffectDefinitionへ変換します。
 *
 * 既にeffectIdを持つ旧景品ではなく、
 * commandsだけを持つ旧景品のMigration用です。
 */
export function createEffectFromLegacyGachaItem(
  item: LegacyGachaItem,
): EffectDefinition {
  const definition =
    actionRegistry.getById(
      LEGACY_COMMAND_ACTION_ID,
    );

  if (!definition) {
    throw new Error(
      [
        "旧ガチャ景品のMigrationに必要なActionが見つかりません。",
        `actionId=${LEGACY_COMMAND_ACTION_ID}`,
      ].join(" "),
    );
  }

  const now =
    Date.now();

  const createdAt =
    parseCreatedAt(
      item.createdAt,
      now,
    );

  return {
    /**
     * Migrationを何度実行しても
     * 同じ旧景品から別Effectが増殖しないよう、
     * deterministicなIDにします。
     */
    id:
      createMigratedEffectId(
        item.id,
      ),

    name:
      item.name,

    description:
      item.description,

    actions:
      item.commands.map(
        (command) =>
          createLegacyActionInstance(
            command,
            definition,
          ),
      ),

    tags: [
      "旧ガチャ移行",
    ],

    favorite:
      false,

    rarity:
      item.rarity,

    imageDataUrl:
      item.imageDataUrl ??
      null,

    soundId:
      null,

    isEnabled:
      item.isEnabled,

    createdAt,

    updatedAt:
      now,
  };
}

function createLegacyActionInstance(
  command: GachaCommand,

  definition:
    NonNullable<
      ReturnType<
        typeof actionRegistry.getById
      >
    >,
): ActionInstance {
  return {
    id:
      createActionInstanceId(
        command.id,
      ),

    actionId:
      definition.id,

    definition,

    values: {
      type:
        command.type,

      value:
        command.value,

      delay:
        normalizeDelay(
          command.delay,
        ),

      enabled:
        command.enabled,
    },
  };
}

function createMigratedEffectId(
  legacyItemId: string,
): string {
  return [
    "legacy-gacha-effect",
    legacyItemId,
  ].join("-");
}

function createActionInstanceId(
  legacyCommandId: string,
): string {
  return [
    "legacy-gacha-action",
    legacyCommandId,
  ].join("-");
}

function normalizeDelay(
  value: number,
): number {
  if (
    !Number.isFinite(value) ||
    value < 0
  ) {
    return 0;
  }

  return value;
}

function parseCreatedAt(
  value: string,
  fallback: number,
): number {
  const timestamp =
    Date.parse(value);

  if (
    !Number.isFinite(
      timestamp,
    )
  ) {
    return fallback;
  }

  return timestamp;
}