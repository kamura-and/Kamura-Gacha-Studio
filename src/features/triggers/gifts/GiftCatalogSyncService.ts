import type {
    GiftCatalogItem,
} from "@/features/triggers/gifts/GiftCatalog";

import {
    useGiftCatalogStore,
} from "@/features/triggers/gifts/giftCatalogStore";

export function applyGiftCatalogSync(
    gifts: GiftCatalogItem[],
): void {
    const syncedAt =
        Date.now();

    const syncedGifts =
        gifts.map(
            (
                gift,
            ): GiftCatalogItem => ({
                ...gift,

                /*
                 * APIから現在取得できたギフトなので
                 * activeとして扱う。
                 */
                status:
                    "active",

                /*
                 * 新規ギフトの場合は
                 * Store側のmerge処理によって
                 * firstSeenAtとして保持される。
                 *
                 * 既存ギフトの場合は
                 * Store側が元のfirstSeenAtを維持する。
                 */
                firstSeenAt:
                    syncedAt,

                /*
                 * 今回の同期で確認できた時刻。
                 */
                lastSeenAt:
                    syncedAt,
            }),
        );

    useGiftCatalogStore
        .getState()
        .upsertGifts(
            syncedGifts,
        );
}