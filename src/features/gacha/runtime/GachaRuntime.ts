import {
  gachaRepository,
} from "../repository/GachaRepository";

import {
  drawGacha,
} from "../services/drawGacha";

import type {
  DrawGachaOptions,
} from "../services/drawGacha";

import type {
  GachaItem,
} from "../types/gacha";

export type GachaSpinOptions =
  DrawGachaOptions;

export type GachaSpinResult = {
  gachaPoolId: string;
  item: GachaItem;
  drawnAt: number;
};

export class GachaRuntime {
  public spin(
    gachaPoolId: string,
    options: GachaSpinOptions = {},
  ): GachaSpinResult {
    const normalizedPoolId =
      gachaPoolId.trim();

    if (!normalizedPoolId) {
      throw new Error(
        "ガチャプールIDは必須です。",
      );
    }

    const items =
      gachaRepository.findByPoolId(
        normalizedPoolId,
      );

    if (items.length === 0) {
      throw new Error(
        [
          "抽選可能なガチャアイテムがありません。",
          `gachaPoolId=${normalizedPoolId}`,
        ].join(" "),
      );
    }

    const selectedItem =
      drawGacha(
        items,
        options,
      );

    return {
      gachaPoolId:
        normalizedPoolId,
      item:
        cloneGachaItem(
          selectedItem,
        ),
      drawnAt: Date.now(),
    };
  }
}

export const gachaRuntime =
  new GachaRuntime();

function cloneGachaItem(
  item: GachaItem,
): GachaItem {
  return {
    ...item,
    commands:
      item.commands.map(
        (command) => ({
          ...command,
        }),
      ),
  };
}