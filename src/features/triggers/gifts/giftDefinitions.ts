import type {
    GiftCatalogItem,
} from "@/features/triggers/gifts/GiftCatalog";


export type GiftDefinition =
    GiftCatalogItem;


/*
 * 以前は開発・動作確認用の
 * manual Giftをここに定義していた。
 *
 * Gift CatalogをTikFinityから
 * 実データとして取得できるようになったため、
 * サンプル定義は廃止。
 *
 * export自体は既存参照との互換性のため
 * 現時点では残しておく。
 */
export const giftDefinitions:
    GiftDefinition[] = [];


export function findGiftDefinition(
    giftId: string | undefined,
): GiftDefinition | undefined {
    if (
        !giftId
    ) {
        return undefined;
    }


    return giftDefinitions.find(
        (
            gift,
        ) =>
            gift.id ===
            giftId,
    );
}