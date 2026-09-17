import type {
    GiftCatalogItem,
} from "@/features/triggers/gifts/GiftCatalog";

import {
    useGiftCatalogStore,
} from "@/features/triggers/gifts/giftCatalogStore";


export type LearnUnknownGiftInput = {
    giftId: string;
    giftName?: string;
};


/**
 * 実配信で受信したGiftをGift Catalogへ学習する。
 *
 * すでにCatalogに存在するGiftの場合は、
 * lastSeenAtのみ更新する。
 *
 * 未知のGiftの場合はstatus="unknown"として
 * 一時登録する。
 *
 * 後日TikFinity Catalog同期で同じgiftIdが取得されれば、
 * 通常のupsert処理によって正式情報へ更新される。
 */
export function learnUnknownGift(
    input: LearnUnknownGiftInput,
): void {
    const giftId =
        input.giftId.trim();

    if (!giftId) {
        return;
    }


    const giftName =
        normalizeGiftName(
            input.giftName,
            giftId,
        );


    const store =
        useGiftCatalogStore.getState();


    const existingGift =
        store.gifts.find(
            (gift) =>
                gift.id === giftId,
        );


    const now =
        Date.now();


    if (existingGift) {
        store.upsertGift({
            ...existingGift,

            lastSeenAt:
                now,
        });

        return;
    }


    const unknownGift:
        GiftCatalogItem = {
            id:
                giftId,

            name:
                giftName,

            source:
                "tikfinity",

            status:
                "unknown",

            firstSeenAt:
                now,

            lastSeenAt:
                now,
        };


    store.upsertGift(
        unknownGift,
    );


    console.info(
        "[GIFT CATALOG]",
        "learned unknown gift",
        {
            giftId:
                unknownGift.id,

            giftName:
                unknownGift.name,

            status:
                unknownGift.status,
        },
    );
}


/**
 * Gift名が取得できない場合でも、
 * Catalog上で識別可能な名前を生成する。
 */
function normalizeGiftName(
    giftName:
        | string
        | undefined,
    giftId: string,
): string {
    const normalizedName =
        giftName?.trim();

    if (normalizedName) {
        return normalizedName;
    }


    return `不明なギフト（ID: ${giftId}）`;
}