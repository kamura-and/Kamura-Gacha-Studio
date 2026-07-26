import {
  useGachaStore,
} from "../store/gachaStore";

import type {
  GachaItem,
} from "../types/gacha";

export class GachaRepository {
  /**
   * 現在登録されている全ガチャアイテムを取得
   */
  public findAll(): GachaItem[] {
    return [
      ...useGachaStore.getState().items,
    ];
  }

  /**
   * 抽選対象のみ取得
   */
  public findEnabled(): GachaItem[] {
    return this.findAll().filter(
      (item) => item.isEnabled,
    );
  }

  /**
   * ガチャプール取得
   *
   * 現在はPool機能が存在しないため、
   * すべて同一プールとして扱う。
   *
   * 将来Pool実装時は
   * このメソッドだけ修正すればよい。
   */
  public findByPoolId(
    _poolId: string,
  ): GachaItem[] {
    return this.findEnabled();
  }

  /**
   * ID検索
   */
  public findById(
    id: string,
  ): GachaItem | undefined {
    return this.findAll().find(
      (item) => item.id === id,
    );
  }

  /**
   * 件数
   */
  public count(): number {
    return this.findAll().length;
  }
}

export const gachaRepository =
  new GachaRepository();