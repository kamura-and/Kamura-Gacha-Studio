import type {
    GiftCatalogItem,
} from "@/features/triggers/gifts/GiftCatalog";

import {
    triggerRepository,
} from "@/features/triggers/repository/TriggerRepository";

import {
    useTriggerStore,
} from "@/features/triggers/store/triggerStore";


type LegacyGiftDefinition = {
    legacyId: string;
    name: string;
};


const LEGACY_GIFTS:
    LegacyGiftDefinition[] = [
        {
            legacyId:
                "rose",

            name:
                "バラ",
        },
        {
            legacyId:
                "finger-heart",

            name:
                "フィンガーハート",
        },
        {
            legacyId:
                "doughnut",

            name:
                "ドーナッツ",
        },
        {
            legacyId:
                "corgi",

            name:
                "コーギー",
        },
        {
            legacyId:
                "swan",

            name:
                "白鳥",
        },
        {
            legacyId:
                "galaxy",

            name:
                "銀河",
        },
        {
            legacyId:
                "money-gun",

            name:
                "マネーガン",
        },
        {
            legacyId:
                "whale",

            name:
                "クジラ",
        },
        {
            legacyId:
                "yellow-car",

            name:
                "黄色い車",
        },
        {
            legacyId:
                "hat-and-mustache",

            name:
                "帽子と口ひげ",
        },
    ];


export type LegacyGiftIdMigrationResult = {
    migratedTriggerCount: number;
    migratedConditionCount: number;
    skippedLegacyIds: string[];
};


export function migrateLegacyGiftIds(
    gifts: GiftCatalogItem[],
): LegacyGiftIdMigrationResult {
    const migrationMap =
        buildMigrationMap(
            gifts,
        );

    let migratedTriggerCount =
        0;

    let migratedConditionCount =
        0;


    const triggers =
        triggerRepository.findAll();


    for (
        const trigger
        of triggers
    ) {
        let triggerChanged =
            false;

        const conditions =
            trigger.conditions.map(
                (
                    condition,
                ) => {
                    if (
                        condition.field !==
                        "giftId"
                    ) {
                        return condition;
                    }

                    if (
                        typeof condition.value !==
                        "string"
                    ) {
                        return condition;
                    }

                    const migratedGiftId =
                        migrationMap.get(
                            condition.value,
                        );

                    if (
                        !migratedGiftId ||
                        migratedGiftId ===
                        condition.value
                    ) {
                        return condition;
                    }

                    triggerChanged =
                        true;

                    migratedConditionCount +=
                        1;

                    return {
                        ...condition,

                        value:
                            migratedGiftId,
                    };
                },
            );


        if (
            !triggerChanged
        ) {
            continue;
        }


        triggerRepository.update(
            trigger.id,
            {
                conditions,
            },
        );

        migratedTriggerCount +=
            1;
    }


    /*
     * Repositoryを直接更新したため、
     * Zustand側も最新状態へ同期する。
     */
    if (
        migratedTriggerCount >
        0
    ) {
        useTriggerStore
            .getState()
            .loadTriggers();
    }


    const skippedLegacyIds =
        LEGACY_GIFTS
            .filter(
                (
                    legacyGift,
                ) =>
                    !migrationMap.has(
                        legacyGift.legacyId,
                    ),
            )
            .map(
                (
                    legacyGift,
                ) =>
                    legacyGift.legacyId,
            );


    const result:
        LegacyGiftIdMigrationResult = {
            migratedTriggerCount,
            migratedConditionCount,
            skippedLegacyIds,
        };


    console.info(
        "[LegacyGiftIdMigration]",
        "Migration completed.",
        result,
    );


    return result;
}


function buildMigrationMap(
    gifts: GiftCatalogItem[],
): Map<string, string> {
    const migrationMap =
        new Map<
            string,
            string
        >();


    for (
        const legacyGift
        of LEGACY_GIFTS
    ) {
        /*
         * manual定義自身を候補に含めない。
         *
         * TikFinityから取得された実Catalogの中で、
         * 日本語名が完全一致するものだけを見る。
         */
        const candidates =
            gifts.filter(
                (
                    gift,
                ) =>
                    gift.source ===
                    "tikfinity" &&
                    gift.id !==
                    legacyGift.legacyId &&
                    gift.name ===
                    legacyGift.name,
            );


        /*
         * 1件だけ特定できた場合のみ移行。
         *
         * 0件:
         * Catalogに存在しないため保留。
         *
         * 2件以上:
         * 同名Giftの可能性があるため
         * 勝手に選ばず保留。
         */
        if (
            candidates.length !==
            1
        ) {
            continue;
        }


        migrationMap.set(
            legacyGift.legacyId,
            candidates[0].id,
        );
    }


    return migrationMap;
}