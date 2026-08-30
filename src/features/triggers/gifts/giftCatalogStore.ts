import { create } from "zustand";

import {
    createJSONStorage,
    persist,
} from "zustand/middleware";

import type {
    GiftCatalogItem,
} from "@/features/triggers/gifts/GiftCatalog";

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
                            /*
                             * 既存Catalogを維持しながら、
                             * 未登録の初期ギフトだけ追加する。
                             *
                             * すでに同期・更新されたギフトを
                             * manual定義で上書きしない。
                             */
                            gifts:
                                gifts.reduce(
                                    (
                                        currentGifts,
                                        gift,
                                    ) => {
                                        const exists =
                                            currentGifts.some(
                                                (currentGift) =>
                                                    currentGift.id ===
                                                    gift.id,
                                            );

                                        if (exists) {
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
                                    (gift) =>
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
            (gift) =>
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

        /*
         * 初回発見日時は、
         * 後から同期しても上書きしない。
         */
        firstSeenAt:
            existingGift.firstSeenAt ??
            incomingGift.firstSeenAt,

        /*
         * aliasesは双方を維持しつつ
         * 重複を取り除く。
         */
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