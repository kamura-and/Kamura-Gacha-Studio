import type {
    GiftCatalogItem,
} from "@/features/triggers/gifts/GiftCatalog";

import {
    useGiftCatalogStore,
} from "@/features/triggers/gifts/giftCatalogStore";

import {
    migrateLegacyGiftIds,
} from "@/features/triggers/gifts/LegacyGiftIdMigration";


export function applyGiftCatalogSync(
    gifts: GiftCatalogItem[],
): void {
    const syncedAt =
        Date.now();


    /*
     * 開発初期に入れていた
     * manualサンプルGiftだけを除去する。
     *
     * TikFinity由来の実Giftは削除しない。
     */
    useGiftCatalogStore
        .getState()
        .removeLegacyManualGifts();


    const syncedGifts =
        gifts.map(
            (
                gift,
            ): GiftCatalogItem => ({
                ...gift,

                status:
                    "active",

                firstSeenAt:
                    syncedAt,

                lastSeenAt:
                    syncedAt,
            }),
        );


    useGiftCatalogStore
        .getState()
        .upsertGifts(
            syncedGifts,
        );


    /*
     * Catalog同期後に、
     * legacy Trigger IDを
     * 実TikFinity Gift IDへ移行する。
     */
    migrateLegacyGiftIds(
        useGiftCatalogStore
            .getState()
            .gifts,
    );
}