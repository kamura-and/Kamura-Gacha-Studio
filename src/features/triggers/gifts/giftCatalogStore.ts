import { create } from "zustand";

import {
    createJSONStorage,
    persist,
} from "zustand/middleware";

import type {
    GiftCatalogItem,
} from "@/features/triggers/gifts/GiftCatalog";


const LEGACY_MANUAL_GIFT_IDS =
    new Set([
        "rose",
        "finger-heart",
        "doughnut",
        "corgi",
        "swan",
        "galaxy",
        "money-gun",
        "whale",
        "yellow-car",
        "hat-and-mustache",
    ]);


type GiftCatalogState = {
    gifts: GiftCatalogItem[];

    initializeDefaults: (
        gifts: GiftCatalogItem[],
    ) => void;

    upsertGift: (
        gift: GiftCatalogItem,
    ) => void;

    upsertGifts: (
        gifts: GiftCatalogItem[],
    ) => void;

    setGiftStatus: (
        giftId: string,
        status: GiftCatalogItem["status"],
    ) => void;

    removeLegacyManualGifts: () => void;
};


export const useGiftCatalogStore =
    create<GiftCatalogState>()(
        persist(
            (set) => ({
                gifts: [],

                initializeDefaults: (
                    gifts,
                ) => {
                    set(
                        (state) => ({
                            gifts:
                                gifts.reduce(
                                    (
                                        currentGifts,
                                        gift,
                                    ) => {
                                        const exists =
                                            currentGifts.some(
                                                (
                                                    currentGift,
                                                ) =>
                                                    currentGift.id ===
                                                    gift.id,
                                            );

                                        if (
                                            exists
                                        ) {
                                            return currentGifts;
                                        }

                                        return [
                                            ...currentGifts,
                                            gift,
                                        ];
                                    },
                                    state.gifts,
                                ),
                        }),
                    );
                },

                upsertGift: (
                    gift,
                ) => {
                    set(
                        (state) => ({
                            gifts:
                                upsertGiftIntoList(
                                    state.gifts,
                                    gift,
                                ),
                        }),
                    );
                },

                upsertGifts: (
                    gifts,
                ) => {
                    set(
                        (state) => ({
                            gifts:
                                gifts.reduce(
                                    (
                                        currentGifts,
                                        gift,
                                    ) =>
                                        upsertGiftIntoList(
                                            currentGifts,
                                            gift,
                                        ),
                                    state.gifts,
                                ),
                        }),
                    );
                },

                setGiftStatus: (
                    giftId,
                    status,
                ) => {
                    set(
                        (state) => ({
                            gifts:
                                state.gifts.map(
                                    (
                                        gift,
                                    ) =>
                                        gift.id ===
                                            giftId
                                            ? {
                                                ...gift,
                                                status,
                                            }
                                            : gift,
                                ),
                        }),
                    );
                },

                removeLegacyManualGifts: () => {
                    set(
                        (state) => ({
                            gifts:
                                state.gifts.filter(
                                    (
                                        gift,
                                    ) =>
                                        !(
                                            gift.source ===
                                                "manual" &&
                                            LEGACY_MANUAL_GIFT_IDS.has(
                                                gift.id,
                                            )
                                        ),
                                ),
                        }),
                    );
                },
            }),
            {
                name:
                    "kamura-gift-catalog",

                storage:
                    createJSONStorage(
                        () =>
                            localStorage,
                    ),

                partialize: (
                    state,
                ) => ({
                    gifts:
                        state.gifts,
                }),
            },
        ),
    );


function upsertGiftIntoList(
    gifts: GiftCatalogItem[],
    incomingGift: GiftCatalogItem,
): GiftCatalogItem[] {
    const existingIndex =
        gifts.findIndex(
            (
                gift,
            ) =>
                gift.id ===
                incomingGift.id,
        );

    if (
        existingIndex ===
        -1
    ) {
        return [
            ...gifts,
            incomingGift,
        ];
    }

    return gifts.map(
        (
            gift,
            index,
        ) => {
            if (
                index !==
                existingIndex
            ) {
                return gift;
            }

            return mergeGift(
                gift,
                incomingGift,
            );
        },
    );
}


function mergeGift(
    existingGift: GiftCatalogItem,
    incomingGift: GiftCatalogItem,
): GiftCatalogItem {
    return {
        ...existingGift,
        ...incomingGift,

        firstSeenAt:
            existingGift.firstSeenAt ??
            incomingGift.firstSeenAt,

        aliases:
            mergeAliases(
                existingGift.aliases,
                incomingGift.aliases,
            ),
    };
}


function mergeAliases(
    current:
        | string[]
        | undefined,
    incoming:
        | string[]
        | undefined,
): string[] | undefined {
    const aliases =
        Array.from(
            new Set([
                ...(current ?? []),
                ...(incoming ?? []),
            ]),
        );

    return aliases.length > 0
        ? aliases
        : undefined;
}