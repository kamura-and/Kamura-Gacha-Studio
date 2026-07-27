import type {
  GachaItem,
} from "@/features/gacha/types/gacha";

/**
 * 有効な景品だけを返します。
 *
 * 景品単体の排出率は廃止済みです。
 * 実際の抽選率はPoolのweightから計算します。
 */
export function getEnabledGachaItems(
  items: GachaItem[],
): GachaItem[] {
  return items.filter(
    (item) => item.isEnabled,
  );
}